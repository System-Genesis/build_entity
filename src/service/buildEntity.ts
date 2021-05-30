import { initEntity } from './initEntity';
import { entity } from '../types/entityType';
import { akaStr, dataSourceHierarchy, primeStr } from '../config/entity.config';

const source = () => {
  return (curr: any, _: any) => {
    // enum fn
    return curr.entityType === 'Solider' ? -1 : 1;
  };
};

export const buildEntity = async (data: any) => {
  let dataArr: any = [];

  let aka: any = [];
  let prime: any;

  dataSourceHierarchy.forEach((d) => {
    if (data[d]) {
      if (d === akaStr) aka = data[d];
      else if (d === primeStr) prime = data[d];
      else data[d].sort(source).forEach((record: any) => dataArr.push(record));
    }
  });

  // sort aka
  aka.sort((curr: any, _: any) => {
    // enum fn
    return `${curr.personalNumber}`.length === 9 ? 1 : -1;
  });

  // sort prime
  prime.sort(source);

  dataArr = [...aka, ...prime, ...dataArr];

  if (dataArr.length > 0) {
    let entity: Partial<entity> = await initEntity(dataArr[0] as entity);

    for (let i = 1; i < dataArr.length; i++) {
      entity = await initEntity(dataArr[i] as entity, entity as entity);
    }
  }
};
