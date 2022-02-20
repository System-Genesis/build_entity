import { entity } from '../types/entityType';
import { akaStr, sourceHierarchy } from '../utils/entity.utils';
import { getPrimeSource, sortAka, sortSource } from '../utils/entity.utils';
import { mergedObj } from '../types/mergedObjType';
import { record } from '../types/recordType';
import logger from 'logger-genesis';

/**
 * Create array of records ordered by hierarchy of source
 * Prefer aka source first, prime source second
 * In each source sort the records according his sort logic
 *
 * @param data original obj from queue
 * @returns Array of records ordered by hierarchy
 */
export const getRecordsByPriority = (data: mergedObj): record[] => {
  const primeSourceStr = getPrimeSource(data.aka || data.city);
  logger.info(true, 'APP', `Prime source = ${primeSourceStr}.`, `Prime source = ${primeSourceStr}.`, {
    id: data.identifiers,
  });

  const allRecords: any = [];
  let akaRecords: entity[] = [];
  let primeRecords: entity[] = [];

  sourceHierarchy.forEach((source) => {
    if (data[source]) {
      const records = data[source]?.map(mapToDSRecords(source)).sort(sortSource);

      if (source === akaStr) akaRecords = records.sort(sortAka);
      else if (source === primeSourceStr) primeRecords = records;
      else records.forEach((record: entity) => allRecords.push(record));
    }
  });

  return [...akaRecords, ...primeRecords, ...allRecords];
};

// TODO check if necessary
export function mapToDSRecords(source: string): any {
  return ({ record }) => {
    record.source = source;
    return record;
  };
}
