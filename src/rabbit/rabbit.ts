import menash, { ConsumerMessage } from 'menashmq';
import config from './rabbit.config';
import { buildEntity } from '../service/buildEntity';

export const connectRabbit = async () => {
  console.log('Connecting to Rabbit...');

  await menash.connect(config.rabbit.uri, config.rabbit.retryOptions);

  console.log('Rabbit connected');

  await menash.declareQueue(config.rabbit.getData);
  await menash.declareQueue(config.rabbit.sendData);

  if (config.rabbit.isMockMatchToKart) {
    return;
  }

  await menash.queue(config.rabbit.getData).activateConsumer(
    async (msg: ConsumerMessage) => {
      let record: any = msg.getContent();

      const entity = await buildEntity(record);

      if (entity) {
        await menash.send(config.rabbit.sendData, JSON.stringify(entity));

        msg.ack();
      } else {
        // throw error
      }
    },
    { noAck: false }
  );
};
export const sendRecordToDiff = async (record: any, dataSource: any, runUID: any) => {
  await menash.send(config.rabbit.sendData, {
    record: record,
    dataSource: dataSource,
    runUID: runUID,
  });
};

export default { connectRabbit, sendRecordToMatch: sendRecordToDiff };
