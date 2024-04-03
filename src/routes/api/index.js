import { Router } from "express";

import { testController } from "../../controllers/api/test.controller.js";

const APIRouter = Router();

APIRouter.post("/test", testController);

export default APIRouter;
