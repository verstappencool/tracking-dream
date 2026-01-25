"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";

interface AnimatedColumnProps {
    children: React.ReactNode;
    shouldAnimate: boolean;
    projectsKey: string;
}

export function AnimatedColumn({ children, shouldAnimate, projectsKey }: AnimatedColumnProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number | null>(null);
    const startTimeRef = useRef<number>(0);
    const [shouldLoop, setShouldLoop] = useState(false);
    const [scrollDistance, setScrollDistance] = useState(0);

    useEffect(() => {
        const container = containerRef.current;
        const wrapper = wrapperRef.current;

        if (!container || !wrapper) return;

        // Measure
        const measure = () => {
            const items = Array.from(wrapper.children);
            const halfLength = Math.ceil(items.length / 2);

            let totalHeight = 0;
            for (let i = 0; i < halfLength; i++) {
                totalHeight += (items[i] as HTMLElement).offsetHeight;
            }
            totalHeight += (halfLength - 1) * 12;

            const needsAnimation = shouldAnimate || totalHeight > container.clientHeight;
            setShouldLoop(needsAnimation);
            setScrollDistance(totalHeight + 12);

            if (!needsAnimation && wrapper) {
                wrapper.style.transform = 'translate3d(0, 0, 0)';
            }
        };

        requestAnimationFrame(() => {
            setTimeout(measure, 100);
        });

    }, [shouldAnimate, projectsKey, children]);

    // PURE requestAnimationFrame approach - paling smooth!
    useEffect(() => {
        if (!shouldLoop || scrollDistance === 0) return;

        const wrapper = wrapperRef.current;
        if (!wrapper) return;

        const SPEED = 25; // pixels per second
        const duration = (scrollDistance / SPEED) * 1000; // convert to ms
        startTimeRef.current = performance.now();

        const animate = (currentTime: number) => {
            if (!wrapper) return;

            const elapsed = currentTime - startTimeRef.current;
            const progress = (elapsed % duration) / duration;
            const yPos = -scrollDistance * progress;

            // Direct transform - bypass GSAP untuk max performance
            wrapper.style.transform = `translate3d(0, ${yPos}px, 0)`;

            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [shouldLoop, scrollDistance]);

    return (
        <div
            ref={containerRef}
            className="overflow-hidden h-full"
            style={{
                contain: "layout style paint",
            }}
        >
            <div
                ref={wrapperRef}
                className="space-y-3"
                style={{
                    transform: "translate3d(0, 0, 0)",
                    willChange: shouldLoop ? "transform" : "auto",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                }}
            >
                {children}
                {shouldLoop && children}
            </div>
        </div>
    );
}