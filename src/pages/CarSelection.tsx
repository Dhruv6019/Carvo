import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navigation } from "@/components/Navigation";
import { Upload, ArrowRight, Car, Calendar, Settings } from "lucide-react";

export const CarSelection = () => {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedVariant, setSelectedVariant] = useState("");
  
  const carBrands = [
    "BMW", "Mercedes-Benz", "Audi", "Porsche", "Tesla", 
    "Toyota", "Honda", "Ford", "Chevrolet", "Nissan"
  ];
  
  const models = {
    "BMW": ["M3", "M4", "M5", "X5", "X6", "i8"],
    "Mercedes-Benz": ["AMG GT", "C63", "E63", "S63", "GLE", "GLS"],
    "Audi": ["RS6", "RS7", "R8", "Q7", "Q8", "TT"],
    "Porsche": ["911", "Cayenne", "Macan", "Panamera", "Taycan"],
    "Tesla": ["Model S", "Model 3", "Model X", "Model Y"]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-background">
      <Navigation />
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-display font-black text-foreground mb-6">
            Select Your <span className="bg-gradient-to-r from-electric-blue to-burnt-orange bg-clip-text text-transparent">Vehicle</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose your car model to start customizing. Our system supports hundreds of vehicles with precise fitment data.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Car Selection Form */}
          <Card className="p-8 space-y-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-display font-bold text-foreground flex items-center">
                <Car className="w-6 h-6 mr-3 text-electric-blue" />
                Vehicle Details
              </h2>
              
              {/* Brand Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Brand</label>
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select your car brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {carBrands.map((brand) => (
                      <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Model Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Model</label>
                <Select 
                  value={selectedModel} 
                  onValueChange={setSelectedModel}
                  disabled={!selectedBrand}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select your car model" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedBrand && models[selectedBrand]?.map((model) => (
                      <SelectItem key={model} value={model}>{model}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Year Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Year</label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 15 }, (_, i) => 2024 - i).map((year) => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Variant Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Variant</label>
                <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select variant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="base">Base Model</SelectItem>
                    <SelectItem value="sport">Sport Package</SelectItem>
                    <SelectItem value="premium">Premium Package</SelectItem>
                    <SelectItem value="performance">Performance Package</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Upload Option */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-px bg-border flex-1"></div>
                <span className="text-sm text-muted-foreground">OR</span>
                <div className="h-px bg-border flex-1"></div>
              </div>
              
              <Card className="p-6 border-dashed border-2 border-electric-blue/30 bg-electric-blue/5 hover:bg-electric-blue/10 transition-colors cursor-pointer">
                <div className="text-center space-y-4">
                  <Upload className="w-12 h-12 text-electric-blue mx-auto" />
                  <div>
                    <h3 className="font-semibold text-foreground">Upload Your Car Photo</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload a photo of your car for more accurate customization
                    </p>
                  </div>
                  <Button variant="outline" className="border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white">
                    Choose File
                  </Button>
                </div>
              </Card>
            </div>

            {/* Continue Button */}
            <Button 
              size="lg"
              className="w-full bg-gradient-to-r from-electric-blue to-electric-blue-dark text-white font-semibold py-4 rounded-xl text-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
              disabled={!selectedBrand || !selectedModel || !selectedYear}
            >
              Continue to Customization
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Card>

          {/* Car Preview & Info */}
          <div className="space-y-8">
            {/* Selected Car Info */}
            {selectedBrand && selectedModel && (
              <Card className="p-8 bg-gradient-to-br from-electric-blue/5 to-burnt-orange/5 border-electric-blue/20">
                <div className="space-y-6">
                  <h3 className="text-2xl font-display font-bold text-foreground">
                    {selectedYear} {selectedBrand} {selectedModel}
                  </h3>
                  
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <Car className="w-16 h-16 mx-auto mb-4" />
                      <p>Car preview will appear here</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-electric-blue" />
                      <span className="text-muted-foreground">Year: {selectedYear}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Settings className="w-4 h-4 text-electric-blue" />
                      <span className="text-muted-foreground">Variant: {selectedVariant || "Not selected"}</span>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Popular Models */}
            <Card className="p-8">
              <h3 className="text-xl font-display font-bold text-foreground mb-6">
                Popular Models
              </h3>
              <div className="space-y-4">
                {[
                  { brand: "BMW", model: "M3", count: "2,431 customizations" },
                  { brand: "Mercedes", model: "AMG GT", count: "1,832 customizations" },
                  { brand: "Audi", model: "RS6", count: "1,654 customizations" },
                  { brand: "Porsche", model: "911", count: "1,287 customizations" }
                ].map((car, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                    <div>
                      <p className="font-semibold text-foreground">{car.brand} {car.model}</p>
                      <p className="text-sm text-muted-foreground">{car.count}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarSelection;