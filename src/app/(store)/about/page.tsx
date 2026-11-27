import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { about, hero, values } from "@/content/site";
import { ArrowRightIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Our Story | Clean, Vegan Beauty from Houston, Texas",
  description:
    "Loved Beauty is a vegan, cruelty-free beauty brand founded in Houston, Texas. Learn about our clean formulas and our values.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      {/* Her photo, and a panel painted from the photo's own edge so the studio backdrop carries on behind the words. */}
      <section className="about-story text-ivory lg:grid lg:grid-cols-[50%_minmax(0,1fr)] xl:grid-cols-[42%_minmax(0,1fr)]" aria-labelledby="about-heading">
        {/* Phones: the slogan sits above her, on the top edge of the backdrop. */}
        <div className="about-head grid justify-items-center gap-3 px-6 pt-10 pb-4 text-center lg:hidden">
          <p className="eyebrow text-pink">{about.eyebrow}</p>
          <p aria-hidden="true" className="h-display text-[clamp(3rem,14vw,4.4rem)] leading-[0.95] text-ivory">
            <span className="block text-[0.42em] leading-[1.2] tracking-[0.08em] uppercase">{hero.headlineLead}</span>
            <span className="block whitespace-nowrap italic text-pink">{hero.headlineAccent}</span>
          </p>
        </div>
        <Image
          src="/hero/launch-tv.jpg"
          alt={hero.photos.tv.alt}
          width={1600}
          height={2400}
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="block h-auto w-full lg:h-full lg:object-cover lg:object-right"
        />
        <div className="about-words flex flex-col items-start justify-center px-6 pt-20 pb-12 lg:px-[5vw] lg:py-8 xl:pr-[8vw] xl:pl-[6vw]">
          <p className="eyebrow hidden text-pink lg:block">{about.eyebrow}</p>
          <h1 id="about-heading" className="h-display sr-only text-ivory lg:not-sr-only lg:mt-3 lg:text-[clamp(2.9rem,5.2vw,5.4rem)] lg:leading-[0.95]">
            <span className="block text-[0.42em] leading-[1.2] tracking-[0.08em] uppercase">{hero.headlineLead} </span>
            <span className="block whitespace-nowrap italic text-pink">{hero.headlineAccent}</span>
          </h1>
          <div className="p-serif space-y-5 text-[1.2rem] leading-[1.45] text-ivory lg:mt-6 lg:max-w-[38rem] lg:space-y-4 lg:text-[clamp(1.05rem,1.36vw,1.4rem)]">
            {about.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <p className="p-serif mt-7 text-[1.25rem] font-semibold text-ivory lg:mt-5 lg:max-w-[38rem] lg:text-[clamp(1.1rem,1.44vw,1.45rem)]">{about.founderNote}</p>
          <Link href="/shop" className="btn mt-9 lg:mt-7 border-pink bg-pink text-ink hover:border-white hover:bg-white">
            Shop the Collection <ArrowRightIcon width={14} height={14} />
          </Link>
        </div>
      </section>

      <section id="values" className="scroll-mt-20 border-t border-tan-line bg-tan/45" aria-labelledby="values-heading">
        <div className="container-lb py-16 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow" data-reveal>
              What we stand for
            </p>
            <h2 id="values-heading" className="h-display mt-4 text-4xl md:text-5xl" data-reveal style={{ "--d": "100ms" } as React.CSSProperties}>
              Gentle formulas. Honest ingredients.
            </h2>
            <p className="p-serif mt-5 text-[1.2rem] text-plum" data-reveal style={{ "--d": "200ms" } as React.CSSProperties}>
              Every Loved Beauty product is verified by our manufacturing partner as vegan, cruelty-free, paraben-free and sulfate-free. Full ingredient lists are printed on every box.
            </p>
          </div>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <li key={v.key} className="bg-white p-7 text-center" data-reveal style={{ "--d": `${i * 90}ms` } as React.CSSProperties}>
                <p className="h-display text-3xl">{v.title}</p>
                <p className="p-serif mt-2 text-[1.1rem] text-plum">{v.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
