import { Router, Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Notification, NotificationType } from "../entities/Notification";
import NotificationService from "../services/NotificationService";
import { authenticate } from "../middlewares/auth";
import { getAllowedNotificationTypes } from "../utils/notificationRoleConfig";
import { In } from "typeorm";

const router = Router();

// Seed test notifications (development only)
router.post("/seed", authenticate, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const notificationRepository = AppDataSource.getRepository(Notification);

        // Check if user already has notifications
        const existingCount = await notificationRepository.count({ where: { userId } });

        if (existingCount > 0) {
            return res.json({
                message: "User already has notifications",
                count: existingCount
            });
        }

        // Create sample notifications
        const notifications = [
            {
                userId,
                type: NotificationType.ORDER_UPDATE,
                title: "Order Confirmed",
                message: "Your order #12345 for custom body kit has been confirmed and is being processed.",
                isRead: false,
                relatedEntityId: 12345,
            },
            {
                userId,
                type: NotificationType.PAYMENT_CONFIRMED,
                title: "Payment Received",
                message: "We've received your payment of $1,299.99. Your order is now being prepared.",
                isRead: false,
                relatedEntityId: 789,
            },
            {
                userId,
                type: NotificationType.DELIVERY_ASSIGNED,
                title: "Delivery Personnel Assigned",
                message: "Your order has been assigned to our delivery team. Expected delivery: 2-3 business days.",
                isRead: false,
                relatedEntityId: 456,
            },
            {
                userId,
                type: NotificationType.DELIVERY_COMPLETED,
                title: "Order Delivered",
                message: "Your custom exhaust system has been successfully delivered! Please confirm receipt.",
                isRead: true,
                relatedEntityId: 234,
            },
            {
                userId,
                type: NotificationType.REVIEW_RECEIVED,
                title: "New Review Received",
                message: "A customer left a 5-star review on your recent purchase. Check it out!",
                isRead: true,
                relatedEntityId: 567,
            },
        ];

        const saved = await notificationRepository.save(notifications);

        console.log(`✅ Created ${saved.length} test notifications for user ${userId}`);

        return res.json({
            message: "Test notifications created successfully",
            count: saved.length,
            notifications: saved,
        });
    } catch (error) {
        console.error("Seed notifications error:", error);
        return res.status(500).json({ message: "Failed to create test notifications" });
    }
});

// Delete all user notifications (development/testing)
router.delete("/clear", authenticate, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const notificationRepository = AppDataSource.getRepository(Notification);

        const result = await notificationRepository.delete({ userId });

        return res.json({
            message: "All notifications cleared",
            deletedCount: result.affected || 0,
        });
    } catch (error) {
        console.error("Clear notifications error:", error);
        return res.status(500).json({ message: "Failed to clear notifications" });
    }
});

// Get all notifications (filtered by user role)
router.get("/", authenticate, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const userRole = (req as any).user.role;
        const notificationRepository = AppDataSource.getRepository(Notification);

        // Get allowed notification types for this user's role
        const allowedTypes = getAllowedNotificationTypes(userRole);

        console.log(`🎭 User ${userId} (${userRole}) can see notification types:`, allowedTypes);

        // SECURITY & ROLE-BASED: Only fetch notifications for THIS user AND their role
        const notifications = await notificationRepository.find({
            where: {
                userId: userId,           // User isolation
                type: In(allowedTypes)    // Role-based filtering
            },
            order: { created_at: "DESC" },
            take: 50,
        });

        console.log(`📬 User ${userId} (${userRole}) fetched ${notifications.length} notifications`);

        // Double-check: Verify all notifications belong to this user
        const allBelongToUser = notifications.every(n => n.userId === userId);
        if (!allBelongToUser) {
            console.error(`⚠️ SECURITY ALERT: User ${userId} received notifications from other users!`);
            return res.status(500).json({ message: "Data integrity error" });
        }

        return res.json(notifications);
    } catch (error) {
        console.error("Get Notifications Error:", error);
        return res.status(500).json({ message: "Failed to fetch notifications" });
    }
});

// Get unread count (filtered by user role)
router.get("/unread-count", authenticate, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const userRole = (req as any).user.role;
        const notificationRepository = AppDataSource.getRepository(Notification);

        // Get allowed notification types for this user's role
        const allowedTypes = getAllowedNotificationTypes(userRole);

        // SECURITY & ROLE-BASED: Count only THIS user's unread notifications of allowed types
        const count = await notificationRepository.count({
            where: {
                userId: userId,           // User isolation
                isRead: false,
                type: In(allowedTypes)    // Role-based filtering
            },
        });

        console.log(`🔔 User ${userId} (${userRole}) has ${count} unread notifications`);

        return res.json({ count });
    } catch (error) {
        console.error("Get Unread Count Error:", error);
        return res.status(500).json({ message: "Failed to get unread count" });
    }
});

// Mark notification as read
router.put("/:id/read", authenticate, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const { id } = req.params;
        const notificationRepository = AppDataSource.getRepository(Notification);

        // SECURITY: Find notification AND verify ownership in one query
        const notification = await notificationRepository.findOne({
            where: {
                id: parseInt(id),
                userId: userId  // Must belong to authenticated user
            },
        });

        if (!notification) {
            // Either doesn't exist OR belongs to another user
            console.warn(`⚠️ User ${userId} attempted to read notification ${id} (not found or unauthorized)`);
            return res.status(404).json({ message: "Notification not found" });
        }

        notification.isRead = true;
        await notificationRepository.save(notification);

        console.log(`✅ User ${userId} marked notification ${id} as read`);

        return res.json({ message: "Notification marked as read" });
    } catch (error) {
        console.error("Mark Notification Read Error:", error);
        return res.status(500).json({ message: "Failed to mark notification as read" });
    }
});

// Mark all as read
router.put("/mark-all-read", authenticate, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const notificationRepository = AppDataSource.getRepository(Notification);

        // SECURITY: Only update THIS user's notifications
        const result = await notificationRepository.update(
            {
                userId: userId,  // User isolation
                isRead: false
            },
            { isRead: true }
        );

        console.log(`✅ User ${userId} marked ${result.affected || 0} notifications as read`);

        return res.json({ message: "All notifications marked as read" });
    } catch (error) {
        console.error("Mark All Notifications Read Error:", error);
        return res.status(500).json({ message: "Failed to mark all notifications as read" });
    }
});

export default router;
