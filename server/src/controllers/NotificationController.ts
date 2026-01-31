import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Notification } from "../entities/Notification";

export class NotificationController {
    static async getMyNotifications(req: Request, res: Response) {
        try {
            const userId = (req as any).user.userId;
            const notificationRepository = AppDataSource.getRepository(Notification);

            const notifications = await notificationRepository.find({
                where: { userId },
                order: { created_at: "DESC" },
                take: 50, // Limit to last 50 notifications
            });

            return res.json(notifications);
        } catch (error) {
            console.error("Get Notifications Error:", error);
            return res.status(500).json({ message: "Failed to fetch notifications" });
        }
    }

    static async markAsRead(req: Request, res: Response) {
        try {
            const userId = (req as any).user.userId;
            const { id } = req.params;
            const notificationRepository = AppDataSource.getRepository(Notification);

            const notification = await notificationRepository.findOne({
                where: { id: parseInt(id), userId },
            });

            if (!notification) {
                return res.status(404).json({ message: "Notification not found" });
            }

            notification.isRead = true;
            await notificationRepository.save(notification);

            return res.json({ message: "Notification marked as read" });
        } catch (error) {
            console.error("Mark Notification Read Error:", error);
            return res.status(500).json({ message: "Failed to mark notification as read" });
        }
    }

    static async markAllAsRead(req: Request, res: Response) {
        try {
            const userId = (req as any).user.userId;
            const notificationRepository = AppDataSource.getRepository(Notification);

            await notificationRepository.update(
                { userId, isRead: false },
                { isRead: true }
            );

            return res.json({ message: "All notifications marked as read" });
        } catch (error) {
            console.error("Mark All Notifications Read Error:", error);
            return res.status(500).json({ message: "Failed to mark all notifications as read" });
        }
    }

    static async getUnreadCount(req: Request, res: Response) {
        try {
            const userId = (req as any).user.userId;
            const notificationRepository = AppDataSource.getRepository(Notification);

            const count = await notificationRepository.count({
                where: { userId, isRead: false },
            });

            return res.json({ count });
        } catch (error) {
            console.error("Get Unread Count Error:", error);
            return res.status(500).json({ message: "Failed to get unread count" });
        }
    }
}
