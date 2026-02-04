import { useState, ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Image as ImageIcon } from "lucide-react";

interface ImageWithFallbackProps extends ImgHTMLAttributes<HTMLImageElement> {
    fallbackSrc?: string;
}

export const ImageWithFallback = ({
    src,
    alt,
    className,
    fallbackSrc = "/placeholder.svg",
    ...props
}: ImageWithFallbackProps) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleError = () => {
        if (!hasError) {
            setHasError(true);
            setImgSrc(fallbackSrc);
        }
    };

    const handleLoad = () => {
        setIsLoading(false);
    };

    return (
        <div className={cn("relative overflow-hidden bg-secondary/20", className)}>
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-secondary/20 animate-pulse">
                    <ImageIcon className="w-8 h-8 text-muted-foreground/20" />
                </div>
            )}
            <img
                {...props}
                src={imgSrc}
                alt={alt}
                onError={handleError}
                onLoad={handleLoad}
                className={cn(
                    "w-full h-full object-cover transition-opacity duration-300",
                    isLoading ? "opacity-0" : "opacity-100",
                    className
                )}
            />
        </div>
    );
};
