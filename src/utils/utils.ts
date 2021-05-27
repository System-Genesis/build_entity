import validator from './validator';

export const setPhone = (obj: any): string[] | null => {
  return validator().phone.test(`${obj.areaCode}-${obj.areaCode}`)
    ? [`${obj.areaCode}-${obj.areaCode}`]
    : null;
};

export const setMobilePhone = (areaCodeMobile: any): string[] | null => {
  return validator().mobilePhone.test(`${areaCodeMobile}-${areaCodeMobile}`)
    ? [`${areaCodeMobile}-${areaCodeMobile}`]
    : null;
};

export const getDischargeDay = (dischargeDay: any) => {
  const date = dischargeDay ? new Date(dischargeDay) : null;
  const userTimezoneOffset = date ? date.getTimezoneOffset() * 60000 : null;
  return date ? new Date(date.getTime() - (userTimezoneOffset as number)) : null;
};
