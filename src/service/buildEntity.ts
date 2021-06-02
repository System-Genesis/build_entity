import { initEntity } from './initEntity';
import { entity } from '../types/entityType';
import { akaStr, dataSourceHierarchy } from '../utils/entity.utils';
import { getPrimeSource, sortAka, sortSource } from '../utils/entity.utils';
import { mergedObj } from '../types/mergedObjType';
import { logInfo } from '../logger/logger';

export const getRecordsByHierarchy = (data: mergedObj): entity[] => {
  const primeUnitStr = getPrimeSource(data.aka || data.city);

  const allRecords: any = [];

  let akaRecords: entity[] = [];
  let primeRecords: entity[] = [];

  dataSourceHierarchy.forEach((d) => {
    if (data[d]) {
      if (d === akaStr) {
        akaRecords = data[d]?.map(({ record }) => record).sort(sortAka) || [];
      } else if (d === primeUnitStr) {
        primeRecords = data[d]?.map(({ record }) => record).sort(sortSource) || [];
      } else {
        data[d]
          .sort(sortSource)
          .map(({ record }) => record)
          .forEach((record: entity) => allRecords.push(record));
      }
    }
  });

  return [...akaRecords, ...primeRecords, ...allRecords];
};

const setEntity = (allRecords: entity[]) => {
  let entity: entity = {};

  if (process.env.VALIDATE) {
    allRecords.forEach((record) => (entity = initEntity(record, entity)));
  } else {
    allRecords.reverse().forEach((record) => Object.assign(entity, record));

    // delete undefined fields
    Object.keys(entity).forEach((field) => (!entity[field] ? delete entity[field] : null));
  }

  logInfo('Result entity => ', entity);
  return entity;
};

export const buildEntity = async (data: mergedObj) => {
  let allRecords: entity[] = getRecordsByHierarchy(data);

  if (allRecords.length === 0) {
    logInfo(`Didn't get any record`);
    return null;
  }

  return setEntity(allRecords);
};
