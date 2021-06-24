import { entityValidation } from '../utils/entity.utils';
import { logInfo } from '../logger/logger';
import { entity } from '../types/entityType';
import { record } from '../types/recordType';

/**
 * Add fields to entity from record
 *
 * @param record record from source
 * @param entity entity that builded before and add new fields
 * @returns entity with the new fields
 */
export const setEntity = (record: record, entity: entity = {}) => {
  logInfo(`Start with Record from ${record.source} => `, record);

  validateFields(record).forEach((fieldName) => setSpecificField(entity, record, fieldName));

  logInfo(`End with Record from ${record.source}`);
  return entity;
};

/**
 * Check which field to get from this record
 *
 * @param record record from source
 * @returns array of fields name that pass the validation
 */
export function validateFields(record: record): string[] {
  const validatedFields: string[] = [];

  Object.keys(entityValidation).forEach((eliValidatorerationer) => {
    if (record[eliValidatorerationer] && entityValidation[eliValidatorerationer](record)) {
      validatedFields.push(eliValidatorerationer);
    }
  });

  return validatedFields;
}

/**
 * Insert value to entity if not exist
 *
 * @param entity target entity to insert value
 * @param record source to get value from
 * @param fieldName name of filed to get & insert the value
 */
export function setSpecificField(entity: entity, record: record, fieldName: string) {
  if (!entity[fieldName] && record[fieldName]) {
    logInfo(`Set ${fieldName} = ${record[fieldName]}; from ${record.source}`);

    entity[fieldName] = record[fieldName];
  }
}

//
// if add to array and not replace
//
// export function setSpecificField(entity: entity, record: record, fieldName: string) {
//   if (!entity[fieldName] && record[fieldName]) {
//     entity[fieldName] = Array.isArray(entity[fieldName])
//       ? entity[fieldName].push(...record[fieldName])
//       : record[fieldName];
//   }
// }
