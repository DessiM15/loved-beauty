import Image from "next/image";
import Link from "next/link";
import { hero } from "@/content/site";
import { ArrowRightIcon } from "@/components/ui/icons";

/**
 * Hero: one message, one primary button, still imagery. Full-bleed blush
 * ground with an editorial two-image composition. Swap `hero.image` for the
 * campaign shot when the photoshoot is done; the layout is built for a 4:5.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-blush" aria-labelledby="hero-heading">
      {/* soft glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 70% at 80% 30%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 60%), radial-gradient(50% 60% at 10% 90%, rgba(244,207,214,0.9) 0%, rgba(244,207,214,0) 60%)",
        }}
      />
      <div className="container-lb relative grid items-center gap-10 py-14 md:py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:py-24">
        <div className="animate-fade-up max-w-xl">
          <p className="eyebrow">{hero.eyebrow}</p>
          <h1 id="hero-heading" className="h-display mt-4 text-5xl md:text-6xl lg:text-7xl">
            {hero.headline}
          </h1>
          <p className="mt-5 max-w-md text-[1.02rem] leading-relaxed text-plum">{hero.subhead}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href={hero.primaryCta.href} className="btn btn-primary">
              {hero.primaryCta.label} <ArrowRightIcon width={14} height={14} />
            </Link>
            <Link href={hero.secondaryCta.href} className="btn btn-outline">
              {hero.secondaryCta.label}
            </Link>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[0.68rem] tracking-luxe uppercase text-plum">
            <li>Vegan</li>
            <li>Cruelty-free</li>
            <li>Paraben-free</li>
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-soft">
            <Image
              src={hero.image.src}
              alt={hero.image.alt}
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-4 hidden w-[42%] overflow-hidden rounded-[1.5rem] border-4 border-cream shadow-card sm:block lg:-left-10">
            <div className="relative aspect-[4/5]">
              <Image src={hero.imageSecondary.src} alt={hero.imageSecondary.alt} fill sizes="20vw" className="object-cover" />
            </div>
          </div>
          <div className="absolute top-5 -right-2 rounded-full bg-white/90 px-4 py-2 text-[0.62rem] tracking-luxe uppercase text-rose-deep shadow-card backdrop-blur sm:right-4">
            Free shipping $200+
          </div>
        </div>
      </div>
    </section>
  );
}
