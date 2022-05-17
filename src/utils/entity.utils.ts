import { units } from '../units/units';
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
 * USE [units] array of all unit with source
 * @returns source name
 */
export const getPrimeSource = (currUnit: { record: entity }[] | undefined): string => {
  if (!currUnit || currUnit.length == 0) return '';

  let source: string = '';

  Object.keys(units as { [source: string]: string[] }).forEach((u) => {
    if (units[u].includes(currUnit[0].record.akaUnit)) source = u;
  });

  return source;
};

// Prefer agumon first
export const sortSource = (curr: record, next: record) => {
  return next.entityType === fieldsName.entityType.c || curr.entityType === fieldsName.entityType.s ? -1 : 1;
};

// Id first
export const sortAka = (curr: record, _: record) => {
  return curr.rank === fieldsName.preferredRank ? 1 : -1;
};

// For ant needed validation (in Future)
export const entityValidation = {
  entityType: (source: record) => source.entityType,
  personalNumber: (source: record) => source.personalNumber,
  employeeId: (source: record) => source.employeeId,
  employeeNumber: (source: record) => source.employeeNumber,
  organization: (source: record) => source.organization,
  serviceType: (source: record) => source.serviceType,
  firstName: (source: record) => source.firstName,
  lastName: (source: record) => source.lastName,
  akaUnit: (source: record) => source.akaUnit,
  // status: (source: record) => source.status,
  rank: (source: record) => source.rank,
  // job: (source: record) => source.job,
  // displayName: (source: record) => source.displayName,
  // mail: (source: record) => source.mail,
  address: (source: record) => source.address,
  clearance: (source: record) => source.clearance,
  pictures: (source: record) => source.pictures,
  sex: (source: record) => source.sex,
  birthDate: (source: record) => source.birthDate,
  // createdAt: (source: record) => source.createdAt,
  // updatedAt: (source: record) => source.updatedAt,
  goalUserId: (source: record) => source.goalUserId,
  identityCard: (source: record) => source.identityCard,
  dischargeDay: (source: record) => source.dischargeDay,
  phone: (source: record) => source.phone,
  mobilePhone: (source: record) => source.mobilePhone,
};
