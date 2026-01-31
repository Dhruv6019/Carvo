import { Router } from "express";
import { DeliveryController } from "../controllers/DeliveryController";
import { authenticate, authorize } from "../middlewares/auth";
import { UserRole } from "../entities/User";

const router = Router();

router.use(authenticate);
router.use(authorize([UserRole.DELIVERY_BOY]));

router.get("/assignments", DeliveryController.getAssignments);
router.post("/:id/start", DeliveryController.startDelivery);
router.post("/:id/verify", DeliveryController.verifyDeliveryOtp);

export default router;
