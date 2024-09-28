import { Router } from "express";
import { upload } from "../../config/multer.js";
import { validateBody, validateParams } from "../../middlewares/validateFields.js";
import { addPlaceCollection, createTrip, deleteTrip, favorTrip, popularTrips, searchTripById, deletePlaceCollection, placeToPlan, getCollection, getPlan, getDay, getAttraction, getTrip } from "../../controllers/api/trip.controller.js";

const TripRouter = Router();

TripRouter.post("/collections", validateBody(['googlePlaceId']), addPlaceCollection);  // Test OK
TripRouter.delete("/collections", validateBody(['googlePlaceId']), deletePlaceCollection);  // Test OK
TripRouter.get("/collections", getCollection);  // Test OK

TripRouter.get("/", popularTrips);  // Test OK
TripRouter.post("/", validateBody(['title', 'startTime', 'endTime']), upload.single('image'), createTrip);  // Test OK (照片上傳未測試)

TripRouter.get("/:id", validateParams(['id']), searchTripById);  // Test OK
TripRouter.post("/:id/favor", validateParams(['id']), favorTrip);   // Test OK

// 刪除行程，意味著，所有與之相關的方案都要被刪除（need to delete tripLike, tripShare, plan, day, and attraction待修改） Test Failed
// TripRouter.delete("/:id", validateParams(['id']), deleteTrip);

TripRouter.get("/:id/getspecifictripinfo", validateParams(['id']), getTrip);  // 目前看起來測試OK

TripRouter.post("/:id/plan/addPlace", validateBody(['collectionId', 'planId', 'dayId', 'startAt', 'endAt', 'note']), placeToPlan);  // 目前測試OK，但如果同一天有好多個景點時間相同，則順序會錯亂
TripRouter.get("/:id/plan", validateParams(['id']), getPlan);  // Test OK
TripRouter.get("/:id/plan/days", validateBody(['planId']), getDay);  // Test OK
TripRouter.get("/:id/plan/days/specificday", validateBody(['dayId']), getAttraction);  // Test OK，但就如placeToPlan所說，景點時間問題希望由前端判斷

export default TripRouter;