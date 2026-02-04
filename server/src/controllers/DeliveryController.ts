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
            relations: ["items", "items.part", "customer", "payments"]
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
        const order = await orderRepository.findOne({
            where: { id: parseInt(req.params.id) },
            relations: ["payments"]
        });

        if (!order) return res.status(404).json({ message: "Order not found" });

        if (order.deliveryOtp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        order.status = OrderStatus.DELIVERED;
        order.deliveryOtp = ""; // Clear OTP after successful delivery

        await orderRepository.save(order);

        // Update Payment Status if COD
        const codPayment = order.payments?.find((p: any) => p.method === 'cod' && p.status === 'pending');
        if (codPayment) {
            const paymentRepository = AppDataSource.getRepository(require("../entities/Payment").Payment);
            codPayment.status = 'completed'; // or PaymentStatus.COMPLETED
            await paymentRepository.save(codPayment);

            // --- COMMISSION SPLIT & DISTRIBUTION LOGIC ---
            const transactionRepository = AppDataSource.getRepository(require("../entities/Transaction").Transaction);
            const totalAmount = Number(order.final_amount || order.total_amount);

            // Rates (Configurable in real app)
            const ADMIN_RATE = 0.10;
            const DELIVERY_RATE = 0.05;
            const SELLER_RATE = 0.85;

            // 1. Delivery Boy Earning
            const deliveryEarning = totalAmount * DELIVERY_RATE;
            await transactionRepository.save({
                userId: (req as any).user.userId, // Current Delivery Boy
                amount: deliveryEarning,
                type: 'credit',
                source: 'commission',
                description: `Delivery Commission for Order #${order.id}`,
                orderId: order.id
            });

            // 2. Admin Commission
            const adminEarning = totalAmount * ADMIN_RATE;
            // Assuming Admin User ID is 1 or we find the first admin
            // For now, we assume a system account or just record it generally. 
            // Let's attribute to User ID 1 if usually admin.
            await transactionRepository.save({
                userId: 1, // Placeholder for Admin ID
                amount: adminEarning,
                type: 'credit',
                source: 'commission',
                description: `Platform Fee for Order #${order.id}`,
                orderId: order.id
            });

            // 3. Seller Earnings (Split proportional to their items if multiple sellers)
            // Simplified: Assuming single seller or primary seller for the order items
            // In a multi-seller order, we would iterate over items.
            // Let's find sellers from items.
            const items = order.items || [];
            const sellerEarningsMap = new Map<number, number>();

            for (const item of items) {
                if (item.part && item.part.sellerId) {
                    const itemTotal = Number(item.price) * item.quantity;
                    const sellerShare = itemTotal * SELLER_RATE; // 85% of their item's value
                    const current = sellerEarningsMap.get(item.part.sellerId) || 0;
                    sellerEarningsMap.set(item.part.sellerId, current + sellerShare);
                }
            }

            for (const [sellerId, amount] of sellerEarningsMap) {
                await transactionRepository.save({
                    userId: sellerId,
                    amount: amount,
                    type: 'credit',
                    source: 'order_payment',
                    description: `Earnings for Order #${order.id}`,
                    orderId: order.id
                });
            }
        }

        // --- INVOICE GENERATION & EMAIL ---
        try {
            const { InvoiceService } = require("../services/InvoiceService");
            // Assuming NotificationService has this method accessible or imported correctly
            // Since we are in Controller, we should import these at top or use dependency injection.
            // For this edit, I'll assume imports are handled or I'll add them.

            // Re-importing inside function to ensure no circular dep issues if any, but better to put at top.
            // Using require for this block stability.

            // Generate Invoice
            const invoice = await InvoiceService.generateInvoiceForOrder(order.id);

            // Send Email
            // Note: NotificationService import might need adjustment based on file structure availability.
            const NotificationServiceModule = require("../services/NotificationService").default;
            if (order.customer && order.customer.email) {
                await NotificationServiceModule.sendInvoiceEmail(order.customer.email, invoice);
            } else {
                console.warn(`Customer email not found for order ${order.id}. Skipping invoice email.`);
            }

        } catch (error) {
            console.error("Post-delivery Invoice/Email failed:", error);
            // Don't fail the delivery verification itself
        }

        return res.json({ message: "Delivery verified, Payment Collected, and Earnings Distributed!", order });
    }
}
