import Image from "next/image";
import Link from "next/link";
import { hero } from "@/content/site";

/**
 * Home hero (the client's pick for launch, Nov 2026): three shoot photos side
 * by side, edge to edge, left untouched; the slogan, the description and the
 * Shop button sit on a cream band right below them. On a phone the hero is the
 * TV photo alone and the band stacks under it. On desktop the photos stop
 * short of the window's foot so the band is on the first screen.
 */
export function Hero() {
  const { liner, tv, oil } = hero.photos;
  return (
    <section aria-labelledby="hero-heading">
      <div className="grid md:h-[min(50vw,calc(100svh-var(--announce-h)-var(--header-h)-8.5rem))] md:min-h-[440px] md:grid-cols-3">
        <div className="relative hidden md:block">
          <Image src={liner.src} alt={liner.alt} fill priority sizes="34vw" className="object-cover" />
        </div>
        <div className="relative aspect-[2/3] md:aspect-auto">
          <Image src={tv.src} alt={tv.alt} fill priority sizes="(min-width: 768px) 34vw, 100vw" className="object-cover" />
        </div>
        <div className="relative hidden md:block">
          <Image src={oil.src} alt={oil.alt} fill priority sizes="34vw" className="object-cover" />
        </div>
      </div>

      <div className="grid justify-items-start gap-4 bg-cream px-[6vw] pt-7 pb-9 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center md:gap-[4vw] md:px-[5vw] md:py-[2.6vw]">
        <h1 id="hero-heading" className="h-display text-[clamp(2.9rem,12.6vw,4rem)] leading-[0.95] md:text-[clamp(2.6rem,4vw,3.75rem)]">
          <span className="block text-[0.39em] leading-[1.1] tracking-[0.08em] uppercase">{hero.headlineLead}</span>
          <span className="block whitespace-nowrap italic text-rose-ink">{hero.headlineAccent}</span>
        </h1>
        <p className="p-serif text-[1.15rem] leading-[1.35] text-plum md:max-w-[34vw] md:text-[clamp(1.05rem,1.35vw,1.3rem)]">
          {hero.subhead}
        </p>
        <Link href={hero.primaryCta.href} className="btn btn-primary">
          {hero.primaryCta.label}
        </Link>
      </div>
    </section>
  );
}
