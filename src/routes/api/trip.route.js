import { Router } from "express";
import { keepTrip, ownTrip, popularTrips } from "../../controllers/api/trip.controller.js";

const TripRouter = Router();

TripRouter.get("/", popularTrips);
TripRouter.get("/:id/own", ownTrip);
TripRouter.get("/:id/keep", keepTrip);

export default TripRouter;