import Image from "next/image";
import Link from "next/link";
import { hero, noir } from "@/content/site";
import { ArrowRightIcon } from "@/components/ui/icons";
import { ThemeSwitch } from "@/components/theme/themed";

/** Home hero. Two compositions, one per design version; the theme switch picks. */
export function Hero() {
  return <ThemeSwitch light={<HeroLight />} noir={<HeroNoir />} />;
}

/** V1: full-bleed editorial photo, centered launch copy over a cream spotlight. */
function HeroLight() {
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-blush" aria-labelledby="hero-heading">
      <div className="absolute inset-0">
        <picture>
          <source media="(min-width: 768px)" srcSet="/editorial/hero.webp" />
          <Image
            src="/editorial/hero-portrait.webp"
            alt={hero.image.alt}
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-[50%_30%] md:object-[50%_38%]"
            style={{ animation: "ken-burns 2.4s cubic-bezier(0.16,1,0.3,1) both" }}
          />
        </picture>
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(var(--veil),0.55) 0%, rgba(var(--veil),0) 22%, rgba(var(--veil),0) 45%, rgba(var(--veil),0.7) 70%, rgba(var(--veil),0.96) 100%)" }} />
      </div>
      <div className="container-lb relative pb-16 pt-[calc(var(--header-h)+6rem)] md:pb-24">
        <HeroCopy />
      </div>
      <ScrollCue />
    </section>
  );
}

/**
 * V2: the wordmark splits the model. Huge serif "Loved / Beauty" sits behind a
 * cut-out of the model so she stands in front of the type; launch copy below
 * over a dark veil. Phones get the flat portrait with the same copy.
 */
function HeroNoir() {
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-cream" aria-labelledby="hero-heading">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 55% at 50% 42%, rgba(212,173,92,0.16) 0%, rgba(212,173,92,0) 60%), radial-gradient(120% 90% at 50% 100%, #1a1214 0%, #120d0e 60%, #0c0809 100%)",
        }}
      />

      {/* desktop: type behind, model in front */}
      <div className="absolute inset-0 hidden md:block" aria-hidden="true">
        <div className="absolute inset-x-0 top-[calc(var(--header-h)+1rem)] flex flex-col items-center leading-[0.8] select-none" style={{ animation: "fade-up 1.6s cubic-bezier(0.16,1,0.3,1) both", animationDelay: "200ms" }}>
          <span className="font-serif text-[15vw] text-ink/95">Loved</span>
          <span className="font-serif text-[15vw] italic text-rose-deep">Beauty</span>
        </div>
        <div className="absolute inset-x-0 top-[var(--header-h)] bottom-0">
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
        <div className="absolute inset-x-0 bottom-0 h-[48%]" style={{ background: "linear-gradient(180deg, rgba(18,13,14,0) 0%, rgba(18,13,14,0.8) 40%, rgba(18,13,14,0.97) 100%)" }} />
      </div>

      {/* phones: flat portrait */}
      <div className="absolute inset-0 md:hidden">
        <Image src={noir.hero.portrait} alt={noir.hero.alt} fill priority sizes="100vw" className="object-cover object-[50%_20%]" style={{ animation: "ken-burns 2.4s cubic-bezier(0.16,1,0.3,1) both" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(18,13,14,0.5) 0%, rgba(18,13,14,0) 25%, rgba(18,13,14,0.2) 50%, rgba(18,13,14,0.85) 75%, rgba(18,13,14,0.98) 100%)" }} />
      </div>

      <div className="container-lb relative pb-14 pt-[calc(var(--header-h)+6rem)] md:pb-14">
        <HeroCopy spotlight={false} compact />
      </div>
      <ScrollCue />
    </section>
  );
}

function HeroCopy({ spotlight = true, compact = false }: { spotlight?: boolean; compact?: boolean }) {
  return (
    <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
      {spotlight && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-24 -inset-y-16 md:-inset-x-48 md:-inset-y-28"
          style={{ background: "radial-gradient(ellipse at center, rgba(var(--veil),0.96) 0%, rgba(var(--veil),0.85) 40%, rgba(var(--veil),0.4) 62%, rgba(var(--veil),0) 76%)" }}
        />
      )}
      <div className="relative flex flex-col items-center">
        <p className="eyebrow text-[0.72rem] text-ink animate-fade-up" style={{ animationDelay: "500ms" }}>
          {hero.eyebrow}
        </p>
        <h1 id="hero-heading" className={`h-display mt-5 text-ink animate-fade-up ${compact ? "text-5xl sm:text-6xl md:text-7xl" : "text-[3.4rem] sm:text-7xl md:text-8xl"}`} style={{ animationDelay: "650ms" }}>
          {hero.headlineLead} <em className="h-italic text-rose-deep">{hero.headlineItalic}</em>
        </h1>
        <span className="mt-6 gold-rule animate-fade-up" style={{ animationDelay: "720ms" }} />
        <p className="mx-auto mt-6 max-w-md text-[0.98rem] leading-relaxed text-plum animate-fade-up" style={{ animationDelay: "800ms" }}>
          {hero.subhead}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-5 animate-fade-up" style={{ animationDelay: "950ms" }}>
          <Link href={hero.primaryCta.href} className="btn btn-primary">
            {hero.primaryCta.label} <ArrowRightIcon width={14} height={14} />
          </Link>
          <Link href={hero.secondaryCta.href} className="link-underline text-[0.68rem] tracking-luxe uppercase text-ink">
            {hero.secondaryCta.label}
          </Link>
        </div>
      </div>
    </div>
  );
}

function ScrollCue() {
  return (
    <div className="absolute right-6 bottom-8 hidden flex-col items-center gap-3 md:flex" aria-hidden="true">
      <span className="text-[0.58rem] tracking-luxe uppercase text-plum [writing-mode:vertical-rl]">Scroll</span>
      <span className="block h-12 w-px overflow-hidden bg-line">
        <span className="block h-full w-full bg-ink" style={{ animation: "scroll-cue 2.4s cubic-bezier(0.76,0,0.24,1) infinite" }} />
      </span>
    </div>
  );
}
