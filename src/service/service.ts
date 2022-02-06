import { mergedObj } from '../types/mergedObjType';
import { record } from '../types/recordType';
import logger from 'logger-genesis';
import { getRecordsByHierarchy } from './recordsByHierarchy';
import { buildEntity } from './buildEntity';

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
