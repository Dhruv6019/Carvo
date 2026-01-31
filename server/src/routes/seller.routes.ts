import { Router } from "express";
import { SellerController } from "../controllers/SellerController";
import { authenticate, authorize } from "../middlewares/auth";
import { UserRole } from "../entities/User";

const router = Router();

// Middleware: All routes require authentication and "seller" role
// Note: Some platforms allow Admin to act as seller too, but here we strict to Seller.
router.use(authenticate);
router.use(authorize([UserRole.SELLER, UserRole.ADMIN])); // Admins can manage inventory too? Usually yes, adding admin for flexibility.

// Parts Inventory
router.get("/parts", SellerController.getInventory);
router.post("/parts", SellerController.createPart);
router.put("/parts/:id", SellerController.updatePart);
router.delete("/parts/:id", SellerController.deletePart);

// Categories Management
router.get("/categories", SellerController.getCategories);
router.post("/categories", SellerController.createCategory);
router.put("/categories/:id", SellerController.updateCategory);
router.delete("/categories/:id", SellerController.deleteCategory);

// Orders & Delivery
router.get("/orders", SellerController.getOrders);
router.get("/delivery-agents", SellerController.getDeliveryAgents);
router.post("/orders/assign", SellerController.assignOrder);

export default router;
