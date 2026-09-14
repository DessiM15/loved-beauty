import Image from "next/image";
import Link from "next/link";
import { hero } from "@/content/site";
import { ArrowRightIcon } from "@/components/ui/icons";

/**
 * Home hero, option 1G (the client's pick, 14 Sept 2026): her counter photo
 * full-bleed, the slogan floating on the wall to the left of the spray.
 * "Beauty That" in letter-spaced capitals, "Loves You Back" in the brand pink
 * italic beneath it, the serif subhead, Shop the Collection and Our Story.
 * On phones the copy sits at the top and the photo is cropped to its right
 * side so the spray stays in frame.
 */
export function Hero() {
  return (
    <section className="relative flex min-h-[calc(100svh-var(--announce-h)-var(--header-h))] flex-col overflow-hidden md:aspect-[16/9] md:max-h-[860px] md:min-h-0" aria-labelledby="hero-heading">
      <Image
        src={hero.photo.src}
        alt={hero.photo.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-[78%_50%] md:object-center"
      />
      {/* Phone only: a soft shadow over the top of the wall so the pink italic and the copy read where they cross the sunlit wall. */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(70,48,42,0.26)_0%,rgba(70,48,42,0.12)_38%,rgba(70,48,42,0)_62%)] md:hidden" aria-hidden="true" />

      <div className="relative z-10 flex flex-1 flex-col pt-[7%] pl-[7%] pr-[6%] md:absolute md:inset-y-0 md:left-[7%] md:w-[46%] md:justify-center md:p-0">
        <div className="grid w-[80%] gap-4 sm:w-[62%] md:w-full md:gap-5 md:-translate-y-[2%]">
          <h1 id="hero-heading" className="h-display text-[2.3rem] leading-[0.92] sm:text-[3.2rem] md:text-[clamp(3.8rem,7.3vw,6.6rem)] animate-fade-up" style={{ animationDelay: "200ms" }}>
            <span className="h-lead whitespace-nowrap">{hero.headlineLead}</span>
            <span className="h-italic block whitespace-nowrap [text-shadow:0_1px_3px_rgba(70,48,42,0.28)] md:[text-shadow:none]">{hero.headlineAccent}</span>
          </h1>
          <p className="p-serif max-w-[18ch] text-[1.1rem] leading-[1.3] text-plum sm:max-w-[22ch] md:max-w-[26ch] md:text-[clamp(1.2rem,1.8vw,1.65rem)] animate-fade-up" style={{ animationDelay: "340ms" }}>
            {hero.subhead}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-6 gap-y-4 animate-fade-up" style={{ animationDelay: "480ms" }}>
            <Link href={hero.primaryCta.href} className="btn btn-primary">
              {hero.primaryCta.label} <ArrowRightIcon width={14} height={14} />
            </Link>
            <Link href={hero.secondaryCta.href} className="border-b border-current pb-0.5 text-[0.7rem] font-medium tracking-luxe uppercase text-ink transition-colors hover:text-plum">
              {hero.secondaryCta.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
