import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { Truck, MapPin, CheckCircle } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const DeliveryDashboard = () => {
    const [assignments, setAssignments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewingOrder, setViewingOrder] = useState<any>(null);
    const [verifyingOrder, setVerifyingOrder] = useState<any>(null);
    const [otp, setOtp] = useState(""); // OTP input state

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const res = await api.get("/delivery/assignments");
                setAssignments(res.data);
            } catch (error) {
                console.error("Error fetching assignments", error);
                toast.error("Failed to load assignments");
            } finally {
                setLoading(false);
            }
        };

        fetchAssignments();
    }, []);



    const handleStartDelivery = async (id: number) => {
        try {
            await api.post(`/delivery/${id}/start`);
            toast.success("Delivery started. OTP sent to customer.");
            // Refresh to update status
            const res = await api.get("/delivery/assignments");
            setAssignments(res.data);
        } catch (error) {
            toast.error("Failed to start delivery");
        }
    };

    const handleVerifyOtp = async (id: number) => {
        try {
            await api.post(`/delivery/${id}/verify`, { otp });
            toast.success("Delivery verified successfully!");
            setOtp("");
            setVerifyingOrder(null);
            // Refresh to update status
            const res = await api.get("/delivery/assignments");
            setAssignments(res.data);
        } catch (error) {
            toast.error("Invalid OTP or verification failed");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-background">
            <Navigation />

            <div className="pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-4xl font-display font-black text-foreground mb-4">
                            Delivery <span className="bg-gradient-to-r from-electric-blue to-burnt-orange bg-clip-text text-transparent">Dashboard</span>
                        </h1>
                        <p className="text-xl text-muted-foreground">Your active deliveries</p>
                    </div>

                    <Card className="p-6">
                        <h2 className="text-2xl font-semibold text-foreground mb-6">Active Assignments</h2>
                        <div className="space-y-4">
                            {assignments.map((order) => (
                                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-start space-x-4">
                                        <Truck className="w-6 h-6 text-electric-blue mt-1" />
                                        <div>
                                            <p className="font-medium text-foreground">Order #{order.id}</p>
                                            <p className="text-sm font-semibold text-foreground">{order.customer?.name}</p>
                                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                                                <MapPin className="w-4 h-4 mr-1" />
                                                {order.shipping_address}
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">Status: {order.status}</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" onClick={() => setViewingOrder(order)}>
                                        View Details
                                    </Button>
                                    {order.status === 'shipped' && (
                                        <Button onClick={() => handleStartDelivery(order.id)} className="bg-blue-500 hover:bg-blue-600">
                                            Start Delivery
                                        </Button>
                                    )}
                                    {order.status === 'out_for_delivery' && (
                                        <Button onClick={() => setVerifyingOrder(order)} className="bg-green-500 hover:bg-green-600">
                                            Verify OTP
                                        </Button>
                                    )}
                                </div>
                            ))}
                            {assignments.length === 0 && <p className="text-center text-muted-foreground py-8">No active delivery assignments.</p>}
                        </div>
                    </Card>
                </div>
            </div>


            {/* Order Details Dialog */}
            <Dialog open={!!viewingOrder} onOpenChange={(open) => !open && setViewingOrder(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Order #{viewingOrder?.id}</DialogTitle>
                        <DialogDescription>Delivery Details</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <p className="font-semibold">Shipping Address</p>
                            <p className="text-muted-foreground">{viewingOrder?.shipping_address}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Items</p>
                            <div className="space-y-2 mt-2">
                                {viewingOrder?.items?.map((item: any, idx: number) => (
                                    <div key={idx} className="flex justify-between border-b pb-2">
                                        <span>{item.part?.name || "Item"} (x{item.quantity})</span>
                                        <span>${item.price}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-between font-bold pt-2">
                            <span>Total Amount</span>
                            <span>${viewingOrder?.total_amount}</span>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* OTP Verification Dialog */}
            <Dialog open={!!verifyingOrder} onOpenChange={(open) => !open && setVerifyingOrder(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Verify Delivery - Order #{verifyingOrder?.id}</DialogTitle>
                        <DialogDescription>Please enter the 6-digit OTP provided by the customer.</DialogDescription>
                    </DialogHeader>
                    <div className="py-6 space-y-4">
                        <div className="flex justify-center">
                            <input
                                className="border-2 border-electric-blue rounded-lg px-4 py-3 text-center text-3xl font-bold tracking-[0.5em] w-full focus:outline-none focus:ring-2 focus:ring-electric-blue"
                                type="text"
                                maxLength={6}
                                placeholder="000000"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </div>
                        <Button className="w-full h-12 text-lg bg-electric-blue" onClick={() => handleVerifyOtp(verifyingOrder.id)}>
                            Complete Delivery
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div >
    );
};

export default DeliveryDashboard;
