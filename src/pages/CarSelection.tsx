import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ArrowRight, Car, Calendar, Settings, Check, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export const CarSelection = () => {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedVariant, setSelectedVariant] = useState("");
  const [cars, setCars] = useState<any[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const navigate = useNavigate();

  // Custom Car State
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [customBrand, setCustomBrand] = useState("");
  const [customModel, setCustomModel] = useState("");
  const [customYear, setCustomYear] = useState("");
  const [customBody, setCustomBody] = useState("bmw"); // default fallback mapping

  const handleCustomSubmit = () => {
    if (!customBrand || !customModel || !customYear) return;

    // Navigate with custom params
    // We map the custom body choice to our available 3D models for the visualization
    // If user picks 'Convertible/Sedan' -> map to BMW M4 (generic sedan-ish)
    // If user picks 'Supercar' -> map to McLaren
    // If user picks 'Luxury/Sport' -> map to Porsche

    let mappedModelType = 'bmw'; // default
    if (customBody === 'supercar') mappedModelType = 'mclaren';
    if (customBody === 'luxury') mappedModelType = 'porsche';

    navigate(`/customize?brand=${customBrand}&model=${customModel}&year=${customYear}&carId=custom&modelType=${mappedModelType}`);
    setIsCustomOpen(false);
  };

  const selectedCar = cars.find(c => c.make === selectedBrand && c.model === selectedModel && c.year === parseInt(selectedYear));

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await api.get("/customer/cars");
        setCars(response.data);
        const uniqueBrands = Array.from(new Set(response.data.map((car: any) => car.make)));
        setBrands(uniqueBrands as string[]);
      } catch (error) {
        console.error("Error fetching cars", error);
        setBrands(["BMW", "Mercedes-Benz", "Audi", "Porsche", "Tesla"]);
      }
    };
    fetchCars();
  }, []);

  useEffect(() => {
    if (selectedBrand) {
      const brandCars = cars.filter((car: any) => car.make === selectedBrand);
      if (brandCars.length > 0) {
        const uniqueModels = Array.from(new Set(brandCars.map((car: any) => car.model)));
        setModels(uniqueModels as string[]);
      } else {
        const fallbackModels: any = {
          "BMW": ["M3", "M4", "M5", "X5", "X6", "i8"],
          "Mercedes-Benz": ["AMG GT", "C63", "E63", "S63", "GLE", "GLS"],
          "Audi": ["RS6", "RS7", "R8", "Q7", "Q8", "TT"],
          "Porsche": ["911", "Cayenne", "Macan", "Panamera", "Taycan"],
          "Tesla": ["Model S", "Model 3", "Model X", "Model Y"]
        };
        setModels(fallbackModels[selectedBrand] || []);
      }
    } else {
      setModels([]);
    }
  }, [selectedBrand, cars]);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".page-content", { y: 20, opacity: 0, duration: 0.8 });
  }, { scope: containerRef });

  const handleContinue = () => {
    const car = cars.find(c => c.make === selectedBrand && c.model === selectedModel && c.year === parseInt(selectedYear));
    const carId = car ? car.id : null;
    navigate(`/customize?brand=${selectedBrand}&model=${selectedModel}&year=${selectedYear}&carId=${carId || ''}`);
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 page-content">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* LEFT: FORM SECTION */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <div className="text-electric-blue font-bold tracking-widest text-xs uppercase mb-2">
                Garage Access
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
                Select Your Vehicle
              </h1>
              <p className="text-gray-500 text-lg">
                Choose your specific model to access our premium customization studio. We ensure perfect fitment for every part.
              </p>
            </div>

            <div className="space-y-6">

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Brand</label>
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger className="bg-white border-gray-200 h-12 rounded-xl focus:ring-4 focus:ring-electric-blue/10 font-medium text-gray-600">
                    <SelectValue placeholder="Select Brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Model</label>
                  <Select value={selectedModel} onValueChange={setSelectedModel} disabled={!selectedBrand}>
                    <SelectTrigger className="bg-white border-gray-200 h-12 rounded-xl focus:ring-4 focus:ring-electric-blue/10 font-medium text-gray-600">
                      <SelectValue placeholder="Select Model" />
                    </SelectTrigger>
                    <SelectContent>
                      {models.map((model) => (
                        <SelectItem key={model} value={model}>{model}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Year</label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="bg-white border-gray-200 h-12 rounded-xl focus:ring-4 focus:ring-electric-blue/10 font-medium text-gray-600">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 15 }, (_, i) => 2024 - i).map((year) => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Trim Variant (Optional)</label>
                <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                  <SelectTrigger className="bg-white border-gray-200 h-12 rounded-xl focus:ring-4 focus:ring-electric-blue/10 font-medium text-gray-600">
                    <SelectValue placeholder="Select Trim" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="base">Base Model</SelectItem>
                    <SelectItem value="sport">Sport Package</SelectItem>
                    <SelectItem value="premium">Premium Package</SelectItem>
                    <SelectItem value="performance">Performance / M / AMG</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Car Trigger - Premium UI */}
              <div className="pt-6 mt-6 border-t border-gray-100">
                <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-electric-blue group-hover:text-white transition-colors duration-300">
                        <Plus className="w-5 h-5 text-electric-blue group-hover:text-white" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-gray-900">Not in the list?</h3>
                        <p className="text-xs text-gray-500">Configure a custom vehicle specification</p>
                      </div>
                    </div>
                  </div>

                  <Dialog open={isCustomOpen} onOpenChange={setIsCustomOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-electric-blue hover:text-electric-blue font-medium h-10 transition-all">
                        Add Custom Vehicle
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Add Custom Vehicle</DialogTitle>
                        <DialogDescription>
                          Enter your vehicle details to start a custom project. We'll use a generic 3D model for visualization.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <label className="text-sm font-medium">Brand</label>
                          <Input placeholder="e.g. Ferrari" value={customBrand} onChange={(e) => setCustomBrand(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                          <label className="text-sm font-medium">Model</label>
                          <Input placeholder="e.g. 488 Pista" value={customModel} onChange={(e) => setCustomModel(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                          <label className="text-sm font-medium">Year</label>
                          <Input placeholder="e.g. 2023" type="number" value={customYear} onChange={(e) => setCustomYear(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                          <label className="text-sm font-medium">Body Style (for 3D Preview)</label>
                          <Select value={customBody} onValueChange={setCustomBody}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Body Style" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bmw">Sedan / Coupe (Generic)</SelectItem>
                              <SelectItem value="luxury">Luxury / Sport (Porsche Style)</SelectItem>
                              <SelectItem value="supercar">Supercar_Exotic (McLaren Style)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleCustomSubmit} disabled={!customBrand || !customModel || !customYear} className="bg-electric-blue text-white w-full">
                          Add & Continue
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT: INFO CARD (Floating) */}
          <div className="lg:col-span-5 relative mt-12 lg:mt-0">
            {/* Decorative background shape */}
            <div className="absolute top-10 right-10 w-full h-full bg-gray-100 rounded-[2.5rem] -rotate-3 -z-10" />

            <div className="bg-gradient-to-br from-electric-blue to-blue-700 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden min-h-[500px] flex flex-col justify-between group cursor-default transition-transform hover:-translate-y-1">
              {/* Texture Overlay */}
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

              <div className="relative z-10">
                {selectedCar && selectedCar.image_url ? (
                  <div className="w-full aspect-video mb-8 rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg">
                    <img
                      src={selectedCar.image_url}
                      alt={`${selectedBrand} ${selectedModel}`}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                ) : (
                  <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm border border-white/20">
                    <Car className="w-8 h-8 text-white" />
                  </div>
                )}

                <h2 className="text-3xl font-display font-bold mb-4">
                  {selectedBrand && selectedModel ? `${selectedYear} ${selectedBrand} ${selectedModel}` : "Your Dream Build"}
                </h2>

                <p className="text-blue-100 text-lg leading-relaxed mb-8">
                  {selectedBrand ? "Ready to be transformed. Our studio allows for real-time 3D customization with OEM-grade parts." : "Select your vehicle details on the left to confirm compatibility and start your project."}
                </p>

                <div className="space-y-4">
                  {["Real-time Preview", "Instant Quotation", "Expert Validation", "Save Your Build"].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="bg-white/20 rounded-full p-1">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="font-medium text-blue-50">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative z-10 pt-12 border-t border-white/20 mt-8">
                <div className="flex items-end justify-between mb-6">
                  <span className="text-blue-200 font-medium">Status</span>
                  <span className="text-2xl font-bold">{selectedBrand && selectedModel ? "Available" : "Waiting..."}</span>
                </div>

                <Button
                  onClick={handleContinue}
                  disabled={!selectedBrand || !selectedModel || !selectedYear}
                  className="w-full bg-white text-electric-blue hover:bg-blue-50 h-14 rounded-xl text-lg font-bold shadow-lg shadow-black/10 flex items-center justify-between px-6 group-hover:px-8 transition-all"
                >
                  <span>Start Customizing</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CarSelection;