import "dotenv/config.js";
import app from "./app.js";
import db from "./database.js";
import logger from "./logger.js";
import fs from "fs";
import https from "https";

const { SERVER_HTTPS_PORT, SERVER_HTTP_PORT } = process.env;
// const options = {
//   key: fs.readFileSync("src/server.key"),
//   cert: fs.readFileSync("src/server.crt"),
// }

// https.createServer(options, app).listen(SERVER_HTTPS_PORT, () => {
//   logger.info(`HTTPS Server is running on port ${SERVER_HTTPS_PORT}`);
// });

app.listen(SERVER_HTTP_PORT, () => {
  logger.info(`HTTP Server is listening on port ${SERVER_HTTP_PORT}`);
});

db.connect();
db.resolve();
