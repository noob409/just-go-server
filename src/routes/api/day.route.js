import { Router } from "express";
import { getDays } from "../../controllers/api/day.controller.js";
import { checkDaysAccess } from "../../middlewares/checkDaysAccess.js";

const DayRouter = Router({ mergeParams: true });

DayRouter.get("/", checkDaysAccess, getDays);

export default DayRouter;
