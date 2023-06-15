import dotenv from 'dotenv';
dotenv.config();

export default {
  HOST: process.env.DB_HOST,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  DB: process.env.DB_DATABASE,
  dialect: process.env.DB_DIALECT,
  timeout: {
    connect: 60000
  },
  pool: {
    max: Number(process.env.DB_POOL_MAX),
    min: Number(process.env.DB_POOL_MIN),
    acquire: Number(process.env.DB_POOL_ACQUIRE),
    evict: Number(process.env.DB_POOL_EVICT),
    idle: Number(process.env.DB_POOL_IDLE)
  }
};
