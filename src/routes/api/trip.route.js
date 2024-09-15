import { Router } from "express";
import { addPlaceCollection, createTrip, deleteTrip, favorTrip, keepTrip, ownTrip, popularTrips, searchTripById } from "../../controllers/api/trip.controller.js";

const TripRouter = Router();

TripRouter.get("/", popularTrips);
TripRouter.get("/:id", searchTripById);
TripRouter.get("/:id/own", ownTrip);
TripRouter.get("/:id/keep", keepTrip);
TripRouter.post("/:id/favor", favorTrip);
TripRouter.delete("/:id", deleteTrip);

TripRouter.post("/create", createTrip);
TripRouter.post("/collections", addPlaceCollection);

export default TripRouter;