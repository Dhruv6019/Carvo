import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigation } from "@/components/Navigation";
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
  Share2
} from "lucide-react";

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("builds");

  const savedBuilds = [
    {
      id: 1,
      name: "BMW M3 Competition",
      image: "/placeholder.svg",
      modifications: ["Matte Black Paint", "Carbon Wheels", "Sport Interior"],
      price: "$7,950",
      date: "2024-01-15",
      status: "Draft"
    },
    {
      id: 2,
      name: "Audi RS6 Avant",
      image: "/placeholder.svg",
      modifications: ["Nardo Grey", "20\" Alloys", "Carbon Spoiler"],
      price: "$5,420",
      date: "2024-01-10",
      status: "Quoted"
    }
  ];

  const orders = [
    {
      id: "ORD-001",
      vehicle: "BMW M3 Competition",
      status: "In Progress",
      date: "2024-01-20",
      completion: "65%",
      total: "$7,950"
    },
    {
      id: "ORD-002",
      vehicle: "Mercedes AMG GT",
      status: "Completed",
      date: "2023-12-15",
      completion: "100%",
      total: "$12,340"
    }
  ];

  const quotes = [
    {
      id: "QUO-001",
      vehicle: "Porsche 911 Turbo",
      modifications: 5,
      status: "Pending",
      date: "2024-01-22",
      total: "$15,680"
    },
    {
      id: "QUO-002",
      vehicle: "Tesla Model S",
      modifications: 3,
      status: "Approved",
      date: "2024-01-18",
      total: "$4,200"
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
              My <span className="bg-gradient-to-r from-electric-blue to-burnt-orange bg-clip-text text-transparent">Dashboard</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Manage your builds, orders, and account
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 text-center">
              <Car className="w-8 h-8 text-electric-blue mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">3</p>
              <p className="text-sm text-muted-foreground">Saved Builds</p>
            </Card>
            <Card className="p-6 text-center">
              <Clock className="w-8 h-8 text-burnt-orange mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">2</p>
              <p className="text-sm text-muted-foreground">Active Orders</p>
            </Card>
            <Card className="p-6 text-center">
              <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">12</p>
              <p className="text-sm text-muted-foreground">Favorites</p>
            </Card>
            <Card className="p-6 text-center">
              <Settings className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">$25K</p>
              <p className="text-sm text-muted-foreground">Total Spent</p>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="builds">Saved Builds</TabsTrigger>
              <TabsTrigger value="orders">My Orders</TabsTrigger>
              <TabsTrigger value="quotes">Quote Requests</TabsTrigger>
              <TabsTrigger value="profile">Profile Settings</TabsTrigger>
            </TabsList>

            {/* Saved Builds */}
            <TabsContent value="builds" className="space-y-6">
              <div className="grid gap-6">
                {savedBuilds.map((build) => (
                  <Card key={build.id} className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center">
                          <Car className="w-8 h-8 text-electric-blue" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{build.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {build.modifications.join(", ")}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={build.status === "Draft" ? "secondary" : "default"}>
                              {build.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">{build.date}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <p className="text-lg font-bold text-electric-blue mr-4">{build.price}</p>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Orders */}
            <TabsContent value="orders" className="space-y-6">
              <div className="grid gap-6">
                {orders.map((order) => (
                  <Card key={order.id} className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">Order {order.id}</h3>
                        <p className="text-muted-foreground">{order.vehicle}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant={order.status === "Completed" ? "default" : "secondary"}>
                            {order.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{order.date}</span>
                          {order.status === "In Progress" && (
                            <span className="text-sm text-electric-blue">{order.completion} complete</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <p className="text-lg font-bold text-foreground">{order.total}</p>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Quote Requests */}
            <TabsContent value="quotes" className="space-y-6">
              <div className="grid gap-6">
                {quotes.map((quote) => (
                  <Card key={quote.id} className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">Quote {quote.id}</h3>
                        <p className="text-muted-foreground">{quote.vehicle}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant={quote.status === "Approved" ? "default" : "secondary"}>
                            {quote.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{quote.modifications} modifications</span>
                          <span className="text-sm text-muted-foreground">{quote.date}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <p className="text-lg font-bold text-foreground">{quote.total}</p>
                        <Button variant="outline" size="sm">
                          View Quote
                        </Button>
                        {quote.status === "Approved" && (
                          <Button className="bg-electric-blue">
                            Proceed to Order
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Profile Settings */}
            <TabsContent value="profile" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Personal Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">Full Name</label>
                      <p className="text-muted-foreground">John Doe</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Email</label>
                      <p className="text-muted-foreground">john.doe@email.com</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Phone</label>
                      <p className="text-muted-foreground">+1 (555) 123-4567</p>
                    </div>
                    <Button variant="outline" className="mt-4">
                      Edit Profile
                    </Button>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">Email Notifications</span>
                      <Button variant="outline" size="sm">
                        <Bell className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">Dark Mode</span>
                      <Button variant="outline" size="sm">
                        Toggle
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">Newsletter</span>
                      <Button variant="outline" size="sm">
                        Subscribe
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;