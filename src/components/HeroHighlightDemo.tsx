"use client";
import { motion, useScroll, useTransform } from "motion/react";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import { FloatingDock } from "@/components/ui/floating-dock";
import { useRef } from "react";
import {
    IconHome,
    IconPhoto,
    IconShoppingBag,
    IconInfoCircle,
    IconMail,
    IconLayoutDashboard,
    IconShoppingCart,
} from "@tabler/icons-react";

export default function HeroHighlightDemo() {
    const links = [
        {
            title: "Home",
            icon: (
                <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: "/",
        },
        {
            title: "Gallery",
            icon: (
                <IconPhoto className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: "/gallery",
        },
        {
            title: "Shop",
            icon: (
                <IconShoppingBag className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: "/shop",
        },
        {
            title: "About",
            icon: (
                <IconInfoCircle className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: "/about",
        },
        {
            title: "Contact",
            icon: (
                <IconMail className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: "/contact",
        },
        {
            title: "Dashboard",
            icon: (
                <IconLayoutDashboard className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: "/dashboard",
        },
        {
            title: "Cart",
            icon: (
                <IconShoppingCart className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: "/cart",
        },
    ];

    const dockRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: dockRef,
        offset: ["start end", "center center"]
    });

    const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

    return (
        <HeroHighlight containerClassName="flex flex-col">
            <motion.h1
                initial={{
                    opacity: 0,
                    y: 20,
                }}
                animate={{
                    opacity: 1,
                    y: [20, -5, 0],
                }}
                transition={{
                    duration: 0.5,
                    ease: [0.4, 0.0, 0.2, 1],
                }}
                className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
            >
                Transform Your Ride. Unleash Your Vision. Every modification is a{" "}
                <Highlight className="text-black dark:text-white">
                    statement of your style.
                </Highlight>
            </motion.h1>

            <motion.div
                ref={dockRef}
                style={{ opacity }}
                className="mt-16 pb-8 flex justify-center"
            >
                <FloatingDock mobileClassName="translate-y-20" items={links} />
            </motion.div>
        </HeroHighlight>
    );
}
