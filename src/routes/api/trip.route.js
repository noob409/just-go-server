import { Router } from "express";
import { upload } from "../../config/multer.js";
import { validateBody, validateParams } from "../../middlewares/validateFields.js";
import {
    addPlaceCollection, createTrip, deleteTrip, favorTrip, popularTrips, searchTripById, deletePlaceCollection,
    placeToPlan, getCollection, getPlan, getDay, getAttraction, getTrip, createPlan
} from "../../controllers/api/trip.controller.js";
import { coEditTripPermission, deleteCoEditTripPermission } from "../../controllers/api/trip.share.controller.js";

const TripRouter = Router();

TripRouter.post("/collections", validateBody(['googlePlaceId']), addPlaceCollection);  // Test OK
TripRouter.delete("/collections", validateBody(['googlePlaceId']), deletePlaceCollection);  // Test OK
TripRouter.get("/collections", getCollection);  // Test OK

TripRouter.get("/", popularTrips);  // Test OK
TripRouter.post("/", upload.single('image'), validateBody(['name', 'startTime', 'endTime']), createTrip);  // Test OK (照片上傳未測試)

TripRouter.get("/:id", validateParams(['id']), searchTripById);  // Test OK
TripRouter.delete("/:id", validateParams(['id']), deleteTrip);  // Test OK
TripRouter.post("/:id/favor", validateParams(['id']), favorTrip);  // Test OK
TripRouter.get("/:id/details", validateParams(['id']), getTrip);  // Test OK
TripRouter.post("/:id/share", validateParams(['id']), validateBody(['linkPermission']), coEditTripPermission);
TripRouter.delete("/:id/share", validateParams(['id']), validateBody(['deleteUserId']), deleteCoEditTripPermission);

TripRouter.post("/:id/plan/addplace", validateBody(['collectionId', 'planId', 'dayId', 'startAt', 'endAt', 'note']), validateParams(['id']), placeToPlan);  // 目前測試OK，但如果同一天有好多個景點時間相同，則順序會錯亂
TripRouter.post("/:id/plan", validateParams(['id']), validateBody(['name', 'startAt', 'endAt']), createPlan);  // Test OK

// TripRouter.get("/:id/plan", validateParams(['id']), getPlan);  // Test OK
// TripRouter.get("/:id/plan/days", validateBody(['planId']), getDay);  // Test OK
// TripRouter.get("/:id/plan/days/specificday", validateBody(['dayId']), getAttraction);  // Test OK，但就如placeToPlan所說，景點時間問題希望由前端判斷

export default TripRouter;