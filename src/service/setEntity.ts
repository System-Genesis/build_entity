import { entityValidation } from '../utils/entity.utils';
import { entity } from '../types/entityType';
import { record } from '../types/recordType';

let setFieldsLog: string = '';
/**
 * Add fields to entity from record
 *
 * @param record record from source
 * @param entity entity that builded before and add new fields
 * @returns entity with the new fields
 */
export const setEntity = (record: record, logMsg: { msg: string }, entity: entity = {}) => {
  setFieldsLog = '';

  validateFields(record).forEach((fieldName) => setSpecificField(entity, record, fieldName));

  logMsg.msg += setFieldsLog;

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
    setFieldsLog += `Set ${fieldName} = ${record[fieldName]}; from ${record.source}.\n`;

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
