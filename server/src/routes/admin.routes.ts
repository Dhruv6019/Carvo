import { Router } from "express";
import { AdminController } from "../controllers/AdminController";
import { authenticate, authorize } from "../middlewares/auth";
import { UserRole } from "../entities/User";

const router = Router();

router.use(authenticate);
router.use(authorize([UserRole.ADMIN]));

router.get("/users", AdminController.getAllUsers);
router.get("/users/:id", AdminController.getUserById);
router.post("/users", AdminController.createUser);
router.put("/users/:id", AdminController.updateUser);
router.delete("/users/:id", AdminController.deleteUser);

router.post("/cars", AdminController.createCar);
router.put("/cars/:id", AdminController.updateCar);
router.delete("/cars/:id", AdminController.deleteCar);

router.post("/categories", AdminController.createCategory);

router.get("/analytics", AdminController.getAnalytics);
router.get("/analytics/revenue", AdminController.getRevenueTrend);
// System Settings
router.get("/settings", AdminController.getSystemSettings);
router.put("/settings/:key", AdminController.updateSystemSetting);

router.get("/orders", AdminController.getAllOrders);

export default router;
