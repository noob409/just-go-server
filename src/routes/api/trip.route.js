import { Router } from "express";
import { upload } from "../../config/multer.js";
import { validateBody, validateParams } from "../../middlewares/validateFields.js";
import { addPlaceCollection, createTrip, deleteTrip, favorTrip, popularTrips, searchTripById, deletePlaceCollection, placeToPlan, getCollection, getPlan, getDay, getAttraction } from "../../controllers/api/trip.controller.js";

const TripRouter = Router();

TripRouter.post("/collections", validateBody(['googlePlaceId']), addPlaceCollection);  // Test OK
TripRouter.delete("/collections", validateBody(['googlePlaceId']), deletePlaceCollection);  // Test OK
TripRouter.get("/collections", getCollection);  // Test Ok

TripRouter.post("/:id/plan/addPlace", validateBody(['collectionId', 'planId', 'dayId', 'startAt', 'endAt', 'note']), placeToPlan);

TripRouter.get("/", popularTrips);  // Test OK
TripRouter.post("/", validateBody(['title', 'startTime', 'endTime']), upload.single('image'), createTrip);  // Test OK (照片上傳未測試)

TripRouter.get("/:id", validateParams(['id']), searchTripById);  // Test OK
TripRouter.post("/:id/favor", validateParams(['id']), favorTrip);   // Test OK
// TripRouter.delete("/:id", validateParams(['id']), deleteTrip);  // 刪除行程，意味著，所有與之相關的方案都要被刪除（待修改） Test Failed

TripRouter.post("/:id/plan/addPlace", validateBody(['collectionId', 'planId', 'dayId', 'startAt', 'endAt', 'note']), placeToPlan);
TripRouter.get("/:id/plan", validateParams(['id']), getPlan);
TripRouter.get("/:id/plan/days", validateBody(['planId']), getDay);
TripRouter.get("/:id/plan/day/specificday", validateBody(['dayId']), getAttraction);

export default TripRouter;