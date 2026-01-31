import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Palette, Settings, Zap, Shield, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

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
            Fluid <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">Modification</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Immersive customization services with real-time liquid preview technology
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            // Override colors for water theme
            const waterColors = [
              "from-cyan-400 to-blue-500",
              "from-teal-400 to-emerald-500",
              "from-blue-500 to-indigo-600",
              "from-violet-500 to-purple-600"
            ];

            return (
              <GlassCard
                key={index}
                variant="neon"
                className="group p-8 cursor-pointer hover:border-cyan-400/50"
              >
                <div className="space-y-6">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${waterColors[index % 4]} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-glow transition-all duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-display font-bold text-foreground group-hover:text-cyan-400 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed group-hover:text-blue-200/80">
                      {feature.description}
                    </p>
                  </div>

                  {/* CTA */}
                  <Link to="/services">
                    <Button
                      variant="ghost"
                      className="group-hover:translate-x-2 transition-transform duration-300 p-0 h-auto text-cyan-400 hover:bg-transparent hover:text-cyan-300"
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <Link to="/services">
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold px-12 py-4 rounded-xl text-lg hover:shadow-water hover:scale-105 transition-all duration-300 border border-white/10"
            >
              Explore All Services
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div >
    </section >
  );
};