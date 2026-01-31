import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, User } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

const SupportDashboard = () => {
    const [complaints, setComplaints] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                // Assuming endpoint exists or using generic get
                // If SupportController.getComplaints exists and is mapped
                const res = await api.get("/support/complaints");
                setComplaints(res.data);
            } catch (error) {
                console.error("Error fetching complaints", error);
                toast.error("Failed to load complaints");
            } finally {
                setLoading(false);
            }
        };

        fetchComplaints();
    }, []);

    const resolveComplaint = async (id: number) => {
        try {
            await api.patch(`/support/complaints/${id}/status`, { status: 'resolved' });
            toast.success("Complaint resolved");
            setComplaints(complaints.map(c => c.id === id ? { ...c, status: 'resolved' } : c));
        } catch (error) {
            toast.error("Failed to resolve complaint");
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-background">
            <Navigation />

            <div className="pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-4xl font-display font-black text-foreground mb-4">
                            Support <span className="bg-gradient-to-r from-electric-blue to-burnt-orange bg-clip-text text-transparent">Dashboard</span>
                        </h1>
                        <p className="text-xl text-muted-foreground">Manage customer support tickets</p>
                    </div>

                    <Card className="p-6">
                        <h2 className="text-2xl font-semibold text-foreground mb-6">Open Tickets</h2>
                        <div className="space-y-4">
                            {complaints.map((ticket) => (
                                <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-start space-x-4">
                                        <MessageSquare className="w-6 h-6 text-electric-blue mt-1" />
                                        <div>
                                            <p className="font-medium text-foreground">{ticket.subject}</p>
                                            <p className="text-sm text-muted-foreground">{ticket.description}</p>
                                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                                                <User className="w-4 h-4 mr-1" />
                                                Customer ID: {ticket.customerId}
                                            </div>
                                            <Badge variant={ticket.status === 'resolved' ? 'default' : 'destructive'} className="mt-2">
                                                {ticket.status}
                                            </Badge>
                                        </div>
                                    </div>
                                    {ticket.status !== 'resolved' && (
                                        <Button onClick={() => resolveComplaint(ticket.id)}>Resolve</Button>
                                    )}
                                </div>
                            ))}
                            {complaints.length === 0 && <p className="text-center text-muted-foreground py-8">No open tickets.</p>}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SupportDashboard;
