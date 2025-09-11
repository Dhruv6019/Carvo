import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Download, 
  Share2, 
  Save, 
  ShoppingCart,
  Car,
  Palette,
  Settings
} from "lucide-react";

export const LivePreview = () => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [selectedView, setSelectedView] = useState("front");

  const views = [
    { id: "front", name: "Front View" },
    { id: "side", name: "Side View" },
    { id: "rear", name: "Rear View" },
    { id: "interior", name: "Interior" }
  ];

  const modifications = [
    { category: "Paint", item: "Matte Black", price: "$1,200" },
    { category: "Wheels", item: "20\" Carbon Rims", price: "$3,500" },
    { category: "Interior", item: "Red Leather Seats", price: "$2,800" },
    { category: "Performance", item: "Cold Air Intake", price: "$450" }
  ];

  const totalPrice = "$7,950";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-background">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-display font-black text-foreground mb-4">
              Live <span className="bg-gradient-to-r from-electric-blue to-burnt-orange bg-clip-text text-transparent">Preview</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              See your modifications in real-time
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Preview Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* View Controls */}
              <div className="flex flex-wrap gap-2 justify-center">
                {views.map((view) => (
                  <Button
                    key={view.id}
                    variant={selectedView === view.id ? "default" : "outline"}
                    onClick={() => setSelectedView(view.id)}
                    className={selectedView === view.id ? "bg-electric-blue" : ""}
                  >
                    {view.name}
                  </Button>
                ))}
              </div>

              {/* Main Preview */}
              <Card className="p-8">
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl flex items-center justify-center relative overflow-hidden">
                  <div className="text-center text-muted-foreground">
                    <Car className="w-24 h-24 mx-auto mb-4 text-electric-blue" />
                    <p className="text-lg font-medium">3D Car Preview</p>
                    <p className="text-sm">Interactive 360° view with your modifications</p>
                  </div>
                  
                  {/* Zoom Level Indicator */}
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary">{zoomLevel}%</Badge>
                  </div>
                </div>

                {/* Preview Controls */}
                <div className="flex justify-center items-center space-x-4 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setZoomLevel(Math.max(50, zoomLevel - 25))}
                    disabled={zoomLevel <= 50}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setZoomLevel(100)}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}
                    disabled={zoomLevel >= 200}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-center">
                <Button variant="outline" className="border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Download Image
                </Button>
                <Button variant="outline" className="border-burnt-orange text-burnt-orange hover:bg-burnt-orange hover:text-white">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Build
                </Button>
                <Button className="bg-gradient-to-r from-electric-blue to-electric-blue-dark">
                  <Save className="w-4 h-4 mr-2" />
                  Save Configuration
                </Button>
              </div>
            </div>

            {/* Modifications Summary */}
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-xl font-display font-bold text-foreground mb-4 flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-electric-blue" />
                  Current Modifications
                </h3>
                
                <div className="space-y-4">
                  {modifications.map((mod, index) => (
                    <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div>
                        <p className="font-medium text-foreground">{mod.item}</p>
                        <p className="text-sm text-muted-foreground">{mod.category}</p>
                      </div>
                      <p className="font-semibold text-electric-blue">{mod.price}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-border">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-foreground">Total:</span>
                    <span className="text-electric-blue">{totalPrice}</span>
                  </div>
                </div>
              </Card>

              {/* Vehicle Info */}
              <Card className="p-6">
                <h3 className="text-lg font-display font-bold text-foreground mb-4 flex items-center">
                  <Car className="w-5 h-5 mr-2 text-electric-blue" />
                  Vehicle Details
                </h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Make:</span>
                    <span className="text-foreground font-medium">BMW</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Model:</span>
                    <span className="text-foreground font-medium">M3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Year:</span>
                    <span className="text-foreground font-medium">2023</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Variant:</span>
                    <span className="text-foreground font-medium">Competition</span>
                  </div>
                </div>
              </Card>

              {/* Get Quote Button */}
              <Button size="lg" className="w-full bg-gradient-to-r from-burnt-orange to-burnt-orange-dark text-white font-semibold py-4 rounded-xl text-lg hover:shadow-lg hover:scale-105 transition-all duration-300">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Get Quote
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivePreview;