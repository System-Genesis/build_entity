import chai, { assert } from 'chai';
import fieldsName from '../src/config/fieldsName';
import { buildEntity, getRecordsByHierarchy } from '../src/service/buildEntity';
import { record } from '../src/types/recordType';

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

  describe('buildEntity', () => {
    it('Should return entity type C', () => {
      const records: record[] = [
        { source: 'aka', firstName: 'a', identityCard: '207026568' },
        { source: 'es', firstName: 'b', entityType: fieldsName.entityType.s },
        { source: 'sf', firstName: 'sf', entityType: fieldsName.entityType.s },
        { source: 'ads', firstName: 'c', entityType: fieldsName.entityType.s },
        { source: 'adnn', firstName: 'e', entityType: fieldsName.entityType.c },
      ];

      const res = buildEntity(records, { identityCard: '207026568' });

      console.log(res);

      assert.equal(fieldsName.entityType.c, res.entityType);
    });

    it('Should return entity type S', () => {
      const records: record[] = [
        { source: 'aka', firstName: 'a', identityCard: '1564151' },
        { source: 'es', firstName: 'b', entityType: fieldsName.entityType.s },
        { source: 'sf', firstName: 'sf', entityType: fieldsName.entityType.s },
        { source: 'ads', firstName: 'c', entityType: fieldsName.entityType.s },
        { source: 'adnn', firstName: 'e', entityType: fieldsName.entityType.s },
      ];

      const res = buildEntity(records, { personalNumber: '2131' });

      assert.equal(fieldsName.entityType.s, res.entityType);
    });

    it('Should return entity type G', () => {
      const records: record[] = [
        { source: 'aka', firstName: 'a', identityCard: '1564151' },
        { source: 'es', firstName: 'b', entityType: fieldsName.entityType.g },
        { source: 'sf', firstName: 'sf', entityType: fieldsName.entityType.s },
        { source: 'ads', firstName: 'c', entityType: fieldsName.entityType.s },
        { source: 'adnn', firstName: 'e', entityType: fieldsName.entityType.c },
      ];

      const res = buildEntity(records, { personalNumber: '2131' });

      assert.equal(fieldsName.entityType.g, res.entityType);
    });
  });
});
