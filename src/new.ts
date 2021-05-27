import { entity } from './types';

const fn: any = [];
const validators: any = (a: any = 'a'): any => {
  return a;
};

const match_aka = async (obj: entity) => {
  const newObj: entity = {
    entityType: obj.entityType ? fn.entityTypeValue.s : null,
    firstName: obj.firstName,
    lastName: obj.lastName,
    personalNumber: obj.personalNumber.toString(),
    rank: obj.rank,
    clearance: obj.clearance,
    phone: setPhone(obj),
    identityCard: validators(obj.identityCard).identityCard ? obj.identityCard : null,
    mobilePhone: setMobilePhone(obj),
    dischargeDay: getDischargeDay(obj),

    displayName: obj.displayName,
    akaUnit: obj.akaUnit,
    status: obj.status,
    mail: obj.mail,
    job: obj.job,
    address: obj.address,
    // check what we get
    pictures: {
      profile: {
        url: obj.pictures.profile.url,
        meta: obj.pictures.profile.meta,
      },
    },
    sex: obj.sex,
    birthDate: obj.birthDate,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };

  return newObj;
};

function setPhone(obj: any): string[] {
  return validators().phone.test(`${obj.areaCode}-${obj.areaCode}`)
    ? [`${obj.areaCode}-${obj.areaCode}`]
    : null;
}

function setMobilePhone(obj: any): string[] {
  return validators().mobilePhone.test(`${obj.areaCodeMobile}-${obj.areaCodeMobile}`)
    ? [`${obj.areaCodeMobile}-${obj.areaCodeMobile}`]
    : null;
}

function getDischargeDay(obj: any) {
  const date = obj.dischargeDay ? new Date(obj.dischargeDay) : null;
  const userTimezoneOffset = date.getTimezoneOffset() * 60000;
  return date ? new Date(date.getTime() - userTimezoneOffset) : null;
}
