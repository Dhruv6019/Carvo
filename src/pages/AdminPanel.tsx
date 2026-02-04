import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigation } from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Users,
  Car,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Ticket,
  ChevronLeft,
  ChevronRight,
  Puzzle,
  ChevronDown,
  Settings,
  FileText,
  Calendar,
  CheckCircle,
  FileCode,
  Image as ImageIcon
} from "lucide-react";
import api from "@/lib/api";
import { exportToCSV } from "@/lib/utils";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RevenueChart } from "@/components/Admin/RevenueChart";
import { ModulesView } from "@/components/Admin/ModulesView";
import { AddModuleUserModal } from "@/components/Admin/AddModuleUserModal";
import { GalleryManagement } from "@/components/Admin/GalleryManagement";

export const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [revenuePeriod, setRevenuePeriod] = useState("month");
  const [analytics, setAnalytics] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);

  // ... (other states)

  // Fetch Revenue specific effect
  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await api.get(`/admin/analytics/revenue?period=${revenuePeriod.toLowerCase()}`);
        setRevenueTrend(res.data);
      } catch (error) {
        console.error("Failed to fetch revenue trend");
      }
    };
    fetchRevenue();
  }, [revenuePeriod]);


  const [cars, setCars] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [customizations, setCustomizations] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [quotations, setQuotations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingOrder, setViewingOrder] = useState<any>(null);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editingCar, setEditingCar] = useState<any>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isCarModalOpen, setIsCarModalOpen] = useState(false);
  const [revenueTrend, setRevenueTrend] = useState<any[]>([]);
  const [usersPage, setUsersPage] = useState(1);
  const [carsPage, setCarsPage] = useState(1);
  const [ordersPage, setOrdersPage] = useState(1);
  const [couponsPage, setCouponsPage] = useState(1);
  const itemsPerPage = 10;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<any>(null);
  const [isModuleUserModalOpen, setIsModuleUserModalOpen] = useState(false);


  const handleAddModuleUser = () => {
    setEditingUser(null);
    setIsModuleUserModalOpen(true);
  };

  const handleEditModuleUser = (user: any) => {
    setEditingUser(user);
    setIsModuleUserModalOpen(true);
  };

  const [userFormData, setUserFormData] = useState({
    name: "",
    email: "",
    role: "customer",
    phone: ""
  });

  const [carFormData, setCarFormData] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    base_price: 0
  });

  // Settings State
  const [settings, setSettings] = useState({
    disableEmails: false,
    disablePush: false
  });

  const fetchSettings = async () => {
    try {
      const res = await api.get("/admin/settings");
      if (res.data) {
        const fetchedSettings = res.data;
        const newSettings = { disableEmails: false, disablePush: false };
        fetchedSettings.forEach((s: any) => {
          if (s.key === "DISABLE_EMAILS") newSettings.disableEmails = s.value === "true";
          if (s.key === "DISABLE_PUSH") newSettings.disablePush = s.value === "true";
        });
        setSettings(newSettings);
      }
    } catch (error) {
      console.error("Failed to fetch settings", error);
    }
  };

  const handleSettingChange = async (key: string, value: string) => {
    try {
      await api.put(`/admin/settings/${key}`, { value });
      setSettings(prev => ({
        ...prev,
        [key === "DISABLE_EMAILS" ? "disableEmails" : "disablePush"]: value === "true"
      }));
      toast.success("Settings updated");
    } catch (error) {
      toast.error("Failed to update settings");
    }
  };

  const [coupons, setCoupons] = useState<any[]>([]);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponFormData, setCouponFormData] = useState({
    code: "",
    discount_type: "percentage",
    discount_value: 0,
    min_order_value: 0,
    max_discount: 0,
    usage_limit: 0,
    expiry_date: ""
  });

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingUser) {
        await api.put(`/admin/users/${editingUser.id}`, userFormData);
        toast.success("User updated successfully");
      } else {
        await api.post("/admin/users", userFormData);
        toast.success("User created successfully");
      }
      setIsUserModalOpen(false);
      setEditingUser(null);
      // Refresh users
      const usersRes = await api.get("/admin/users");
      setUsers(usersRes.data);
    } catch (error) {
      toast.error("Failed to save user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveCar = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingCar) {
        await api.put(`/admin/cars/${editingCar.id}`, carFormData);
        toast.success("Car updated successfully");
      } else {
        await api.post("/admin/cars", carFormData);
        toast.success("Car created successfully");
      }
      setIsCarModalOpen(false);
      setEditingCar(null);
      // Refresh cars
      const carsRes = await api.get("/customer/cars");
      setCars(carsRes.data);
    } catch (error) {
      toast.error("Failed to save car");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    setIsDeleting({ type: 'user', id });
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error("Failed to delete user");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleDeleteCar = async (id: number) => {
    if (!confirm("Are you sure you want to delete this car?")) return;
    setIsDeleting({ type: 'car', id });
    try {
      await api.delete(`/admin/cars/${id}`);
      setCars(cars.filter(c => c.id !== id));
      toast.success("Car deleted successfully");
    } catch (error) {
      toast.error("Failed to delete car");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = { ...couponFormData };
      // Ensure numbers are numbers
      payload.discount_value = Number(payload.discount_value);
      payload.min_order_value = Number(payload.min_order_value);
      payload.max_discount = Number(payload.max_discount);
      payload.usage_limit = Number(payload.usage_limit);

      if (editingCoupon) {
        await api.put(`/coupons/${editingCoupon.id}`, payload);
        toast.success("Coupon updated successfully");
      } else {
        await api.post("/coupons", payload);
        toast.success("Coupon created successfully");
      }
      setIsCouponModalOpen(false);
      setEditingCoupon(null);
      // Refresh coupons
      const couponsRes = await api.get("/coupons");
      setCoupons(couponsRes.data);
    } catch (error) {
      toast.error("Failed to save coupon");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCoupon = async (id: number) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    setIsDeleting({ type: 'coupon', id });
    try {
      await api.delete(`/coupons/${id}`);
      setCoupons(coupons.filter(c => c.id !== id));
      toast.success("Coupon deleted successfully");
    } catch (error) {
      toast.error("Failed to delete coupon");
    } finally {
      setIsDeleting(null);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Analytics
        const analyticsRes = await api.get("/admin/analytics");
        setAnalytics(analyticsRes.data);

        // Fetch Users
        const usersRes = await api.get("/admin/users");
        setUsers(usersRes.data);

        // Fetch Cars (using public endpoint for now, or admin specific if created)
        const carsRes = await api.get("/customer/cars");
        setCars(carsRes.data);

        // Fetch Orders
        const ordersRes = await api.get("/admin/orders");
        setOrders(ordersRes.data);

        // Fetch Coupons
        const couponsRes = await api.get("/coupons");
        setCoupons(couponsRes.data);

        // Fetch Settings
        await fetchSettings();

        // Fetch Interactions
        const custRes = await api.get("/admin/customizations");
        setCustomizations(custRes.data);

        const bookRes = await api.get("/admin/bookings");
        setBookings(bookRes.data);

        const quoteRes = await api.get("/admin/quotations");
        setQuotations(quoteRes.data); // Assuming Quotations API is implemented or using same endpoint if combined

      } catch (error) {
        console.error("Error fetching admin data", error);
        toast.error("Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    { label: "Total Users", value: users.length.toString(), icon: Users, color: "text-blue-500" },
    { label: "Revenue", value: `₹${analytics?.dailyRevenue || 0}`, icon: DollarSign, color: "text-yellow-500" },
    { label: "Active Modules", value: users.filter(u => ['seller', 'delivery_boy', 'service_provider', 'support_agent'].includes(u.role)).length.toString(), icon: Puzzle, color: "text-emerald-500" },
    { label: "Active Bookings", value: analytics?.activeBookings?.toString() || "0", icon: ShoppingCart, color: "text-green-500" },
    { label: "Pending Quotes", value: analytics?.pendingQuotations?.toString() || "0", icon: Car, color: "text-purple-500" }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50/50 dark:bg-gray-900">
      <Navigation />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex pt-0">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 bottom-0 w-64 bg-background border-r z-50 hidden md:block overflow-y-auto pt-6 px-4 shadow-lg">
          <div className="mb-8 px-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-electric-blue to-burnt-orange bg-clip-text text-transparent">
              Admin Panel
            </h2>
            <p className="text-xs text-muted-foreground mt-1">Management Console</p>
          </div>

          <TabsList className="flex flex-col h-auto w-full bg-transparent p-0 space-y-2">
            <TabsTrigger value="dashboard" className="w-full justify-start px-4 py-3 h-auto text-base font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all rounded-lg">
              <TrendingUp className="w-5 h-5 mr-3" /> Dashboard
            </TabsTrigger>
            <TabsTrigger value="users" className="w-full justify-start px-4 py-3 h-auto text-base font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all rounded-lg">
              <Users className="w-5 h-5 mr-3" /> Users
            </TabsTrigger>
            <TabsTrigger value="modules" className="w-full justify-start px-4 py-3 h-auto text-base font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all rounded-lg">
              <Users className="w-5 h-5 mr-3" /> Modules
            </TabsTrigger>
            <TabsTrigger value="cars" className="w-full justify-start px-4 py-3 h-auto text-base font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all rounded-lg">
              <Car className="w-5 h-5 mr-3" /> Car Models
            </TabsTrigger>
            <TabsTrigger value="coupons" className="w-full justify-start px-4 py-3 h-auto text-base font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all rounded-lg">
              <Ticket className="w-5 h-5 mr-3" /> Coupons
            </TabsTrigger>
            <TabsTrigger value="orders" className="w-full justify-start px-4 py-3 h-auto text-base font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all rounded-lg">
              <ShoppingCart className="w-5 h-5 mr-3" /> Orders
            </TabsTrigger>
            <TabsTrigger value="settings" className="w-full justify-start px-4 py-3 h-auto text-base font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all rounded-lg">
              <Settings className="w-5 h-5 mr-3" /> Settings
            </TabsTrigger>

            <div className="pt-4 pb-2 px-4 text-xs font-semibold text-muted-foreground uppercase">Interactions</div>
            <TabsTrigger value="customizations" className="w-full justify-start px-4 py-3 h-auto text-base font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all rounded-lg">
              <FileCode className="w-5 h-5 mr-3" /> Customizations
            </TabsTrigger>
            <TabsTrigger value="bookings" className="w-full justify-start px-4 py-3 h-auto text-base font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all rounded-lg">
              <Calendar className="w-5 h-5 mr-3" /> Bookings
            </TabsTrigger>
            <TabsTrigger value="quotations" className="w-full justify-start px-4 py-3 h-auto text-base font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all rounded-lg">
              <FileText className="w-5 h-5 mr-3" /> Quotations
            </TabsTrigger>
          </TabsList>
        </aside>

        {/* Main Content */}
        <div className="flex-1 md:ml-64 px-8 pb-8 pt-28 overflow-x-hidden min-h-[calc(100vh-4rem)]">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Mobile Header (visible only on small screens) */}
            <div className="md:hidden mb-6">
              <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
            </div>

            <TabsContent value="dashboard" className="mt-0 space-y-6">
              <div className="mb-2">
                <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
                <p className="text-muted-foreground">Overview of your platform's performance</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {stats.map((stat, index) => (
                  <Card key={index} className="p-6 transition-all hover:shadow-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                        <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-800 ${stat.color.replace('text-', 'text-')}`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-foreground flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-electric-blue" />
                      Revenue Trend
                    </h3>
                    <div className="relative">
                      <select
                        value={revenuePeriod}
                        onChange={(e) => setRevenuePeriod(e.target.value)}
                        className="appearance-none bg-background border px-3 py-1.5 pr-8 rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                      >
                        <option value="month">Month</option>
                        <option value="week">Week</option>
                        <option value="year">Year</option>
                      </select>
                      <ChevronRight className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 rotate-90 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                  <div className="h-80 w-full">
                    <RevenueChart data={revenueTrend} />
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-6">Recent Users</h3>
                  <div className="space-y-4">
                    {users.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold mr-4">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="capitalize">
                          {user.role.replace('_', ' ')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users" className="mt-0 space-y-6">
              {/* ... existing Users content content with minimal changes, just ensuring spacing ... */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-foreground">Users</h2>
                  <p className="text-muted-foreground">Manage all registered users</p>
                </div>
                <div className="flex space-x-2 w-full md:w-auto">
                  {/* ... search & actions ... */}
                  <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" onClick={() => exportToCSV(users, "users")}>
                    <Download className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline">Export</span>
                  </Button>
                  <Button className="bg-electric-blue" onClick={() => {
                    setEditingUser(null);
                    setUserFormData({ name: "", email: "", role: "customer", phone: "" });
                    setIsUserModalOpen(true);
                  }}>
                    <Plus className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline">Add User</span>
                  </Button>
                </div>
              </div>

              <Card className="p-0 overflow-hidden border-none shadow-sm">
                {/* Users List rendered slightly better */}
                <div className="divide-y">
                  {users
                    .filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()))
                    .slice((usersPage - 1) * itemsPerPage, usersPage * itemsPerPage)
                    .map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="grid gap-1">
                            <p className="font-medium text-foreground leading-none">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant="outline" className="capitalize">{user.role.replace('_', ' ')}</Badge>
                          <div className="text-sm text-muted-foreground hidden lg:block">
                            {new Date(user.created_at).toLocaleDateString()}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => {
                              setEditingUser(user);
                              setUserFormData({ name: user.name, email: user.email, role: user.role, phone: user.phone || "" });
                              setIsUserModalOpen(true);
                            }}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={isDeleting?.type === 'user' && isDeleting?.id === user.id}
                            >
                              <Trash2 className={`w-4 h-4 ${isDeleting?.type === 'user' && isDeleting?.id === user.id ? 'animate-spin' : ''}`} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                {users.length > itemsPerPage && (
                  <div className="flex items-center justify-center space-x-2 p-4 border-t">
                    <Button variant="outline" size="sm" onClick={() => setUsersPage(p => Math.max(1, p - 1))} disabled={usersPage === 1}>
                      <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                    </Button>
                    <span className="text-sm">Page {usersPage}</span>
                    <Button variant="outline" size="sm" onClick={() => setUsersPage(p => p + 1)} disabled={usersPage * itemsPerPage >= users.length}>
                      Next <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="modules" className="mt-0 space-y-6">
              <ModulesView
                users={users}
                onAddUser={handleAddModuleUser}
                onEditUser={handleEditModuleUser}
              />
            </TabsContent>

            <TabsContent value="cars" className="mt-0 space-y-6">
              {/* ... Cars Layout similar improvements ... */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-foreground">Car Models</h2>
                  <p className="text-muted-foreground">Manage vehicle catalog</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => exportToCSV(cars, "car-models")}>
                    <Download className="w-4 h-4 mr-2" /> Export
                  </Button>
                  <Button className="bg-electric-blue" onClick={() => {
                    setEditingCar(null);
                    setCarFormData({ make: "", model: "", year: new Date().getFullYear(), base_price: 0 });
                    setIsCarModalOpen(true);
                  }}>
                    <Plus className="w-4 h-4 mr-2" /> Add Model
                  </Button>
                </div>
              </div>
              <Card className="p-0 overflow-hidden border-none shadow-sm">
                <div className="divide-y">
                  {cars.slice((carsPage - 1) * itemsPerPage, carsPage * itemsPerPage).map((car) => (
                    <div key={car.id} className="flex items-center justify-between p-4 hover:bg-gray-50/50">
                      <div className="grid gap-1">
                        <p className="font-medium text-foreground">{car.make} {car.model}</p>
                        <div className="flex gap-2 text-sm text-muted-foreground">
                          <span>{car.year}</span>
                          <span>•</span>
                          <span className="font-medium text-foreground">₹{car.base_price.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => {
                          setEditingCar(car);
                          setCarFormData({ make: car.make, model: car.model, year: car.year, base_price: car.base_price });
                          setIsCarModalOpen(true);
                        }}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50" onClick={() => handleDeleteCar(car.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Pagination ... */}
                {cars.length > itemsPerPage && (
                  <div className="flex items-center justify-center space-x-2 p-4 border-t">
                    <Button variant="outline" size="sm" onClick={() => setCarsPage(p => Math.max(1, p - 1))} disabled={carsPage === 1}>
                      <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                    </Button>
                    <span className="text-sm">Page {carsPage}</span>
                    <Button variant="outline" size="sm" onClick={() => setCarsPage(p => p + 1)} disabled={carsPage * itemsPerPage >= cars.length}>
                      Next <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="orders" className="mt-0 space-y-6">
              {/* ... Orders Layout ... */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-foreground">Orders</h2>
                  <p className="text-muted-foreground">Track and manage orders</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => {
                    const sorted = [...orders].sort((a, b) => b.total_amount - a.total_amount);
                    setOrders(sorted);
                    toast.info("Sorted by amount high to low");
                  }}>
                    <Filter className="w-4 h-4 mr-2" /> Sort
                  </Button>
                  <Button variant="outline" onClick={() => exportToCSV(orders, "orders")}>
                    <Download className="w-4 h-4 mr-2" /> Export
                  </Button>
                </div>
              </div>
              <Card className="p-0 overflow-hidden border-none shadow-sm">
                <div className="divide-y">
                  {orders.slice((ordersPage - 1) * itemsPerPage, ordersPage * itemsPerPage).map((order) => (
                    <div key={order.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-lg">#{order.id}</span>
                            <Badge variant={order.status === 'delivered' ? 'default' : order.status === 'cancelled' ? 'destructive' : 'secondary'} className="capitalize">
                              {order.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString()} • {order.items?.length || 0} items
                          </p>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="font-bold text-lg">₹{order.total_amount.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">{order.customer?.name || 'Unknown'}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => setViewingOrder(order)}>Details</Button>
                            <Button variant="outline" size="sm" onClick={async () => {
                              try {
                                const res = await api.post(`/invoices/${order.id}/generate`);
                                window.open(`/invoice/${res.data.id}`, '_blank');
                              } catch (err) {
                                toast.error("Failed to generate invoice");
                              }
                            }}>
                              <Ticket className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="coupons" className="mt-0 space-y-6">
              {/* ... Coupons Layout ... */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-foreground">Coupons</h2>
                  <p className="text-muted-foreground">Manage discounts and offers</p>
                </div>
                <Button className="bg-electric-blue" onClick={() => {
                  setEditingCoupon(null);
                  setCouponFormData({
                    code: "",
                    discount_type: "percentage",
                    discount_value: 0,
                    min_order_value: 0,
                    max_discount: 0,
                    usage_limit: 0,
                    expiry_date: ""
                  });
                  setIsCouponModalOpen(true);
                }}>
                  <Plus className="w-4 h-4 mr-2" /> Add Coupon
                </Button>
              </div>
              <Card className="p-0 overflow-hidden border-none shadow-sm">
                <div className="divide-y">
                  {coupons.slice((couponsPage - 1) * itemsPerPage, couponsPage * itemsPerPage).map((coupon) => (
                    <div key={coupon.id} className="flex items-center justify-between p-4 hover:bg-gray-50/50">
                      <div className="grid gap-1">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-lg text-primary">{coupon.code}</span>
                          <Badge variant={coupon.is_active ? "default" : "secondary"}>
                            {coupon.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {coupon.discount_type === 'percentage' ? `${coupon.discount_value}% off` : `₹${coupon.discount_value} off`}
                          • Used {coupon.used_count} / {coupon.usage_limit || '∞'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => {
                          setEditingCoupon(coupon);
                          setCouponFormData({ ...coupon, expiry_date: coupon.expiry_date ? new Date(coupon.expiry_date).toISOString().split('T')[0] : "" }); // Simplified
                          setIsCouponModalOpen(true);
                        }}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteCoupon(coupon.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="mt-0 space-y-6">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-foreground">Settings</h2>
                <p className="text-muted-foreground">Manage system-wide configurations</p>
              </div>

              <div className="grid gap-6">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Notification Preferences</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-base font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Email Notifications
                        </label>
                        <p className="text-sm text-muted-foreground">
                          Enable or disable all outgoing system emails (OTP, Welcome, Orders).
                        </p>
                      </div>
                      <Switch
                        checked={!settings.disableEmails}
                        onCheckedChange={(checked) => handleSettingChange("DISABLE_EMAILS", (!checked).toString())}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-base font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Push Notifications
                        </label>
                        <p className="text-sm text-muted-foreground">
                          Enable or disable system-wide push notifications.
                        </p>
                      </div>
                      <Switch
                        checked={!settings.disablePush}
                        onCheckedChange={(checked) => handleSettingChange("DISABLE_PUSH", (!checked).toString())}
                      />
                    </div>
                  </div>
                </Card>
              </div>

              <div className="mt-8">
                <GalleryManagement />
              </div>
            </TabsContent>


            {/* NEW INTERACTION TABS */}

            <TabsContent value="customizations" className="mt-0 space-y-6">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-foreground">Customizations</h2>
                <p className="text-muted-foreground">Review and acknowledge car configuration requests</p>
              </div>
              <Card className="p-0 overflow-hidden border-none shadow-sm">
                <div className="divide-y">
                  {customizations.length === 0 ? <div className="p-8 text-center text-muted-foreground">No customization requests found</div> :
                    customizations.map((cust) => (
                      <div key={cust.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{cust.name}</h3>
                              <Badge variant={cust.status === 'approved' ? 'default' : cust.status === 'reviewed' ? 'secondary' : 'outline'}>
                                {cust.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-foreground mb-1">Customer: <span className="font-medium">{cust.customer?.name}</span> ({cust.customer?.email})</p>
                            <p className="text-sm text-muted-foreground">Model: {cust.car?.make} {cust.car?.model}</p>

                            {/* Configuration Summary - Visual */}
                            <div className="mt-3 p-4 bg-white/50 dark:bg-black/20 border rounded-xl space-y-3">
                              {(() => {
                                try {
                                  const config = typeof cust.configuration === 'string'
                                    ? JSON.parse(cust.configuration)
                                    : cust.configuration;

                                  return (
                                    <>
                                      {config.colors && Array.isArray(config.colors) && config.colors.length > 0 && (
                                        <div className="flex items-center gap-3">
                                          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground w-16">Colors</span>
                                          <div className="flex gap-2">
                                            {config.colors.map((color: string, i: number) => (
                                              <div
                                                key={i}
                                                className="w-6 h-6 rounded-full border shadow-sm ring-1 ring-black/5"
                                                style={{ backgroundColor: color }}
                                                title={color}
                                              />
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {config.parts && Array.isArray(config.parts) && config.parts.length > 0 && (
                                        <div className="flex items-start gap-3">
                                          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground w-16 pt-1">Parts</span>
                                          <div className="flex flex-wrap gap-2">
                                            {config.parts.map((partId: number, i: number) => (
                                              <Badge key={i} variant="outline" className="bg-background">
                                                Part #{partId}
                                              </Badge>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {!config.colors?.length && !config.parts?.length && (
                                        <p className="text-sm text-muted-foreground italic">No specific configuration details</p>
                                      )}
                                    </>
                                  );
                                } catch (e) {
                                  return <pre className="whitespace-pre-wrap text-xs text-red-400">Error parsing config</pre>;
                                }
                              })()}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            {cust.status === 'pending' && (
                              <Button size="sm" onClick={async () => {
                                try {
                                  await api.put(`/admin/customizations/${cust.id}/status`, { status: 'reviewed' });
                                  toast.success("Marked as Reviewed");
                                  const res = await api.get("/admin/customizations");
                                  setCustomizations(res.data);
                                } catch (e) { toast.error("Failed to update status"); }
                              }}>
                                <CheckCircle className="w-4 h-4 mr-2" /> Acknowledge
                              </Button>
                            )}
                            {cust.status === 'reviewed' && (
                              <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700" onClick={async () => {
                                try {
                                  await api.put(`/admin/customizations/${cust.id}/status`, { status: 'approved' });
                                  toast.success("Approved Customization");
                                  const res = await api.get("/admin/customizations");
                                  setCustomizations(res.data);
                                } catch (e) { toast.error("Failed to update status"); }
                              }}>
                                Approve & Notify
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="bookings" className="mt-0 space-y-6">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-foreground">Service Bookings</h2>
                <p className="text-muted-foreground">Manage service appointments</p>
              </div>
              <Card className="p-0 overflow-hidden border-none shadow-sm">
                <div className="divide-y">
                  {bookings.length === 0 ? <div className="p-8 text-center text-muted-foreground">No bookings found</div> :
                    bookings.map((booking) => (
                      <div key={booking.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{booking.service_type}</h3>
                              <Badge variant={booking.status === 'confirmed' ? 'default' : booking.status === 'completed' ? 'secondary' : 'outline'}>
                                {booking.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-foreground mb-1">Customer: <span className="font-medium">{booking.customer?.name}</span></p>
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              <Calendar className="w-4 h-4" /> {new Date(booking.scheduled_date).toLocaleDateString()}
                            </p>
                            {booking.notes && <p className="text-sm text-muted-foreground mt-2 italic">"{booking.notes}"</p>}
                          </div>
                          <div className="flex flex-col gap-2">
                            {booking.status === 'pending' && (
                              <Button size="sm" onClick={async () => {
                                try {
                                  await api.put(`/admin/bookings/${booking.id}/status`, { status: 'confirmed' });
                                  toast.success("Booking Confirmed");
                                  const res = await api.get("/admin/bookings");
                                  setBookings(res.data);
                                } catch (e) { toast.error("Failed to update status"); }
                              }}>
                                <CheckCircle className="w-4 h-4 mr-2" /> Confirm
                              </Button>
                            )}
                            {booking.status === 'confirmed' && (
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={async () => {
                                if (confirm("Mark service as Completed? This will process provider commission and send invoice.")) {
                                  try {
                                    await api.put(`/admin/bookings/${booking.id}/status`, { status: 'completed' });
                                    toast.success("Service Completed! Commission Distributed.");
                                    const res = await api.get("/admin/bookings");
                                    setBookings(res.data);
                                  } catch (e) { toast.error("Failed to complete service"); }
                                }
                              }}>
                                <CheckCircle className="w-4 h-4 mr-2" /> Mark Done
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="quotations" className="mt-0 space-y-6">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-foreground">Payment Requests</h2>
                <p className="text-muted-foreground">Handle payment overview requests and quotations</p>
              </div>
              <Card className="p-0 overflow-hidden border-none shadow-sm">
                <div className="divide-y">
                  {quotations.length === 0 ? <div className="p-8 text-center text-muted-foreground">No quotation requests found</div> :
                    quotations.map((quote) => (
                      <div key={quote.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">Quote #{quote.id}</h3>
                              <Badge variant={quote.status === 'accepted' ? 'secondary' : quote.status === 'completed' ? 'default' : 'outline'}>
                                {quote.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-foreground mb-1">For Customization: <strong>{quote.customization?.name || 'N/A'}</strong></p>
                            <p className="text-sm text-muted-foreground">Customer: {quote.customer?.name}</p>
                            {quote.estimated_price && <p className="text-lg font-bold text-green-600 mt-2">Est. Price: ₹{Number(quote.estimated_price).toLocaleString()}</p>}
                          </div>
                          <div className="flex flex-col gap-2">
                            {quote.status === 'pending' && (
                              <Button size="sm" onClick={async () => {
                                const price = prompt("Enter estimated price for this quote:");
                                if (price) {
                                  try {
                                    await api.put(`/admin/quotations/${quote.id}/status`, { status: 'accepted', estimated_price: parseFloat(price) });
                                    toast.success("Quotation Sent");
                                    const res = await api.get("/admin/quotations");
                                    setQuotations(res.data);
                                  } catch (e) { toast.error("Failed to send quote"); }
                                }
                              }}>
                                <DollarSign className="w-4 h-4 mr-2" /> Send Quote
                              </Button>
                            )}
                            {quote.status === 'accepted' && (
                              <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={async () => {
                                if (confirm("Mark this as Completed? This will record payment, distribute commissions, and send invoice.")) {
                                  try {
                                    await api.put(`/admin/quotations/${quote.id}/status`, { status: 'completed' });
                                    toast.success("Marked Completed! Commission Distributed.");
                                    const res = await api.get("/admin/quotations");
                                    setQuotations(res.data);
                                  } catch (e) { toast.error("Failed to complete"); }
                                }
                              }}>
                                <CheckCircle className="w-4 h-4 mr-2" /> Mark Completed
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </Card>
            </TabsContent>

          </div>
        </div>
      </Tabs>

      {/* ... Modals (keep generic) ... */}

      <AddModuleUserModal
        isOpen={isModuleUserModalOpen}
        onClose={() => setIsModuleUserModalOpen(false)}
        onSuccess={async () => {
          const usersRes = await api.get("/admin/users");
          setUsers(usersRes.data);
        }}
        userToEdit={editingUser}
      />
      <Dialog open={isCouponModalOpen} onOpenChange={setIsCouponModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCoupon ? "Edit Coupon" : "Add Coupon"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveCoupon} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Coupon Code</label>
              <Input
                required
                value={couponFormData.code}
                onChange={(e) => setCouponFormData({ ...couponFormData, code: e.target.value.toUpperCase() })}
                placeholder="SUMMER25"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <select
                  className="w-full p-2 border rounded-md bg-transparent"
                  value={couponFormData.discount_type}
                  onChange={(e) => setCouponFormData({ ...couponFormData, discount_type: e.target.value })}
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Value</label>
                <Input
                  required
                  type="number"
                  value={couponFormData.discount_value}
                  onChange={(e) => setCouponFormData({ ...couponFormData, discount_value: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Min Order (₹)</label>
                <Input
                  type="number"
                  value={couponFormData.min_order_value}
                  onChange={(e) => setCouponFormData({ ...couponFormData, min_order_value: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Max Disc (₹)</label>
                <Input
                  type="number"
                  value={couponFormData.max_discount}
                  onChange={(e) => setCouponFormData({ ...couponFormData, max_discount: Number(e.target.value) })}
                  disabled={couponFormData.discount_type === 'fixed'}
                  placeholder={couponFormData.discount_type === 'fixed' ? "N/A" : "Unlimited"}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Usage Limit</label>
                <Input
                  type="number"
                  value={couponFormData.usage_limit}
                  onChange={(e) => setCouponFormData({ ...couponFormData, usage_limit: Number(e.target.value) })}
                  placeholder="0 for unlimited"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Expiry Date</label>
                <Input
                  type="date"
                  value={couponFormData.expiry_date}
                  onChange={(e) => setCouponFormData({ ...couponFormData, expiry_date: e.target.value })}
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-electric-blue" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Coupon"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPanel;