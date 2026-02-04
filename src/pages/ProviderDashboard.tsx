import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, CheckCircle, XCircle } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const ProviderDashboard = () => {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewingBooking, setViewingBooking] = useState<any>(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await api.get("/provider/bookings");
                setBookings(res.data);
            } catch (error) {
                console.error("Error fetching bookings", error);
                toast.error("Failed to load bookings");
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const updateStatus = async (id: number, status: string) => {
        try {
            await api.patch(`/provider/bookings/${id}/status`, { status });
            toast.success(`Booking updated to ${status}`);
            setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
        } catch (error) {
            toast.error("Failed to update booking");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-background">
            <Navigation />

            <div className="pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-4xl font-display font-black text-foreground mb-4">
                            Provider <span className="bg-gradient-to-r from-electric-blue to-burnt-orange bg-clip-text text-transparent">Dashboard</span>
                        </h1>
                        <p className="text-xl text-muted-foreground">Manage service bookings</p>
                    </div>

                    <Card className="p-6">
                        <h2 className="text-2xl font-semibold text-foreground mb-6">Upcoming Bookings</h2>
                        <div className="space-y-4">
                            {bookings.map((booking) => (
                                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <p className="font-medium text-foreground">Booking #{booking.id}</p>
                                        <p className="text-sm text-muted-foreground">Date: {new Date(booking.scheduled_date).toLocaleDateString()}</p>
                                        <p className="text-sm text-muted-foreground">Status: {booking.status}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        {booking.status === 'pending' && (
                                            <>
                                                <Button size="sm" className="bg-green-500 hover:bg-green-600" onClick={() => updateStatus(booking.id, 'confirmed')}>
                                                    <CheckCircle className="w-4 h-4 mr-2" /> Confirm
                                                </Button>
                                                <Button size="sm" variant="destructive" onClick={() => updateStatus(booking.id, 'cancelled')}>
                                                    <XCircle className="w-4 h-4 mr-2" /> Reject
                                                </Button>
                                            </>
                                        )}
                                        {booking.status === 'confirmed' && (
                                            <Button size="sm" className="bg-blue-500 hover:bg-blue-600" onClick={() => {
                                                if (confirm("Confirm service completion? This will process payments and commissions.")) {
                                                    updateStatus(booking.id, 'completed');
                                                }
                                            }}>
                                                Mark Completed
                                            </Button>
                                        )}
                                        <Button size="sm" variant="outline" onClick={() => setViewingBooking(booking)}>
                                            View Details
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {bookings.length === 0 && <p className="text-center text-muted-foreground py-8">No bookings found.</p>}
                        </div>
                    </Card>
                </div>
            </div>


            {/* Booking Details Dialog */}
            <Dialog open={!!viewingBooking} onOpenChange={(open) => !open && setViewingBooking(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Booking #{viewingBooking?.id}</DialogTitle>
                        <DialogDescription>Service Details</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="flex items-center space-x-2">
                            <span className="font-semibold">Service:</span>
                            <span className="capitalize">{viewingBooking?.service_type}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="font-semibold">Status:</span>
                            <Badge variant={viewingBooking?.status === 'completed' ? 'default' : 'secondary'}>{viewingBooking?.status}</Badge>
                        </div>
                        <div>
                            <p className="font-semibold">Scheduled Date</p>
                            <p className="text-muted-foreground">{viewingBooking?.scheduled_date && new Date(viewingBooking.scheduled_date).toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Customer</p>
                            <p className="text-muted-foreground">Name: {viewingBooking?.user?.name || "N/A"}</p>
                            <p className="text-muted-foreground">Email: {viewingBooking?.user?.email || "N/A"}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Notes</p>
                            <p className="text-muted-foreground">{viewingBooking?.notes || "No additional notes."}</p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div >
    );
};

export default ProviderDashboard;
