import { units } from '../units/units';
import { entity } from '../types/entityType';
import { log } from '../logger/logger';

export const validator = () => {
  return {
    phone: /^\d{1,2}-?\d{6,7}$|^\*\d{3}$|^\d{4,5}$/,
    mobilePhone: /^\d{2,3}-?\d{7}$/,
    identityCard: (id: string | undefined) => {
      if (!id) return false;

      let idNumber = id;
      if (!idNumber.match(/^\d{5,9}$/g)) return false;
      // The number is too short - add leading zeroes
      idNumber = idNumber.padStart(9, '0');
      //ID Validation
      const accumulator = idNumber.split('').reduce((count, currChar, currIndex) => {
        const num = Number(currChar) * ((currIndex % 2) + 1);
        return (count += num > 9 ? num - 9 : num);
      }, 0);

      return accumulator % 10 === 0;
    },
  };
};

export const setPhone = (obj: any): string | null => {
  return validator().phone.test(`${obj.areaCode}-${obj.phone}`)
    ? `${obj.areaCode}-${obj.phone}`
    : null;
};

export const setMobilePhone = (obj: any): string | null => {
  return validator().mobilePhone.test(`${obj.areaCodeMobile}-${obj.mobilePhone}`)
    ? `${obj.areaCodeMobile}-${obj.mobilePhone}`
    : null;
};

export const setDischargeDay = (dischargeDay: any) => {
  const date = dischargeDay ? new Date(dischargeDay) : null;
  const userTimezoneOffset = date ? date.getTimezoneOffset() * 60000 : null;
  const res = date ? new Date(date.getTime() - (userTimezoneOffset as number)) : null;
  return res?.toString() !== 'Invalid Date' ? res : null;
};

export const getPrimeSource = (currUnit: string | undefined): string => {
  if (!currUnit) return '';

  let unit: string = '';

  Object.keys(units).forEach((u) => {
    if (units[u].includes(currUnit)) unit = u;
  });

  log('prime source = ' + unit);
  return unit;
};

// enum fn
export const sortSource = (curr: entity, _: entity) => (curr.entityType === 'Solider' ? 1 : -1);
export const sortAka = (curr: entity, _: entity) => (curr.personalNumber?.length === 9 ? -1 : 1);
