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

export const setDischargeDay = (dischargeDay: any) => {
  const date = dischargeDay ? new Date(dischargeDay) : null;
  const userTimezoneOffset = date ? date.getTimezoneOffset() * 60000 : null;
  return date ? new Date(date.getTime() - (userTimezoneOffset as number)) : null;
};
