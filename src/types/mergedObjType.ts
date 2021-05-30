import { entity } from './entityType';

export type mergedObj = {
  aka: entity[];
  eightSocks: entity[];
  sf: entity[];
  city: entity[];
  adNn: entity[];
  adS: entity[];

  identifiers: {
    personalNumber: string;
    identityCard: string;
    goalUser: string;
  };
};
