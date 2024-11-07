import { Router } from "express";
import { getDetailPlace } from "../../controllers/api/place.controller.js";
import { validateBody } from "../../middlewares/validateFields.js";

const PlaceRouter = Router();

PlaceRouter.get("/", validateBody(['googlePlaceIdList']), getDetailPlace);

export default PlaceRouter;
