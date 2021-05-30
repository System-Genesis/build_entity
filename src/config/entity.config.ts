import { entity } from '../types/entityType';
import { setDischargeDay, setMobilePhone, setPhone } from '../utils/utils';
import { validator } from '../utils/utils';

export const dataSourceHierarchy: string[] = ['a', 'b'];
export const primeStr = 'getPrime';
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
  //   profile: (ds: entity) => ds.pictures?.profile,
  //   url: (ds: entity) => ds.pictures?.profile?.url,
  //   meta: (ds: entity) => ds.pictures?.profile?.meta,
  sex: (ds: entity) => ds.sex,
  birthDate: (ds: entity) => ds.birthDate,
  createdAt: (ds: entity) => ds.createdAt,
  updatedAt: (ds: entity) => ds.updatedAt,
  phone: (ds: entity) => (ds.phone = setPhone(ds) as string[]),
  identityCard: (ds: entity) => validator().identityCard(ds.identityCard),
  mobilePhone: (ds: entity) => (ds.mobilePhone = setMobilePhone(ds.mobilePhone) as string[]),
  dischargeDay: (ds: entity) => (ds.dischargeDay = setDischargeDay(ds.dischargeDay) as Date),
};

// function setFieldOneByOne(baseObj: entity, entity: entity) {
//   if (!baseObj.firstName && entity.firstName) baseObj.firstName = entity.firstName;
//   if (!baseObj.lastName && entity.lastName) baseObj.lastName = entity.lastName;
//   if (!baseObj.personalNumber && entity.personalNumber)
//     baseObj.personalNumber = entity.personalNumber;
//   if (!baseObj.rank && entity.rank) baseObj.rank = entity.rank;
//   if (!baseObj.clearance && entity.clearance) baseObj.clearance = entity.clearance;
//   if (!baseObj.displayName && entity.displayName) baseObj.displayName = entity.displayName;
//   if (!baseObj.akaUnit && entity.akaUnit) baseObj.akaUnit = entity.akaUnit;
//   if (!baseObj.status && entity.status) baseObj.status = entity.status;
//   if (!baseObj.mail && entity.mail) baseObj.mail = entity.mail;
//   if (!baseObj.job && entity.job) baseObj.job = entity.job;
//   if (!baseObj.address && entity.address) baseObj.address = entity.address;
//   if (!baseObj.sex && entity.sex) baseObj.sex = entity.sex;
//   if (!baseObj.birthDate && entity.birthDate) baseObj.birthDate = entity.birthDate;
//   if (!baseObj.createdAt && entity.createdAt) baseObj.createdAt = entity.createdAt;
//   if (!baseObj.updatedAt && entity.updatedAt) baseObj.updatedAt = entity.updatedAt;

//   if (!baseObj.phone && entity.phone) baseObj.phone = setPhone(entity) as string[];

//   if (!baseObj.identityCard && entity.identityCard)
//     baseObj.identityCard = (
//       validator().identityCard(entity.identityCard) ? entity.identityCard : null
//     ) as string;

//   if (!baseObj.mobilePhone && entity.mobilePhone)
//     baseObj.mobilePhone = setMobilePhone(entity.mobilePhone) as string[];
//   if (!baseObj.dischargeDay && entity.dischargeDay)
//     baseObj.dischargeDay = setDischargeDay(entity.dischargeDay) as Date;

//   if (!baseObj.pictures.profile.url && entity.pictures.profile.url) {
//     baseObj.pictures = { profile: { url: entity.pictures.profile.url, meta: null } };
//   }

//   if (!baseObj.pictures.profile.meta && entity.pictures.profile.meta) {
//     baseObj.pictures = {
//       profile: { meta: entity.pictures.profile.meta, url: baseObj.pictures?.profile.url as string },
//     };
//   }
// }
