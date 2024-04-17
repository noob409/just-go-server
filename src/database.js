import { readdirSync } from "fs";

import sequelize from "./config/sequelize.js";
import logger from "./logger.js";
import { delay } from "./utils/utils.js";

const db = {
  sequelize,
  async connect() {
    while (true) {
      try {
        await sequelize.authenticate();
        logger.info("[DB] connected");
        break;
      } catch (error) {
        logger.error(error, `[DB] connection failed. reason:`);
        await delay(3000);
      }
    }
  },
  async resolve() {
    const modelFiles = readdirSync("./src/models")
      .filter((file) => file.endsWith(".js"))
      .map((file) => `./models/${file}`);
    for (const modelFile of modelFiles) {
      const model = await import(modelFile);
      this[model.default.name] = model.default;
      model.associate?.();
    }
  },
};

export default db;
