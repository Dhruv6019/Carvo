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
            return res.json(booking);
        } else {
            return res.status(400).json({ message: "Invalid status" });
        }
    }
}
