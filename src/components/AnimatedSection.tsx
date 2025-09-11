import React from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: "fadeInUp" | "slideInLeft" | "slideInRight" | "scaleIn";
  delay?: number;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className,
  animation = "fadeInUp",
  delay = 0,
}) => {
  const { ref, isVisible } = useScrollAnimation();

  const animationClass = {
    fadeInUp: "animate-fade-in-up",
    slideInLeft: "animate-slide-in-left", 
    slideInRight: "animate-slide-in-right",
    scaleIn: "animate-scale-in",
  }[animation];

  const delayClass = delay > 0 ? `animate-delay-${delay}` : "";

  return (
    <section
      ref={ref}
      className={cn(
        "opacity-0",
        isVisible && animationClass,
        delayClass,
        className
      )}
    >
      {children}
    </section>
  );
};