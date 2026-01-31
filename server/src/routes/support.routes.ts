import { Router } from "express";
import { SupportController } from "../controllers/SupportController";
import { authenticate, authorize } from "../middlewares/auth";
import { UserRole } from "../entities/User";

const router = Router();

router.use(authenticate);

// Customers can create complaints
router.post("/complaints", authorize([UserRole.CUSTOMER]), SupportController.createComplaint);

// Customers, Agents, Admin can view
router.get("/complaints", authorize([UserRole.CUSTOMER, UserRole.SUPPORT_AGENT, UserRole.ADMIN]), SupportController.getComplaints);

// Agents and Admin can update status
router.patch("/complaints/:id/status", authorize([UserRole.SUPPORT_AGENT, UserRole.ADMIN]), SupportController.updateComplaintStatus);

export default router;
