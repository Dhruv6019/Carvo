
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Circle, Clock, Download, Eye, Truck, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface OrderItem {
    id: number;
    part: {
        name: string;
        price: string | number;
        imageUrl?: string;
    };
    quantity: number;
    price: string | number;
}

interface Order {
    id: number;
    created_at: string;
    status: 'pending' | 'confirmed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'completed';
    total_amount: string | number;
    items: OrderItem[];
    deliveryOtp?: string;
}

interface OrderHistoryProps {
    orders: Order[];
    onViewDetails: (order: Order) => void;
    onDownloadInvoice: (orderId: number) => void;
}

const steps = [
    { id: 'pending', label: 'Ordered' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'out_for_delivery', label: 'Out for delivery' },
    { id: 'delivered', label: 'Delivered' },
];

const getStatusStepIndex = (status: string) => {
    switch (status) {
        case 'pending': return 0;
        case 'confirmed': return 1;
        case 'shipped': return 1; // Map shipped to confirmed level or add new step
        case 'out_for_delivery': return 2;
        case 'delivered': return 3;
        case 'completed': return 3;
        default: return 0;
    }
};

export const OrderHistory = ({ orders, onViewDetails, onDownloadInvoice }: OrderHistoryProps) => {
    return (
        <div className="space-y-6">
            {orders.map((order) => {
                const currentStepIndex = getStatusStepIndex(order.status);

                return (
                    <Card key={order.id} className="p-6 overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-border/50">
                            <div>
                                <h3 className="text-lg font-bold text-foreground">#{String(order.id).padStart(8, 'ORD000')}</h3>
                                <p className="text-sm text-muted-foreground">Placed on {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                            </div>
                            <div className="flex gap-3 mt-4 md:mt-0">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-electric-blue hover:text-electric-blue/80 hover:bg-electric-blue/10"
                                    onClick={() => onViewDetails(order)}
                                >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View order details
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-electric-blue/20 text-foreground hover:bg-electric-blue/5"
                                    onClick={() => onDownloadInvoice(order.id)}
                                >
                                    <Download className="w-4 h-4 mr-2 text-electric-blue" />
                                    Download invoice
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Products Section */}
                            <div className="flex-1 space-y-4">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="w-24 h-24 bg-secondary/30 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden border border-border/50">
                                            {item.part.imageUrl ? (
                                                <img src={item.part.imageUrl} alt={item.part.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <Package className="w-10 h-10 text-muted-foreground/50" />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-lg text-foreground">{item.part.name}</h4>
                                            <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                                            <p className="font-medium mt-1">₹{Number(item.price).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Status Timeline Section */}
                            <div className="lg:w-72">
                                <div className="mt-2 space-y-6 relative">
                                    {/* Vertical Line */}
                                    <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-border/50 -z-10" />

                                    {steps.map((step, index) => {
                                        const isCompleted = index <= currentStepIndex;
                                        const isCurrent = index === currentStepIndex;

                                        return (
                                            <div key={step.id} className="flex items-center gap-4 relative">
                                                <div className={`
                                                    w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors duration-300 z-10
                                                    ${isCompleted ? 'bg-emerald-500 border-emerald-500' : 'bg-background border-muted-foreground/30'}
                                                `}>
                                                    {isCompleted && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                                                </div>
                                                <span className={`text-sm font-medium ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                    {step.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Footer / Delivery Date */}
                        <div className={`mt-6 p-4 rounded-lg flex items-center gap-3 ${order.status === 'delivered' || order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-orange-500/10 text-orange-600 dark:text-orange-400'}`}>
                            {order.status === 'delivered' || order.status === 'completed' ? (
                                <>
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="font-medium">Delivered on {new Date(order.created_at).toLocaleDateString()}</span>
                                    {/* Note: Ideally we'd have a separate delivered_at date */}
                                </>
                            ) : (
                                <>
                                    <Truck className="w-5 h-5" />
                                    <span className="font-medium">Expected delivery by {new Date(new Date(order.created_at).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                                </>
                            )}
                        </div>
                    </Card>
                );
            })}
            {orders.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No active orders.</p>
                </div>
            )}
        </div>
    );
};
