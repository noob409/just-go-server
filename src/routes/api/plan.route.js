import { Router } from "express";
import {
  validateBody,
  validateParams,
} from "../../middlewares/validateFields.js";
import { getPlans, createPlan } from "../../controllers/api/plan.controller.js";
import { checkPlansAccess } from "../../middlewares/checkPlanAccess.js";

const PlanRouter = Router({ mergeParams: true });

PlanRouter.get("/", checkPlansAccess, getPlans);
PlanRouter.post("/", checkPlansAccess, createPlan);

export default PlanRouter;
