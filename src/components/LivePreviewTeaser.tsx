import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RotateCcw, Maximize2, Download, Eye } from "lucide-react";
import { useState } from "react";

export const LivePreviewTeaser = () => {
  const [activeColor, setActiveColor] = useState("red");
  
  const colors = [
    { name: "red", value: "#ef4444", label: "Racing Red" },
    { name: "blue", value: "#3b82f6", label: "Electric Blue" },
    { name: "black", value: "#1f2937", label: "Midnight Black" },
    { name: "white", value: "#f9fafb", label: "Pearl White" },
    { name: "orange", value: "#f97316", label: "Sunset Orange" }
  ];

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Preview Demo */}
          <div className="space-y-8">
            <Card className="p-8 bg-white dark:bg-gray-900 shadow-xl">
              {/* Car Preview Area */}
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl flex items-center justify-center mb-6 relative overflow-hidden">
                {/* Simulated Car */}
                <div 
                  className="w-80 h-40 rounded-lg transition-all duration-500 flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: colors.find(c => c.name === activeColor)?.value }}
                >
                  <div className="text-center">
                    <Eye className="w-8 h-8 mx-auto mb-2" />
                    Live Preview
                  </div>
                </div>
                
                {/* Floating Controls */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button size="icon" variant="ghost" className="bg-white/80 hover:bg-white">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="bg-white/80 hover:bg-white">
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="bg-white/80 hover:bg-white">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Color Picker */}
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Choose Paint Color</h4>
                <div className="flex space-x-3">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setActiveColor(color.name)}
                      className={`w-12 h-12 rounded-lg border-2 transition-all duration-300 hover:scale-110 ${
                        activeColor === color.name 
                          ? 'border-electric-blue shadow-lg scale-110' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.label}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Selected: {colors.find(c => c.name === activeColor)?.label}
                </p>
              </div>
            </Card>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-display font-black text-foreground leading-tight">
                See Changes
                <br />
                <span className="bg-gradient-to-r from-electric-blue to-burnt-orange bg-clip-text text-transparent">
                  In Real-Time
                </span>
              </h2>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Our advanced 3D visualization technology lets you preview every modification 
                before committing. No surprises, just perfect results.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4">
              {[
                "360° rotation and zoom",
                "Realistic lighting and shadows",
                "Multiple angle views",
                "HD photo-quality renders",
                "Save and share configurations"
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-electric-blue to-burnt-orange rounded-full"></div>
                  <span className="text-foreground font-medium">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-electric-blue to-electric-blue-dark text-white font-semibold px-8 py-3 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Try Live Preview
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};