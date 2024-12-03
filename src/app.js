import cors from "cors";
import express, { json } from "express";
import redoc from "redoc-express";
import path from "path";
import { fileURLToPath } from 'url';
import morgan from 'morgan';

import REDOC_CONFIG from "./config/redoc.js";
import logger from "./logger.js";
import routes from "./routes/index.js";

logger.info("[Init] useAPIService.");

const app = express();

app.use(morgan('common'));

// 允许特定的前端域名
const corsOptions = {
  origin: 'http://localhost:5173', // 替换为您的前端应用的URL
  optionsSuccessStatus: 200
};

// cors
app.use(cors(corsOptions));

// json body parser
app.use(json());

// 設置靜態資源目錄
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, 'uploads')));

// api route
app.use(routes);

app.get("/docs/swagger.json", (_, res) =>
  res.sendFile("/swagger-output.json", { root: "." })
);

// docs route
app.use("/docs", redoc(REDOC_CONFIG));

// AWS health check
app.use("/ping", (_, res) => res.end());

// error handler
app.use((err, req, res, __) => {
  logger.error(err);
  const status = err.status || 500;
  const message = err.message;
  logger.info(
    `[${req.method}][${res.locals.user?.uEmail}][${req.url}] ${status}: ${message}`
  );
  res.status(status).json({ message: message });
});

export default app;
