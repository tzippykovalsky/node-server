import express from "express";
import { getAdminEmail, sendEmail } from "../controllers/email.js";


const router = express.Router();

router.post("/",sendEmail);
router.get("/",getAdminEmail);


export default router;



