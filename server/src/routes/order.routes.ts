import { Router } from "express";
import { OrderController } from "../controllers/OrderController";
import { authenticate, authorize } from "../middlewares/auth";
import { UserRole } from "../entities/User";

const router = Router();

router.use(authenticate);

router.get("/my-orders", OrderController.getMyOrders);
router.post("/", authorize([UserRole.CUSTOMER]), OrderController.createOrder);
router.get("/:id", OrderController.getOrderById);

router.post("/:id/cancel", authorize([UserRole.CUSTOMER]), OrderController.cancelOrder);

export default router;
