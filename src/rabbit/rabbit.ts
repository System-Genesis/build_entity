import menash, { ConsumerMessage } from 'menashmq';
import config from '../config/rabbit.config';
import { logInfo, logError } from '../logger/logger';
import { buildEntity } from '../service/buildEntity';
import { entity } from '../types/entityType';
import { mergedObj } from '../types/mergedObjType';

export const connectRabbit = async () => {
  logInfo('Connecting to Rabbit...');

  await menash.connect(config.rabbit.uri, config.rabbit.retryOptions);

  await menash.declareQueue(config.rabbit.getData);
  await menash.declareQueue(config.rabbit.sendData);

  logInfo('Rabbit connected');

  await menash.queue(config.rabbit.getData).activateConsumer(
    async (msg: ConsumerMessage) => {
      try {
        let record = msg.getContent() as mergedObj;
        logInfo(`Get from queue => `, record);

        const entity = await buildEntity(record);
        logInfo('Entity builded');

        if (entity) {
          await sendRecordToDiff(entity);
          logInfo('Send to dif queue');

          msg.ack();
        } else {
          throw 'Entity not builded';
        }
      } catch (error) {
        logError(error);

        msg.ack();
      }
    },
    { noAck: false }
  );
};

export const sendRecordToDiff = async (data: entity) => {
  try {
    await menash.send(config.rabbit.getData, data);
  } catch (error) {
    logInfo(`${error}`.split('at C')[0]);
  }
};

export default { connectRabbit, sendRecordToDiff };
