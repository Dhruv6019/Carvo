import { Button } from "@/components/ui/button";
import { Star, ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import luxuryCarHero from "@/assets/luxury-car-hero.jpg";

export const Hero3D = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const modPackages = [
    { 
      name: "FERRARI", 
      model: "458 GT3",
      rating: 4.2,
      description: "Ferrari 458 Modification Available. Just one of several other race-ready supercars waiting for your custom touch. Built for speed and style.",
      specs: [
        "800+ HORSE POWER",
        "TWIN TURBO V8 ENGINE", 
        "CARBON FIBER BODY KIT"
      ]
    },
    { 
      name: "LAMBORGHINI", 
      model: "HURACAN",
      rating: 4.8,
      description: "Transform your Lamborghini with our premium modification packages. Custom performance upgrades and luxury aesthetic enhancements.",
      specs: [
        "CUSTOM PAINT JOBS",
        "LUXURY INTERIOR TRIM",
        "PREMIUM SOUND SYSTEM"
      ]
    },
    { 
      name: "MCLAREN", 
      model: "720S",
      rating: 4.9,
      description: "Professional racing modifications for the ultimate driving experience. Track-ready performance upgrades and aerodynamic enhancements.",
      specs: [
        "RACING SUSPENSION",
        "AERODYNAMIC PACKAGE",
        "LIGHTWEIGHT MATERIALS"
      ]
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % modPackages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + modPackages.length) % modPackages.length);
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Navigation */}
      <Navigation />
      
      {/* Dark Background with subtle patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.05),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(99,102,241,0.05),transparent_50%)]"></div>
      
      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 min-h-screen flex items-center pt-20">
        <div className="grid grid-cols-12 gap-8 w-full items-center">
          
          {/* Left Content - 4 columns */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Model Name */}
            <div className="space-y-2">
              <h1 className="text-6xl lg:text-7xl font-black text-white leading-none tracking-tight uppercase">
                {modPackages[currentSlide].name}
              </h1>
              <h2 className="text-xl lg:text-2xl font-medium text-slate-300 uppercase tracking-wider">
                {modPackages[currentSlide].model}
              </h2>
            </div>

            {/* Description */}
            <p className="text-slate-400 text-sm lg:text-base leading-relaxed max-w-xs">
              {modPackages[currentSlide].description}
            </p>

            {/* Rating */}
            <div className="flex items-center space-x-3">
              <span className="text-5xl font-light text-white">{modPackages[currentSlide].rating}</span>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < Math.floor(modPackages[currentSlide].rating) ? 'text-yellow-400 fill-current' : 'text-slate-600'}`} 
                  />
                ))}
              </div>
            </div>

            {/* Explore Button */}
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-transparent border border-white/30 text-white hover:bg-white hover:text-slate-900 px-8 py-3 text-sm font-medium tracking-widest uppercase transition-all duration-300"
            >
              EXPLORE
            </Button>
          </div>

          {/* Center Content - Car Image - 5 columns */}
          <div className="col-span-12 lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-2xl">
              <div 
                className="w-full h-80 lg:h-96 bg-cover bg-center bg-no-repeat transition-all duration-500 hover:scale-105"
                style={{ backgroundImage: `url(${luxuryCarHero})` }}
              >
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-radial from-blue-500/10 via-transparent to-transparent"></div>
              </div>
            </div>
          </div>

          {/* Right Content - Specs - 3 columns */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            <h3 className="text-white text-sm font-medium tracking-widest uppercase">SPECS</h3>
            <div className="space-y-4">
              {modPackages[currentSlide].specs.map((spec, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                  <span className="text-slate-300 text-sm font-light">{spec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-8 left-8 flex items-center space-x-6">
        <span className="text-slate-500 text-xs tracking-wide">Copyright 2024</span>
        
        <button 
          onClick={prevSlide}
          className="text-slate-400 hover:text-white transition-colors p-1"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        {/* Car Thumbnails */}
        <div className="flex space-x-3">
          {modPackages.map((pkg, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-12 h-8 bg-cover bg-center rounded-sm transition-all duration-300 border ${
                index === currentSlide 
                  ? 'border-white opacity-100' 
                  : 'border-slate-600 opacity-40 hover:opacity-70'
              }`}
              style={{ backgroundImage: `url(${luxuryCarHero})` }}
            />
          ))}
        </div>
        
        <button 
          onClick={nextSlide}
          className="text-slate-400 hover:text-white transition-colors p-1"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom Right - Social Icons */}
      <div className="absolute bottom-8 right-8 flex items-center space-x-4">
        <button className="text-slate-400 hover:text-white transition-colors">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
          </svg>
        </button>
        <button className="text-slate-400 hover:text-white transition-colors">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
          </svg>
        </button>
        <button className="text-slate-400 hover:text-white transition-colors">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
        </button>
      </div>
    </section>
  );
};