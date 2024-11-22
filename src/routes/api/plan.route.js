import { Router } from "express";
import {
  validateBody,
  validateParams,
} from "../../middlewares/validateFields.js";
import { getPlans, createPlan } from "../../controllers/api/plan.controller.js";

const PlanRouter = Router({ mergeParams: true });

PlanRouter.get("/", getPlans);
PlanRouter.post("/", createPlan);

export default PlanRouter;
