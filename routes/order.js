import express from "express";
import * as orderController from "../controllers/order.js";
import { auth, authAdmin } from "../middlewares/auth.js";


const router = express.Router();

router.post("/", auth, orderController.addOrder);
router.get("/allOrders",authAdmin,orderController.getAllOrders);
router.get("/",auth,orderController.getAllOrdersFromCurrentUser);
router.put("/:id",authAdmin,orderController.updateOrder);
router.delete("/:id",auth,orderController.deleteOrder);
export default router;

