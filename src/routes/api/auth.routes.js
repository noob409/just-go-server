import { Router } from "express";
import { register, login, verifyEmail, googleLogin } from "../../controllers/api/auth.controller.js";
import { validateRegister, validateLogin, validateGoogleLogin } from "../../middlewares/validate.js";

const AuthRouter = Router();

AuthRouter.post("/register", validateRegister, register);
AuthRouter.post("/login", validateLogin, login);
AuthRouter.post("/google", validateGoogleLogin, googleLogin);
AuthRouter.get("/verify/:token", verifyEmail);

export default AuthRouter;
