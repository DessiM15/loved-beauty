import Image from "next/image";
import { noir } from "@/content/site";
import { ThemeSwitch } from "@/components/theme/themed";
import { HeroNoir } from "./hero-noir";
import { HeroCopy, ScrollCue } from "./hero-copy";

/** Home hero. Two compositions, one per design version; the theme switch picks. */
export function Hero() {
  return <ThemeSwitch light={<HeroLight />} noir={<HeroNoir />} />;
}

/**
 * V1: full-bleed moody model photograph on the light site (dark hero, light
 * pages, the way editorial sites do it). Ivory copy over a dark veil.
 */
function HeroLight() {
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden" style={{ background: "#120d0e" }} aria-labelledby="hero-heading" data-hero-tone="dark">
      <div className="absolute inset-0">
        <picture>
          <source media="(min-width: 768px)" srcSet="/noir/hero-wide.webp" />
          <Image
            src={noir.hero.portrait}
            alt={noir.hero.alt}
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-[50%_20%] md:object-[50%_30%]"
            style={{ animation: "ken-burns 2.4s cubic-bezier(0.16,1,0.3,1) both" }}
          />
        </picture>
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(18,13,14,0.45) 0%, rgba(18,13,14,0) 22%, rgba(18,13,14,0) 42%, rgba(18,13,14,0.78) 68%, rgba(18,13,14,0.97) 100%)" }} />
      </div>
      <div className="container-lb relative pb-16 pt-[calc(var(--header-h)+6rem)] md:pb-20">
        <HeroCopy dark />
      </div>
      <ScrollCue dark />
    </section>
  );
}
