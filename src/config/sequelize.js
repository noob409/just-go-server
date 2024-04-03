import pg from "pg";
import { Sequelize } from "sequelize";

import logger from "../logger.js";

const {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_DATABASE,
  DATABASE_LOGGING,
  DATABASE_SSL,
} = process.env;

logger.info(
  {
    DATABASE_HOST,
    DATABASE_PORT,
    DATABASE_USER,
    DATABASE_PASSWORD,
    DATABASE_DATABASE,
    DATABASE_SSL,
    DATABASE_LOGGING,
  },
  "Sequelize Config:"
);

// PostgreSQL FIX: 修正 pg 將數字轉成字串的問題
pg.defaults.parseInt8 = true;
pg.defaults.ssl = DATABASE_SSL === "true";

const sequelize = new Sequelize(
  DATABASE_DATABASE,
  DATABASE_USER,
  DATABASE_PASSWORD,
  {
    dialect: "postgres",
    dialectModule: pg,
    dialectOptions: {
      decimalNumbers: true,
      ...(DATABASE_SSL === "true"
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : {}),
    },
    ...(DATABASE_SSL === "true"
      ? {
          ssl: "Amazon RDS",
        }
      : {}),
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    logging: DATABASE_LOGGING === "true" ? logger.info.bind(logger) : false,
  }
);

export default sequelize;
