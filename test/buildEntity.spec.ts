import chai, { assert } from 'chai';
import { getRecordsByHierarchy } from '../src/service/buildEntity';

chai.should();

describe('Build entity', () => {
  describe('GetRecordsByHierarchy', () => {
    it('Should prefer aka source first', () => {
      const res = getRecordsByHierarchy({
        aka: [{ record: { akaUnit: 'aka' } }],
        city: [{ record: { akaUnit: 'b' } }],
        adNn: [{ record: { akaUnit: 'c' } }],
        sf: [{ record: { akaUnit: 'd' } }],
        identifiers: { personalNumber: '', identityCard: '', goalUser: '' },
      });

      assert.equal(res[0].akaUnit, 'aka');
    });

    it('Should prefer prime source second', () => {
      const res = getRecordsByHierarchy({
        aka: [{ record: { akaUnit: 'sf1' } }],
        city: [{ record: { akaUnit: 'b' } }],
        adNn: [{ record: { akaUnit: 'c' } }],
        sf: [{ record: { akaUnit: 'sf' } }],
        identifiers: { personalNumber: '', identityCard: '', goalUser: '' },
      });

      assert.equal(res[1].akaUnit, 'sf');
    });

    it('Should Order by hierarchy of source', () => {
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
