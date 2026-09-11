import Image from "next/image";
import Link from "next/link";
import { hero, noir } from "@/content/site";
import { ArrowRightIcon } from "@/components/ui/icons";
import { ThemeSwitch } from "@/components/theme/themed";

/** Home hero. Two compositions, one per design version; the theme switch picks. */
export function Hero() {
  return <ThemeSwitch light={<HeroLight />} noir={<HeroNoir />} />;
}

const IVORY = "#f5ece6";
const ROSE = "#e3a5b4";
const PLUM_TEXT = "#c9b6bb";

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

/**
 * V2: the wordmark and the model share the frame. "Loved / Beauty" sits left,
 * the cut-out model stands right and crosses only the tail of the word; a faint
 * outline of the letters is drawn in front of her so the type still reads.
 */
function HeroNoir() {
  const wordmark = (
    <>
      <span className="block font-serif">Loved</span>
      <span className="block font-serif italic">Beauty</span>
    </>
  );
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-cream" aria-labelledby="hero-heading" data-hero-tone="dark">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 60% at 68% 45%, rgba(212,173,92,0.16) 0%, rgba(212,173,92,0) 60%), radial-gradient(120% 90% at 50% 100%, #1a1214 0%, #120d0e 60%, #0c0809 100%)",
        }}
      />

      {/* desktop: wordmark left, model right, ghost outline in front */}
      <div className="absolute inset-0 hidden md:block" aria-hidden="true">
        <div className="absolute inset-x-0 top-[calc(var(--header-h)+1.5rem)] pl-[11vw] leading-[0.82] select-none text-[15vw]" style={{ animation: "fade-up 1.6s cubic-bezier(0.16,1,0.3,1) both", animationDelay: "200ms" }}>
          <div className="[&>span:first-child]:text-ink/95 [&>span:last-child]:text-rose-deep">{wordmark}</div>
        </div>
        <div className="absolute top-[var(--header-h)] right-0 bottom-0 left-[18%]">
          <Image
            src={noir.hero.model}
            alt={noir.hero.alt}
            fill
            priority
            fetchPriority="high"
            sizes="82vw"
            className="object-contain object-left-bottom"
            style={{ animation: "fade-up 1.8s cubic-bezier(0.16,1,0.3,1) both", animationDelay: "500ms" }}
          />
        </div>
        {/* ghost outline so covered letters still trace through her */}
        <div
          className="pointer-events-none absolute inset-x-0 top-[calc(var(--header-h)+1.5rem)] pl-[11vw] leading-[0.82] select-none text-[15vw]"
          style={{ WebkitTextStroke: "1px rgba(245,236,230,0.4)", color: "transparent", animation: "fade-up 1.6s cubic-bezier(0.16,1,0.3,1) both", animationDelay: "900ms" }}
        >
          {wordmark}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[46%]" style={{ background: "linear-gradient(180deg, rgba(18,13,14,0) 0%, rgba(18,13,14,0.82) 42%, rgba(18,13,14,0.97) 100%)" }} />
      </div>

      {/* phones: flat portrait */}
      <div className="absolute inset-0 md:hidden">
        <Image src={noir.hero.portrait} alt={noir.hero.alt} fill priority sizes="100vw" className="object-cover object-[50%_20%]" style={{ animation: "ken-burns 2.4s cubic-bezier(0.16,1,0.3,1) both" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(18,13,14,0.5) 0%, rgba(18,13,14,0) 25%, rgba(18,13,14,0.2) 50%, rgba(18,13,14,0.85) 75%, rgba(18,13,14,0.98) 100%)" }} />
      </div>

      <div className="container-lb relative pb-14 pt-[calc(var(--header-h)+6rem)] md:pb-14">
        <HeroCopy dark compact />
      </div>
      <ScrollCue dark />
    </section>
  );
}

/** Launch copy. `dark` forces ivory type regardless of theme (both heroes sit on dark photography). */
function HeroCopy({ dark = false, compact = false }: { dark?: boolean; compact?: boolean }) {
  const ink = dark ? IVORY : undefined;
  return (
    <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
      <p className="eyebrow text-[0.72rem] animate-fade-up" style={{ animationDelay: "500ms", color: dark ? ROSE : undefined }}>
        {hero.eyebrow}
      </p>
      <h1 id="hero-heading" className={`h-display mt-5 animate-fade-up ${compact ? "text-5xl sm:text-6xl md:text-7xl" : "text-[3.4rem] sm:text-7xl md:text-8xl"}`} style={{ animationDelay: "650ms", color: ink }}>
        {hero.headlineLead} <em className="h-italic" style={{ color: dark ? ROSE : undefined }}>{hero.headlineItalic}</em>
      </h1>
      <span className="mt-6 gold-rule animate-fade-up" style={{ animationDelay: "720ms" }} />
      <p className="mx-auto mt-6 max-w-md text-[0.98rem] leading-relaxed animate-fade-up" style={{ animationDelay: "800ms", color: dark ? PLUM_TEXT : undefined }}>
        {hero.subhead}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-5 animate-fade-up" style={{ animationDelay: "950ms" }}>
        <Link href={hero.primaryCta.href} className="btn" style={dark ? { background: IVORY, color: "#17110f", borderColor: IVORY } : undefined}>
          {hero.primaryCta.label} <ArrowRightIcon width={14} height={14} />
        </Link>
        <Link href={hero.secondaryCta.href} className="link-underline text-[0.68rem] tracking-luxe uppercase" style={{ color: ink }}>
          {hero.secondaryCta.label}
        </Link>
      </div>
    </div>
  );
}

function ScrollCue({ dark = false }: { dark?: boolean }) {
  return (
    <div className="absolute right-6 bottom-8 hidden flex-col items-center gap-3 md:flex" aria-hidden="true" style={{ color: dark ? PLUM_TEXT : undefined }}>
      <span className="text-[0.58rem] tracking-luxe uppercase [writing-mode:vertical-rl]">Scroll</span>
      <span className="block h-12 w-px overflow-hidden" style={{ background: dark ? "rgba(245,236,230,0.2)" : undefined }}>
        <span className="block h-full w-full" style={{ background: dark ? IVORY : undefined, animation: "scroll-cue 2.4s cubic-bezier(0.76,0,0.24,1) infinite" }} />
      </span>
    </div>
  );
}
