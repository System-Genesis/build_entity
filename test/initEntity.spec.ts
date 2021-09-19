import chai, { assert } from 'chai';
import { entity } from '../src/types/entityType';
import { setEntity, setSpecificField, validateFields } from '../src/service/setEntity';
import { getPrimeSource } from '../src/utils/entity.utils';
import { record } from './../src/types/recordType';

chai.should();
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
      assert.deepEqual(res, [ 'entityType','clearance', 'identityCard']);
    });

    it('Some validation Should fail', () => {
      const record: record = {
        entityType: 'b',
        clearance: 'a',
        identityCard: '800',
        source: 'test',
      };

      const res = validateFields(record);
            
      assert.notDeepEqual(res, [ 'entityType','clearance', 'identityCard']);
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

      assert.isString(entity.clearance);
      assert.isFalse(Object.keys(entity).includes('lastName'));
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

      assert.isString(entity.clearance);
      assert.isString(entity.lastName);
      assert.isUndefined(entity.firstName);
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

      assert.deepEqual(expected, actual);
    });

    it('Should not init fail validation field', () => {
      const record: record = {
        clearance: 'ds',
        lastName: 'fhj',
        identityCard: undefined,
        source: 'test',
      };

      const res = setEntity(record, logMsg);

      assert.isString(res.clearance);
      assert.isString(res.lastName);
      assert.isFalse(Object.keys(res).includes('identityCard'));
      assert.isFalse(Object.keys(res).includes('ds'));
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

      assert.equal(res.clearance, 'c');
      assert.equal(res.lastName, 'b');
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

      assert.equal(res.clearance, 'c');
      assert.equal(res.lastName, 'd');
    });
  });

  describe('getPrimeSource', () => {
    it('Should find unit', () => {
      const unit = [{ record: { akaUnit: 'sf1' } }];
      const res = getPrimeSource(unit);

      assert.equal(res, 'sf');
    });

    it('Should not find unit', () => {
      const unit = [{ record: { akaUnit: 'sf1s' } }];
      const res = getPrimeSource(unit);

      assert.notEqual(res, 'sf');
    });

    it('Should return "" because akaUnit dos not exits', () => {
      const unit = [{ record: {} }];
      const res = getPrimeSource(unit);

      assert.equal(res, '');
    });

    it('Should not find source, aka does not a unit ', () => {
      const unit = [{ record: { akaUnit: 'aka' } }];
      const res = getPrimeSource(unit);

      assert.notEqual(res, 'aka');
    });
  });
});
