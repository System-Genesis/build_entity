import { createEntity } from './../src/service/service';
import { mergedObj } from '../src/types/mergedObjType';

jest.mock('logger-genesis');

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

      expect(res.firstName).toEqual('d');
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

      expect(res.firstName).toEqual('d');
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

      expect(res.firstName).toEqual('d');
    });
  });

  describe('logic', () => {
    it('Should add fields from other source', async () => {
      const data: mergedObj = {
        aka: [{ record: { rank: 'good rank', akaUnit: 'sf1' } }],
        sf: [{ record: { firstName: 'd' } }],
        city: [{ record: { lastName: undefined, address: 'address' } }],
        es: [{ record: { firstName: 'c', clearance: 'good' } }],

        identifiers: {
          personalNumber: 'string',
          identityCard: 'string',
          goalUser: 'string',
        },
      };

      const res = (await createEntity(data)) || { clearance: 'error' };

      expect(res.clearance).toEqual('good');
      expect(res.rank).toEqual('good rank');
      expect(res.address).toEqual('address');
    });

    it('Should ignore undefined fields', async () => {
      const data: mergedObj = {
        aka: [{ record: { akaUnit: 'sf1' } }],
        sf: [{ record: { firstName: 'd' } }],
        city: [{ record: { firstName: 'c', lastName: undefined } }],

        identifiers: {
          personalNumber: '156456',
        },
      };

      const res = (await createEntity(data)) || { firstName: 'error' };

      expect(Object.keys(res)).not.toContain('lastName');
    });

    it('Should insert personalNumber = 9 ', async () => {
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

      expect(res.firstName).toEqual('win');
      expect(res.lastName).toEqual('last');
    });
  });
});
