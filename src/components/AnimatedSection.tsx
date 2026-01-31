import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: "fadeInUp" | "slideInLeft" | "slideInRight" | "scaleIn";
  delay?: number;
  duration?: number;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className,
  animation = "fadeInUp",
  delay = 0,
  duration = 0.2,
}) => {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    const element = ref.current;
    if (!element) return;

    const fromVars: gsap.TweenVars = {
      opacity: 0,
      duration: duration,
      delay: delay / 1000,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: "top 100%",
        toggleActions: "play none none reverse",
      },
    };

    switch (animation) {
      case "fadeInUp":
        fromVars.y = 50;
        break;
      case "slideInLeft":
        fromVars.x = -50;
        break;
      case "slideInRight":
        fromVars.x = 50;
        break;
      case "scaleIn":
        fromVars.scale = 0.8;
        break;
    }

    gsap.from(element, fromVars);
  }, { scope: ref, dependencies: [animation, delay, duration] });

  return (
    <section
      ref={ref}
      className={cn("will-change-transform", className)}
    >
      {children}
    </section>
  );
};