import { setEntity } from './setEntity';
import { entity } from '../types/entityType';
import { identifiers } from '../types/mergedObjType';
import { record } from '../types/recordType';
import fieldsName from '../config/fieldsName';
import logger from 'logger-genesis';
import envConfig from '../config/env.config';

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

  // delete forbidden fields on goalUser
  if (entity.entityType == fieldsName.entityType.g) {
    envConfig.goalUserForbiddenFields.forEach((key) => {
      delete entity[key];
    });
  }

  logger.info(false, 'APP', 'Result Entity', JSON.stringify(entity), entity);
  return entity;
};

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

export function getTruthyFields(obj: object) {
  Object.keys(obj).forEach((field) => (!obj[field] ? delete obj[field] : null));

  return obj;
}
