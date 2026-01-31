import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface AnimatedEyeProps {
    isOpen: boolean;
    size?: number;
    className?: string;
    onClick?: () => void;
}

const AnimatedEye: React.FC<AnimatedEyeProps> = ({
    isOpen,
    size = 24,
    className = "",
    onClick
}) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const eyelidRef = useRef<SVGPathElement>(null);
    const pupilRef = useRef<SVGCircleElement>(null);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);

    useEffect(() => {
        // Initialize timeline
        if (!timelineRef.current) {
            timelineRef.current = gsap.timeline({ paused: true });

            // Animation Definition
            // 1. Eyelid closes down
            timelineRef.current
                .to(eyelidRef.current, {
                    attr: { d: "M2 12C2 12 5 20 12 20C19 20 22 12 22 12C22 12 19 4 12 4C5 4 2 12 2 12Z" }, // Fully closed shape? No, this is the container.
                    // Let's create a specialized path for the eyelid.
                    // Initial Open State Path: M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11 8-11 8z (Approx standard eye)
                    // We want to animate the TOP curve going DOWN.
                    duration: 0.3,
                    ease: "power2.inOut"
                }, 0)
        }
    }, []);

    // Re-thinking the SVG structure for better control.
    // We need an upper eyelid path that moves.

    return (
        <div
            onClick={onClick}
            className={`cursor-pointer ${className}`}
            style={{ width: size, height: size }}
            role="button"
            aria-label={isOpen ? "Hide password" : "Show password"}
        >
            <EyeSVG isOpen={isOpen} />
        </div>
    );
};

const EyeSVG = ({ isOpen }: { isOpen: boolean }) => {
    const tl = useRef<gsap.core.Timeline | null>(null);
    const upperLidRef = useRef<SVGPathElement>(null);
    const pupilRef = useRef<SVGCircleElement>(null);
    const eyelashGroupRef = useRef<SVGGElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => { // Scope GSAP
            tl.current = gsap.timeline({
                defaults: { duration: 0.25, ease: "power2.inOut" },
                paused: true
            });

            // "Closed" state means we show lines/eyelashes or just a shut lid.
            // "Open" state means pupil is visible.

            // Let's define the animation from OPEN (default draw) to CLOSED.
            // When CLOSED (isOpen=false for "password hidden"? Actually usually "Open Eye" = Text Visible. "Slashed Eye" = Password Hidden.)
            // NOTE: The previous UI logic was:
            // showPassword=true (Text Visible) -> Eye Icon (Open)
            // showPassword=false (dots) -> EyeOff Icon (Crossed)

            // So: isOpen={showPassword}
            // IF isOpen is FALSE (Hidden), we animate to CLOSED state.
            // IF isOpen is TRUE (Visible), we animate to OPEN state.

            if (tl.current && upperLidRef.current && pupilRef.current) {
                // Animate Upper Lid closing down
                // Open Path (approx): M 2 12 Q 12 2 22 12
                // Closed Path (approx): M 2 12 Q 12 20 22 12 (Curved down)

                tl.current
                    .to(upperLidRef.current, {
                        attr: { d: "M 2 12 Q 12 19 22 12" }, // Close down
                        fill: "currentColor"
                    }, "close")
                    .to(pupilRef.current, {
                        scaleY: 0,
                        opacity: 0,
                        duration: 0.15
                    }, "close")
                    .fromTo(eyelashGroupRef.current, {
                        scaleY: 0,
                        opacity: 0
                    }, {
                        scaleY: 1,
                        opacity: 1,
                        duration: 0.2
                    }, "close+=0.1"); // Eyelashes pop out when closed
            }

        });

        return () => ctx.revert();
    }, []);

    useEffect(() => {
        if (tl.current) {
            if (!isOpen) {
                tl.current.play(); // Animate to CLOSED
            } else {
                tl.current.reverse(); // Animate to OPEN
            }
        }
    }, [isOpen]);

    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full text-gray-500 overflow-visible"
        >
            {/* Base Eye Outline (Lower Lid - Static-ish) */}
            <path
                d="M 2 12 Q 12 20 22 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
            />

            {/* Upper Lid (Animates) */}
            <path
                ref={upperLidRef}
                d="M 2 12 Q 12 4 22 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
            />

            {/* Pupil */}
            <circle
                ref={pupilRef}
                cx="12"
                cy="12"
                r="3.5"
                fill="currentColor"
            />

            {/* Eyelashes (Visible only when closed) */}
            {/* Center cx=12, cy=12 approx */}
            <g ref={eyelashGroupRef} style={{ opacity: 0, transformOrigin: "12px 14px" }}>
                <path d="M 12 14 L 12 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M 16 13.5 L 18 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M 8 13.5 L 6 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </g>
        </svg>
    )
}

export default AnimatedEye;
