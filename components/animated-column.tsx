"use client";

import { useRef, useState, useEffect, memo } from "react";
import gsap from "gsap";

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
        const trackRef = useRef<HTMLDivElement>(null);
        const singleRef = useRef<HTMLDivElement>(null);
        const offsetRef = useRef(0);                    // posisi Y saat ini (px)
        const [needsScroll, setNeedsScroll] = useState(false);
        const [singleHeight, setSingleHeight] = useState(0);

        // ── Ukur tinggi satu salinan ──
        useEffect(() => {
            setNeedsScroll(false);
            setSingleHeight(0);
            offsetRef.current = 0;

            const container = containerRef.current;
            const single = singleRef.current;
            if (!container || !single) return;

            const tid = setTimeout(() => {
                const contentH = single.scrollHeight;
                if (shouldAnimate || contentH > container.clientHeight) {
                    setSingleHeight(contentH + CARD_GAP);
                    setNeedsScroll(true);
                }
            }, 300);

            return () => clearTimeout(tid);
        }, [projectsKey, shouldAnimate]);

        // ── GSAP Ticker: tambah offset tiap frame, wrap pakai modulo ──
        useEffect(() => {
            const track = trackRef.current;
            if (!needsScroll || singleHeight === 0 || !track) return;

            // Reset offset ke 0 setiap kali ukuran berubah
            offsetRef.current = 0;
            gsap.set(track, { y: 0, force3D: true });

            const tick = (_time: number, deltaTime: number) => {
                // Kurangi offset: bergerak ke atas
                offsetRef.current -= (SCROLL_SPEED * deltaTime) / 1000;

                // Modulo wrap — tidak pernah reset paksa, hanya "bungkus" angka
                // Salinan 2 sudah ada persis di bawah salinan 1 sejauh singleHeight
                // sehingga transisi wrap ini tidak terlihat sama sekali
                if (offsetRef.current <= -singleHeight) {
                    offsetRef.current += singleHeight;
                }

                gsap.set(track, { y: offsetRef.current, force3D: true });
            };

            gsap.ticker.add(tick);
            // fps 60 sudah default; lag smoothing agar spike CPU tidak bikin jolt
            gsap.ticker.lagSmoothing(500, 33);

            return () => {
                gsap.ticker.remove(tick);
            };
        }, [needsScroll, singleHeight]);

        return (
            <div ref={containerRef} className="overflow-hidden h-full">
                <div
                    ref={trackRef}
                    style={{
                        willChange: needsScroll ? "transform" : "auto",
                        contain: needsScroll ? "layout style" : "none",
                    }}
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

