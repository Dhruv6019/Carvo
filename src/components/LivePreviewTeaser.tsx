import { Button } from "@/components/ui/button";
import { ThreeDCar } from "./ThreeDCar";
import { GlassCard } from "@/components/ui/GlassCard";
import { RotateCcw, Maximize2, Download, Eye } from "lucide-react";
import { Link } from "react-router-dom";
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
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background Liquid/Mesh */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Preview Demo */}
          <div className="space-y-8">
            <GlassCard variant="neon" className="p-8 shadow-water border-cyan-500/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/20 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2 group-hover:bg-cyan-400/30 transition-colors duration-700"></div>
              {/* Car Preview Area */}
              <div className="aspect-video bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl flex items-center justify-center mb-6 relative overflow-hidden border border-white/5 shadow-inner">
                {/* Simulated Car */}
                <div className="w-full h-full absolute inset-0">
                  <ThreeDCar modelType="bmw" color={activeColor === 'black' ? '#1f2937' : colors.find(c => c.name === activeColor)?.value} controls={false} />
                </div>
              </div>

              {/* Color Picker */}
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Select Finish</h4>
                <div className="flex space-x-3">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setActiveColor(color.name)}
                      className={`w-12 h-12 rounded-full border-2 transition-all duration-300 hover:scale-110 relative overflow-hidden ${activeColor === color.name
                        ? 'border-cyan-400 shadow-glow scale-110'
                        : 'border-white/10 hover:border-white/30'
                        }`}
                      style={{ backgroundColor: color.value }}
                      title={color.label}
                    >
                      {activeColor === color.name && (
                        <div className="absolute inset-0 bg-white/20 animate-pulse-glow rounded-full"></div>
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground flex items-center">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 mr-2 animate-pulse"></span>
                  Active: {colors.find(c => c.name === activeColor)?.label}
                </p>
              </div>
            </GlassCard>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-display font-black text-foreground leading-tight">
                See Changes
                <br />
                <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                  In Real-Time
                </span>
              </h2>

              <p className="text-xl text-muted-foreground leading-relaxed">
                Our advanced liquid rendering engine simulates light, reflection, and flow.
                Preview every modification before committing.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4">
              {[
                "360° fluid rotation",
                "Ray-traced lighting & reflections",
                "Dynamic water/weather effects",
                "4K photoish renders",
                "Save configurations to cloud"
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 group">
                  <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                  <span className="text-foreground font-medium group-hover:text-cyan-300 transition-colors">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/car-selection">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-semibold px-8 py-3 rounded-xl hover:shadow-water hover:scale-105 transition-all duration-300 border border-white/10"
                >
                  Try Live Preview
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div >
    </section >
  );
};