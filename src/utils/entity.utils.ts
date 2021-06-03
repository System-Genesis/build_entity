import { logInfo } from '../logger/logger';
import { units } from '../units/units';
import { validator } from './validator.utils';
import { record } from './../types/recordType';
import { entity } from './../types/entityType';

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
export const sortSource = (curr: record, _: record) => (curr.entityType === 'Solider' ? 1 : -1);
export const sortAka = (curr: record, _: record) => (curr.personalNumber?.length === 9 ? -1 : 1);

export const entityValidation = {
  displayName: (ds: record) => ds.displayName,
  entityType: (ds: record) => ds.entityType,
  personalNumber: (ds: record) => ds.personalNumber,
  firstName: (ds: record) => ds.firstName,
  lastName: (ds: record) => ds.lastName,
  akaUnit: (ds: record) => ds.akaUnit,
  status: (ds: record) => ds.status,
  rank: (ds: record) => ds.rank,
  mail: (ds: record) => ds.mail,
  job: (ds: record) => ds.job,
  address: (ds: record) => ds.address,
  clearance: (ds: record) => ds.clearance,
  pictures: (ds: record) => ds.pictures,
  sex: (ds: record) => ds.sex,
  birthDate: (ds: record) => ds.birthDate,
  createdAt: (ds: record) => ds.createdAt,
  updatedAt: (ds: record) => ds.updatedAt,
  identityCard: (ds: record) => validator().identityCard(ds.identityCard),
  dischargeDay: (ds: record) => ds.dischargeDay,
  phone: (ds: record) => {
    if (ds.phone) return !Array.isArray(ds.phone) ? (ds.phone = [ds.phone]) : ds.phone;

    return null;
  },
  mobilePhone: (ds: record) => ds.mobilePhone,
};
