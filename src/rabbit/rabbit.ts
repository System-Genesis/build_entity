import menash, { ConsumerMessage } from 'menashmq';
import config from './rabbit.config';
import { buildEntity } from '../service/buildEntity';
import { data } from './../config/fake';

export const connectRabbit = async () => {
  console.log('Connecting to Rabbit...');

  await menash.connect(config.rabbit.uri, config.rabbit.retryOptions);

  await menash.declareQueue(config.rabbit.getData);
  await menash.declareQueue(config.rabbit.sendData);

  console.log('Rabbit connected');

  await menash.queue(config.rabbit.getData).activateConsumer(
    async (msg: ConsumerMessage) => {
      try {
        let record: any = msg.getContent();

        const entity = await buildEntity(record);

        if (entity) {
          console.log('🚀 ~ file: rabbit.ts ~ line 24 ~ entity', entity);
          await menash.send(config.rabbit.sendData, JSON.stringify(entity));

          msg.ack();
        } else {
          throw 'Entity not builded';
        }
      } catch (error) {
        console.log(error);

        msg.ack();
      }
    },
    { noAck: false }
  );
};

export const sendRecordToDiff = async () => {
  try {
    await connectRabbit();

    await menash.send(config.rabbit.getData, data);
  } catch (error) {
    console.log(`${error}`.split('at C')[0]);
  }
};

export default { connectRabbit, sendRecordToDiff };
