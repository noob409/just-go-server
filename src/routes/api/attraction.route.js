import { Router } from "express";
import {
  getAttractions,
  createAttraction,
  deleteAttraction,
  updateAttractionOrder,
  updateAttractionTime,
  updateAttractionNote,
} from "../../controllers/api/attraction.controller.js";
import { checkDayAccess } from "../../middlewares/checkDaysAccess.js";
import { checkAttractionAccess } from "../../middlewares/checkAttractionAccess.js";
import {
  validateBody,
  validateParams,
} from "../../middlewares/validateFields.js";

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
  validateParams(["attractionId"]),
  checkAttractionAccess,
  deleteAttraction
);
AttractionRouter.patch(
  "/:attractionId/order",
  validateParams(["attractionId"]),
  checkAttractionAccess,
  updateAttractionOrder
);
AttractionRouter.patch(
  "/:attractionId/time",
  checkAttractionAccess,
  validateBody(["startAt", "endAt"]),
  updateAttractionTime
);
AttractionRouter.patch(
  "/:attractionId/note",
  checkAttractionAccess,
  validateBody(["note"]),
  updateAttractionNote
);

export default AttractionRouter;
