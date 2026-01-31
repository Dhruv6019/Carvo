import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Complaint, ComplaintStatus } from "../entities/Complaint";

export class SupportController {
    static async createComplaint(req: Request, res: Response) {
        const userId = (req as any).user.userId;
        const complaintRepository = AppDataSource.getRepository(Complaint);

        const complaint = complaintRepository.create({ ...req.body, customerId: userId });
        await complaintRepository.save(complaint);
        return res.status(201).json(complaint);
    }

    static async getComplaints(req: Request, res: Response) {
        // Agents see all, customers see theirs
        const userId = (req as any).user.userId;
        const role = (req as any).user.role;
        const complaintRepository = AppDataSource.getRepository(Complaint);

        if (role === "support_agent" || role === "admin") {
            const complaints = await complaintRepository.find();
            return res.json(complaints);
        } else {
            const complaints = await complaintRepository.find({ where: { customerId: userId } });
            return res.json(complaints);
        }
    }

    static async updateComplaintStatus(req: Request, res: Response) {
        const complaintRepository = AppDataSource.getRepository(Complaint);
        let complaint = await complaintRepository.findOne({ where: { id: parseInt(req.params.id) } });

        if (!complaint) return res.status(404).json({ message: "Complaint not found" });

        const { status } = req.body;
        if (Object.values(ComplaintStatus).includes(status)) {
            complaint.status = status;
            // Assign agent if not assigned
            if (!complaint.agentId) {
                complaint.agentId = (req as any).user.userId;
            }
            await complaintRepository.save(complaint);
            return res.json(complaint);
        } else {
            return res.status(400).json({ message: "Invalid status" });
        }
    }
}
