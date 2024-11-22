import { Router } from "express";
import { getDays } from "../../controllers/api/day.controller.js";

const DayRouter = Router({ mergeParams: true });

DayRouter.get("/", getDays);

export default DayRouter;
