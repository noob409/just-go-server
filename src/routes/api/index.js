// src/routes/api/index.js

import { Router } from "express";

import { testController } from "../../controllers/api/test.controller.js";
import AuthRouter from "./auth.routes.js";
import TripRouter from "./trip.route.js";
import UserRouter from "./user.routes.js";
import { verifyToken } from "../../utils/jwtUtils.js";

const APIRouter = Router();

APIRouter.post("/test", testController);

APIRouter.use("/auth", AuthRouter);

// 所有以/api/${name} (except to /api/auth)開頭的請求都需要經過驗證token
// 路徑需修改
APIRouter.use("/trips", verifyToken, TripRouter);

APIRouter.use("/users", verifyToken, UserRouter);

export default APIRouter;
