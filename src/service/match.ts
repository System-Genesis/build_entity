import { entity } from '../types/entityType';
import { getDischargeDay, setMobilePhone, setPhone } from '../utils/utils';
import validator from '../utils/validator';

export const match_Other = async (newObj: entity, baseObj: entity = {} as entity) => {
  if (!baseObj.entityType && newObj.entityType) baseObj.entityType = newObj.entityType;
  if (!baseObj.firstName && newObj.firstName) baseObj.firstName = newObj.firstName;
  if (!baseObj.lastName && newObj.lastName) baseObj.lastName = newObj.lastName;
  if (!baseObj.personalNumber && newObj.personalNumber)
    baseObj.personalNumber = newObj.personalNumber;
  if (!baseObj.rank && newObj.rank) baseObj.rank = newObj.rank;
  if (!baseObj.clearance && newObj.clearance) baseObj.clearance = newObj.clearance;
  if (!baseObj.displayName && newObj.displayName) baseObj.displayName = newObj.displayName;
  if (!baseObj.akaUnit && newObj.akaUnit) baseObj.akaUnit = newObj.akaUnit;
  if (!baseObj.status && newObj.status) baseObj.status = newObj.status;
  if (!baseObj.mail && newObj.mail) baseObj.mail = newObj.mail;
  if (!baseObj.job && newObj.job) baseObj.job = newObj.job;
  if (!baseObj.address && newObj.address) baseObj.address = newObj.address;
  if (!baseObj.sex && newObj.sex) baseObj.sex = newObj.sex;
  if (!baseObj.birthDate && newObj.birthDate) baseObj.birthDate = newObj.birthDate;
  if (!baseObj.createdAt && newObj.createdAt) baseObj.createdAt = newObj.createdAt;
  if (!baseObj.updatedAt && newObj.updatedAt) baseObj.updatedAt = newObj.updatedAt;

  if (!baseObj.phone && newObj.phone) baseObj.phone = setPhone(newObj) as string[];

  if (!baseObj.identityCard && newObj.identityCard)
    baseObj.identityCard = (
      validator().identityCard(newObj.identityCard) ? newObj.identityCard : null
    ) as string;

  if (!baseObj.mobilePhone && newObj.mobilePhone)
    baseObj.mobilePhone = setMobilePhone(newObj.mobilePhone) as string[];
  if (!baseObj.dischargeDay && newObj.dischargeDay)
    baseObj.dischargeDay = getDischargeDay(newObj.dischargeDay) as Date;

  if (!baseObj.pictures.profile.url && newObj.pictures.profile.url) {
    baseObj.pictures = { profile: { url: newObj.pictures.profile.url, meta: null } };
  }

  if (!baseObj.pictures.profile.meta && newObj.pictures.profile.meta) {
    baseObj.pictures = {
      profile: { meta: newObj.pictures.profile.meta, url: baseObj.pictures?.profile.url as string },
    };
  }

  return baseObj;
};
