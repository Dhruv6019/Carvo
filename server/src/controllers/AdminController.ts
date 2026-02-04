import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User, UserRole } from "../entities/User";
import { Car } from "../entities/Car";
import { Part } from "../entities/Part";
import { Category } from "../entities/Category";
import { Order } from "../entities/Order";
import { Booking, BookingStatus } from "../entities/Booking";
import { Quotation, QuotationStatus } from "../entities/Quotation";
import bcrypt from "bcryptjs";
import NotificationService from "../services/NotificationService";
import { NotificationType } from "../entities/Notification";

import { Customization } from "../entities/Customization";

export class AdminController {
    // Customization Management
    static async getCustomizations(req: Request, res: Response) {
        const customizations = await AppDataSource.getRepository(Customization).find({
            relations: ["customer", "car"],
            order: { created_at: "DESC" }
        });
        return res.json(customizations);
    }

    static async updateCustomizationStatus(req: Request, res: Response) {
        const repo = AppDataSource.getRepository(Customization);
        const customization = await repo.findOne({ where: { id: parseInt(req.params.id) }, relations: ["customer"] });
        if (!customization) return res.status(404).json({ message: "Customization not found" });

        const { status } = req.body;
        customization.status = status;
        await repo.save(customization);

        // Notify User
        if (status === "reviewed" || status === "approved") {
            await NotificationService.createNotification(
                customization.customerId,
                NotificationType.CUSTOMIZATION_APPROVED,
                "Customization Update",
                `Your customization "${customization.name}" has been marked as ${status}.`,
                customization.id
            );
        }

        return res.json(customization);
    }

    // Booking Management
    static async getBookings(req: Request, res: Response) {
        const bookings = await AppDataSource.getRepository(Booking).find({
            relations: ["customer", "provider", "quotation"],
            order: { created_at: "DESC" }
        });
        return res.json(bookings);
    }

    static async updateBookingStatus(req: Request, res: Response) {
        const repo = AppDataSource.getRepository(Booking);
        const booking = await repo.findOne({ where: { id: parseInt(req.params.id) }, relations: ["customer"] });
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        const { status } = req.body;
        booking.status = status;
        await repo.save(booking);

        // Notify User
        await NotificationService.createNotification(
            booking.customerId,
            NotificationType.ORDER_UPDATE,
            "Booking Update",
            `Your booking status has been updated to ${status}.`,
            booking.id
        );

        return res.json(booking);
    }

    // Quotation Management
    static async getQuotations(req: Request, res: Response) {
        const quotations = await AppDataSource.getRepository(Quotation).find({
            relations: ["customer", "customization"],
            order: { created_at: "DESC" }
        });
        return res.json(quotations);
    }

    static async updateQuotationStatus(req: Request, res: Response) {
        const repo = AppDataSource.getRepository(Quotation);
        const quotation = await repo.findOne({ where: { id: parseInt(req.params.id) }, relations: ["customer", "customization"] });
        if (!quotation) return res.status(404).json({ message: "Quotation not found" });

        const { status, estimated_price } = req.body;
        if (status) quotation.status = status;
        if (estimated_price) quotation.estimated_price = estimated_price;

        await repo.save(quotation);

        // --- COMMISSION & INVOICE LOGIC FOR COMPLETED QUOTATIONS ---
        if (status === 'completed') { // Using string literal or QuotationStatus.COMPLETED
            // Check for Payment
            const paymentRepository = AppDataSource.getRepository(require("../entities/Payment").Payment);
            // Check if a payment exists for this quotation
            let payment = await paymentRepository.findOne({ where: { quotationId: quotation.id } });

            // If no payment record exists, creating one (assuming Cash/Direct settlement)
            let verifiedPayment = payment;

            if (!verifiedPayment) {
                const PaymentEntity = require("../entities/Payment").Payment;
                const newPayment = new PaymentEntity();
                newPayment.quotationId = quotation.id;
                newPayment.amount = Number(quotation.estimated_price || 0);
                newPayment.method = 'manual_settlement';
                newPayment.status = 'completed';
                await paymentRepository.save(newPayment);
                verifiedPayment = newPayment;
            } else if (verifiedPayment.status !== 'completed') {
                verifiedPayment.status = 'completed';
                await paymentRepository.save(verifiedPayment);
            }

            const totalAmount = Number(verifiedPayment?.amount || 0);
            if (totalAmount > 0) {
                const transactionRepository = AppDataSource.getRepository(require("../entities/Transaction").Transaction);
                const ADMIN_RATE = 0.10;
                const SHOP_RATE = 0.90;

                // 1. Admin Commission
                await transactionRepository.save({
                    userId: 1, // Admin
                    amount: totalAmount * ADMIN_RATE,
                    type: 'credit',
                    source: 'commission',
                    description: `Platform Fee for Quotation #${quotation.id}`
                });

                // 2. Shop/Provider Earnings
                if (quotation.providerId) {
                    await transactionRepository.save({
                        userId: quotation.providerId,
                        amount: totalAmount * SHOP_RATE,
                        type: 'credit',
                        source: 'commission',
                        description: `Earnings for Quotation #${quotation.id}`,
                    });
                }
            }

            // Send Invoice/Notification
            await NotificationService.createNotification(
                quotation.customerId,
                NotificationType.ORDER_UPDATE,
                "Quotation Completed",
                `Your quotation for ${quotation.customization?.name || 'customization'} has been marked as completed & paid.`,
                quotation.id
            );
        } else {
            // Notify User for other status updates
            await NotificationService.createNotification(
                quotation.customerId,
                NotificationType.ORDER_UPDATE,
                "Quotation Update",
                `Your quotation for ${quotation.customization?.name || 'customization'} has been updated to ${status}.`,
                quotation.id
            );
        }

        return res.json(quotation);
    }

    // User Management
    static async getAllUsers(req: Request, res: Response) {
        const users = await AppDataSource.getRepository(User).find({
            relations: ["sellerProfile", "deliveryProfile", "serviceProviderProfile", "supportProfile"]
        });
        return res.json(users);
    }

    static async getUserById(req: Request, res: Response) {
        const user = await AppDataSource.getRepository(User).findOne({ where: { id: parseInt(req.params.id) } });
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.json(user);
    }

    static async createUser(req: Request, res: Response) {
        try {
            const userRepository = AppDataSource.getRepository(User);
            const { password, ...userData } = req.body;

            // Extract profile data from request body
            const {
                business_name, tax_id, bank_name, bank_account_number,
                vehicle_plate_number, vehicle_model, license_number,
                company_name, experience_years, operating_hours, certification_details,
                employee_id, department, shift_start, shift_end,
                ...coreUserData
            } = userData;

            const user = new User();
            userRepository.merge(user, coreUserData);
            if (password) {
                user.password = await bcrypt.hash(password, 10);
            }

            const savedUser = await userRepository.save(user);

            // Create Profile based on role
            if (user.role === UserRole.SELLER) {
                const profileRepo = AppDataSource.getRepository(require("../entities/SellerProfile").SellerProfile);
                const profile = profileRepo.create({
                    user: savedUser,
                    business_name: business_name || "New Business",
                    tax_id, bank_name, bank_account_number,
                    address: (userData as any).address || "", // address from body
                    registration_number: license_number // mapping license to reg number if needed
                });
                await profileRepo.save(profile);
            } else if (user.role === UserRole.DELIVERY_BOY) {
                const profileRepo = AppDataSource.getRepository(require("../entities/DeliveryProfile").DeliveryProfile);
                const profile = profileRepo.create({
                    user: savedUser,
                    vehicle_plate_number, vehicle_model, license_number
                });
                await profileRepo.save(profile);
            } else if (user.role === UserRole.SERVICE_PROVIDER) {
                const profileRepo = AppDataSource.getRepository(require("../entities/ServiceProviderProfile").ServiceProviderProfile);
                const profile = profileRepo.create({
                    user: savedUser,
                    company_name: company_name || "New Company",
                    experience_years, operating_hours, certification_details
                });
                await profileRepo.save(profile);
            } else if (user.role === UserRole.SUPPORT_AGENT) {
                const profileRepo = AppDataSource.getRepository(require("../entities/SupportProfile").SupportProfile);
                const profile = profileRepo.create({
                    user: savedUser,
                    employee_id, department, shift_start, shift_end
                });
                await profileRepo.save(profile);
            }

            return res.status(201).json(savedUser);
        } catch (error) {
            console.error("Create User Error", error);
            return res.status(400).json({ message: "Failed to create user", error });
        }
    }

    static async updateUser(req: Request, res: Response) {
        try {
            const userRepository = AppDataSource.getRepository(User);
            let user = await userRepository.findOne({
                where: { id: parseInt(req.params.id) },
                relations: ["sellerProfile", "deliveryProfile", "serviceProviderProfile", "supportProfile"]
            });

            if (!user) return res.status(404).json({ message: "User not found" });

            const oldRole = user.role;
            const { password, ...userData } = req.body;

            // Extract profile data
            const {
                business_name, tax_id, bank_name, bank_account_number,
                vehicle_plate_number, vehicle_model, license_number,
                company_name, experience_years, operating_hours, certification_details,
                employee_id, department, shift_start, shift_end,
                ...coreUserData
            } = userData;

            userRepository.merge(user, coreUserData);

            if (password && password.trim() !== "") {
                user.password = await bcrypt.hash(password, 10);
            }

            await userRepository.save(user);

            // Update Profile
            if (user.role === UserRole.SELLER && user.sellerProfile) {
                const profileRepo = AppDataSource.getRepository(require("../entities/SellerProfile").SellerProfile);
                profileRepo.merge(user.sellerProfile, { business_name, tax_id, bank_name, bank_account_number });
                await profileRepo.save(user.sellerProfile);
            } else if (user.role === UserRole.DELIVERY_BOY && user.deliveryProfile) {
                const profileRepo = AppDataSource.getRepository(require("../entities/DeliveryProfile").DeliveryProfile);
                profileRepo.merge(user.deliveryProfile, { vehicle_plate_number, vehicle_model, license_number });
                await profileRepo.save(user.deliveryProfile);
            } // ... add others similarly if needed, for brevity covering main ones. 
            // Better to cover all:
            else if (user.role === UserRole.SERVICE_PROVIDER && user.serviceProviderProfile) {
                const profileRepo = AppDataSource.getRepository(require("../entities/ServiceProviderProfile").ServiceProviderProfile);
                profileRepo.merge(user.serviceProviderProfile, { company_name, experience_years, operating_hours, certification_details });
                await profileRepo.save(user.serviceProviderProfile);
            } else if (user.role === UserRole.SUPPORT_AGENT && user.supportProfile) {
                const profileRepo = AppDataSource.getRepository(require("../entities/SupportProfile").SupportProfile);
                profileRepo.merge(user.supportProfile, { employee_id, department, shift_start, shift_end });
                await profileRepo.save(user.supportProfile);
            }

            return res.json(user);
        } catch (error) {
            console.error("Update User Error", error);
            return res.status(400).json({ message: "Failed to update user", error });
        }
    }

    static async deleteUser(req: Request, res: Response) {
        try {
            const userRepository = AppDataSource.getRepository(User);
            const result = await userRepository.delete(req.params.id);
            if (result.affected === 0) return res.status(404).json({ message: "User not found" });
            return res.json({ message: "User deleted" });
        } catch (error) {
            return res.status(400).json({ message: "Failed to delete user", error });
        }
    }

    // Car Management
    static async createCar(req: Request, res: Response) {
        const carRepository = AppDataSource.getRepository(Car);
        const car = carRepository.create(req.body);
        await carRepository.save(car);
        return res.status(201).json(car);
    }

    static async updateCar(req: Request, res: Response) {
        const carRepository = AppDataSource.getRepository(Car);
        let car = await carRepository.findOne({ where: { id: parseInt(req.params.id) } });
        if (!car) return res.status(404).json({ message: "Car not found" });

        carRepository.merge(car, req.body);
        await carRepository.save(car);
        return res.json(car);
    }

    static async deleteCar(req: Request, res: Response) {
        const carRepository = AppDataSource.getRepository(Car);
        const result = await carRepository.delete(req.params.id);
        if (result.affected === 0) return res.status(404).json({ message: "Car not found" });
        return res.json({ message: "Car deleted" });
    }

    // Category Management
    static async createCategory(req: Request, res: Response) {
        const categoryRepository = AppDataSource.getRepository(Category);
        const category = categoryRepository.create(req.body);
        await categoryRepository.save(category);
        return res.status(201).json(category);
    }

    // Analytics
    static async getAnalytics(req: Request, res: Response) {
        const orderRepository = AppDataSource.getRepository(Order);
        const bookingRepository = AppDataSource.getRepository(Booking);
        const quotationRepository = AppDataSource.getRepository(Quotation);
        const partRepository = AppDataSource.getRepository(Part);

        // Calculate daily revenue (simplified: total revenue)
        const totalRevenueResult = await orderRepository
            .createQueryBuilder("order")
            .select("SUM(order.total_amount)", "sum")
            .getRawOne();
        const dailyRevenue = totalRevenueResult ? parseFloat(totalRevenueResult.sum) : 0;

        const activeBookings = await bookingRepository.count({ where: { status: BookingStatus.PENDING } });
        const pendingQuotations = await quotationRepository.count({ where: { status: QuotationStatus.PENDING } });

        // Stock levels check
        const lowStockParts = await partRepository
            .createQueryBuilder("part")
            .where("part.stock_quantity < :threshold", { threshold: 5 })
            .getCount();

        return res.json({
            dailyRevenue,
            activeBookings,
            pendingQuotations,
            stockLevels: lowStockParts > 0 ? "Low Stock Alert" : "Good"
        });
    }

    static async getRevenueTrend(req: Request, res: Response) {
        try {
            const period = req.query.period as string || 'month';
            const orderRepository = AppDataSource.getRepository(Order);

            let query = "";

            if (period === 'week') {
                query = `
                    SELECT DATE_FORMAT(created_at, '%d %b') as name, SUM(total_amount) as value
                    FROM \`order\`
                    WHERE status != 'cancelled'
                    AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
                    GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d'), name
                    ORDER BY MIN(created_at) ASC
                `;
            } else if (period === 'year') {
                query = `
                    SELECT DATE_FORMAT(created_at, '%b %Y') as name, SUM(total_amount) as value
                    FROM \`order\`
                    WHERE status != 'cancelled'
                    AND created_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR)
                    GROUP BY DATE_FORMAT(created_at, '%Y-%m'), name
                    ORDER BY MIN(created_at) ASC
                `;
            } else { // month (default)
                query = `
                    SELECT DATE_FORMAT(created_at, '%d %b') as name, SUM(total_amount) as value
                    FROM \`order\`
                    WHERE status != 'cancelled'
                    AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                    GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d'), name
                    ORDER BY MIN(created_at) ASC
                `;
            }

            const result = await orderRepository.query(query);
            return res.json(result);
        } catch (error) {
            console.error("Revenue Trend Error:", error);
            return res.status(500).json({ message: "Failed to fetch revenue trend" });
        }
    }

    // Order Management
    static async getAllOrders(req: Request, res: Response) {
        const orderRepository = AppDataSource.getRepository(Order);
        const orders = await orderRepository.find({
            relations: ["items", "items.part", "customer", "deliveryAgent"],
            order: { created_at: "DESC" }
        });
        return res.json(orders);
    }

    // System Settings
    static async getSystemSettings(req: Request, res: Response) {
        try {
            const settingsRepository = AppDataSource.getRepository("SystemSetting");
            const settings = await settingsRepository.find();
            return res.json(settings);
        } catch (error) {
            return res.status(500).json({ message: "Failed to fetch settings" });
        }
    }

    static async updateSystemSetting(req: Request, res: Response) {
        const { key } = req.params;
        const { value, description } = req.body;

        try {
            const settingsRepository = AppDataSource.getRepository("SystemSetting");
            let setting = await settingsRepository.findOne({ where: { key } });

            if (!setting) {
                setting = settingsRepository.create({ key, value, description });
            } else {
                setting.value = value;
                if (description) setting.description = description;
            }

            await settingsRepository.save(setting);
            return res.json(setting);
        } catch (error) {
            return res.status(500).json({ message: "Failed to update setting" });
        }
    }
}
