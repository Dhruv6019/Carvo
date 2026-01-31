import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Quotation, QuotationStatus } from "../entities/Quotation";
import { Customization } from "../entities/Customization";
import { User } from "../entities/User";
import NotificationService from "../services/NotificationService";

export class QuotationController {
    static async createQuotation(req: Request, res: Response) {
        const userId = (req as any).user.userId;
        const { customizationId } = req.body;

        const quotationRepository = AppDataSource.getRepository(Quotation);
        const customizationRepository = AppDataSource.getRepository(Customization);

        // Verify customization belongs to user
        const customization = await customizationRepository.findOne({
            where: { id: customizationId, customerId: userId }
        });

        if (!customization) {
            return res.status(404).json({ message: "Customization not found" });
        }

        // Check if quotation already exists
        const existingQuotation = await quotationRepository.findOne({
            where: { customizationId: customizationId }
        });

        if (existingQuotation) {
            return res.status(400).json({ message: "Quotation already requested for this customization" });
        }

        const quotation = new Quotation();
        quotation.customerId = userId;
        quotation.customizationId = customizationId;
        quotation.status = QuotationStatus.PENDING;

        await quotationRepository.save(quotation);

        // 📧 Send Email: Quotation Requested
        const user = await AppDataSource.getRepository(User).findOne({ where: { id: userId } });
        if (user) {
            // Fetch customization name for the email
            const cust = await customizationRepository.findOne({ where: { id: customizationId } });
            const custName = cust ? cust.name : `Customization #${customizationId}`;
            await NotificationService.sendQuotationRequestedEmail(user.email, user.name, custName);
        }

        return res.status(201).json(quotation);
    }
    static async getMyQuotations(req: Request, res: Response) {
        const userId = (req as any).user.userId;
        const quotationRepository = AppDataSource.getRepository(Quotation);

        const quotations = await quotationRepository.find({
            where: { customerId: userId },
            relations: ["customization", "customization.car"],
            order: { created_at: "DESC" }
        });

        return res.json(quotations);
    }
}
