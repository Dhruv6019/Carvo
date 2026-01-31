import { Router } from "express";
import { PaymentController } from "../controllers/PaymentController";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get("/upi-config", PaymentController.getUpiConfig);
router.post("/create", authenticate, PaymentController.createPayment);
router.post("/confirm", authenticate, PaymentController.confirmPayment);
router.post("/verify/:id", authenticate, PaymentController.verifyPayment); // TODO: Add admin middleware
router.post("/webhook", PaymentController.webhook); // Webhooks usually don't use user auth, but signature verification

export default router;
