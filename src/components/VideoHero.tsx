import { Button } from "@/components/ui/button";
import { Play, ArrowRight, Menu, User } from "lucide-react";
import { useState } from "react";
export const VideoHero = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* YouTube Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <iframe className="video-background" src="https://www.youtube.com/embed/Vx9dh7SqxNA?autoplay=1&mute=1&loop=1&playlist=Vx9dh7SqxNA&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1" title="Car Background Video" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen onLoad={() => setIsVideoLoaded(true)} />
      </div>
      
      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-hero-overlay"></div>
      
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">CM</span>
            </div>
            <span className="text-white font-display font-bold text-xl">CarMods Pro</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <a href="#" className="text-white hover:text-electric-blue transition-colors font-medium">Home</a>
            <a href="#customize" className="text-white hover:text-electric-blue transition-colors font-medium">Customize</a>
            <a href="#gallery" className="text-white hover:text-electric-blue transition-colors font-medium">Gallery</a>
            <a href="#about" className="text-white hover:text-electric-blue transition-colors font-medium">About</a>
            <a href="#contact" className="text-white hover:text-electric-blue transition-colors font-medium">Contact</a>
          </div>

          {/* Login & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="hidden lg:flex text-white hover:bg-white/10">
              <User className="w-4 h-4 mr-2" />
              Login
            </Button>
            <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-white/10">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <div className="space-y-8">
          {/* Main Headline */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-black text-white leading-none tracking-tight uppercase">
            Visualize<br />
            <span className="bg-gradient-to-r from-electric-blue to-burnt-orange bg-clip-text text-transparent">
              Your Ride
            </span>
          </h1>
          
          {/* Subheading */}
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Customize your car with live previews. Paints, alloys, interiors & more.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 pt-8">
            <Button size="lg" className="bg-gradient-to-r from-electric-blue to-electric-blue-dark hover:shadow-glow text-white font-semibold px-10 py-4 rounded-xl text-lg transition-all duration-300 hover:scale-105">
              Start Modifying
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="border-2 border-white hover:bg-white font-semibold px-10 py-4 rounded-xl text-lg transition-all duration-300 text-lime-900">
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>;
};