import { VideoHero } from "@/components/VideoHero";
import { Navigation } from "@/components/Navigation";
import { FeatureCards } from "@/components/FeatureCards";
import { LivePreviewTeaser } from "@/components/LivePreviewTeaser";
import FluidModificationSection from "@/components/FluidModificationSection";
import HeroHighlightDemo from "@/components/HeroHighlightDemo";
import { Footer } from "@/components/Footer";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Gamepad2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PullToPlayTeaser = () => (
  <section className="py-24 bg-black relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/10 to-transparent pointer-events-none"></div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="max-w-2xl text-center md:text-left">
          <div className="flex items-center space-x-3 text-electric-blue mb-6 justify-center md:justify-start">
            <Gamepad2 className="w-6 h-6" />
            <span className="text-sm font-black uppercase tracking-[0.3em]">Game Experience</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            Pull to <br />
            <span className="text-gradient">Launch</span>
          </h2>
          <p className="text-xl text-white/50 mb-10 leading-relaxed">
            Experience our simulation engine. Drag, launch, and dominate the hills.
            Ready to test your driving skills?
          </p>
          <Link to="/game">
            <Button size="lg" className="bg-electric-blue hover:bg-white text-black rounded-full px-12 py-8 text-xl font-black group transition-all duration-500 hover:scale-105">
              Play Simulator
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
            </Button>
          </Link>
        </div>
        <div className="relative group">
          <div className="absolute -inset-4 bg-electric-blue/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="w-64 h-64 md:w-80 md:h-80 bg-gradient-electric rounded-[3rem] rotate-12 flex items-center justify-center shadow-2xl transition-transform duration-700 group-hover:rotate-0">
            <div className="text-black transform -rotate-12 group-hover:rotate-0 transition-transform duration-700">
              <Gamepad2 className="w-24 h-24" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
const Index = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navigation />
      <VideoHero />
      <AnimatedSection animation="fadeInUp" delay={0}>
        <FluidModificationSection />
      </AnimatedSection>
      <AnimatedSection animation="slideInLeft" delay={0}>
        <LivePreviewTeaser />
      </AnimatedSection>
      <AnimatedSection animation="scaleIn" delay={0}>
        <HeroHighlightDemo />
      </AnimatedSection>
      <AnimatedSection animation="fadeInUp" delay={0}>
        <PullToPlayTeaser />
      </AnimatedSection>
      <AnimatedSection animation="fadeInUp" delay={0}>
        <Footer />
      </AnimatedSection>
    </div>
  );
};

export default Index;
