import { Router } from "express";
import productRouter from "./product.js";
import userRouter from "./user.js";
import orderRouter from "./order.js";
import emailRouter from "./email.js";

const router = Router();

router.use("/email", emailRouter);
router.use("/products", productRouter);
router.use("/users", userRouter);
router.use("/orders", orderRouter)

export default router;