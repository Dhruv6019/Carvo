import { useState, useRef, useEffect } from "react";
import { Bell, Package, CreditCard, Truck, CheckCircle, X, ShieldAlert, BadgeCheck, Star, AlertTriangle } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

const getNotificationIcon = (type: string) => {
    switch (type) {
        case "order_update":
            return <Package className="w-5 h-5 text-blue-400" />;
        case "payment_confirmed":
            return <CreditCard className="w-5 h-5 text-green-400" />;
        case "delivery_assigned":
            return <Truck className="w-5 h-5 text-orange-400" />;
        case "order_delivered":
            return <CheckCircle className="w-5 h-5 text-emerald-400" />;
        case "security_alert":
            return <ShieldAlert className="w-5 h-5 text-red-400" />;
        case "role_update":
            return <BadgeCheck className="w-5 h-5 text-purple-400" />;
        case "review_received":
            return <Star className="w-5 h-5 text-yellow-400" />;
        case "low_stock":
            return <AlertTriangle className="w-5 h-5 text-red-500" />;
        default:
            return <Bell className="w-5 h-5 text-gray-400" />;
    }
};

export const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const handleNotificationClick = (id: number, isRead: boolean) => {
        if (!isRead) {
            markAsRead(id);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-[380px] bg-[#1e1e1e] border border-[#2a2a2a] rounded-2xl shadow-2xl overflow-hidden z-[999] pointer-events-auto animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Header */}
                    <div className="sticky top-0 bg-[#1e1e1e] border-b border-[#2a2a2a] px-4 py-3 flex items-center justify-between">
                        <h3 className="text-white font-semibold text-sm">Notifications</h3>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <Button
                                    onClick={markAllAsRead}
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 h-7"
                                >
                                    Mark all read
                                </Button>
                            )}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-white/5"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Notification List */}
                    <div className="max-h-[500px] overflow-y-auto">
                        {loading ? (
                            <div className="p-8 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
                                <p className="text-gray-400 text-sm mt-3">Loading...</p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-12 text-center">
                                <Bell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                                <p className="text-gray-400 text-sm">No notifications yet</p>
                                <p className="text-gray-600 text-xs mt-1">We'll notify you when something happens</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-[#2a2a2a]">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        onClick={() => handleNotificationClick(notification.id, notification.isRead)}
                                        className={`p-4 cursor-pointer transition-all hover:bg-[#252525] ${!notification.isRead ? "bg-blue-500/5 border-l-2 border-blue-400" : ""
                                            }`}
                                    >
                                        <div className="flex gap-3">
                                            {/* Icon */}
                                            <div className="flex-shrink-0 mt-0.5">
                                                {getNotificationIcon(notification.type)}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h4 className={`text-sm font-medium ${notification.isRead ? "text-gray-300" : "text-white"
                                                        }`}>
                                                        {notification.title}
                                                    </h4>
                                                    {!notification.isRead && (
                                                        <span className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-1.5"></span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-gray-600 mt-2">
                                                    {notification.createdAt ? formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true }) : ''}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="sticky bottom-0 bg-[#1e1e1e] border-t border-[#2a2a2a] px-4 py-3">
                            <button
                                onClick={() => { setIsOpen(false); window.location.href = '/notifications'; }}
                                className="w-full text-center text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium"
                            >
                                View all notifications
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
