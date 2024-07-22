import { Router } from "express";
import { ownTrip } from "../../controllers/api/trip.controller.js";

const TripRouter = Router();

TripRouter.get('/Own', ownTrip);

export default TripRouter;