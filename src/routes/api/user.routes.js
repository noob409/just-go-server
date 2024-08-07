// src/routes/api/user.routes.js

import { Router } from "express";
import { upload } from "../../config/multer.js";
import { profileChange, userInfo } from "../../controllers/api/user.controller.js";

const UserRouter = Router();

UserRouter.put('/:id', upload.single('avatar'), profileChange);
UserRouter.get('/:id', userInfo);

export default UserRouter;