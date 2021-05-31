import { initEntity } from './initEntity';
import { entity } from '../types/entityType';
import { akaStr, dataSourceHierarchy } from '../config/entity.config';
import { getPrimeSource, sortAka, sortSource } from '../utils/utils';
import { mergedObj } from '../types/mergedObjType';
import { log } from '../logger/logger';

const getRecordsByHierarchy = (data: mergedObj) => {
  const primeUnitStr = getPrimeSource(data.aka[0].akaUnit || data.city[0].akaUnit);

  const allRecords: any = [];

  let akaRecords: entity[] = [];
  let primeRecords: entity[] = [];

  dataSourceHierarchy.forEach((d) => {
    if (data[d]) {
      if (d === akaStr) akaRecords = data[d];
      else if (d === primeUnitStr) primeRecords = data[d];
      else data[d].sort(sortSource).forEach((record: any) => allRecords.push(record));
    }
  });

  akaRecords.sort(sortAka);

  primeRecords.sort(sortSource);

  return [...akaRecords, ...primeRecords, ...allRecords];
};

const setEntity = (allRecords: entity[]) => {
  let entity: entity = {};

  for (let i = 0; i < allRecords.length; i++) {
    entity = initEntity(allRecords[i], entity);
  }

  log('result entity: ', entity);
  return entity;
};

export const buildEntity = async (data: mergedObj) => {
  log(`getFrom queue `, data);
  let allRecords: entity[] = getRecordsByHierarchy(data);

  if (allRecords.length > 0) return setEntity(allRecords);

  log(`didn't get any record`);
  return null;
};
