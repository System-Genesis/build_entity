import './dotenv';

import * as env from 'env-var';

export default {
  serviceName: env.get('SERVICE_NAME').required().asString(),
  systemName: env.get('SYSTEM_NAME').required().asString(),
  rabbit: {
    uri: env.get('MATCH_TO_KART_RABBIT_URI').required().asString(),
    sendData: env.get('SEND_DATA').required().asString(),
    logger: env.get('LOGGER').required().asString(),
    getData: env.get('GET_DATA').required().asString(),
    retryOptions: {
      minTimeout: env.get('RABBIT_RETRY_MIN_TIMEOUT').default(1000).asIntPositive(),
      retries: env.get('RABBIT_RETRY_RETRIES').default(10).asIntPositive(),
      factor: env.get('RABBIT_RETRY_FACTOR').default(1.8).asFloatPositive(),
    },
  },
  ds_h: env.get('DS_H').required().asArray(),
};
