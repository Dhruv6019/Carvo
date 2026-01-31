import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
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
  Plus,
  Package
} from "lucide-react";
import { ThreeDCar } from "@/components/ThreeDCar";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { toast } from "sonner";

export const ModificationHub = () => {
  const [cart, setCart] = useState<any[]>([]);
  const [favorites, setFavorites] = useState(new Set());
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const carId = searchParams.get("carId");
  const brand = searchParams.get("brand");
  const model = searchParams.get("model");
  const year = searchParams.get("year");

  const [parts, setParts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string>("");

  useEffect(() => {
    const fetchParts = async () => {
      try {
        const response = await api.get("/customer/parts");
        setParts(response.data);
      } catch (error) {
        console.error("Error fetching parts", error);
      } finally {
        setLoading(false);
      }
    };
    fetchParts();
  }, []);

  // Map UI tabs to Database Categories
  const modCategories = [
    { id: "Paint", label: "Exterior", icon: Palette, dbCategories: ["Exterior", "Paint", "Body Kits"] }, // Group Body Kits here or separate? Keep separate as per UI
    { id: "Alloys", label: "Wheels & Alloys", icon: Settings, dbCategories: ["Wheels", "Wheels & Tires", "Alloys"] },
    { id: "Interior", label: "Interior", icon: Shield, dbCategories: ["Interior"] },
    { id: "Performance", label: "Performance", icon: Zap, dbCategories: ["Engine", "Engine Parts", "Exhaust Systems", "Brakes", "Suspension", "Performance"] },
    { id: "Lighting", label: "Lighting", icon: Lightbulb, dbCategories: ["Lighting"] },
    { id: "Body Kits", label: "Body Kits", icon: Wind, dbCategories: ["Body Kits"] }
  ];

  // Filter parts by mapped categories
  const filteredPartsByCategory = (tabId: string) => {
    const categoryDef = modCategories.find(c => c.id === tabId);
    if (!categoryDef) return [];

    return parts.filter(p => {
      const partCatName = p.category?.name || "";
      return categoryDef.dbCategories.includes(partCatName);
    });
  };

  const toggleFavorite = (itemId: any, category: string) => {
    const key = `${category}-${itemId}`;
    const newFavorites = new Set(favorites);
    if (newFavorites.has(key)) {
      newFavorites.delete(key);
    } else {
      newFavorites.add(key);
    }
    setFavorites(newFavorites);
  };

  const addToCart = (item: any, category: string) => {
    setCart(prev => [...prev, { ...item, category }]);
    toast.success(`${item.name} added to cart`);
  };

  const handleGetQuote = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    try {
      // Create customization first
      const customizationRes = await api.post("/customer/customizations", {
        carId: carId ? parseInt(carId) : 1, // Default to 1 if not present
        name: `${brand || 'My'} ${model || 'Car'} Build`,
        configuration: {
          parts: cart.map(item => item.id),
          colors: cart.filter(i => i.category === 'paint').map(i => i.color)
        }
      });

      // Then create quotation (if endpoint exists, or just notify success)
      // Then create quotation
      await api.post("/customer/quotations", { customizationId: customizationRes.data.id });

      toast.success("Quote request submitted successfully!");
      setCart([]);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting quote", error);
      toast.error("Failed to submit quote request");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-background">
      <Navigation />
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        {/* Header */}
        <div className="text-center mb-0 relative h-[50vh] w-full rounded-2xl overflow-hidden border border-border shadow-2xl bg-black">
          <ThreeDCar modelType={brand?.toLowerCase() === 'porsche' ? 'porsche' : brand?.toLowerCase() === 'mclaren' ? 'mclaren' : 'bmw'} color={selectedColor} />
          <div className="absolute top-4 left-4 z-10 pointer-events-none">
            <h1 className="text-4xl md:text-5xl font-display font-black text-white drop-shadow-md">
              Modification <span className="text-electric-blue">Hub</span>
            </h1>
            <p className="text-xl text-gray-200 mt-2 drop-shadow-md">
              Customizing {year} {brand} {model}
            </p>
          </div>
        </div>

        <div className="mt-8 grid lg:grid-cols-4 gap-8">
          {/* Modification Categories */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="Paint" className="space-y-8">
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

              {/* Dynamic Content for Each Category */}
              {modCategories.map((category) => (
                <TabsContent key={category.id} value={category.id} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-display font-bold text-foreground">{category.label} Options</h2>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPartsByCategory(category.id).map((part) => (
                      <Card key={part.id} className="p-6 hover:shadow-lg transition-all duration-300 group">
                        <div className="space-y-4">
                          {/* Part Image */}
                          <div className="relative">
                            <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
                              {part.image_url ? (
                                <img src={part.image_url} alt={part.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                              ) : (
                                <Settings className="w-16 h-16 text-gray-400 group-hover:rotate-90 transition-transform duration-500" />
                              )}
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => toggleFavorite(part.id, category.id)}
                            >
                              <Heart
                                className={`w-4 h-4 ${favorites.has(`${category.id}-${part.id}`)
                                  ? 'fill-red-500 text-red-500'
                                  : 'text-gray-400'
                                  }`}
                              />
                            </Button>
                          </div>

                          {/* Part Info */}
                          <div className="space-y-2">
                            <h3 className="font-semibold text-foreground">{part.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">{part.description || "Premium Performance Component"}</p>
                            <p className="text-lg font-bold text-electric-blue">₹{part.price}</p>
                          </div>

                          {/* Actions */}
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={() => addToCart(part, category.id)}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add to Build
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                    {filteredPartsByCategory(category.id).length === 0 && (
                      <div className="col-span-full py-12 text-center bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-muted-foreground italic">No parts found in the {category.label} category.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              ))}
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
                        <p className="font-semibold text-electric-blue">₹{item.price}</p>
                      </div>
                    ))}

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-semibold text-foreground">Total:</span>
                        <span className="font-bold text-lg text-electric-blue">
                          ₹{cart.reduce((sum, item) => sum + item.price, 0)}
                        </span>
                      </div>
                      <Button
                        className="w-full bg-gradient-to-r from-electric-blue to-electric-blue-dark text-white"
                        onClick={handleGetQuote}
                      >
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
      <Footer />
    </div>
  );
};

export default ModificationHub;
