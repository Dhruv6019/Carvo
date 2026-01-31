import { cn } from "@/lib/utils";
import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "neon" | "dark";
    hoverEffect?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
    ({ className, variant = "default", hoverEffect = true, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "relative overflow-hidden rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl transition-all duration-500",
                    "water-effect hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)] hover:-translate-y-1",
                    hoverEffect && "group",
                    variant === "neon" && "shadow-water border-cyan-400/30 bg-cyan-900/10",
                    variant === "dark" && "bg-black/40 border-white/10",
                    className
                )}
                {...props}
            >
                {/* Water Refraction / Noise Texture */}
                <div className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                />

                {/* Ripple Emitter */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-400/20 rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-all duration-700 group-hover:scale-150" />
                </div>

                <div className="relative z-10">
                    {children}
                </div>
            </div>
        );
    }
);
GlassCard.displayName = "GlassCard";
