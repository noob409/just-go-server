import { Router } from "express";
import {
  validateBody,
  validateParams,
} from "../../middlewares/validateFields.js";
import {
  getPlans,
  createPlan,
  updatePlanName,
} from "../../controllers/api/plan.controller.js";
import {
  checkPlansAccess,
  checkPlanAccess,
} from "../../middlewares/checkPlanAccess.js";

const PlanRouter = Router({ mergeParams: true });

PlanRouter.get("/", checkPlansAccess, getPlans);
PlanRouter.post("/", checkPlansAccess, createPlan);
PlanRouter.patch(
  "/:planId/name",
  validateParams(["planId"]),
  checkPlanAccess,
  updatePlanName
);

export default PlanRouter;
