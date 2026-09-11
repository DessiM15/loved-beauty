"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const KEY = "lb_loader_seen";
const DURATION = 1700;

/**
 * One-time brand loader: logo fades up over cream, a gold line draws, then
 * the curtain lifts. Shown once per browser session so shoppers are never
 * held up twice. NEXT_PUBLIC_LOADER_ALWAYS=true forces it on every load (for review).
 */
export function Loader() {
  const [state, setState] = useState<"hidden" | "showing" | "leaving">("hidden");

  useEffect(() => {
    const always = process.env.NEXT_PUBLIC_LOADER_ALWAYS === "true";
    let seen = false;
    try {
      seen = sessionStorage.getItem(KEY) === "1";
    } catch {
      /* ignore */
    }
    if (seen && !always) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t0 = setTimeout(() => setState("showing"), 0);
    const t1 = setTimeout(() => setState("leaving"), DURATION);
    const t2 = setTimeout(() => {
      setState("hidden");
      document.body.style.overflow = prev;
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {
        /* ignore */
      }
    }, DURATION + 900);
    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      document.body.style.overflow = prev;
    };
  }, []);

  if (state === "hidden") return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-cream transition-transform duration-[900ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${
        state === "leaving" ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="animate-fade-up">
        <Image src="/brand/logo-rose.png" alt="" width={1725} height={447} priority className="h-12 w-auto md:h-16" />
      </div>
      <div className="mt-8 h-px w-40 overflow-hidden bg-line">
        <div className="h-full origin-left bg-gold" style={{ animation: `loader-bar ${DURATION}ms cubic-bezier(0.16,1,0.3,1) both` }} />
      </div>
      <p className="mt-5 text-[0.6rem] tracking-luxe uppercase text-plum animate-fade-up" style={{ animationDelay: "300ms" }}>
        Clean · Vegan · Cruelty-free
      </p>
    </div>
  );
}
