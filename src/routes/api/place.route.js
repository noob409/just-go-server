import { Router } from "express";
import {
  getDetailPlace,
  getDetailPlaceById,
} from "../../controllers/api/place.controller.js";
import { validateParams } from "../../middlewares/validateFields.js";

const PlaceRouter = Router();

PlaceRouter.post("/", validateBody(["googlePlaceIdList"]), getDetailPlace);
PlaceRouter.get("/:id", validateParams(["id"]), getDetailPlaceById);

export default PlaceRouter;
