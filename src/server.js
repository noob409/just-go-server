import "dotenv/config.js";
import app from "./app.js";
import db from "./database.js";
import logger from "./logger.js";

const { SERVER_HTTP_PORT } = process.env;

app.listen(SERVER_HTTP_PORT, () => {
  logger.info(`listening on port ${SERVER_HTTP_PORT}`);
});

db.connect();
db.resolve();
