"use client";

import { useRef, useState, useEffect, memo } from "react";

/** px/detik — 35 = elegan, 60 = news ticker cepat */
const SCROLL_SPEED = 35;
/** gap antar card — sync dengan space-y-3 = 12px */
const CARD_GAP = 12;

interface AnimatedColumnProps {
    children: React.ReactNode;
    shouldAnimate: boolean;
    projectsKey: string;
}

export const AnimatedColumn = memo(
    function AnimatedColumn({ children, shouldAnimate, projectsKey }: AnimatedColumnProps) {
        const containerRef = useRef<HTMLDivElement>(null);
        const singleRef = useRef<HTMLDivElement>(null);
        const [needsScroll, setNeedsScroll] = useState(false);
        const [singleHeight, setSingleHeight] = useState(0);

        // ── Ukur tinggi satu salinan ──
        useEffect(() => {
            setNeedsScroll(false);
            setSingleHeight(0);

            const container = containerRef.current;
            const single = singleRef.current;
            if (!container || !single) return;

            const tid = setTimeout(() => {
                const contentH = single.scrollHeight;
                if (shouldAnimate || contentH > container.clientHeight) {
                    // Bulatkan ke bilangan bulat agar hardware TV tidak jitter (subpixel rendering error)
                    setSingleHeight(Math.ceil(contentH + CARD_GAP));
                    setNeedsScroll(true);
                }
            }, 300);

            return () => clearTimeout(tid);
        }, [projectsKey, shouldAnimate]);

        const duration = singleHeight / SCROLL_SPEED;

        return (
            <div ref={containerRef} className="overflow-hidden h-full relative">
                {needsScroll && (
                    <style>{`
                        @keyframes tv-marquee-${projectsKey} {
                            0% { transform: translate3d(0, 0, 0); }
                            100% { transform: translate3d(0, -${singleHeight}px, 0); }
                        }
                    `}</style>
                )}

                <div
                    style={
                        needsScroll
                            ? {
                                willChange: "transform",
                                contain: "layout style",
                                animation: `tv-marquee-${projectsKey} ${duration}s linear infinite`,
                                // Hardware Acceleration mutlak untuk Android jadul (Smart TV/Android Box HW Compose)
                                transform: "translateZ(0)",
                                WebkitTransform: "translateZ(0)",
                                backfaceVisibility: "hidden",
                                WebkitBackfaceVisibility: "hidden",
                                perspective: 1000,
                                WebkitPerspective: 1000,
                            }
                            : {}
                    }
                >
                    {/* Salinan 1 — dipakai untuk mengukur tinggi */}
                    <div ref={singleRef} className="space-y-3">
                        {children}
                    </div>

                    {/* Salinan 2 — hanya mount saat scroll aktif */}
                    {needsScroll && (
                        <div className="space-y-3" style={{ marginTop: CARD_GAP }}>
                            {children}
                        </div>
                    )}
                </div>
            </div>
        );
    }
);

