import { Button } from "@/components/ui/button";
import { Play, ArrowRight, Menu, User, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ThreeDCar } from "./ThreeDCar";

export const VideoHero = () => {
  const { user, logout } = useAuth();
  const [currentModel, setCurrentModel] = useState<'bmw' | 'porsche' | 'mclaren'>('bmw');

  const getModelColor = (model: string) => {
    switch (model) {
      case 'bmw': return 'from-cyan-900/40 via-blue-900/20';
      case 'porsche': return 'from-rose-900/40 via-amber-900/20';
      case 'mclaren': return 'from-orange-900/40 via-purple-900/20';
      default: return 'from-gray-900/40 via-gray-900/20';
    }
  };

  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505]">
    {/* Dynamic Background Atmosphere */}
    <div className={`absolute inset-0 bg-gradient-to-br ${getModelColor(currentModel)} to-black transition-colors duration-1000 ease-in-out`}></div>

    {/* Subtle Noise Texture Overlay (Lighter alternative) */}
    <div className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay bg-noise"></div>

    {/* Central Glow Spot */}
    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-white/5 to-transparent rounded-full blur-3xl opacity-50 mix-blend-screen transition-all duration-1000 ${currentModel === 'bmw' ? 'scale-100' : currentModel === 'porsche' ? 'scale-110' : 'scale-125'}`}></div>

    {/* 3D Car Background */}
    <div className="absolute inset-0 w-full h-full z-10 transition-opacity duration-500">
      <ThreeDCar modelType={currentModel} />
    </div>

    {/* Left Side Marquee - Infinite loop for all models */}
    <div className="absolute top-0 left-4 md:left-8 h-full w-24 md:w-32 z-10 overflow-hidden pointer-events-none select-none opacity-20">
      <div className="animate-marquee-vertical flex flex-col space-y-12 md:space-y-24">
        {[...Array(10)].map((_, i) => (
          <span key={i} className="text-8xl md:text-9xl font-display font-black text-transparent transform" style={{ WebkitTextStroke: '2px white', writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}>
            {currentModel === 'bmw' ? 'BMW' : currentModel === 'porsche' ? 'PORSCHE' : 'MCLAREN'}
          </span>
        ))}
        {/* Duplicate for seamless loop */}
        {[...Array(10)].map((_, i) => (
          <span key={`dup-${i}`} className="text-8xl md:text-9xl font-display font-black text-transparent transform" style={{ WebkitTextStroke: '2px white', writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}>
            {currentModel === 'bmw' ? 'BMW' : currentModel === 'porsche' ? 'PORSCHE' : 'MCLAREN'}
          </span>
        ))}
      </div>
    </div>
    {/* Right Side Credits Marquee - Inverted Side and Direction */}
    <div className="absolute top-0 left-44 h-full w-24 md:w-32 z-10 overflow-hidden pointer-events-none select-none opacity-15">
      <div className="animate-marquee-vertical-reverse flex flex-col space-y-12 md:space-y-24">
        {["CARVO", "IT-6E", "GROUP-7", "BY", "MADE", "KRISH", "MANAN", "MEHUL", "MEET", "JAINAM", "KRISHNA", "DHRUV"].map((text, i) => (
          <span key={i} className="text-4xl md:text-5xl font-display font-black text-transparent transform" style={{ WebkitTextStroke: '1px white', writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}>
            {text}
          </span>
        ))}
        {/* Duplicate for seamless loop */}
        {["CARVO", "IT-6E", "GROUP-7", "BY", "MADE", "KRISH", "MANAN", "MEHUL", "MEET", "JAINAM", "KRISHNA", "DHRUV"].map((text, i) => (
          <span key={`dup-${i}`} className="text-4xl md:text-5xl font-display font-black text-transparent transform" style={{ WebkitTextStroke: '1px white', writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}>
            {text}
          </span>
        ))}
      </div>
    </div>


    {/* Hero Content (Buttons Only) */}
    <div className="absolute bottom-24 right-8 md:right-16 z-20 pointer-events-none">
      <div className="pointer-events-auto">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8">
          {/* Model Switcher - enhanced */}
          <div className="relative group">
            <div className={`absolute -inset-1 bg-gradient-to-r ${currentModel === 'bmw' ? 'from-cyan-500 to-blue-500' : currentModel === 'porsche' ? 'from-red-500 to-orange-500' : 'from-orange-500 to-purple-500'} rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200`}></div>
            <Button
              onClick={() => setCurrentModel(prev => {
                if (prev === 'bmw') return 'porsche';
                if (prev === 'porsche') return 'mclaren';
                return 'bmw';
              })}
              size="icon"
              className="relative bg-black/40 hover:bg-black/60 text-white rounded-full w-16 h-16 backdrop-blur-xl border border-white/10 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <ArrowRight className="w-6 h-6 animate-pulse group-hover:translate-x-1 transition-transform" />
            </Button>
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-mono text-white/50 tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Next Model
            </span>
          </div>

          <Link to="/car-selection">
            <Button size="lg" className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold px-10 py-7 rounded-full text-lg transition-all duration-300 backdrop-blur-md group relative overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-r ${currentModel === 'bmw' ? 'from-cyan-500/10 to-blue-500/10' : currentModel === 'porsche' ? 'from-red-500/10 to-orange-500/10' : 'from-orange-500/10 to-purple-500/10'} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              <span className="relative z-10 flex items-center font-bold tracking-wide">
                Start Modifying
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </span>
              {/* Animated shine effect */}
              <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
            </Button>
          </Link>
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