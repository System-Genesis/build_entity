import { initializeLogger } from './logger/logger';
import { connectRabbit, initializeConsume } from './rabbit/rabbit';

(async () => {
  await connectRabbit();
  await initializeLogger();
  await initializeConsume();
})();
