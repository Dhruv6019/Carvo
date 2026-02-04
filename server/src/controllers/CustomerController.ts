import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Car } from "../entities/Car";
import { Part } from "../entities/Part";
import { Customization } from "../entities/Customization";
import { User } from "../entities/User";
import { Booking, BookingStatus } from "../entities/Booking";
import NotificationService from "../services/NotificationService";
import { NotificationType } from "../entities/Notification";

export class CustomerController {
    static async getCars(req: Request, res: Response) {
        const cars = await AppDataSource.getRepository(Car).find();
        return res.json(cars);
    }

    static async getCarParts(req: Request, res: Response) {
        // Get all parts with their category information
        const parts = await AppDataSource.getRepository(Part).find({
            relations: ["category"],
            order: { id: "ASC" }
        });
        return res.json(parts);
    }

    static async getPartById(req: Request, res: Response) {
        const { id } = req.params;
        const part = await AppDataSource.getRepository(Part).findOne({
            where: { id: parseInt(id) },
            relations: ["category"]
        });

        if (!part) {
            return res.status(404).json({ message: "Part not found" });
        }

        return res.json(part);
    }

    static async createCustomization(req: Request, res: Response) {
        const { carId, name, configuration } = req.body;
        const userId = (req as any).user.userId;

        const customization = new Customization();
        customization.name = name;
        customization.configuration = configuration;
        customization.carId = carId;
        customization.customerId = userId;
        customization.preview_token = "mock-preview-token-" + Date.now();

        await AppDataSource.getRepository(Customization).save(customization);

        // ✅ Send instant notification to customer
        await NotificationService.createNotification(
            userId,
            NotificationType.CUSTOMIZATION_APPROVED,
            "Customization Created",
            `Your customization "${name}" has been created successfully. Our team will review it shortly.`,
            customization.id
        );

        // ✅ Notify Admins
        await NotificationService.notifyAllAdmins(
            NotificationType.CUSTOMIZATION_APPROVED,
            "New Customization Request",
            `User ${userId} created a new customization "${name}".`,
            customization.id
        );

        // 📧 Send Email: Customization Saved
        const user = await AppDataSource.getRepository(User).findOne({ where: { id: userId } });
        if (user) {
            await NotificationService.sendCustomizationCreatedEmail(user.email, user.name, name);
        }

        console.log(`🎨 Customization created for user ${userId}, notification sent`);

        return res.status(201).json(customization);
    }
    static async createBooking(req: Request, res: Response) {
        const userId = (req as any).user.userId;
        const { serviceType, date, notes } = req.body;

        const booking = new Booking();
        booking.customerId = userId;
        booking.service_type = serviceType;
        booking.scheduled_date = new Date(date);
        booking.notes = notes;
        booking.status = BookingStatus.PENDING;

        await AppDataSource.getRepository(Booking).save(booking);

        // ✅ Send instant notification to customer
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        await NotificationService.createNotification(
            userId,
            NotificationType.ORDER_UPDATE,
            "Booking Confirmed",
            `Your ${serviceType} service has been booked for ${formattedDate}. We'll notify you once a provider is assigned.`,
            booking.id
        );

        // ✅ Notify Admins
        await NotificationService.notifyAllAdmins(
            NotificationType.ORDER_UPDATE,
            "New Service Booking",
            `New Booking #${booking.id}: ${serviceType} on ${formattedDate}.`,
            booking.id
        );

        // 📧 Send Email: Booking Confirmation
        const userForBooking = await AppDataSource.getRepository(User).findOne({ where: { id: userId } });
        if (userForBooking) {
            await NotificationService.sendBookingConfirmationEmail(userForBooking.email, userForBooking.name, serviceType, formattedDate);
        }

        console.log(`📅 Booking created for user ${userId}, notification sent`);

        return res.status(201).json(booking);
    }
    static async getMyBookings(req: Request, res: Response) {
        const userId = (req as any).user.userId;
        const bookingRepository = AppDataSource.getRepository(Booking);

        const bookings = await bookingRepository.find({
            where: { customerId: userId },
            order: { scheduled_date: "DESC" }
        });

        return res.json(bookings);
    }
}
