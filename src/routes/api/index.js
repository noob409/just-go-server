// src/routes/api/index.js

import { Router } from "express";

import { testController } from "../../controllers/api/test.controller.js";
import AuthRouter from "./auth.routes.js";
import TripRouter from "./trip.route.js";
import { verifyToken } from "../../controllers/api/verify.controller.js";

const APIRouter = Router();

APIRouter.post("/test", testController);

APIRouter.use("/auth", AuthRouter);

// 所有以/api/trip開頭的請求都需要經過驗證token
APIRouter.use("/trip", verifyToken, TripRouter);

// APIRouter.use("/trip", TestRouter);

export default APIRouter;
