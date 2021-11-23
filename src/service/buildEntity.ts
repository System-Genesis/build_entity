import { setEntity } from './setEntity';
import { entity } from '../types/entityType';
import { akaStr, sourceHierarchy } from '../utils/entity.utils';
import { getPrimeSource, sortAka, sortSource } from '../utils/entity.utils';
import { mergedObj, identifiers } from '../types/mergedObjType';
import { record } from '../types/recordType';
import fieldsName from '../config/fieldsName';
import logger from 'logger-genesis';

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
  logger.info(true, 'APP', `Prime source = ${primeUnitStr}.`, `Prime source = ${primeUnitStr}.`, {
    id: data.identifiers,
  });

  const allRecords: any = [];
  let akaRecords: entity[] = [];
  let primeRecords: entity[] = [];

  sourceHierarchy.forEach((source) => {
    if (data[source]) {
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
export const buildEntity = (allRecords: record[], identifiers: identifiers): entity => {
  let entity: entity = {};

  if (process.env.VALIDATE) {
    const logMsg = { msg: '' };

    allRecords.forEach((record) => (entity = setEntity(record, logMsg, entity)));

    logger.info(true, 'APP', 'Entity Builded', logMsg.msg, { id: identifiers });
  } else {
    allRecords.reverse().forEach((record) => Object.assign(entity, getTruthyFields(record)));
  }

  // Optional civilian
  if (entity.entityType == fieldsName.entityType.s && entity.identityCard) {
    entity.entityType = gerPriorityEntityType(allRecords, entity.entityType, identifiers);
  }
  logger.info(false, 'APP', 'Result Entity', JSON.stringify(entity), entity);
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

  if (allRecords.length > 0) {
    return buildEntity(allRecords, data.identifiers);
  }
  logger.error(false, 'APP', `Didn't get any record`, JSON.stringify(data), data.identifiers);
  return null;
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

export function gerPriorityEntityType(allRecords: record[], entityType: string, identifiers: identifiers): string {
  for (const record of allRecords) {
    if (record.entityType === fieldsName.entityType.c) {
      logger.info(false, 'APP', 'Change Entity Type', `Change to ${fieldsName.entityType.c}, source ${record.source}`, {
        id: identifiers,
      });
      return record.entityType;
    }
  }

  return entityType;
}
