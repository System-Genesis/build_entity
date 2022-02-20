import { entity } from '../src/types/entityType';
import { setEntity, setSpecificField, validateFields } from '../src/service/setEntity';
import { getPrimeSource } from '../src/utils/entity.utils';
import { record } from './../src/types/recordType';

jest.mock('logger-genesis');

const logMsg = { msg: '' };

describe('init entity', () => {
  describe('validateFields', () => {
    it('Should all pass validation', () => {
      const record: record = {
        clearance: 'a',
        entityType: 'b',
        identityCard: '8112005',
        source: 'test',
      };

      const res = validateFields(record);
      expect(res).toEqual(['entityType', 'clearance', 'identityCard']);
    });

    it('Some validation Should fail', () => {
      const record: record = {
        entityType: 'b',
        clearance: 'a',
        identityCard: '800',
        source: 'test',
      };

      const res = validateFields(record);

      expect(res).not.toContain(['entityType', 'clearance', 'identityCard']);
    });
  });

  describe('setSpecificField', () => {
    it('Should ignore undefined fields', () => {
      const record: record = {
        clearance: 'a',
        lastName: undefined,
        source: 'test',
      };
      const entity: entity = {};

      setSpecificField(entity, record, 'clearance');
      setSpecificField(entity, record, 'lastName');

      expect(entity.clearance).toBeTruthy();
      expect(Object.keys(entity)).not.toContain('lastName');
    });

    it('Should add fields', () => {
      const record: record = {
        clearance: 'a',
        lastName: 'b',
        source: 'test',
      };
      const entity: entity = {};

      setSpecificField(entity, record, 'clearance');
      setSpecificField(entity, record, 'lastName');

      expect(entity.clearance).toBeTruthy();
      expect(entity.lastName).toBeTruthy();
      expect(entity.firstName).toBeFalsy();
    });
  });

  describe('initEntity', () => {
    it('Should fully init', () => {
      const record: record = {
        clearance: 'a',
        lastName: 'b',
        source: 'test',
      };
      const expected: entity = {
        clearance: 'a',
        lastName: 'b',
      };

      const entity: entity = {};

      const actual = setEntity(record, logMsg, entity);

      expect(expected).toEqual(actual);
    });

    it('Should not init fail validation field', () => {
      const record: record = {
        clearance: 'ds',
        lastName: 'fhj',
        identityCard: undefined,
        source: 'test',
      };

      const res = setEntity(record, logMsg);
      expect(res.clearance).toBeTruthy();
      expect(res.lastName).toBeTruthy();

      expect(Object.keys(res)).not.toContain('identityCard');
      expect(Object.keys(res)).not.toContain('dc');
    });

    it('Should add fields', () => {
      const record: record = {
        clearance: 'a',
        lastName: 'b',
        source: 'test',
      };

      const entity: entity = {
        clearance: 'c',
      };

      const res = setEntity(record, logMsg, entity);

      expect(res.clearance).toEqual('c');
      expect(res.lastName).toEqual('b');
    });

    it('Should not override existing field', () => {
      const record: record = {
        clearance: 'a',
        lastName: 'b',
        akaUnit: 'sf1',
        source: 'test',
      };

      const entity: entity = {
        clearance: 'c',
        lastName: 'd',
      };

      const res = setEntity(record, logMsg, entity);

      expect(res.clearance).toEqual('c');
      expect(res.lastName).toEqual('d');
    });
  });

  describe('getPrimeSource', () => {
    it('Should find unit', () => {
      const unit = [{ record: { akaUnit: 'sf1' } }];
      const res = getPrimeSource(unit);

      expect(res).toEqual('sf');
    });

    it('Should not find unit', () => {
      const unit = [{ record: { akaUnit: 'sf1s' } }];
      const res = getPrimeSource(unit);

      expect(res).not.toEqual('sf');
    });

    it('Should return "" because akaUnit dos not exits', () => {
      const unit = [{ record: {} }];
      const res = getPrimeSource(unit);

      expect(res).toEqual('');
    });

    it('Should not find source, aka does not a unit ', () => {
      const unit = [{ record: { akaUnit: 'aka' } }];
      const res = getPrimeSource(unit);

      expect(res).not.toEqual('aka');
    });
  });
});
