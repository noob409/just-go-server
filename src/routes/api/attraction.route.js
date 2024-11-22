import { Router } from "express";
import {
  getAttractions,
  createAttraction,
  deleteAttraction,
  updateAttractionTime,
  updateAttractionNote,
} from "../../controllers/api/attraction.controller.js";

const AttractionRouter = Router({ mergeParams: true });

AttractionRouter.get("/", getAttractions);
AttractionRouter.post("/", createAttraction);
AttractionRouter.delete("/:attractionId", deleteAttraction);
AttractionRouter.patch("/:attractionId/time", updateAttractionTime);
AttractionRouter.patch("/:attractionId/note", updateAttractionNote);

export default AttractionRouter;
