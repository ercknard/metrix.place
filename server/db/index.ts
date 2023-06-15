import { Options, Sequelize } from 'sequelize';
import { config } from '../db/config/config';

console.log(process.env.NODE_ENV);

const conf = config[
  process.env.NODE_ENV as 'development' | 'test' | 'production'
]
  ? config[process.env.NODE_ENV as 'development' | 'test' | 'production']
  : {};

export const _sequelize = new Sequelize(conf as Options);

_sequelize.authenticate();

//export * from './models';
