import path from 'path';
import os from 'os';
import winston, { config, format } from 'winston';

const date = () => new Date(Date.now()).toLocaleDateString();

const logger = winston.createLogger({
  levels: config.npm.levels,

  format: format.combine(
    format.colorize(),
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.splat(),
    format.simple(),
    format((info) => {
      info.service = 'build entity';
      info.hostname = os.hostname();
      return info;
    })(),
    format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, `../../log/${date()}-logger.log`),
      maxsize: 50000,
    }),
  ],
});

export const log = (str: string, any: any = '') => {
  logger.log('error', `${str} =>`, any);
};
