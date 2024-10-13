// src/routes/api/user.routes.js

import { Router } from "express";
import { upload } from "../../config/multer.js";
import { profileChange, userInfo } from "../../controllers/api/user.controller.js";
import { coTrip, keepTrip, ownTrip } from "../../controllers/api/user.trip.controller.js";
import { validateBody } from "../../middlewares/validateFields.js";

const UserRouter = Router();

UserRouter.put("/:id", upload.single('avatar'), validateBody(['name']), profileChange);
UserRouter.get("/:id", userInfo);

UserRouter.get("/:id/trips/own", ownTrip);
UserRouter.get("/:id/trips/coedit", coTrip);
UserRouter.get("/:id/trips/keep", keepTrip);

export default UserRouter;