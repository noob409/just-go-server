import cors from "cors";
import express, { json } from "express";
import redoc from "redoc-express";
import session from 'express-session';


import REDOC_CONFIG from "./config/redoc.js";
import logger from "./logger.js";
import routes from "./routes/index.js";

logger.info("[Init] useAPIService.");

const app = express();

// 允许特定的前端域名
const corsOptions = {
  origin: 'http://localhost:5173', // 替换为您的前端应用的URL
  optionsSuccessStatus: 200
};

// cors
app.use(cors(corsOptions));

// json body parser
app.use(json());

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

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
