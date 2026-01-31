import { Router } from "express";
import { CustomerController } from "../controllers/CustomerController";
import { QuotationController } from "../controllers/QuotationController";
import { authenticate, authorize } from "../middlewares/auth";
import { UserRole } from "../entities/User";

const router = Router();

// Public Routes
router.get("/cars", CustomerController.getCars);
router.get("/parts", CustomerController.getCarParts);
router.get("/parts/:id", CustomerController.getPartById);
router.get("/cars/:id/parts", CustomerController.getCarParts);

// Protected Routes
router.use(authenticate);
// Allow customers and admins to access these
router.use(authorize([UserRole.CUSTOMER, UserRole.ADMIN]));
router.post("/customizations", CustomerController.createCustomization);
router.post("/quotations", QuotationController.createQuotation);
router.get("/quotations", QuotationController.getMyQuotations);
router.get("/bookings", CustomerController.getMyBookings);
router.post("/bookings", CustomerController.createBooking);

export default router;
