import { useEffect, useState } from "react";

interface LoadingScreenProps {
    duration?: number;
    onComplete?: () => void;
}

export const LoadingScreen = ({ duration = 3000, onComplete }: LoadingScreenProps) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let startTime: number;
        let animationFrame: number;

        const animate = (time: number) => {
            if (!startTime) startTime = time;
            const elapsed = time - startTime;

            // Non-linear progress simulation: starts normal, slows down at the end to feel "real"
            // Then quickly finishing once it gets very close
            let targetProgress = (elapsed / duration) * 100;

            // Ease out cubic for a "realistic" feel
            const t = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - t, 3);
            let currentProgress = easeOut * 100;

            // Ensure we don't jump backwards (though cubic won't)
            setProgress(Math.min(currentProgress, 100));

            if (t < 1) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                setProgress(100);
                setTimeout(() => {
                    if (onComplete) onComplete();
                }, 500); // Small delay at 100% for impact
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [duration, onComplete]);

    // Calculate circle properties
    const radius = 150;
    const stroke = 5;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center text-cream">
            <div className="relative flex items-center justify-center">
                {/* SVG Circle */}
                <svg
                    height={radius * 2}
                    width={radius * 2}
                    className="transform -rotate-90"
                >
                    {/* Background Circle (faint) */}
                    <circle
                        stroke="rgba(255, 255, 220, 0.1)"
                        strokeWidth={stroke}
                        fill="transparent"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                    {/* Progress Circle */}
                    <circle
                        stroke="#FEFBE0" // Light cream color matching the image text
                        strokeWidth={stroke}
                        strokeDasharray={circumference + ' ' + circumference}
                        style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.1s linear' }}
                        strokeLinecap="round"
                        fill="transparent"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                </svg>

                {/* Center Text */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-9xl font-serif text-[#FEFBE0] font-light">
                        {Math.round(progress).toString().padStart(2, '0')}
                    </span>
                </div>
            </div>

            {/* Loading Text */}
            <div className="absolute bottom-20 text-[#FEFBE0]/70 font-sans text-sm tracking-widest uppercase">
                Loading...
            </div>
        </div>
    );
};
