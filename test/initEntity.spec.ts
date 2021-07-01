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
        displayName: 'a',
        entityType: 'b',
        identityCard: '8112005',
        source: 'test',
      };

      const res = validateFields(record);
      assert.deepEqual(res, ['displayName', 'entityType', 'identityCard']);
    });

    it('Some validation Should fail', () => {
      const record: record = {
        displayName: 'a',
        entityType: 'b',
        identityCard: '800',
        source: 'test',
      };

      const res = validateFields(record);
      assert.notDeepEqual(res, ['displayName', 'entityType', 'identityCard']);
    });
  });

  describe('setSpecificField', () => {
    it('Should ignore undefined fields', () => {
      const record: record = {
        displayName: 'a',
        lastName: undefined,
        source: 'test',
      };
      const entity: entity = {};

      setSpecificField(entity, record, 'displayName');
      setSpecificField(entity, record, 'lastName');

      assert.isString(entity.displayName);
      assert.isFalse(Object.keys(entity).includes('lastName'));
    });

    it('Should add fields', () => {
      const record: record = {
        displayName: 'a',
        lastName: 'b',
        source: 'test',
      };
      const entity: entity = {};

      setSpecificField(entity, record, 'displayName');
      setSpecificField(entity, record, 'lastName');

      assert.isString(entity.displayName);
      assert.isString(entity.lastName);
      assert.isUndefined(entity.firstName);
    });
  });

  describe('initEntity', () => {
    it('Should fully init', () => {
      const record: record = {
        displayName: 'a',
        lastName: 'b',
        source: 'test',
      };
      const expected: entity = {
        displayName: 'a',
        lastName: 'b',
      };

      const entity: entity = {};

      const actual = setEntity(record, logMsg, entity);

      assert.deepEqual(expected, actual);
    });

    it('Should not init fail validation field', () => {
      const record: record = {
        displayName: 'ds',
        lastName: 'fhj',
        identityCard: undefined,
        source: 'test',
      };

      const res = setEntity(record, logMsg);

      assert.isString(res.displayName);
      assert.isString(res.lastName);
      assert.isFalse(Object.keys(res).includes('identityCard'));
      assert.isFalse(Object.keys(res).includes('ds'));
    });

    it('Should add fields', () => {
      const record: record = {
        displayName: 'a',
        lastName: 'b',
        source: 'test',
      };

      const entity: entity = {
        displayName: 'c',
      };

      const res = setEntity(record, logMsg, entity);

      assert.equal(res.displayName, 'c');
      assert.equal(res.lastName, 'b');
    });

    it('Should not override existing field', () => {
      const record: record = {
        displayName: 'a',
        lastName: 'b',
        akaUnit: 'sf1',
        source: 'test',
      };

      const entity: entity = {
        displayName: 'c',
        lastName: 'd',
      };

      const res = setEntity(record, logMsg, entity);

      assert.equal(res.displayName, 'c');
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
