import chai, { assert } from 'chai';
import chaiHttp from 'chai-http';
import { entity } from '../src/types/entityType';
import { initEntity, setSpecificField, validateFields } from '../src/service/initEntity';

chai.should();

chai.use(chaiHttp);

describe('init entity', () => {
  describe('validateFields', () => {
    it('all pass validation', () => {
      const record: entity = {
        displayName: 'a',
        entityType: 'b',
        identityCard: '8112005',
      };

      const res = validateFields(record);
      assert.deepEqual(res, ['displayName', 'entityType', 'identityCard']);
    });

    it('some validation fail', () => {
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
    it('ignore undefined fields', () => {
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

    it('add fields', () => {
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
    it('full init', () => {
      const record: entity = {
        displayName: 'a',
        lastName: 'b',
      };
      const entity: entity = {};

      const res = initEntity(entity, record);

      assert.deepEqual(record, res);
    });

    it('initEntity not init fail validation field', () => {
      const record: entity = {
        displayName: 'ds',
        lastName: 'fhj',
        identityCard: undefined,
      };

      const res = initEntity(record);

      assert.notDeepEqual(record, res);
    });

    it('add fields', () => {
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

    it('not override existing field', () => {
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
});
