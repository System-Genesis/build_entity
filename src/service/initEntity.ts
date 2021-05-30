import { entityValidation } from '../config/entity.config';
import { entity } from '../types/entityType';

export const initEntity = async (dataSourceObj: entity, entityObj: entity = {}) => {
  validateFields(dataSourceObj).forEach((name) => setSpecificField(entityObj, dataSourceObj, name));

  return entityObj;
};

export function validateFields(dataSourceObj: entity): string[] {
  const validatedFields: string[] = [];

  Object.keys(entityValidation).forEach((validate) => {
    if (entityValidation[validate](dataSourceObj)) validatedFields.push(validate);
  });

  return validatedFields;
}

export function setSpecificField(entity: entity, newObj: entity, fieldName: string) {
  if (!entity[fieldName] && newObj[fieldName]) entity[fieldName] = newObj[fieldName];
}
