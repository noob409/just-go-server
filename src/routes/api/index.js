// src/routes/api/index.js

import { Router } from "express";

import { testController } from "../../controllers/api/test.controller.js";
import AuthRouter from "./auth.routes.js";
const APIRouter = Router();

APIRouter.post("/test", testController);

APIRouter.use("/auth", AuthRouter);

// APIRouter.use("/trip", TestRouter);

export default APIRouter;
