import { units } from '../units/units';
import { validator } from './validator.utils';
import { record } from './../types/recordType';
import { entity } from './../types/entityType';

import configEnv from '../config/env.config';
import fieldsName from '../config/fieldsName';

export const sourceHierarchy: string[] = configEnv.ds_h;
export const akaStr = sourceHierarchy[0];

/**
 * Found the source according the entity unit
 *
 * @param currUnit unit for search in all units and get the prime source
 * @returns source name
 */
export const getPrimeSource = (
  currUnit: { record: entity }[] | undefined
): string => {
  if (!currUnit || currUnit.length == 0) return '';

  let unit: string = '';

  Object.keys(units).forEach((u) => {
    if (units[u].includes(currUnit[0].record.akaUnit)) unit = u;
  });

  return unit;
};

// Prefer agumon first
export const sortSource = (curr: record, next: record) => {
  return next.entityType === fieldsName.entityType.c ||
    curr.entityType === fieldsName.entityType.s
    ? -1
    : 1;
};

// Id first
export const sortAka = (curr: record, _: record) => {
  return curr.rank === fieldsName.preferredRank ? 1 : -1;
};

const validatePhone = (phone: string | undefined | string[]) => {
  if (phone) {
    return !Array.isArray(phone) ? (phone = [phone]) : phone;
  }

  return null;
};

// For ant needed validation (in Future)
export const entityValidation = {
  displayName: (source: record) => source.displayName,
  entityType: (source: record) => source.entityType,
  personalNumber: (source: record) => source.personalNumber,
  firstName: (source: record) => source.firstName,
  lastName: (source: record) => source.lastName,
  akaUnit: (source: record) => source.akaUnit,
  status: (source: record) => source.status,
  rank: (source: record) => source.rank,
  mail: (source: record) => source.mail,
  job: (source: record) => source.job,
  address: (source: record) => source.address,
  clearance: (source: record) => source.clearance,
  pictures: (source: record) => source.pictures,
  sex: (source: record) => source.sex,
  birthDate: (source: record) => source.birthDate,
  createdAt: (source: record) => source.createdAt,
  updatedAt: (source: record) => source.updatedAt,
  goalUserId: (source: record) => source.goalUserId,
  identityCard: (source: record) =>
    validator().identityCard(source.identityCard),
  dischargeDay: (source: record) => source.dischargeDay,
  phone: (source: record) => validatePhone(source.phone),
  mobilePhone: (source: record) => source.mobilePhone,
};
