import { entity } from '../types/entityType';
import { setDischargeDay, setMobilePhone, setPhone } from '../utils/utils';
import { validator } from '../utils/utils';

export const dataSourceHierarchy: string[] = ['aka', 'eightSocks', 'adS', 'adNn', 'city', 'sf'];
export const akaStr = 'aka';

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
  dischargeDay: (ds: entity) => (ds.dischargeDay = setDischargeDay(ds.dischargeDay) as Date),
  phone: (ds: entity) => {
    const phone = setPhone(ds);

    if (phone) return !(ds.phone instanceof Array) ? (ds.phone = [phone]) : ds.phone.push(phone);

    return null;
  },
  mobilePhone: (ds: entity) => {
    const mobilePhone = setMobilePhone(ds);

    if (mobilePhone)
      return !(ds.mobilePhone instanceof Array)
        ? (ds.mobilePhone = [mobilePhone])
        : ds.mobilePhone.push(mobilePhone);

    return null;
  },
};
