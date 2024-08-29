import { Router } from "express";
import { register, login, verifyEmail } from "../../controllers/api/auth.controller.js";
import { validateRegister, validateVerifyEmail } from "../../middlewares/validate.js";

const AuthRouter = Router();

AuthRouter.post("/register", validateRegister, register);
AuthRouter.post("/login", login);
AuthRouter.get("/verify", validateVerifyEmail, verifyEmail);

export default AuthRouter;
