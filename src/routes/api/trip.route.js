import { Router } from "express";
import { addPlaceCollection, createTrip, deleteTrip, favorTrip, keepTrip, ownTrip, popularTrips, searchTripById } from "../../controllers/api/trip.controller.js";

const TripRouter = Router();

TripRouter.get("/", popularTrips);
TripRouter.get("/:id", searchTripById);
TripRouter.post("/:id/favor", favorTrip);
TripRouter.delete("/:id", deleteTrip);

TripRouter.post("/create", createTrip);
TripRouter.post("/collections", addPlaceCollection);
TripRouter.patch("/collections", addPlaceCollection);

// 獲取特定用戶的行程（共編）
TripRouter.get("/users/:id/own", ownTrip);

// 獲取特定用戶的收藏行程
TripRouter.get("/users/:id/keep", keepTrip);

export default TripRouter;