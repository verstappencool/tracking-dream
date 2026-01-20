"use client";

import { useRef, useState, useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface AnimatedColumnProps {
    children: React.ReactNode;
    shouldAnimate: boolean; // trigger untuk force animation atau bisa dideteksi otomatis
    projectsKey: string; // for dependency tracking
}

export function AnimatedColumn({ children, shouldAnimate, projectsKey }: AnimatedColumnProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [hasOverflow, setHasOverflow] = useState(false);

    // Deteksi overflow - cek apakah konten lebih tinggi dari container
    // Menggunakan useLayoutEffect agar deteksi terjadi sebelum paint
    useLayoutEffect(() => {
        const checkOverflow = () => {
            const container = containerRef.current;
            const wrapper = wrapperRef.current;

            if (!container || !wrapper) return;

            // Cek apakah wrapper height lebih besar dari container height
            const isOverflowing = wrapper.scrollHeight > container.clientHeight;
            setHasOverflow(isOverflowing);
        };

        // Check immediately
        checkOverflow();

        // Recheck saat window resize
        window.addEventListener('resize', checkOverflow);

        // Multiple timeouts untuk memastikan DOM sudah render sempurna
        const timeout1 = setTimeout(checkOverflow, 100);
        const timeout2 = setTimeout(checkOverflow, 300);
        const timeout3 = setTimeout(checkOverflow, 500);

        return () => {
            window.removeEventListener('resize', checkOverflow);
            clearTimeout(timeout1);
            clearTimeout(timeout2);
            clearTimeout(timeout3);
        };
    }, [projectsKey, children]);

    // Determine if should actually animate
    const actuallyAnimate = shouldAnimate || hasOverflow;

    // GSAP Animation for entire column
    useGSAP(() => {
        if (!actuallyAnimate) {
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
        dependencies: [actuallyAnimate, projectsKey, hasOverflow],
        revertOnUpdate: true
    });

    // SELALU render dengan refs agar bisa detect overflow
    // Duplicate children HANYA jika ada overflow
    return (
        <div
            ref={containerRef}
            className="overflow-hidden h-full"
        >
            <div
                ref={wrapperRef}
                className="space-y-3"
            >
                {children}
                {actuallyAnimate && children}
            </div>
        </div>
    );
}
