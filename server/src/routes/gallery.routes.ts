import { Router } from "express";
import { GalleryController } from "../controllers/GalleryController";
import { authenticate, authorize } from "../middlewares/auth";
import { UserRole } from "../entities/User";

const router = Router();

// Public
router.get("/", GalleryController.getAll);

// Admin Only
router.post("/", authenticate, authorize([UserRole.ADMIN]), GalleryController.create);
router.put("/:id", authenticate, authorize([UserRole.ADMIN]), GalleryController.update);
router.delete("/:id", authenticate, authorize([UserRole.ADMIN]), GalleryController.delete);
router.post("/seed", authenticate, authorize([UserRole.ADMIN]), GalleryController.seedDefaults);

export default router;
