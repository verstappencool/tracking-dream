"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface MarqueeTextProps {
    userName: string;
    taskName: string;
    className?: string;
}

export function MarqueeText({ userName, taskName, className }: MarqueeTextProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || !textRef.current) return;

        const container = containerRef.current;
        const text = textRef.current;

        // Get widths
        const containerWidth = container.offsetWidth;
        const textWidth = text.scrollWidth;

        // Calculate how far to move
        const distance = textWidth / 2; // Half because we duplicate the text

        // Create the animation
        const animation = gsap.to(text, {
            x: -distance,
            duration: 10,
            ease: "none",
            repeat: -1,
        });

        return () => {
            animation.kill();
        };
    }, [userName, taskName]);

    const content = `( ${userName} | ${taskName} )`;

    return (
        <div ref={containerRef} className={`overflow-hidden whitespace-nowrap ${className}`}>
            <div ref={textRef} className="inline-flex gap-4">
                <span>{content}</span>
                <span>{content}</span>
                <span>{content}</span>
                <span>{content}</span>
            </div>
        </div>
    );
}
