import menash, { ConsumerMessage } from 'menashmq';
import config from '../config';

export const connectRabbit = async () => {
  if (config.rabbit.isMockKiddy && config.rabbit.isMockMatchToKart) {
    return;
  }
  console.log('Connecting to Rabbit...');

  await menash.connect(config.rabbit.uri, config.rabbit.retryOptions);

  console.log('Rabbit connected');

  await menash.declareQueue(config.rabbit.getData);
  await menash.declareQueue(config.rabbit.sendData);
  // await menash.declareTopology({
  //     queues: [{ name: 'feature-queue', options: { durable: true } }],
  //     exchanges: [{ name: 'feature-exchange', type: 'fanout', options: { durable: true } }],
  //     bindings: [{ source: 'feature-exchange', destination: 'feature-queue' }],
  //     consumers: [{ queueName: 'feature-queue', onMessage: featureConsumeFunction }],
  // });
  if (config.rabbit.isMockMatchToKart) {
    return;
  }

  await menash.queue(config.rabbit.afterMatchQName).activateConsumer(
    async (msg: ConsumerMessage) => {
      let record: any = msg.getContent();

      if (!config.rabbit.isMockKiddy) {
        await menash.send(config.rabbit.kiddyQName, JSON.stringify(record));
      }

      msg.ack();
    },
    { noAck: false }
  );
};
export const sendRecordToMatch = async (record: any, dataSource: any, runUID: any) => {
  await menash.send(config.rabbit.beforeMatchQName, {
    record: record,
    dataSource: dataSource,
    runUID: runUID,
  });
};

export default { connectRabbit, sendRecordToMatch };
