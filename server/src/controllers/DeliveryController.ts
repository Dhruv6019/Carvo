import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Order, OrderStatus } from "../entities/Order";

export class DeliveryController {
    static async getAssignments(req: Request, res: Response) {
        const userId = (req as any).user.userId;
        const orderRepository = AppDataSource.getRepository(Order);

        // Get orders assigned to this delivery agent
        const orders = await orderRepository.find({
            where: { deliveryAgentId: userId },
            relations: ["items", "items.part", "customer"]
        });

        return res.json(orders);
    }

    static async startDelivery(req: Request, res: Response) {
        const orderRepository = AppDataSource.getRepository(Order);
        const order = await orderRepository.findOne({ where: { id: parseInt(req.params.id) } });

        if (!order) return res.status(404).json({ message: "Order not found" });

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        order.status = OrderStatus.OUT_FOR_DELIVERY;
        order.deliveryOtp = otp;

        await orderRepository.save(order);

        // In a real app, you might send this OTP via SMS/Email to the customer here

        return res.json({ message: "Delivery started. OTP generated.", order });
    }

    static async verifyDeliveryOtp(req: Request, res: Response) {
        const orderRepository = AppDataSource.getRepository(Order);
        const { otp } = req.body;
        const order = await orderRepository.findOne({ where: { id: parseInt(req.params.id) } });

        if (!order) return res.status(404).json({ message: "Order not found" });

        if (order.deliveryOtp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        order.status = OrderStatus.DELIVERED;
        order.deliveryOtp = ""; // Clear OTP after successful delivery (optional, but good practice to invalidate)

        await orderRepository.save(order);
        return res.json({ message: "Delivery verified and completed", order });
    }
}
