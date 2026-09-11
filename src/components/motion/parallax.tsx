"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Gentle vertical drift for full-bleed imagery (a few percent, never more).
 * The child is scaled slightly so edges never show. Disabled for reduced motion.
 */
export function Parallax({ children, amount = 8, className }: { children: ReactNode; amount?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const target = inner.current;
    if (!el || !target) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < 0 || r.top > vh) return;
      // progress -1 (below viewport) → 1 (above viewport)
      const p = ((r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2)) * -1;
      target.style.transform = `translate3d(0, ${(p * amount).toFixed(2)}%, 0) scale(${1 + amount / 100 + 0.02})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [amount]);

  return (
    <div ref={ref} className={className} style={{ overflow: "hidden" }}>
      <div ref={inner} className="h-full w-full will-change-transform" style={{ transform: `scale(${1 + amount / 100 + 0.02})` }}>
        {children}
      </div>
    </div>
  );
}
