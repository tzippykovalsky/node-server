import express from "express";
import * as userController from "../controllers/user.js";
import { authAdmin } from "../middlewares/auth.js";

const router = express.Router();


router.get("/", authAdmin, userController.getAllUsers);
router.get("/:id", authAdmin, userController.getUserById);
router.post("/signup", userController.signUp);
router.post("/signInGoogle", userController.signInGoogle);
router.post("/", userController.signIn);
router.post("/sendMail",userController.sendEmail);

export default router;



