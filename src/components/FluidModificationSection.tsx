"use client";

import { Palette, Settings, Zap, Shield } from "lucide-react";
import { EvervaultCard, Icon } from "@/components/ui/evervault-card";

export default function FluidModificationSection() {
    const services = [
        {
            title: "Custom Paint Jobs",
            description: "Premium paint finishes, wraps, and custom graphics with live preview technology",
            cardText: "PAINT",
            route: "services"
        },
        {
            title: "Alloy Wheels",
            description: "High-performance wheels from top brands with perfect fitment guarantee",
            cardText: "WHEELS",
            route: "services"
        },
        {
            title: "Performance Upgrades",
            description: "Engine tuning, exhaust systems, and performance modifications for maximum power",
            cardText: "POWER",
            route: "services"
        },
        {
            title: "Interior Styling",
            description: "Luxury upholstery, custom trim, and ambient lighting installations",
            cardText: "LUXURY",
            route: "services"
        },
    ];

    return (
        <div className="px-6 py-12 md:px-12 md:py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
                    Fluid <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">Modification</span>
                </h2>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
                    Immersive customization services with real-time liquid preview technology
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="border border-black/[0.2] dark:border-white/[0.2] flex flex-col items-start p-4 relative min-h-[400px]"
                        >
                            <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
                            <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
                            <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
                            <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />

                            {/* Evervault Card */}
                            <EvervaultCard text={service.cardText} className="h-[330px]" />

                            {/* Title */}
                            <h3 className="text-xl font-semibold text-black dark:text-white mb-3 mt-4">
                                {service.title}
                            </h3>

                            {/* Description */}
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1">
                                {service.description}
                            </p>

                            {/* Learn More Button */}
                            <a href={service.route} className="relative inline-flex h-10 overflow-hidden p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center bg-slate-950 dark:bg-slate-950 px-4 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                                    Learn More
                                </span>
                            </a>
                        </div>
                    ))}
                </div>

                {/* Explore All Services Button */}
                <div className="text-center">
                    <a href="/services" className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 dark:bg-slate-950 px-8 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                            Explore All Services
                        </span>
                    </a>
                </div>
            </div>
        </div>
    );
}
