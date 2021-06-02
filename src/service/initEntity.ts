import { entityValidation } from '../utils/entity.utils';
import { logInfo } from '../logger/logger';
import { entity } from '../types/entityType';

/**
 * Add fields to entity from record
 *
 * @param record record from dataSource
 * @param entity entity that builded before and add new fields
 * @returns entity with the new fields
 */
export const initEntity = (record: entity, entity: entity = {}) => {
  logInfo('Optional fields to copy => ', record);
  logInfo('Copy fields to => ', entity);

  validateFields(record).forEach((fieldName) => setSpecificField(entity, record, fieldName));

  return entity;
};

/**
 * Check which field to get from this record
 *
 * @param record record from dataSource
 * @returns array of fields name that pass the validation
 */
export function validateFields(record: entity): string[] {
  const validatedFields: string[] = [];

  Object.keys(entityValidation).forEach((eliValidatorerationer) => {
    if (record[eliValidatorerationer] && entityValidation[eliValidatorerationer](record)) {
      validatedFields.push(eliValidatorerationer);
    }
  });

  logInfo(`Fields to copy => ${validatedFields}`);
  return validatedFields;
}

/**
 * Insert value to entity if not exist
 *
 * @param entity target entity to insert value
 * @param record source to get value from
 * @param fieldName name of filed to get & insert the value
 */
export function setSpecificField(entity: entity, record: entity, fieldName: string) {
  if (!entity[fieldName] && record[fieldName]) entity[fieldName] = record[fieldName];
}

//
// if add to array and not replace
//
// export function setSpecificField(entity: entity, record: entity, fieldName: string) {
//   if (!entity[fieldName] && record[fieldName]) {
//     entity[fieldName] = Array.isArray(entity[fieldName])
//       ? entity[fieldName].push(...record[fieldName])
//       : record[fieldName];
//   }
// }
