import { Router } from "express";
import { InvoiceController } from "../controllers/InvoiceController";
import { authenticate } from "../middlewares/auth"; // Assuming auth middleware exists

const router = Router();

// Generate Invoice for an Order (Admin or System trigger)
router.post("/:orderId/generate", authenticate, InvoiceController.generateInvoice);

// Get Invoice by ID or Order ID
router.get("/:id", authenticate, InvoiceController.getInvoice);

export default router;
