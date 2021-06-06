import chai, { assert } from 'chai';
import { createEntity } from './../src/service/buildEntity';
import { mergedObj } from '../src/types/mergedObjType';

chai.should();

describe('all', () => {
  describe('hierarchy', () => {
    it('Should prefer aka fields vs other source fields', async () => {
      const data: mergedObj = {
        aka: [{ record: { firstName: 'd' } }],
        sf: [{ record: { firstName: 'c' } }],

        identifiers: {
          personalNumber: 'string',
          identityCard: 'string',
          goalUser: 'string',
        },
      };

      const res = (await createEntity(data)) || { firstName: 'error' };

      assert.equal(res.firstName, 'd');
    });

    it('Should prefer aka fields vs prime source fields', async () => {
      const data: mergedObj = {
        aka: [{ record: { firstName: 'd', akaUnit: 'sf1' } }],
        sf: [{ record: { firstName: 'c' } }],

        identifiers: {
          personalNumber: 'string',
          identityCard: 'string',
          goalUser: 'string',
        },
      };

      const res = (await createEntity(data)) || { firstName: 'error' };

      assert.equal(res.firstName, 'd');
    });

    it('Should prefer prime fields vs other source fields', async () => {
      const data: mergedObj = {
        aka: [{ record: { akaUnit: 'sf1' } }],
        sf: [{ record: { firstName: 'd' } }],
        city: [{ record: { firstName: 'c' } }],

        identifiers: {
          personalNumber: 'string',
          identityCard: 'string',
          goalUser: 'string',
        },
      };

      const res = (await createEntity(data)) || { firstName: 'error' };

      assert.equal(res.firstName, 'd');
    });
  });

  describe('logic', () => {
    it('Should add fields from other source', async () => {
      const data: mergedObj = {
        aka: [{ record: { job: 'good job', akaUnit: 'sf1' } }],
        sf: [{ record: { firstName: 'd' } }],
        city: [{ record: { lastName: undefined, mail: 'mail' } }],
        eightSocks: [{ record: { firstName: 'c', status: 'good' } }],

        identifiers: {
          personalNumber: 'string',
          identityCard: 'string',
          goalUser: 'string',
        },
      };

      const res = (await createEntity(data)) || { status: 'error' };

      assert.equal(res.status, 'good');
      assert.equal(res.job, 'good job');
      assert.equal(res.mail, 'mail');
    });

    it('Should ignore undefined fields', async () => {
      const data: mergedObj = {
        aka: [{ record: { akaUnit: 'sf1' } }],
        sf: [{ record: { firstName: 'd' } }],
        city: [{ record: { firstName: 'c', lastName: undefined } }],

        identifiers: {
          personalNumber: 'string',
          identityCard: 'string',
          goalUser: 'string',
        },
      };

      const res = (await createEntity(data)) || { firstName: 'error' };

      assert.isFalse(Object.keys(res).includes('lastName'));
    });

    it('Should inse personalNumber=9 ', async () => {
      const data: mergedObj = {
        aka: [
          { record: { firstName: 'lose', personalNumber: '156' } },
          { record: { firstName: 'win', lastName: 'last', personalNumber: '123456789' } },
        ],

        identifiers: {
          personalNumber: 'string',
          identityCard: 'string',
          goalUser: 'string',
        },
      };

      const res = (await createEntity(data)) || { firstName: 'error' };

      assert.equal(res.firstName, 'win');
      assert.equal(res.lastName, 'last');
    });
  });
});
