import { Router } from "express";

import APIRouter from "./api/index.js";

const Routes = Router();

Routes.use("/api", APIRouter);

export default Routes;
