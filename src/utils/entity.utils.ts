import { logInfo } from '../logger/logger';
import { entity } from '../types/entityType';
import { units } from '../units/units';
import { validator } from './validator.utils';

export const dataSourceHierarchy: string[] = ['aka', 'eightSocks', 'adS', 'adNn', 'sf', 'city'];
export const akaStr = dataSourceHierarchy[0];

/**
 * Found the dataSource according the entity unit
 *
 * @param currUnit unit for search in all units and get the prime dataSource
 * @returns dataSource name
 */
export const getPrimeSource = (currUnit: { record: entity }[] | undefined): string => {
  if (!currUnit) return '';

  let unit: string = '';

  Object.keys(units).forEach((u) => {
    if (units[u].includes(currUnit[0].record.akaUnit)) unit = u;
  });

  logInfo('Prime source = ' + unit);
  return unit;
};

// enum fn
export const sortSource = (curr: entity, _: entity) => (curr.entityType === 'Solider' ? 1 : -1);
export const sortAka = (curr: entity, _: entity) => (curr.personalNumber?.length === 9 ? -1 : 1);

export const entityValidation = {
  displayName: (ds: entity) => ds.displayName,
  entityType: (ds: entity) => ds.entityType,
  personalNumber: (ds: entity) => ds.personalNumber,
  firstName: (ds: entity) => ds.firstName,
  lastName: (ds: entity) => ds.lastName,
  akaUnit: (ds: entity) => ds.akaUnit,
  status: (ds: entity) => ds.status,
  rank: (ds: entity) => ds.rank,
  mail: (ds: entity) => ds.mail,
  job: (ds: entity) => ds.job,
  address: (ds: entity) => ds.address,
  clearance: (ds: entity) => ds.clearance,
  pictures: (ds: entity) => ds.pictures,
  sex: (ds: entity) => ds.sex,
  birthDate: (ds: entity) => ds.birthDate,
  createdAt: (ds: entity) => ds.createdAt,
  updatedAt: (ds: entity) => ds.updatedAt,
  identityCard: (ds: entity) => validator().identityCard(ds.identityCard),
  dischargeDay: (ds: entity) => ds.dischargeDay,
  phone: (ds: entity) => {
    if (ds.phone) return !Array.isArray(ds.phone) ? (ds.phone = [ds.phone]) : ds.phone;

    return null;
  },
  mobilePhone: (ds: entity) => ds.mobilePhone,
};
