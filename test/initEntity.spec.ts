import chai, { assert } from 'chai';
import { entity } from '../src/types/entityType';
import { initEntity, setSpecificField, validateFields } from '../src/service/initEntity';
import { getPrimeSource } from '../src/utils/entity.utils';

chai.should();

describe('init entity', () => {
  describe('validateFields', () => {
    it('Should all pass validation', () => {
      const record: entity = {
        displayName: 'a',
        entityType: 'b',
        identityCard: '8112005',
      };

      const res = validateFields(record);
      assert.deepEqual(res, ['displayName', 'entityType', 'identityCard']);
    });

    it('Some validation Should fail', () => {
      const record: entity = {
        displayName: 'a',
        entityType: 'b',
        identityCard: '800',
      };

      const res = validateFields(record);
      assert.notDeepEqual(res, ['displayName', 'entityType', 'identityCard']);
    });
  });

  describe('setSpecificField', () => {
    it('Should ignore undefined fields', () => {
      const record: entity = {
        displayName: 'a',
        lastName: undefined,
      };
      const entity: entity = {};

      setSpecificField(entity, record, 'displayName');
      setSpecificField(entity, record, 'lastName');

      assert.isString(entity.displayName);
      assert.notDeepEqual(record, entity);
    });

    it('Should add fields', () => {
      const record: entity = {
        displayName: 'a',
        lastName: 'b',
      };
      const entity: entity = {};

      setSpecificField(entity, record, 'displayName');
      setSpecificField(entity, record, 'lastName');

      assert.deepEqual(record, entity);
    });
  });

  describe('initEntity', () => {
    it('Should fully init', () => {
      const record: entity = {
        displayName: 'a',
        lastName: 'b',
      };
      const entity: entity = {};

      const res = initEntity(entity, record);

      assert.deepEqual(record, res);
    });

    it('Should not init fail validation field', () => {
      const record: entity = {
        displayName: 'ds',
        lastName: 'fhj',
        identityCard: undefined,
      };

      const res = initEntity(record);

      assert.notDeepEqual(record, res);
    });

    it('Should add fields', () => {
      const record: entity = {
        displayName: 'a',
        lastName: 'b',
      };

      const entity: entity = {
        displayName: 'c',
      };

      const res = initEntity(record, entity);

      assert.equal(res.displayName, 'c');
      assert.equal(res.lastName, 'b');
    });

    it('Should not override existing field', () => {
      const record: entity = {
        displayName: 'a',
        lastName: 'b',
      };

      const entity: entity = {
        displayName: 'c',
        lastName: 'd',
      };

      const res = initEntity(record, entity);

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
