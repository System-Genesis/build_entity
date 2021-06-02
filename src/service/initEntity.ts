import { entityValidation } from '../utils/entity.utils';
import { logInfo } from '../logger/logger';
import { entity } from '../types/entityType';

export const initEntity = (record: entity, entity: entity = {}) => {
  logInfo('Optional fields to copy => ', record);
  logInfo('Copy fields to => ', entity);

  validateFields(record).forEach((fieldName) => setSpecificField(entity, record, fieldName));

  return entity;
};

export function validateFields(record: entity): string[] {
  const validatedFields: string[] = [];

  Object.keys(entityValidation).forEach((validate) => {
    if (record[validate] && entityValidation[validate](record)) {
      validatedFields.push(validate);
    }
  });

  logInfo(`Fields to copy => ${validatedFields}`);
  return validatedFields;
}

export function setSpecificField(entity: entity, record: entity, fieldName: string) {
  if (!entity[fieldName] && record[fieldName]) {
    entity[fieldName] = Array.isArray(entity[fieldName])
      ? entity[fieldName].push(...record[fieldName])
      : record[fieldName];
  }
}
