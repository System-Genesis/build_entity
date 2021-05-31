import chai, { assert } from 'chai';
import chaiHttp from 'chai-http';
import { buildEntity } from './../src/service/buildEntity';
import { mergedObj } from '../src/types/mergedObjType';

chai.should();

chai.use(chaiHttp);

describe('all', () => {
  describe('hierarchy', () => {
    it('aka vs other', async () => {
      const data: mergedObj = {
        aka: [{ record: { firstName: 'd' } }],
        sf: [{ record: { firstName: 'c' } }],

        identifiers: {
          personalNumber: 'string',
          identityCard: 'string',
          goalUser: 'string',
        },
      };

      const res = (await buildEntity(data as unknown as mergedObj)) || { firstName: 'error' };

      assert.equal(res.firstName, 'd');
    });

    it('aka vs prime', async () => {
      const data: mergedObj = {
        aka: [{ record: { firstName: 'd', akaUnit: 'sf1' } }],
        sf: [{ record: { firstName: 'c' } }],

        identifiers: {
          personalNumber: 'string',
          identityCard: 'string',
          goalUser: 'string',
        },
      };

      const res = (await buildEntity(data as unknown as mergedObj)) || { firstName: 'error' };

      assert.equal(res.firstName, 'd');
    });

    it('prime vs other', async () => {
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

      const res = (await buildEntity(data as unknown as mergedObj)) || { firstName: 'error' };

      assert.equal(res.firstName, 'd');
    });
  });

  describe('logic', () => {
    it('fields from other ds', async () => {
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

      const res = (await buildEntity(data as unknown as mergedObj)) || { status: 'error' };

      assert.equal(res.status, 'good');
      assert.equal(res.job, 'good job');
      assert.equal(res.mail, 'mail');
    });

    it('ignore undefined fields', async () => {
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

      const res = (await buildEntity(data as unknown as mergedObj)) || { firstName: 'error' };

      assert.isFalse(Object.keys(res).includes('lastName'));
    });

    it('akaSoldier vs akaOther', async () => {
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

      const res = (await buildEntity(data as unknown as mergedObj)) || { firstName: 'error' };

      assert.equal(res.firstName, 'win');
      assert.equal(res.lastName, 'last');
    });
  });
});
