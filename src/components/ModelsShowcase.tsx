import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Zap, Shield, Star } from "lucide-react";

export const ModelsShowcase = () => {
  const packages = [
    {
      name: "Turbo Package",
      category: "Performance",
      price: "FROM $5,999",
      specs: ["+150 HP Gain", "Cold Air Intake", "ECU Tuning"],
      features: ["Turbocharger Kit", "Intercooler Upgrade", "Performance Exhaust"]
    },
    {
      name: "Carbon Package",
      category: "Aesthetic",
      price: "FROM $3,499",
      specs: ["Weight Reduction", "Aerodynamic Kit", "Custom Styling"],
      features: ["Carbon Fiber Hood", "Side Skirts", "Rear Spoiler"]
    },
    {
      name: "Track Package",
      category: "Racing",
      price: "FROM $12,999",
      specs: ["Track-Ready Setup", "Roll Cage", "Racing Suspension"],
      features: ["Coilover Suspension", "Racing Brakes", "Safety Equipment"]
    }
  ];

  return (
    <section className="py-20 px-6 bg-luxury-dark">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black text-foreground mb-4">
            MOD <span className="text-luxury-red">PACKAGES</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose from our professional modification packages designed to enhance 
            performance, style, and functionality of your vehicle.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <Card key={index} className="bg-gradient-surface border-luxury-red/20 overflow-hidden group hover:shadow-luxury transition-all duration-500 hover:scale-105">
              <div className="p-6 space-y-6">
                {/* Package Header */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-luxury-red text-sm font-semibold">{pkg.category}</span>
                    <Star className="w-4 h-4 text-luxury-red" />
                  </div>
                  <h3 className="text-2xl font-black text-foreground">{pkg.name}</h3>
                  <p className="text-3xl font-bold text-luxury-red">{pkg.price}</p>
                </div>

                {/* Specs */}
                <div className="space-y-3">
                  <h4 className="text-foreground font-semibold flex items-center">
                    <Zap className="w-4 h-4 mr-2 text-luxury-red" />
                    Upgrades
                  </h4>
                  <div className="space-y-1">
                    {pkg.specs.map((spec, idx) => (
                      <div key={idx} className="text-muted-foreground text-sm">
                        • {spec}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <h4 className="text-foreground font-semibold flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-luxury-red" />
                    Includes
                  </h4>
                  <div className="space-y-1">
                    {pkg.features.map((feature, idx) => (
                      <div key={idx} className="text-muted-foreground text-sm">
                        • {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <Button variant="glass" className="w-full group-hover:variant-luxury transition-all duration-300">
                  Get Quote
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};