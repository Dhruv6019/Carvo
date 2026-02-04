"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export const LayoutTextFlip = ({
    text = "Build Amazing",
    words = ["Landing Pages", "Component Blocks", "Page Sections", "3D Shaders"],
    duration = 3000,
    className,
}: {
    text: string;
    words: string[];
    duration?: number;
    className?: string;
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
        }, duration);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={cn("flex gap-2 items-center", className)}>
            <motion.span
                layoutId="subtext"
                className="font-bold tracking-tight"
            >
                {text}
            </motion.span>

            <motion.span
                layout
                className="relative inline-flex overflow-hidden rounded-md border border-transparent bg-muted/20 px-2 py-0.5"
            >
                <AnimatePresence mode="popLayout">
                    <motion.span
                        key={currentIndex}
                        initial={{ y: -30, opacity: 0, filter: "blur(4px)" }}
                        animate={{
                            y: 0,
                            opacity: 1,
                            filter: "blur(0px)",
                        }}
                        exit={{ y: 30, opacity: 0, filter: "blur(4px)" }}
                        transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 20,
                        }}
                        className="inline-block whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-orange-500"
                    >
                        {words[currentIndex]}
                    </motion.span>
                </AnimatePresence>
            </motion.span>
        </div>
    );
};
