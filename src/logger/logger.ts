import { menash } from 'menashmq';
import path from 'path';
// import os from 'os';
import winston, { config, format } from 'winston';
import configEnv from '../config/env.config';

const date = () => new Date(Date.now()).toLocaleDateString();

const logger = winston.createLogger({
  levels: config.npm.levels,

  format: format.combine(
    format.colorize(),
    // format.timestamp({
    //   format: 'YYYY-MM-DD HH:mm:ss',
    // }),
    format.splat(),
    format.simple()
    // format((info) => {
    //   info.service = 'build entity';
    //   info.hostname = os.hostname();
    //   return info;
    // })(),
    // format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(__dirname, `../../log/${date()}-logger.log`),
      maxsize: 50000,
    }),
  ],
});

export const logs = (level: string, msg: string, any?: any) => {
  menash.send(configEnv.rabbit.logger, {
    level,
    message: `${msg}. ${any ? JSON.stringify(any) : ''}`,
    system: 'TRAKING',
    service: 'BUILD_ENTITY',
    extraFields: any,
  });

  if (any) logger.info(`${msg} ${JSON.stringify(any)}`);
  else logger.info(msg);
};

export const logInfoLocal = (msg: string, any?: any) => {
  if (any) logger.info(`${msg} ${JSON.stringify(any)}`);
  else logger.info(msg);
};

export const logError = (msg: string, any?: any) => {
  logs('error', msg, any);
};
export const logInfo = (msg: string, any?: any) => {
  logs('info', msg, any);
};
export const logWarn = (msg: string, any?: any) => {
  logs('warn', msg, any);
};
