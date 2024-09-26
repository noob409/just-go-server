import { Router } from "express";
import { upload } from "../../config/multer.js";
import { validateFields } from "../../middlewares/validateFields.js";
import { addPlaceCollection, createTrip, deleteTrip, favorTrip, popularTrips, searchTripById, deletePlaceCollection } from "../../controllers/api/trip.controller.js";

const TripRouter = Router();

TripRouter.get("/", popularTrips);
TripRouter.post("/", validateFields(['userId', 'title', 'startTime', 'endTime']), upload.single('image'), createTrip);

TripRouter.get("/:id", validateFields(['id']), searchTripById);
TripRouter.post("/:id/favor", validateFields(['id']), favorTrip);
TripRouter.delete("/:id", validateFields(['id']), deleteTrip);

TripRouter.post("/collections", validateFields(['googlePlaceId']), addPlaceCollection);
TripRouter.delete("/collections", validateFields(['googlePlaceId']), deletePlaceCollection);

// // 獲取特定用戶的行程（共編）
// TripRouter.get("/users/:id/own", ownTrip);

// // 獲取特定用戶的收藏行程
// TripRouter.get("/users/:id/keep", keepTrip);

export default TripRouter;