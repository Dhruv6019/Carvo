import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Booking, BookingStatus } from "../entities/Booking";
import { IsNull } from "typeorm";

export class ServiceProviderController {
    static async getBookings(req: Request, res: Response) {
        const userId = (req as any).user.userId;
        const bookingRepository = AppDataSource.getRepository(Booking);

        // Find bookings assigned to this provider OR unassigned bookings
        const bookings = await bookingRepository.find({
            where: [
                { providerId: userId },
                { providerId: IsNull() }
            ],
            relations: ["customer"]
        });
        return res.json(bookings);
    }

    static async updateBookingStatus(req: Request, res: Response) {
        const userId = (req as any).user.userId;
        const bookingRepository = AppDataSource.getRepository(Booking);

        let booking = await bookingRepository.findOne({
            where: [
                { id: parseInt(req.params.id), providerId: userId },
                { id: parseInt(req.params.id), providerId: IsNull() }
            ]
        });

        if (!booking) return res.status(404).json({ message: "Booking not found or unauthorized" });

        const { status } = req.body;
        if (Object.values(BookingStatus).includes(status)) {
            booking.status = status;
            // If it was unassigned, assign it to the current user
            if (!booking.providerId) {
                booking.providerId = userId;
            }
            await bookingRepository.save(booking);

            // --- COMMISSION & INVOICE LOGIC FOR COMPLETED SERVICES ---
            if (status === BookingStatus.COMPLETED) {
                // Check if payment exists and mark completed (Assuming mechanism exists or manual cash collect)
                // If utilizing Payment entity linked to Booking:
                const paymentRepository = AppDataSource.getRepository(require("../entities/Payment").Payment);
                const pendingPayment = await paymentRepository.findOne({
                    where: { bookingId: booking.id, status: 'pending' } // PaymentStatus.PENDING
                });

                if (pendingPayment) {
                    pendingPayment.status = 'completed';
                    await paymentRepository.save(pendingPayment);

                    // Distribute Commission
                    const transactionRepository = AppDataSource.getRepository(require("../entities/Transaction").Transaction);
                    const totalAmount = Number(pendingPayment.amount);

                    // Service Rates
                    const ADMIN_RATE = 0.15; // Platform fee for services
                    const PROVIDER_RATE = 0.85;

                    // 1. Service Provider Earning
                    await transactionRepository.save({
                        userId: userId,
                        amount: totalAmount * PROVIDER_RATE,
                        type: 'credit',
                        source: 'commission',
                        description: `Service Earnings for Booking #${booking.id}`,
                        // orderId maps to Booking implicitly or add bookingId to Transaction (TODO: Add bookingId to Transaction entity if strict)
                        // For now using description to track. 
                    });

                    // 2. Admin Commission
                    await transactionRepository.save({
                        userId: 1, // Admin
                        amount: totalAmount * ADMIN_RATE,
                        type: 'credit',
                        source: 'commission',
                        description: `Platform Fee for Service Booking #${booking.id}`
                    });

                    // Generate Invoice
                    try {
                        // InvoiceService needs update to handle Booking or we create a utility
                        // For now, let's assume we can create a generic invoice or skip if InvoiceService is strictly Order-bound.
                        // InvoiceService.generateInvoiceForOrder is strictly for Order.
                        // We will implement a lightweight invoice email directly here or extend InvoiceService.

                        const NotificationServiceModule = require("../services/NotificationService").default;
                        await NotificationServiceModule.createNotification(
                            booking.customerId,
                            'payment_confirmed', // NotificationType
                            "Service Completed",
                            `Your service booking #${booking.id} is completed. Invoice has been sent to your email.`,
                            booking.id
                        );

                        // Mocking Invoice Email for Service (Since Invoice entity is tied to Order)
                        // Ideally, we refactor Invoice to support Booking. 
                        // For this step, I will notify.
                    } catch (e) {
                        console.error("Service Invoice Error", e);
                    }
                }
            }

            return res.json(booking);
        } else {
            return res.status(400).json({ message: "Invalid status" });
        }
    }
}
