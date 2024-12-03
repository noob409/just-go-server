import "dotenv/config.js";
import fs, { existsSync } from "fs";
import http from "http";
import https from "https";
import app from "./app.js";
import db from "./database.js";
import logger from "./logger.js";

const { SERVER_HTTPS_PORT, SERVER_HTTP_PORT } = process.env;

if (
  existsSync("certs/key.pem") &&
  existsSync("certs/cert.crt") &&
  existsSync("certs/chain.pem")
) {
  const options = {
    key: fs.readFileSync("certs/key.pem"),
    cert: fs.readFileSync("certs/cert.crt"),
    ca: fs.readFileSync("certs/chain.pem"),
  };

  https.createServer(options, app).listen(SERVER_HTTPS_PORT, () => {
    logger.info(`HTTPS Server is running on port ${SERVER_HTTPS_PORT}`);
  });
}

http.createServer(app).listen(SERVER_HTTP_PORT, () => {
  logger.info(`HTTP Server is listening on port ${SERVER_HTTP_PORT}`);
});

db.connect();
db.resolve();
