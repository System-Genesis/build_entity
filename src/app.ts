import initializeHttp from './http/app';
import { initializeLogger } from './logger/logger';
import { connectRabbit, initializeConsume } from './rabbit/rabbit';

(async () => {
  initializeHttp();
  await connectRabbit();
  await initializeLogger();
  await initializeConsume();
})();
