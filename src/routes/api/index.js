// src/routes/api/index.js

import { Router } from "express";

import { testController } from "../../controllers/api/test.controller.js";
import { verifyJwtToken } from "../../middlewares/verifyJwtToken.js";
import AuthRouter from "./auth.routes.js";
import TripRouter from "./trip.route.js";
import UserRouter from "./user.routes.js";
import PlaceRouter from "./place.route.js";
import PlanRouter from "./plan.route.js";
import DayRouter from "./day.route.js";
import AttractionRouter from "./attraction.route.js";

const APIRouter = Router();

APIRouter.post("/test", testController);

APIRouter.use("/auth", AuthRouter);

// 所有以/api/${name} (except to /api/auth)開頭的請求都需要經過驗證token
// 路徑需修改
APIRouter.use("/users", verifyJwtToken, UserRouter);
APIRouter.use("/places", verifyJwtToken, PlaceRouter);
APIRouter.use(
  "/trips/:tripId/plans/:planId/days/:dayId/attractions",
  verifyJwtToken,
  AttractionRouter
);
APIRouter.use("/trips/:tripId/plans/:planId/days", verifyJwtToken, DayRouter);
APIRouter.use("/trips/:tripId/plans", verifyJwtToken, PlanRouter);
APIRouter.use("/trips", verifyJwtToken, TripRouter);

export default APIRouter;
