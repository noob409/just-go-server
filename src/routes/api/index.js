import { Router } from "express";

import { testController } from "../../controllers/api/test.controller.js";
import { oauth } from "../../controllers/api/oauth.js"

const APIRouter = Router();

APIRouter.post("/test", testController);

APIRouter.post("/googleoauth", oauth);

export default APIRouter;
