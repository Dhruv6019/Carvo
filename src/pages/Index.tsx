import { VideoHero } from "@/components/VideoHero";
import { Navigation } from "@/components/Navigation";
import { FeatureCards } from "@/components/FeatureCards";
import { LivePreviewTeaser } from "@/components/LivePreviewTeaser";
import FluidModificationSection from "@/components/FluidModificationSection";
import HeroHighlightDemo from "@/components/HeroHighlightDemo";
import { Footer } from "@/components/Footer";
import { AnimatedSection } from "@/components/AnimatedSection";
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
        <Footer />
      </AnimatedSection>
    </div>
  );
};

export default Index;
