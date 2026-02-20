"use client";

import { useRef, useState, useEffect } from "react";

interface AnimatedColumnProps {
    children: React.ReactNode;
    shouldAnimate: boolean;
    projectsKey: string;
}

/** pixels per second the list travels when scrolling */
const SCROLL_SPEED = 40;
/** milliseconds to pause at the top before each scroll cycle */
const PAUSE_TOP_MS = 2500;

export function AnimatedColumn({ children, shouldAnimate, projectsKey }: AnimatedColumnProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number | null>(null);
    const [needsScroll, setNeedsScroll] = useState(false);
    const [scrollHeight, setScrollHeight] = useState(0);

    // Reset & measure whenever the set of projects changes.
    // At the time this runs, only a single copy of children is rendered
    // (because needsScroll is reset to false first), so content.scrollHeight
    // equals the true height of one full list — which is exactly what we
    // need for the seamless-loop math.
    useEffect(() => {
        setNeedsScroll(false);
        setScrollHeight(0);

        const container = containerRef.current;
        const content = contentRef.current;
        if (!container || !content) return;

        let raf: number;
        const measure = () => {
            const containerH = container.clientHeight;
            const contentH = content.scrollHeight;
            const overflows = shouldAnimate || contentH > containerH;
            if (overflows) {
                setScrollHeight(contentH);
                setNeedsScroll(true);
            }
        };

        // Wait for fonts/images to settle before measuring
        raf = requestAnimationFrame(() => setTimeout(measure, 150));
        return () => cancelAnimationFrame(raf);
    }, [projectsKey, shouldAnimate]);

    // Seamless vertical scroll loop via requestAnimationFrame.
    // When needsScroll is true the JSX renders children twice, so the total
    // DOM height is 2 × scrollHeight.  We animate y from 0 → -scrollHeight;
    // at that point the second copy is perfectly aligned with where the first
    // started, so the modulo wrap is invisible to the viewer.
    useEffect(() => {
        if (!needsScroll || scrollHeight === 0) {
            if (contentRef.current) {
                contentRef.current.style.transform = "translate3d(0,0,0)";
            }
            return;
        }

        const content = contentRef.current;
        if (!content) return;

        const scrollDuration = (scrollHeight / SCROLL_SPEED) * 1000; // ms
        const totalCycle = PAUSE_TOP_MS + scrollDuration;
        const startTime = performance.now();

        const animate = (now: number) => {
            const elapsed = (now - startTime) % totalCycle;
            // Hold at y=0 during the pause window, then scroll down
            const scrollElapsed = Math.max(0, elapsed - PAUSE_TOP_MS);
            const progress = scrollElapsed / scrollDuration;
            const y = -(scrollHeight * progress);
            content.style.transform = `translate3d(0,${y}px,0)`;
            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            if (rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
        };
    }, [needsScroll, scrollHeight]);

    return (
        <div
            ref={containerRef}
            className="overflow-hidden h-full"
        >
            <div
                ref={contentRef}
                className="space-y-3"
                style={{
                    transform: "translate3d(0,0,0)",
                    willChange: needsScroll ? "transform" : "auto",
                    backfaceVisibility: "hidden",
                }}
            >
                {children}
                {/* Second copy — only mounted when scrolling is needed, provides
                    the seamless "wrap-around" so the loop looks continuous. */}
                {needsScroll && children}
            </div>
        </div>
    );
}