"use client";

import { useRef, useMemo } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface AnimatedColumnProps {
    children: React.ReactNode;
    shouldAnimate: boolean; // if total projects > 3
    projectsKey: string; // for dependency tracking
}

export function AnimatedColumn({ children, shouldAnimate, projectsKey }: AnimatedColumnProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // GSAP Animation for entire column
    useGSAP(() => {
        if (!shouldAnimate) {
            return;
        }

        const wrapper = wrapperRef.current;
        if (!wrapper) return;

        // Kill existing animations
        gsap.killTweensOf(wrapper);

        // Wait a bit for DOM to settle
        setTimeout(() => {
            if (!wrapper) return;

            // Get height of one set of content (karena duplicate untuk infinite effect)
            const items = wrapper.children;
            const itemCount = items.length / 2; // dibagi 2 karena di-duplicate
            let totalHeight = 0;

            for (let i = 0; i < itemCount; i++) {
                totalHeight += (items[i] as HTMLElement).offsetHeight;
            }

            // Add gap heights (space-y-3 = 0.75rem = 12px per gap)
            totalHeight += (itemCount - 1) * 12;

            // GSAP Timeline for smooth infinite loop
            const tl = gsap.timeline({
                repeat: -1, // infinite loop
            });

            // Pause 3 detik di awal
            tl.to({}, { duration: 3 });

            // Animate menggunakan transform translateY
            tl.to(wrapper, {
                y: -totalHeight,
                duration: 25, // 25 detik untuk column (lebih lambat karena lebih banyak content)
                ease: "none",
            });

            // Pause 2 detik di akhir
            tl.to({}, { duration: 2 });

            // Reset position untuk seamless loop
            tl.set(wrapper, { y: 0 });
        }, 500);

    }, {
        scope: containerRef,
        dependencies: [shouldAnimate, projectsKey],
        revertOnUpdate: true
    });

    if (!shouldAnimate) {
        return <div className="space-y-3">{children}</div>;
    }

    return (
        <div
            ref={containerRef}
            className="overflow-hidden max-h-[600px]"
        >
            <div
                ref={wrapperRef}
                className="space-y-3"
            >
                {children}
            </div>
        </div>
    );
}
