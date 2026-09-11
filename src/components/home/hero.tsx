import Image from "next/image";
import Link from "next/link";
import { hero } from "@/content/site";
import { ArrowRightIcon } from "@/components/ui/icons";

/**
 * Full-bleed editorial hero. One image, one line, one button.
 * Desktop uses the wide crop, phones the portrait crop of the same shot.
 * The header sits transparently over the top of this section.
 */
export function Hero() {
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
        {/* soft legibility veil, light theme: cream from the bottom left */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(251,247,245,0.55)_0%,rgba(251,247,245,0)_22%,rgba(251,247,245,0)_45%,rgba(251,247,245,0.7)_70%,rgba(251,247,245,0.96)_100%)]" />
      </div>

      <div className="container-lb relative pb-16 pt-[calc(var(--header-h)+6rem)] md:pb-24">
        <div className="relative mx-auto max-w-4xl text-center">
          {/* soft cream spotlight so the type stays legible over any photo */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-24 -inset-y-16 md:-inset-x-48 md:-inset-y-28"
            style={{ background: "radial-gradient(ellipse at center, rgba(251,247,245,0.96) 0%, rgba(251,247,245,0.85) 40%, rgba(251,247,245,0.4) 62%, rgba(251,247,245,0) 76%)" }}
          />
          <div className="relative">
          <p className="eyebrow text-[0.72rem] text-ink animate-fade-up" style={{ animationDelay: "500ms" }}>
            {hero.eyebrow}
          </p>
          <h1 id="hero-heading" className="h-display mt-5 text-[3.4rem] text-ink animate-fade-up sm:text-7xl md:text-8xl" style={{ animationDelay: "650ms" }}>
            {hero.headlineLead} <em className="h-italic text-rose-deep">{hero.headlineItalic}</em>
          </h1>
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
      </div>

      {/* scroll cue */}
      <div className="absolute right-6 bottom-8 hidden flex-col items-center gap-3 md:flex" aria-hidden="true">
        <span className="text-[0.58rem] tracking-luxe uppercase text-plum [writing-mode:vertical-rl]">Scroll</span>
        <span className="block h-12 w-px overflow-hidden bg-line">
          <span className="block h-full w-full bg-ink" style={{ animation: "scroll-cue 2.4s cubic-bezier(0.76,0,0.24,1) infinite" }} />
        </span>
      </div>
    </section>
  );
}
