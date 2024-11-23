import { Router } from "express";
import {
  getAttractions,
  createAttraction,
  deleteAttraction,
  updateAttractionTime,
  updateAttractionNote,
} from "../../controllers/api/attraction.controller.js";
import { checkDayAccess } from "../../middlewares/checkDaysAccess.js";
import { checkAttractionAccess } from "../../middlewares/checkAttractionAccess.js";
import { validateBody } from "../../middlewares/validateFields.js";

const AttractionRouter = Router({ mergeParams: true });

AttractionRouter.get("/", checkDayAccess, getAttractions);
AttractionRouter.post(
  "/",
  checkDayAccess,
  validateBody(["googlePlaceId"]),
  createAttraction
);
AttractionRouter.delete(
  "/:attractionId",
  checkAttractionAccess,
  deleteAttraction
);
AttractionRouter.patch(
  "/:attractionId/time",
  checkAttractionAccess,
  updateAttractionTime
);
AttractionRouter.patch(
  "/:attractionId/note",
  checkAttractionAccess,
  updateAttractionNote
);

export default AttractionRouter;
