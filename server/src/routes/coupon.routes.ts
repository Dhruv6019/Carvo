import { Router } from "express";
import { CouponController } from "../controllers/CouponController";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.post("/validate", authenticate, CouponController.validateCoupon);
router.get("/active", CouponController.getActiveCoupons);

// Admin Routes
router.post("/", authenticate, CouponController.createCoupon);
router.get("/", authenticate, CouponController.getAllCoupons);
router.put("/:id", authenticate, CouponController.updateCoupon);
router.delete("/:id", authenticate, CouponController.deleteCoupon);

export default router;
