import { useState, useEffect } from "react";
import api from "@/lib/api";

export interface Notification {
    id: number;
    type: string;
    title: string;
    message: string;
    isRead: boolean;
    relatedEntityId?: number;
    createdAt: string;
}

// Mock notifications for demonstration/fallback
const getMockNotifications = (): Notification[] => [
    {
        id: 1,
        type: "order_update",
        title: "Order Status Updated",
        message: "Your order #12345 for custom body kit has been confirmed and is being processed.",
        isRead: false,
        relatedEntityId: 12345,
        createdAt: new Date(Date.now() - 60000 * 5).toISOString(), // 5 minutes ago
    },
    {
        id: 2,
        type: "payment_confirmed",
        title: "Payment Received",
        message: "We've received your payment of $1,299.99 for premium paint job. Processing will begin shortly.",
        isRead: false,
        relatedEntityId: 789,
        createdAt: new Date(Date.now() - 60000 * 30).toISOString(), // 30 minutes ago
    },
    {
        id: 3,
        type: "delivery_assigned",
        title: "Delivery Personnel Assigned",
        message: "John from our delivery team has been assigned to deliver your custom wheels. ETA: 2-3 business days.",
        isRead: false,
        relatedEntityId: 456,
        createdAt: new Date(Date.now() - 60000 * 120).toISOString(), // 2 hours ago
    },
    {
        id: 4,
        type: "order_delivered",
        title: "Order Delivered",
        message: "Your custom exhaust system has been successfully delivered! Please confirm receipt.",
        isRead: true,
        relatedEntityId: 234,
        createdAt: new Date(Date.now() - 60000 * 60 * 24).toISOString(), // 1 day ago
    },
    {
        id: 5,
        type: "review_received",
        title: "New Review on Your Order",
        message: "A customer left a 5-star review on the custom spoiler you ordered. Check it out!",
        isRead: true,
        relatedEntityId: 567,
        createdAt: new Date(Date.now() - 60000 * 60 * 48).toISOString(), // 2 days ago
    },
];


export const useNotifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const response = await api.get("/notifications");
            // API returns created_at (snake_case), map to createdAt (camelCase)
            const mappedNotifications = response.data.map((n: any) => ({
                ...n,
                createdAt: n.created_at || n.createdAt
            }));
            setNotifications(mappedNotifications);
        } catch (error: any) {
            console.error("Error fetching notifications:", error);
            // On error, just show empty
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const response = await api.get("/notifications/unread-count");
            setUnreadCount(response.data.count);
        } catch (error: any) {
            console.error("Error fetching unread count:", error);
            setUnreadCount(0);
        }
    };

    const markAsRead = async (id: number) => {
        try {
            await api.put(`/notifications/${id}/read`);

            // Immediately update local state
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, isRead: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));

            // Refresh from backend to ensure persistence
            setTimeout(() => {
                fetchNotifications();
                fetchUnreadCount();
            }, 500);
        } catch (error) {
            console.error("Error marking notification as read:", error);
            // Revert local state on error
            fetchNotifications();
            fetchUnreadCount();
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put("/notifications/mark-all-read");

            // Immediately update local state
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);

            // Refresh from backend to ensure persistence
            setTimeout(() => {
                fetchNotifications();
                fetchUnreadCount();
            }, 500);
        } catch (error) {
            console.error("Error marking all as read:", error);
            // Revert local state on error
            fetchNotifications();
            fetchUnreadCount();
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("accessToken"); // Changed from "token" to "accessToken" to match AuthContext
        if (token) {
            fetchNotifications();
            fetchUnreadCount();

            // Auto-refresh every 10 seconds for real-time updates
            const interval = setInterval(() => {
                fetchUnreadCount();
                fetchNotifications();
            }, 10000);

            return () => clearInterval(interval);
        } else {
            setNotifications([]);
            setUnreadCount(0);
            setLoading(false);
        }
    }, []);

    return {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        refresh: fetchNotifications,
    };
};
