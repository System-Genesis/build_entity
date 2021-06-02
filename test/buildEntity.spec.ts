import chai, { assert } from 'chai';
import chaiHttp from 'chai-http';
import { getRecordsByHierarchy } from '../src/service/buildEntity';

chai.should();

chai.use(chaiHttp);

// aka?: { record: entity }[];
// eightSocks?: { record: entity }[];
// sf?: { record: entity }[];
// city?: { record: entity }[];
// adNn?: { record: entity }[];
// adS?: { record: entity }[];

// identifiers: {
//   personalNumber: string;
//   identityCard: string;
//   goalUser: string;
// };

describe('Build entity', () => {
  describe('GetRecordsByHierarchy', () => {
    it('Aka source first', () => {
      const res = getRecordsByHierarchy({
        aka: [{ record: { akaUnit: 'aka' } }],
        city: [{ record: { akaUnit: 'b' } }],
        adNn: [{ record: { akaUnit: 'c' } }],
        sf: [{ record: { akaUnit: 'd' } }],
        identifiers: { personalNumber: '', identityCard: '', goalUser: '' },
      });

      assert.equal(res[0].akaUnit, 'aka');
    });

    it('Prime source second', () => {
      const res = getRecordsByHierarchy({
        aka: [{ record: { akaUnit: 'sf1' } }],
        city: [{ record: { akaUnit: 'b' } }],
        adNn: [{ record: { akaUnit: 'c' } }],
        sf: [{ record: { akaUnit: 'sf' } }],
        identifiers: { personalNumber: '', identityCard: '', goalUser: '' },
      });

      assert.equal(res[1].akaUnit, 'sf');
    });

    it('Order by hierarchy of source', () => {
      const res = getRecordsByHierarchy({
        aka: [{ record: { akaUnit: 'sf1' } }],
        city: [{ record: { akaUnit: 'city' } }],
        adNn: [{ record: { akaUnit: 'adNn' } }],
        sf: [{ record: { akaUnit: 'sf' } }],
        identifiers: { personalNumber: '', identityCard: '', goalUser: '' },
      });

      assert.equal(res[2].akaUnit, 'adNn');
      assert.equal(res[3].akaUnit, 'city');
    });
  });
});
