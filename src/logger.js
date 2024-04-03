import pino from "pino";
import pretty from "pino-pretty";

const streams = pino.multistream([
  pretty({
    colorize: true,
    translateTime: "yyyy-mm-dd HH:MM:ss'Z'",
    ignore: "pid,hostname",
    sync: true,
  }),
  pretty({
    colorize: false,
    translateTime: "yyyy-mm-dd HH:MM:ss'Z'",
    destination: "./logs/log.log",
    ignore: "pid,hostname",
    sync: true,
  }),
]);

const logger = pino({}, streams);

export default logger;
