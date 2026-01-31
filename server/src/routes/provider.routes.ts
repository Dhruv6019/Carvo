import { Router } from "express";
import { ServiceProviderController } from "../controllers/ServiceProviderController";
import { authenticate, authorize } from "../middlewares/auth";
import { UserRole } from "../entities/User";

const router = Router();

router.use(authenticate);
router.use(authorize([UserRole.SERVICE_PROVIDER]));

router.get("/bookings", ServiceProviderController.getBookings);
router.patch("/bookings/:id/status", ServiceProviderController.updateBookingStatus);

export default router;
