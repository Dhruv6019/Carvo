import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Payment, PaymentStatus } from "../entities/Payment";
import { Order, OrderStatus } from "../entities/Order";

export class PaymentController {
    // Get UPI configuration
    static async getUpiConfig(req: Request, res: Response) {
        try {
            const upiId = process.env.UPI_ID || "merchant@paytm";
            const merchantName = process.env.UPI_MERCHANT_NAME || "Carvo Auto Parts";

            return res.json({
                upiId,
                merchantName
            });
        } catch (error) {
            console.error("Get UPI Config Error:", error);
            return res.status(500).json({ message: "Failed to get UPI configuration" });
        }
    }

    // Generate UPI payment string
    static generateUpiString(upiId: string, name: string, amount: number, orderId: number): string {
        const params = new URLSearchParams({
            pa: upiId,
            pn: name,
            am: amount.toString(),
            cu: "INR",
            tn: `Order #${orderId} - Carvo Auto Parts`
        });
        return `upi://pay?${params.toString()}`;
    }

    static async createPayment(req: Request, res: Response) {
        try {
            const { orderId, amount, method } = req.body;

            const payment = new Payment();
            payment.orderId = orderId;
            payment.amount = amount;
            payment.method = method;

            if (method === "upi") {
                // UPI Payment - awaiting user confirmation
                payment.status = PaymentStatus.AWAITING_CONFIRMATION;
                payment.transaction_id = `upi-${Date.now()}-${orderId}`;

                await AppDataSource.getRepository(Payment).save(payment);

                // Generate UPI payment string
                const upiId = process.env.UPI_ID || "merchant@paytm";
                const merchantName = process.env.UPI_MERCHANT_NAME || "Carvo Auto Parts";
                const upiString = PaymentController.generateUpiString(upiId, merchantName, amount, orderId);

                return res.status(201).json({
                    payment,
                    upiDetails: {
                        upiId,
                        merchantName,
                        amount,
                        orderId,
                        upiString
                    }
                });
            } else if (method === "cod") {
                // Cash on Delivery - mark as pending
                payment.status = PaymentStatus.PENDING;
                payment.transaction_id = `cod-${Date.now()}-${orderId}`;

                await AppDataSource.getRepository(Payment).save(payment);

                // Update order status to processing for COD
                const orderRepository = AppDataSource.getRepository(Order);
                const order = await orderRepository.findOne({ where: { id: orderId } });
                if (order) {
                    order.status = OrderStatus.PROCESSING;
                    await orderRepository.save(order);
                }

                return res.status(201).json({
                    payment,
                    message: "Order placed successfully with Cash on Delivery"
                });
            } else {
                return res.status(400).json({ message: "Invalid payment method" });
            }
        } catch (error) {
            console.error("Create Payment Error:", error);
            return res.status(500).json({ message: "Failed to create payment" });
        }
    }

    // User confirms they have completed UPI payment
    static async confirmPayment(req: Request, res: Response) {
        try {
            const { paymentId, transactionReference, upiTransactionId } = req.body;

            const paymentRepository = AppDataSource.getRepository(Payment);
            const payment = await paymentRepository.findOne({ where: { id: paymentId } });

            if (!payment) {
                return res.status(404).json({ message: "Payment not found" });
            }

            if (payment.status !== PaymentStatus.AWAITING_CONFIRMATION) {
                return res.status(400).json({ message: "Payment is not awaiting confirmation" });
            }

            // Update payment with user-provided transaction details
            payment.transaction_reference = transactionReference;
            payment.upi_transaction_id = upiTransactionId;
            payment.status = PaymentStatus.COMPLETED; // Auto-mark as completed for now
            await paymentRepository.save(payment);

            // Update order status to processing
            if (payment.orderId) {
                const orderRepository = AppDataSource.getRepository(Order);
                const order = await orderRepository.findOne({ where: { id: payment.orderId } });
                if (order) {
                    order.status = OrderStatus.PROCESSING;
                    await orderRepository.save(order);
                }
            }

            return res.json({
                message: "Payment confirmed successfully",
                payment
            });
        } catch (error) {
            console.error("Confirm Payment Error:", error);
            return res.status(500).json({ message: "Failed to confirm payment" });
        }
    }

    // Admin endpoint to verify payment (future feature)
    static async verifyPayment(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { verified } = req.body;

            const paymentRepository = AppDataSource.getRepository(Payment);
            const payment = await paymentRepository.findOne({ where: { id: parseInt(id) } });

            if (!payment) {
                return res.status(404).json({ message: "Payment not found" });
            }

            payment.status = verified ? PaymentStatus.COMPLETED : PaymentStatus.FAILED;
            await paymentRepository.save(payment);

            // Update order status
            if (payment.orderId) {
                const orderRepository = AppDataSource.getRepository(Order);
                const order = await orderRepository.findOne({ where: { id: payment.orderId } });
                if (order) {
                    order.status = verified ? OrderStatus.PROCESSING : OrderStatus.PENDING;
                    await orderRepository.save(order);
                }
            }

            return res.json({
                message: verified ? "Payment verified successfully" : "Payment marked as failed",
                payment
            });
        } catch (error) {
            console.error("Verify Payment Error:", error);
            return res.status(500).json({ message: "Failed to verify payment" });
        }
    }

    static async webhook(req: Request, res: Response) {
        // Mock webhook handler - kept for compatibility
        const { transaction_id, status } = req.body;

        const paymentRepository = AppDataSource.getRepository(Payment);
        const payment = await paymentRepository.findOne({ where: { transaction_id } });

        if (!payment) return res.status(404).json({ message: "Payment not found" });

        if (status === "success") {
            payment.status = PaymentStatus.COMPLETED;
            await paymentRepository.save(payment);

            // Update order status
            if (payment.orderId) {
                const orderRepository = AppDataSource.getRepository(Order);
                const order = await orderRepository.findOne({ where: { id: payment.orderId } });
                if (order) {
                    order.status = OrderStatus.PROCESSING;
                    await orderRepository.save(order);
                }
            }
        } else {
            payment.status = PaymentStatus.FAILED;
            await paymentRepository.save(payment);
        }

        return res.json({ received: true });
    }
}
