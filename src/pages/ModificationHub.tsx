import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import { 
  Palette, 
  Settings, 
  Zap, 
  Shield, 
  Lightbulb, 
  Wind,
  ShoppingCart,
  Heart,
  Eye,
  Plus
} from "lucide-react";

export const ModificationHub = () => {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState(new Set());

  const modCategories = [
    { id: "paint", label: "Paint", icon: Palette },
    { id: "wheels", label: "Alloys", icon: Settings },
    { id: "interior", label: "Interior", icon: Shield },
    { id: "performance", label: "Performance", icon: Zap },
    { id: "lighting", label: "Lighting", icon: Lightbulb },
    { id: "aerodynamics", label: "Aero", icon: Wind }
  ];

  const paintOptions = [
    { id: 1, name: "Midnight Black", price: 1299, color: "#1a1a1a", finish: "Matte", popular: true },
    { id: 2, name: "Racing Red", price: 1399, color: "#dc2626", finish: "Gloss", popular: true },
    { id: 3, name: "Electric Blue", price: 1599, color: "#2563eb", finish: "Metallic", popular: false },
    { id: 4, name: "Pearl White", price: 1199, color: "#f8fafc", finish: "Pearl", popular: true },
    { id: 5, name: "Sunset Orange", price: 1699, color: "#ea580c", finish: "Matte", popular: false },
    { id: 6, name: "Forest Green", price: 1599, color: "#059669", finish: "Metallic", popular: false }
  ];

  const wheelOptions = [
    { id: 1, name: "Apex Racing Wheels", price: 2499, size: "19\"", style: "Forged", image: "/api/placeholder/300/300" },
    { id: 2, name: "Carbon Fiber Rims", price: 3999, size: "20\"", style: "Carbon", image: "/api/placeholder/300/300" },
    { id: 3, name: "Chrome Alloys", price: 1899, size: "18\"", style: "Chrome", image: "/api/placeholder/300/300" },
    { id: 4, name: "Matte Black Wheels", price: 2199, size: "19\"", style: "Matte", image: "/api/placeholder/300/300" }
  ];

  const toggleFavorite = (itemId, category) => {
    const key = `${category}-${itemId}`;
    const newFavorites = new Set(favorites);
    if (newFavorites.has(key)) {
      newFavorites.delete(key);
    } else {
      newFavorites.add(key);
    }
    setFavorites(newFavorites);
  };

  const addToCart = (item, category) => {
    setCart(prev => [...prev, { ...item, category }]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-background">
      <Navigation />
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-display font-black text-foreground mb-6">
            Modification <span className="bg-gradient-to-r from-electric-blue to-burnt-orange bg-clip-text text-transparent">Hub</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore thousands of premium modifications and see them live on your vehicle
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Modification Categories */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="paint" className="space-y-8">
              {/* Category Tabs */}
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto p-1 bg-gray-100 dark:bg-gray-800">
                {modCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <TabsTrigger
                      key={category.id}
                      value={category.id}
                      className="flex flex-col items-center space-y-2 p-4 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs font-medium">{category.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {/* Paint Options */}
              <TabsContent value="paint" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-display font-bold text-foreground">Paint Options</h2>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Mode
                  </Button>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paintOptions.map((paint) => (
                    <Card key={paint.id} className="p-6 hover:shadow-lg transition-all duration-300 group">
                      <div className="space-y-4">
                        {/* Color Preview */}
                        <div className="relative">
                          <div 
                            className="w-full h-32 rounded-lg shadow-inner"
                            style={{ backgroundColor: paint.color }}
                          />
                          {paint.popular && (
                            <Badge className="absolute top-2 left-2 bg-electric-blue text-white">
                              Popular
                            </Badge>
                          )}
                          <Button
                            size="icon"
                            variant="ghost"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => toggleFavorite(paint.id, 'paint')}
                          >
                            <Heart 
                              className={`w-4 h-4 ${
                                favorites.has(`paint-${paint.id}`) 
                                  ? 'fill-red-500 text-red-500' 
                                  : 'text-gray-400'
                              }`} 
                            />
                          </Button>
                        </div>
                        
                        {/* Paint Info */}
                        <div className="space-y-2">
                          <h3 className="font-semibold text-foreground">{paint.name}</h3>
                          <p className="text-sm text-muted-foreground">{paint.finish} finish</p>
                          <p className="text-lg font-bold text-electric-blue">${paint.price}</p>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => addToCart(paint, 'paint')}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Wheels Options */}
              <TabsContent value="wheels" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-display font-bold text-foreground">Alloy Wheels</h2>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Filter by Size</Button>
                    <Button variant="outline" size="sm">Filter by Brand</Button>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wheelOptions.map((wheel) => (
                    <Card key={wheel.id} className="p-6 hover:shadow-lg transition-all duration-300 group">
                      <div className="space-y-4">
                        {/* Wheel Image */}
                        <div className="relative">
                          <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                            <Settings className="w-16 h-16 text-gray-400" />
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => toggleFavorite(wheel.id, 'wheels')}
                          >
                            <Heart 
                              className={`w-4 h-4 ${
                                favorites.has(`wheels-${wheel.id}`) 
                                  ? 'fill-red-500 text-red-500' 
                                  : 'text-gray-400'
                              }`} 
                            />
                          </Button>
                        </div>
                        
                        {/* Wheel Info */}
                        <div className="space-y-2">
                          <h3 className="font-semibold text-foreground">{wheel.name}</h3>
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>{wheel.size}</span>
                            <span>{wheel.style}</span>
                          </div>
                          <p className="text-lg font-bold text-electric-blue">${wheel.price}</p>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => addToCart(wheel, 'wheels')}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Other tabs content would be similar */}
              <TabsContent value="interior">
                <div className="text-center py-16">
                  <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Interior Options</h3>
                  <p className="text-muted-foreground">Coming Soon</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Shopping Cart Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 sticky top-24">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-lg text-foreground">Cart Summary</h3>
                  <ShoppingCart className="w-5 h-5 text-electric-blue" />
                </div>
                
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-muted-foreground">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item, index) => (
                      <div key={index} className="flex justify-between items-start p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <p className="font-medium text-sm text-foreground">{item.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{item.category}</p>
                        </div>
                        <p className="font-semibold text-electric-blue">${item.price}</p>
                      </div>
                    ))}
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-semibold text-foreground">Total:</span>
                        <span className="font-bold text-lg text-electric-blue">
                          ${cart.reduce((sum, item) => sum + item.price, 0)}
                        </span>
                      </div>
                      <Button className="w-full bg-gradient-to-r from-electric-blue to-electric-blue-dark text-white">
                        Get Quote
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModificationHub;
