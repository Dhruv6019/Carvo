import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import {
  Car,
  Heart,
  Clock,
  Settings,
  Bell,
  Edit,
  Trash2,
  Eye,
  Download,
  Share2,
  Wrench,
  MessageSquare,
  FileText
} from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { OrderHistory } from "@/components/OrderHistory";

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("builds");
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<any>(null);
  const [cancellingOrder, setCancellingOrder] = useState<any>(null);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: ""
  });

  // Sync form data when user loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: (user as any).phone || "",
        address: (user as any).address || ""
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, quotesRes, bookingsRes, complaintsRes] = await Promise.all([
          api.get("/orders/my-orders").catch(() => ({ data: [] })),
          api.get("/customer/quotations").catch(() => ({ data: [] })),
          api.get("/customer/bookings").catch(() => ({ data: [] })),
          api.get("/support/complaints").catch(() => ({ data: [] }))
        ]);

        setOrders(ordersRes.data);
        setQuotes(quotesRes.data);
        setBookings(bookingsRes.data);
        setComplaints(complaintsRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const { login } = useAuth(); // Need login to update context user

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.put("/users/profile", formData);
      // Update local user context
      const token = localStorage.getItem("accessToken");
      if (token) {
        login(token, res.data);
      }
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile", error);
      toast.error("Failed to update profile");
    }
  };

  const handleProceedToOrder = async (quote: any) => {
    try {
      const parts = quote.customization.configuration.parts || [];
      const items = parts.map((partId: any) => ({ partId, quantity: 1 }));

      await api.post("/orders", {
        items,
        shipping_address: (user as any)?.address || "123 Main St, City, Country"
      });

      toast.success("Order placed successfully!");
      // Refresh orders
      const ordersRes = await api.get("/orders/my-orders");
      setOrders(ordersRes.data);
      setActiveTab("orders");
    } catch (error) {
      console.error("Error placing order", error);
      toast.error("Failed to place order");
    }
  };

  const handleCancelOrder = async () => {
    if (!cancellingOrder) return;
    try {
      await api.post(`/orders/${cancellingOrder.id}/cancel`);
      toast.success("Order cancelled successfully");

      // Refresh orders
      const ordersRes = await api.get("/orders/my-orders");
      setOrders(ordersRes.data);
      setCancellingOrder(null);
    } catch (error) {
      console.error("Error cancelling order", error);
      toast.error("Failed to cancel order");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-background">
      <Navigation />

      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-display font-black text-foreground mb-4">
              My <span className="bg-gradient-to-r from-electric-blue to-burnt-orange bg-clip-text text-transparent">Dashboard</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Welcome back, {user?.name || "Driver"}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 text-center">
              <Car className="w-8 h-8 text-electric-blue mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{quotes.length}</p>
              <p className="text-sm text-muted-foreground">Quotes</p>
            </Card>
            <Card className="p-6 text-center">
              <Clock className="w-8 h-8 text-burnt-orange mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{orders.length}</p>
              <p className="text-sm text-muted-foreground">Active Orders</p>
            </Card>
            <Card className="p-6 text-center">
              <Wrench className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{bookings.length}</p>
              <p className="text-sm text-muted-foreground">Bookings</p>
            </Card>
            <Card className="p-6 text-center">
              <Settings className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">
                ₹{orders.reduce((acc, order) => acc + Number(order.total_amount || 0), 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total Spent</p>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="quotes">Quotes</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            {/* Quotes */}
            <TabsContent value="quotes" className="space-y-6">
              <div className="grid gap-6">
                {quotes.map((quote) => (
                  <Card key={quote.id} className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">Quote #{quote.id}</h3>
                        <p className="text-muted-foreground">{quote.customization?.name || "Custom Build"}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant={quote.status === "approved" ? "default" : "secondary"}>
                            {quote.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(quote.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        {quote.amount && <p className="text-lg font-bold text-foreground">₹{quote.amount}</p>}
                        {quote.status === "approved" && (
                          <Button className="bg-electric-blue" onClick={() => handleProceedToOrder(quote)}>
                            Proceed to Order
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
                {quotes.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No quotes found.</p>
                    <Button className="mt-4" onClick={() => window.location.href = '/customize'}>Start Building</Button>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Orders */}
            <TabsContent value="orders" className="space-y-6">
              <OrderHistory
                orders={orders}
                onViewDetails={(order) => setViewingOrder(order)}
                onDownloadInvoice={(orderId) => window.open(`/invoice/${orderId}`, '_blank')}
              />
            </TabsContent>

            <AlertDialog open={!!cancellingOrder} onOpenChange={(open) => !open && setCancellingOrder(null)}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently cancel order #{cancellingOrder?.id} and restock the items.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCancelOrder} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Yes, Cancel Order
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Bookings */}
            <TabsContent value="bookings" className="space-y-6">
              <div className="grid gap-6">
                {bookings.map((booking) => (
                  <Card key={booking.id} className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground capitalize">{booking.service_type} Service</h3>
                        <p className="text-muted-foreground">{new Date(booking.scheduled_date).toLocaleDateString()}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant={booking.status === "completed" ? "default" : "secondary"}>
                            {booking.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
                {bookings.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No bookings found.</p>
                    <Button className="mt-4" onClick={() => window.location.href = '/services'}>Book Service</Button>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Support/Complaints */}
            <TabsContent value="support" className="space-y-6">
              <div className="grid gap-6">
                {complaints.map((ticket) => (
                  <Card key={ticket.id} className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between space-y-4 md:space-y-0">
                      <div className="flex items-start space-x-4">
                        <MessageSquare className="w-6 h-6 text-electric-blue mt-1" />
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{ticket.subject}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{ticket.description}</p>
                          <div className="flex items-center space-x-3 mt-3">
                            <Badge variant={ticket.status === 'resolved' ? 'default' : 'destructive'}>
                              {ticket.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(ticket.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
                {complaints.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No feedback or complaints submitted.</p>
                    <Button className="mt-4" onClick={() => window.location.href = '/contact'}>Contact Support</Button>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Profile Settings */}
            <TabsContent value="profile" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
                    <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>

                  {isEditing ? (
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Full Name</label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Phone</label>
                        <Input
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Address</label>
                        <Input
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                      </div>
                      <div className="flex space-x-2 pt-2">
                        <Button type="submit" disabled={loading}>Save Changes</Button>
                        <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-foreground">Full Name</label>
                        <p className="text-muted-foreground">{user?.name || "N/A"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Email</label>
                        <p className="text-muted-foreground">{user?.email || "N/A"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Phone</label>
                        <p className="text-muted-foreground">{user?.phone || "N/A"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Address</label>
                        <p className="text-muted-foreground">{(user as any)?.address || "N/A"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Role</label>
                        <p className="text-muted-foreground capitalize">{user?.role || "N/A"}</p>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={!!viewingOrder} onOpenChange={(open) => !open && setViewingOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order #{viewingOrder?.id}</DialogTitle>
            <DialogDescription>Placed on {viewingOrder?.created_at && new Date(viewingOrder.created_at).toLocaleDateString()}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="font-semibold mb-2">Items:</p>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {viewingOrder?.items?.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between border-b pb-2">
                  <span>{item.part?.name || "Unknown Part"} (x{item.quantity})</span>
                  <span>₹{Number(item.price).toLocaleString()}</span>
                </div>
              ))}
              {!viewingOrder?.items && <p className="text-muted-foreground">No items details available.</p>}
            </div>
            <div className="mt-4 flex justify-between font-bold pt-2 border-t">
              <span>Total Amount</span>
              <span>₹{Number(viewingOrder?.total_amount).toLocaleString()}</span>
            </div>
            <div className="mt-4">
              <p className="text-sm font-semibold">Shipping Address</p>
              <p className="text-muted-foreground text-sm">{viewingOrder?.shipping_address}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
};

export default Dashboard;