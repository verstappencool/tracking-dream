"use client";

import { useEffect, useRef, useState, useId } from "react";

interface MarqueeTextProps {
    userName: string;
    taskName: string;
    className?: string;
}

export function MarqueeText({ userName, taskName, className }: MarqueeTextProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const [distance, setDistance] = useState(0);
    const id = useId().replace(/:/g, ""); // Generate unique ID yang aman untuk CSS

    useEffect(() => {
        if (!containerRef.current || !textRef.current) return;

        const text = textRef.current;
        // Karena ada 4 span text render, kita gunakan format setengah untuk transisi seamless
        // Gunakan Math.ceil agar jadi angka bulat absolut (mencegah subpixel rendering jadul Android patah-patah)
        const textWidth = text.scrollWidth;
        setDistance(Math.ceil(textWidth / 2));

    }, [userName, taskName]);

    const content = `( ${userName} | ${taskName} )`;

    return (
        <div ref={containerRef} className={`overflow-hidden whitespace-nowrap relative ${className || ""}`}>
            {distance > 0 && (
                <style>{`
                    @keyframes marquee-x-${id} {
                        0% { transform: translate3d(0, 0, 0); }
                        100% { transform: translate3d(-${distance}px, 0, 0); }
                    }
                `}</style>
            )}
            <div
                ref={textRef}
                className="inline-flex gap-4"
                style={
                    distance > 0
                        ? {
                            willChange: "transform",
                            animation: `marquee-x-${id} 10s linear infinite`,
                            // Hardware Acceleration untuk Android TV/Box Browser
                            transform: "translateZ(0)",
                            WebkitTransform: "translateZ(0)",
                            backfaceVisibility: "hidden",
                            WebkitBackfaceVisibility: "hidden",
                        }
                        : {}
                }
            >
                <span>{content}</span>
                <span>{content}</span>
                <span>{content}</span>
                <span>{content}</span>
            </div>
        </div>
    );
}
