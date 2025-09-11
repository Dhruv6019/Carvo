import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Palette, Settings, Zap, Shield, ArrowRight } from "lucide-react";

export const FeatureCards = () => {
  const features = [
    {
      icon: Palette,
      title: "Custom Paint Jobs",
      description: "Premium paint finishes, wraps, and custom graphics with live preview technology",
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-50 dark:bg-pink-950/20"
    },
    {
      icon: Settings,
      title: "Alloy Wheels",
      description: "High-performance wheels from top brands with perfect fitment guarantee",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/20"
    },
    {
      icon: Zap,
      title: "Performance Upgrades",
      description: "Engine tuning, exhaust systems, and performance modifications for maximum power",
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/20"
    },
    {
      icon: Shield,
      title: "Interior Styling",
      description: "Luxury upholstery, custom trim, and ambient lighting installations",
      color: "from-purple-500 to-indigo-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/20"
    }
  ];

  return (
    <section className="py-24 px-6 bg-surface dark:bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-black text-foreground mb-6">
            Transform Your <span className="bg-gradient-to-r from-electric-blue to-burnt-orange bg-clip-text text-transparent">Vehicle</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Professional modification services with cutting-edge technology and premium components
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className={`group p-8 ${feature.bgColor} border-0 card-hover cursor-pointer`}
              >
                <div className="space-y-6">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-display font-bold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  
                  {/* CTA */}
                  <Button 
                    variant="ghost" 
                    className="group-hover:translate-x-2 transition-transform duration-300 p-0 h-auto text-electric-blue hover:bg-transparent"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-electric-blue to-electric-blue-dark text-white font-semibold px-12 py-4 rounded-xl text-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            View All Services
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};