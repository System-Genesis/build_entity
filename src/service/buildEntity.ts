import { setEntity } from './setEntity';
import { entity } from '../types/entityType';
import { akaStr, sourceHierarchy } from '../utils/entity.utils';
import { getPrimeSource, sortAka, sortSource } from '../utils/entity.utils';
import { mergedObj } from '../types/mergedObjType';
import { logInfo } from '../logger/logger';
import { record } from '../types/recordType';

/**
 * Create array of records ordered by hierarchy of source
 * Prefer aka source first, prime source second
 * In each source sort the records according his sort logic
 *
 * @param data original obj from queue
 * @returns Array of records ordered by hierarchy
 */
export const getRecordsByHierarchy = (data: mergedObj): record[] => {
  const primeUnitStr = getPrimeSource(data.aka || data.city);

  const allRecords: any = [];
  let akaRecords: entity[] = [];
  let primeRecords: entity[] = [];

  sourceHierarchy.forEach((source) => {
    if (data[source]) {
      console.log(source);

      const records = data[source]?.map(mapToDSRecords(source)).sort(sortSource);

      if (source === akaStr) akaRecords = records.sort(sortAka);
      else if (source === primeUnitStr) primeRecords = records;
      else records.forEach((record: entity) => allRecords.push(record));
    }
  });

  return [...akaRecords, ...primeRecords, ...allRecords];
};

/**
 * Create entity for krtfl from all records
 *
 * @param allRecords records from all given sources
 * @returns Entity ready for krtfl
 */
const buildEntity = (allRecords: record[]): entity => {
  let entity: entity = {};

  if (process.env.VALIDATE) {
    allRecords.forEach((record) => (entity = setEntity(record, entity)));
  } else {
    allRecords.reverse().forEach((record) => Object.assign(entity, getTruthyFields(record)));
  }

  logInfo('Result entity => ', entity);
  return entity;
};

/**
 * Main function to build entity for krtfl
 *
 * @param data object from queue in type mergedObj
 * @returns Entity ready for krtfl or null if didn't get records in data
 */
export const createEntity = async (data: mergedObj) => {
  let allRecords: record[] = getRecordsByHierarchy(data);

  if (allRecords.length === 0) {
    logInfo(`Didn't get any record`);
    return null;
  }

  return buildEntity(allRecords);
};

function getTruthyFields(obj: object) {
  Object.keys(obj).forEach((field) => (!obj[field] ? delete obj[field] : null));

  return obj;
}

function mapToDSRecords(source: string): any {
  return ({ record }) => {
    record.source = source;
    return record;
  };
}
