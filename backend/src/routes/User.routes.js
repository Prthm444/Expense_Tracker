import { Router } from "express";
import { checkLogin, loginUser, logoutUser, registerUser } from "../controllers/User.controllers.js";
import { verifyJWT } from "../middlewares/Auth.middlewares.js";



const router = Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/verifyUser").get(verifyJWT, checkLogin);

router.route("/logout").post(verifyJWT, logoutUser);

export default router;
