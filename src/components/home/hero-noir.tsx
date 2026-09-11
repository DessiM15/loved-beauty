"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { hero, noir } from "@/content/site";
import { HeroCopy, ScrollCue } from "./hero-copy";

/**
 * V2 hero, scroll-pinned.
 *
 * At rest: "Loved" left of the model, "Beauty" right of her. The section is
 * taller than the screen and its stage is sticky, so as the visitor scrolls
 * the hero holds in place while the model lifts away and the two words slide
 * together into "Loved Beauty". Once the sequence completes the page scrolls
 * on. Progress comes from the native scroll position, so there is no
 * hijacking and the wheel never feels stuck. Phones get the flat portrait.
 */
export function HeroNoir() {
  const section = useRef<HTMLElement>(null);
  const loved = useRef<HTMLSpanElement>(null);
  const beauty = useRef<HTMLSpanElement>(null);
  const model = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    const apply = (p: number) => {
      const ease = 1 - Math.pow(1 - p, 3); // ease-out cubic
      const spread = 15 * (1 - ease); // vw
      if (loved.current) loved.current.style.transform = `translate3d(${-spread}vw, 0, 0)`;
      if (beauty.current) beauty.current.style.transform = `translate3d(${spread}vw, 0, 0)`;
      if (model.current) {
        model.current.style.transform = `translate3d(0, ${-130 * ease}%, 0) scale(${1 - 0.08 * ease})`;
        model.current.style.opacity = String(1 - Math.max(0, (p - 0.55) / 0.45));
      }
      if (stage.current) stage.current.dataset.done = p >= 0.98 ? "true" : "false";
    };

    const update = () => {
      raf = 0;
      if (window.innerWidth < 768 || reduce) {
        apply(0);
        return;
      }
      const r = el.getBoundingClientRect();
      const travel = el.offsetHeight - window.innerHeight;
      const p = travel > 0 ? Math.min(1, Math.max(0, -r.top / travel)) : 0;
      apply(p);
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
  }, []);

  return (
    <section ref={section} className="relative md:h-[210vh] motion-reduce:md:h-auto" aria-labelledby="hero-heading" data-hero-tone="dark">
      <div ref={stage} className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-cream md:sticky md:top-0 md:h-[100svh]">
        {/* ground */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(55% 60% at 50% 40%, rgba(212,173,92,0.16) 0%, rgba(212,173,92,0) 60%), radial-gradient(120% 90% at 50% 100%, #1a1214 0%, #120d0e 60%, #0c0809 100%)",
          }}
        />

        {/* desktop stage */}
        <div className="absolute inset-0 hidden md:block" aria-hidden="true">
          {/* wordmark row: at rest the words sit either side of her, then meet in the middle */}
          <div
            className="absolute inset-x-0 top-[calc(var(--header-h)+10vh)] flex items-baseline justify-center gap-[0.22em] leading-none select-none text-[13vw]"
            style={{ animation: "fade-up 1.6s cubic-bezier(0.16,1,0.3,1) both", animationDelay: "200ms" }}
          >
            <span ref={loved} className="font-serif text-ink/95 will-change-transform" style={{ transform: "translate3d(-15vw,0,0)" }}>
              Loved
            </span>
            <span ref={beauty} className="relative z-20 font-serif italic text-rose-deep will-change-transform" style={{ transform: "translate3d(15vw,0,0)" }}>
              Beauty
            </span>
          </div>

          {/* model: bottom-anchored, centered, lifts away on scroll */}
          <div ref={model} className="absolute inset-x-0 top-[calc(var(--header-h)+6vh)] bottom-0 z-10 origin-bottom will-change-transform">
            <Image
              src={noir.hero.model}
              alt={noir.hero.alt}
              fill
              priority
              fetchPriority="high"
              sizes="100vw"
              className="object-contain object-bottom"
              style={{ animation: "fade-up 1.8s cubic-bezier(0.16,1,0.3,1) both", animationDelay: "500ms" }}
            />
          </div>

          <div className="absolute inset-x-0 bottom-0 z-10 h-[46%]" style={{ background: "linear-gradient(180deg, rgba(18,13,14,0) 0%, rgba(18,13,14,0.82) 42%, rgba(18,13,14,0.97) 100%)" }} />
        </div>

        {/* phones: flat portrait */}
        <div className="absolute inset-0 md:hidden">
          <Image src={noir.hero.portrait} alt={noir.hero.alt} fill priority sizes="100vw" className="object-cover object-[50%_20%]" style={{ animation: "ken-burns 2.4s cubic-bezier(0.16,1,0.3,1) both" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(18,13,14,0.5) 0%, rgba(18,13,14,0) 25%, rgba(18,13,14,0.2) 50%, rgba(18,13,14,0.85) 75%, rgba(18,13,14,0.98) 100%)" }} />
        </div>

        <div className="container-lb relative z-20 pb-14 pt-[calc(var(--header-h)+6rem)] md:pb-14">
          <HeroCopy dark compact />
        </div>
        <ScrollCue dark label={hero.scrollLabel} />
      </div>
    </section>
  );
}
