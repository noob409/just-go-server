import { Router } from "express";
import { register, login } from "../../controllers/api/auth.controller.js";

const AuthRouter = Router();

AuthRouter.post("/login", login);
AuthRouter.post("/register", register);

export default AuthRouter;