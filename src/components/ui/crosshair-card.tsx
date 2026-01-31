import React from "react";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

interface CrosshairCardProps extends React.HTMLAttributes<HTMLDivElement> {
    containerClassName?: string;
}

export const CrosshairCard = ({
    children,
    className,
    containerClassName,
    ...props
}: CrosshairCardProps) => {
    return (
        <div className={cn("relative group", containerClassName)}>
            {/* Corner Crosshairs */}
            <div className="absolute -top-1.5 -left-1.5 z-20 text-foreground/20">
                <Plus className="w-3 h-3" strokeWidth={1} />
            </div>
            <div className="absolute -top-1.5 -right-1.5 z-20 text-foreground/20">
                <Plus className="w-3 h-3" strokeWidth={1} />
            </div>
            <div className="absolute -bottom-1.5 -left-1.5 z-20 text-foreground/20">
                <Plus className="w-3 h-3" strokeWidth={1} />
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 z-20 text-foreground/20">
                <Plus className="w-3 h-3" strokeWidth={1} />
            </div>

            {/* Main Content Container with Border */}
            <div
                className={cn(
                    "relative h-full border border-foreground/10 bg-background/50 p-6 transition-all duration-300 hover:border-foreground/30",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        </div>
    );
};
