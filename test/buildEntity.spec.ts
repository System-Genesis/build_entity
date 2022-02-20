import fieldsName from '../src/config/fieldsName';
import { buildEntity } from '../src/service/buildEntity';
import { getRecordsByPriority } from '../src/service/recordsByHierarchy';
import { record } from '../src/types/recordType';

jest.mock('logger-genesis');

describe('Build entity', () => {
  describe('getRecordsByPriority', () => {
    it('Should prefer aka source first', () => {
      const res = getRecordsByPriority({
        aka: [{ record: { akaUnit: 'aka' } }],
        city: [{ record: { akaUnit: 'b' } }],
        adNn: [{ record: { akaUnit: 'c' } }],
        sf: [{ record: { akaUnit: 'd' } }],
        identifiers: { personalNumber: '', identityCard: '', goalUser: '' },
      });

      expect(res[0].akaUnit).toEqual('aka');
    });

    it('Should prefer prime source second', () => {
      const res = getRecordsByPriority({
        aka: [{ record: { akaUnit: 'sf1' } }],
        city: [{ record: { akaUnit: 'b' } }],
        adNn: [{ record: { akaUnit: 'c' } }],
        sf: [{ record: { akaUnit: 'sf' } }],
        identifiers: { personalNumber: '', identityCard: '', goalUser: '' },
      });

      expect(res[1].akaUnit).toEqual('sf');
    });

    it('Should Order by hierarchy of source', () => {
      const res = getRecordsByPriority({
        aka: [{ record: { akaUnit: 'sf1' } }],
        city: [{ record: { akaUnit: 'city' } }],
        adNn: [{ record: { akaUnit: 'adNn' } }],
        sf: [{ record: { akaUnit: 'sf' } }],
        identifiers: { personalNumber: '', identityCard: '', goalUser: '' },
      });

      expect(res[2].akaUnit).toEqual('city');
      expect(res[3].akaUnit).toEqual('adNn');
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

      expect(fieldsName.entityType.c).toEqual(res.entityType);
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

      expect(fieldsName.entityType.s).toEqual(res.entityType);
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

      expect(fieldsName.entityType.g).toEqual(res.entityType);
    });
  });

  describe('Should delete forbidden fields for entity type g', () => {
    const records: record[] = [
      { source: 'aka', firstName: 'a', identityCard: '1564151' },
      { source: 'es', firstName: 'b', entityType: fieldsName.entityType.g },
      { source: 'sf', firstName: 'sf', entityType: fieldsName.entityType.s },
      { source: 'ads', firstName: 'c', entityType: fieldsName.entityType.s },
      { source: 'adnn', firstName: 'e', entityType: fieldsName.entityType.c },
    ];

    const res = buildEntity(records, { goalUser: '2131' });

    expect(res.identityCard).toBeFalsy();
  });
});
