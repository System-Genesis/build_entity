import logger from 'logger-genesis';
import menash, { ConsumerMessage } from 'menashmq';
import config from '../config/env.config';
import { createEntity } from '../service/buildEntity';
import { entity } from '../types/entityType';
import { mergedObj } from '../types/mergedObjType';

export const connectRabbit = async () => {
  console.log('Try to connect to Rabbit...');
  await menash.connect(config.rabbit.uri, config.rabbit.retryOptions);

  await menash.declareQueue(config.rabbit.getData);
  await menash.declareQueue(config.rabbit.sendData);

  console.log('Rabbit connected');

  await menash.queue(config.rabbit.getData).activateConsumer(
    async (msg: ConsumerMessage) => {
      try {
        const mergedObj = msg.getContent() as mergedObj;
        logger.info(false, 'APP', 'Got from queue', '', mergedObj);

        const entity = await createEntity(mergedObj);

        if (entity) {
          await sendRecordToCreate(entity);
          logger.info(false, 'APP', 'Send to create queue', '');

          msg.ack();
        } else {
          logger.error(true, 'APP', 'Entity not builded', '');
        }
      } catch (error: any) {
        logger.error(true, 'SYSTEM', 'Entity build Fail', JSON.stringify(error));

        // handle error reject or else ...
        msg.ack();
      }
    },
    { noAck: false }
  );
};

export const sendRecordToCreate = async (data: entity) => {
  try {
    await menash.send(config.rabbit.sendData, data);
  } catch (error) {
    logger.error(true, 'SYSTEM', 'Send to create Fail', JSON.stringify(error));
  }
};

export default { connectRabbit, sendRecordToDiff: sendRecordToCreate };
