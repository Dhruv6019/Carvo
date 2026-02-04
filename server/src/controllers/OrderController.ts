import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Order, OrderStatus } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { Part } from "../entities/Part";
import NotificationService from "../services/NotificationService";
import { NotificationType } from "../entities/Notification";
import { InvoiceService } from "../services/InvoiceService";

export class OrderController {
    static async createOrder(req: Request, res: Response) {
        try {
            const user = (req as any).user;
            const userId = user.userId;
            const userEmail = user.email;

            const { items, shipping_address, coupon_code, discount_amount, final_amount } = req.body;

            const orderRepository = AppDataSource.getRepository(Order);
            const orderItemRepository = AppDataSource.getRepository(OrderItem);
            const partRepository = AppDataSource.getRepository(Part);

            let totalAmount = 0;
            const orderItems: OrderItem[] = [];
            const sellerIds = new Set<number>(); // Track unique sellers

            for (const item of items) {
                const part = await partRepository.findOne({ where: { id: item.partId } });
                if (!part) return res.status(404).json({ message: `Part ${item.partId} not found` });
                if (part.stock_quantity < item.quantity) return res.status(400).json({ message: `Insufficient stock for ${part.name}` });

                const orderItem = new OrderItem();
                orderItem.part = part;
                orderItem.quantity = item.quantity;
                orderItem.price = part.price;
                orderItems.push(orderItem);

                totalAmount += Number(part.price) * item.quantity;

                // Track seller for notification
                if (part.sellerId) {
                    sellerIds.add(part.sellerId);
                }

                // Decrement stock
                part.stock_quantity -= item.quantity;
                await partRepository.save(part);
            }

            const order = new Order();
            order.customerId = userId;
            order.total_amount = totalAmount;
            order.coupon_code = coupon_code || null;
            order.discount_amount = discount_amount || 0;
            order.final_amount = final_amount || totalAmount;
            order.shipping_address = shipping_address;
            order.status = OrderStatus.PENDING;

            await orderRepository.save(order);

            for (const orderItem of orderItems) {
                orderItem.order = order;
                await orderItemRepository.save(orderItem);
            }

            // ✅ Send instant notification to customer - Order Confirmation
            await NotificationService.createNotification(
                userId,
                NotificationType.ORDER_UPDATE,
                "Order Placed Successfully",
                `Your order #${order.id} has been placed successfully. Total: $${order.final_amount.toFixed(2)}`,
                order.id
            );

            // 📧 Send Email: Order Confirmation matches Invoice Details
            await NotificationService.sendOrderConfirmationEmail(userEmail, order.id, order.final_amount);

            // 🧾 Create Invoice & Send Email
            try {
                const invoice = await InvoiceService.generateInvoiceForOrder(order.id);
                invoice.status = 'paid' as any; // Since we just took payment/confirmation, mark as paid for the email
                await NotificationService.sendInvoiceEmail(userEmail, invoice);
            } catch (invError) {
                console.error("Error generating/sending invoice:", invError);
                // Don't fail the order if invoice fails
            }

            // ✅ Send payment confirmation to customer
            await NotificationService.createNotification(
                userId,
                NotificationType.PAYMENT_CONFIRMED,
                "Payment Received",
                `We've received your payment of $${order.final_amount.toFixed(2)} for order #${order.id}. Processing will begin shortly.`,
                order.id
            );

            // 📧 Send Email: Payment Confirmation
            await NotificationService.sendPaymentConfirmationEmail(userEmail, order.id, order.final_amount);

            // ✅ Notify all sellers involved in this order
            for (const sellerId of sellerIds) {
                await NotificationService.createNotification(
                    sellerId,
                    NotificationType.ORDER_UPDATE,
                    "New Order Received",
                    `You have a new order #${order.id}. Check your dashboard for details.`,
                    order.id
                );
            }

            // ✅ Notify Admins
            await NotificationService.notifyAllAdmins(
                NotificationType.ORDER_UPDATE,
                "New Order Placed",
                `New Order #${order.id} placed by ${userEmail}. Total: $${order.final_amount}`,
                order.id
            );

            console.log(`🛒 Order ${order.id} created for user ${userId}, notifications sent to customer and ${sellerIds.size} seller(s)`);

            return res.status(201).json(order);
        } catch (error) {
            console.error("Create Order Error:", error);
            return res.status(500).json({ message: "Failed to create order" });
        }
    }

    static async getOrderById(req: Request, res: Response) {
        const orderRepository = AppDataSource.getRepository(Order);
        const order = await orderRepository.findOne({
            where: { id: parseInt(req.params.id) },
            relations: ["items", "items.part"]
        });

        if (!order) return res.status(404).json({ message: "Order not found" });

        // Check authorization (admin, seller, or owner)
        const userId = (req as any).user.userId;
        const role = (req as any).user.role;

        if (role !== "admin" && role !== "seller" && order.customerId !== userId) {
            return res.status(403).json({ message: "Forbidden" });
        }

        return res.json(order);
    }

    static async getMyOrders(req: Request, res: Response) {
        const userId = (req as any).user.userId;
        const orderRepository = AppDataSource.getRepository(Order);

        const orders = await orderRepository.find({
            where: { customerId: userId },
            relations: ["items", "items.part"],
            order: { created_at: "DESC" }
        });

        return res.json(orders);
    }
    static async cancelOrder(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = (req as any).user.userId;
            const orderRepository = AppDataSource.getRepository(Order);
            const partRepository = AppDataSource.getRepository(Part);

            const order = await orderRepository.findOne({
                where: { id: parseInt(id) },
                relations: ["items", "items.part"]
            });

            if (!order) return res.status(404).json({ message: "Order not found" });

            // Authorization: User must be owner
            if (order.customerId !== userId) {
                return res.status(403).json({ message: "You are not authorized to cancel this order" });
            }

            // Status Check: Can only cancel 'pending' orders
            if (order.status !== 'pending') {
                return res.status(400).json({ message: "Only pending orders can be cancelled" });
            }

            // Restore Stock
            if (order.items) {
                for (const item of order.items) {
                    if (item.part) {
                        item.part.stock_quantity += item.quantity;
                        await partRepository.save(item.part);
                    }
                }
            }

            order.status = OrderStatus.CANCELLED; // Using 'cancelled' string if enum issues, or OrderStatus.CANCELLED
            // For safety based on previous enum usage in this file:
            order.status = 'cancelled' as any;

            await orderRepository.save(order);

            return res.status(200).json({ message: "Order cancelled successfully", order });

        } catch (error) {
            console.error("Cancel Order Error:", error);
            return res.status(500).json({ message: "Failed to cancel order" });
        }
    }
}
