// src/routes/api/user.routes.js

import { Router } from "express";
import { upload } from "../../config/multer.js";
import { profileChange, userInfo } from "../../controllers/api/user.controller.js";
import { keepTrip, ownTrip } from "../../controllers/api/user.trip.controller.js";
import { validateFields } from "../../middlewares/validateFields.js";

const UserRouter = Router();

UserRouter.put("/:id", validateFields(['name']), upload.single('avatar'), profileChange);
UserRouter.get("/:id", userInfo);

UserRouter.get("/:id/trip/own", ownTrip);
UserRouter.get("/:id/trip/keep", keepTrip);

export default UserRouter;