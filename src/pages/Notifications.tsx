
import { useEffect, useState } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { Package, CreditCard, Truck, CheckCircle, ShieldAlert, BadgeCheck, Star, AlertTriangle, Bell, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { ThemeProvider } from "@/components/theme-provider";

const getNotificationIcon = (type: string) => {
    switch (type) {
        case "order_update": return <Package className="w-5 h-5 text-blue-400" />;
        case "payment_confirmed": return <CreditCard className="w-5 h-5 text-green-400" />;
        case "delivery_assigned": return <Truck className="w-5 h-5 text-orange-400" />;
        case "order_delivered": return <CheckCircle className="w-5 h-5 text-emerald-400" />;
        case "security_alert": return <ShieldAlert className="w-5 h-5 text-red-400" />;
        case "role_update": return <BadgeCheck className="w-5 h-5 text-purple-400" />;
        case "review_received": return <Star className="w-5 h-5 text-yellow-400" />;
        case "low_stock": return <AlertTriangle className="w-5 h-5 text-red-500" />;
        default: return <Bell className="w-5 h-5 text-gray-400" />;
    }
};

const Notifications = () => {
    const { notifications, loading, markAsRead, markAllAsRead } = useNotifications();
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    const filteredNotifications = filter === 'all'
        ? notifications
        : notifications.filter(n => !n.isRead);

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <div className="min-h-screen bg-background text-foreground">
                <Navigation />
                <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold font-display">Notifications</h1>
                            <p className="text-muted-foreground mt-1">Stay updated with your orders and activities</p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={filter === 'all' ? 'default' : 'outline'}
                                onClick={() => setFilter('all')}
                                size="sm"
                            >
                                All
                            </Button>
                            <Button
                                variant={filter === 'unread' ? 'default' : 'outline'}
                                onClick={() => setFilter('unread')}
                                size="sm"
                            >
                                Unread
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={markAllAsRead}
                                className="text-blue-400 hover:text-blue-300"
                            >
                                <Check className="w-4 h-4 mr-2" />
                                Mark all read
                            </Button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        </div>
                    ) : filteredNotifications.length === 0 ? (
                        <Card className="p-12 flex flex-col items-center justify-center text-center bg-card/50 border-white/10">
                            <Bell className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
                            <h3 className="text-xl font-semibold mb-2">No notifications found</h3>
                            <p className="text-muted-foreground">You're all caught up! updates will appear here.</p>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {filteredNotifications.map((notification) => (
                                <Card
                                    key={notification.id}
                                    className={`p-5 transition-all hover:bg-white/5 border-white/10 ${!notification.isRead ? 'bg-blue-500/5 border-l-4 border-l-blue-500' : 'bg-card'}`}
                                >
                                    <div className="flex gap-4">
                                        <div className="mt-1 p-2 bg-background/50 rounded-full h-fit">
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className={`font-semibold ${!notification.isRead ? 'text-white' : 'text-gray-300'}`}>
                                                    {notification.title}
                                                </h3>
                                                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                                    {notification.createdAt ? formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true }) : ''}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-400 leading-relaxed mb-3">
                                                {notification.message}
                                            </p>
                                            {!notification.isRead && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 text-xs px-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                                                    onClick={() => markAsRead(notification.id)}
                                                >
                                                    Mark as read
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </ThemeProvider>
    );
};

export default Notifications;
