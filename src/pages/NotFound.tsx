import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col items-center justify-center font-sans">
      {/* Background Layer - Airy Clouds */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?q=80&w=2574&auto=format&fit=crop')`,
          filter: 'brightness(1.05) contrast(0.95)'
        }}
      />

      {/* Soft Gradient Overlay for Readability */}
      <div className="absolute inset-0 z-10 bg-white/30 backdrop-blur-[2px]" />

      {/* Content Container */}
      <div className="relative z-20 text-center px-4 max-w-2xl transform translate-y-[-5%] animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {/* 404 Text with Airy Gradient */}
        <h1 className="text-[12rem] lg:text-[18rem] font-bold leading-none tracking-tighter select-none">
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-[#6D989A] via-[#8FB4B6] to-white/0 opacity-60">
            404
          </span>
        </h1>

        {/* Main Message */}
        <div className="space-y-4 -mt-10 lg:-mt-16">
          <h2 className="text-3xl lg:text-4xl font-semibold text-[#1A1A1A] tracking-tight">
            Sorry, that page could not be found
          </h2>
          <p className="text-sm lg:text-base text-gray-500 font-medium max-w-md mx-auto leading-relaxed opacity-80">
            The requested page either doesn't exist or you don't have access to it.
          </p>
        </div>

        {/* Premium Button */}
        <div className="mt-12">
          <a
            href="/"
            className="inline-flex items-center justify-center px-8 h-12 rounded-full bg-black text-white text-sm font-bold tracking-wide transition-all duration-300 hover:scale-105 hover:bg-black/90 shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)] group"
          >
            Go Back Home
          </a>
        </div>
      </div>

      {/* Subtle Bottom Cloud Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/40 to-transparent pointer-events-none" />
    </div>
  );
};

export default NotFound;
