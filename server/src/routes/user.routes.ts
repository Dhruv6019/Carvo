import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.use(authenticate);

router.get("/profile", UserController.getProfile);
router.put("/profile", UserController.updateProfile);
router.put("/change-password", UserController.changePassword);

export default router;
