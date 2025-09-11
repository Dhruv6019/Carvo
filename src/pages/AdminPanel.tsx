import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigation } from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Download
} from "lucide-react";

export const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");

  const stats = [
    { label: "Total Users", value: "2,456", icon: Users, color: "text-blue-500" },
    { label: "Active Orders", value: "142", icon: ShoppingCart, color: "text-green-500" },
    { label: "Car Models", value: "89", icon: Car, color: "text-purple-500" },
    { label: "Revenue", value: "$145,320", icon: DollarSign, color: "text-yellow-500" }
  ];

  const recentOrders = [
    {
      id: "ORD-001",
      customer: "John Doe",
      vehicle: "BMW M3",
      status: "In Progress",
      total: "$7,950",
      date: "2024-01-20"
    },
    {
      id: "ORD-002",
      customer: "Jane Smith", 
      vehicle: "Audi RS6",
      status: "Completed",
      total: "$12,340",
      date: "2024-01-19"
    },
    {
      id: "ORD-003",
      customer: "Mike Johnson",
      vehicle: "Porsche 911",
      status: "Pending",
      total: "$15,680",
      date: "2024-01-18"
    }
  ];

  const carModels = [
    {
      id: 1,
      brand: "BMW",
      model: "M3",
      year: "2023",
      variants: 3,
      modifications: 24,
      status: "Active"
    },
    {
      id: 2,
      brand: "Mercedes",
      model: "AMG GT",
      year: "2023",
      variants: 2,
      modifications: 18,
      status: "Active"
    },
    {
      id: 3,
      brand: "Audi",
      model: "RS6",
      year: "2023",
      variants: 4,
      modifications: 31,
      status: "Active"
    }
  ];

  const modifications = [
    {
      id: 1,
      name: "Matte Black Paint",
      category: "Paint",
      price: "$1,200",
      compatibility: "Universal",
      status: "Active"
    },
    {
      id: 2,
      name: "Carbon Fiber Wheels",
      category: "Wheels",
      price: "$3,500",
      compatibility: "BMW, Audi",
      status: "Active"
    },
    {
      id: 3,
      name: "Sport Interior Package",
      category: "Interior",
      price: "$2,800",
      compatibility: "Premium Cars",
      status: "Active"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-background">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-display font-black text-foreground mb-4">
              Admin <span className="bg-gradient-to-r from-electric-blue to-burnt-orange bg-clip-text text-transparent">Panel</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Manage your car modification platform
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="cars">Car Models</TabsTrigger>
              <TabsTrigger value="modifications">Modifications</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>

            {/* Dashboard Overview */}
            <TabsContent value="dashboard" className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <Card key={index} className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      </div>
                      <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </Card>
                ))}
              </div>

              {/* Charts & Recent Activity */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-electric-blue" />
                    Revenue Trend
                  </h3>
                  <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Chart Component Here</p>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Recent Orders</h3>
                  <div className="space-y-3">
                    {recentOrders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                        <div>
                          <p className="font-medium text-foreground">{order.id}</p>
                          <p className="text-sm text-muted-foreground">{order.customer} - {order.vehicle}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={order.status === "Completed" ? "default" : "secondary"}>
                            {order.status}
                          </Badge>
                          <p className="text-sm font-medium text-foreground mt-1">{order.total}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Orders Management */}
            <TabsContent value="orders" className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>

              <Card className="p-6">
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="grid grid-cols-4 gap-4 flex-1">
                        <div>
                          <p className="font-medium text-foreground">{order.id}</p>
                          <p className="text-sm text-muted-foreground">{order.date}</p>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{order.customer}</p>
                          <p className="text-sm text-muted-foreground">{order.vehicle}</p>
                        </div>
                        <div>
                          <Badge variant={order.status === "Completed" ? "default" : "secondary"}>
                            {order.status}
                          </Badge>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{order.total}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Car Models Management */}
            <TabsContent value="cars" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-foreground">Car Models</h2>
                <Button className="bg-electric-blue">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Model
                </Button>
              </div>

              <Card className="p-6">
                <div className="space-y-4">
                  {carModels.map((car) => (
                    <div key={car.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="grid grid-cols-5 gap-4 flex-1">
                        <div>
                          <p className="font-medium text-foreground">{car.brand}</p>
                          <p className="text-sm text-muted-foreground">{car.model}</p>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{car.year}</p>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{car.variants} variants</p>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{car.modifications} mods</p>
                        </div>
                        <div>
                          <Badge variant="default">{car.status}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Modifications Management */}
            <TabsContent value="modifications" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-foreground">Modifications</h2>
                <Button className="bg-electric-blue">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Modification
                </Button>
              </div>

              <Card className="p-6">
                <div className="space-y-4">
                  {modifications.map((mod) => (
                    <div key={mod.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="grid grid-cols-5 gap-4 flex-1">
                        <div>
                          <p className="font-medium text-foreground">{mod.name}</p>
                          <p className="text-sm text-muted-foreground">{mod.category}</p>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{mod.price}</p>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{mod.compatibility}</p>
                        </div>
                        <div>
                          <Badge variant="default">{mod.status}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Users Management */}
            <TabsContent value="users" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-foreground">Users</h2>
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button className="bg-electric-blue">
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </div>

              <Card className="p-6">
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="w-16 h-16 mx-auto mb-4" />
                  <p>User management interface would go here</p>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;