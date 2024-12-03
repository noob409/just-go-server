import "dotenv/config.js";
import fs, { existsSync } from "fs";
import https from "https";
import app from "./app.js";
import db from "./database.js";
import logger from "./logger.js";

const { SERVER_HTTPS_PORT, SERVER_HTTP_PORT } = process.env;

if (existsSync("certs/key.pem") && existsSync("certs/cert.crt")) {
  const options = {
    key: fs.readFileSync("certs/key.pem"),
    cert: fs.readFileSync("certs/cert.crt"),
  };

  https.createServer(options, app).listen(SERVER_HTTPS_PORT, () => {
    logger.info(`HTTPS Server is running on port ${SERVER_HTTPS_PORT}`);
  });
}

app.listen(SERVER_HTTP_PORT, () => {
  logger.info(`HTTP Server is listening on port ${SERVER_HTTP_PORT}`);
});

db.connect();
db.resolve();
