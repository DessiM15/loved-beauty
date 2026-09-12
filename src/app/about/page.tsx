import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { about, hero, site, values } from "@/content/site";
import { ArrowRightIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Our Story | Clean, Vegan Beauty from Houston, Texas",
  description:
    "Loved Beauty is a vegan, cruelty-free beauty brand founded in Houston, Texas. Learn about our clean formulas, our values and why every product is made to feel like a little luxury.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <section className="container-lb grid items-center gap-12 py-12 md:py-20 lg:grid-cols-2 lg:gap-20">
        <div className="relative aspect-[4/5] overflow-hidden bg-pink/60" data-reveal>
          <Image src="/products/shimmer-glow-setting-spray-1.webp" alt="Loved Beauty Shimmer Glow Setting Spray" fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
        <div className="flex flex-col items-start">
          <p className="eyebrow" data-reveal>
            {about.eyebrow}
          </p>
          <h1 className="h-hero mt-4 text-4xl sm:text-5xl md:text-[3.9rem]" data-reveal style={{ "--d": "80ms" } as React.CSSProperties}>
            {hero.headlineLead}
            <br />
            <span className="h-italic">{hero.headlineAccent}</span>
          </h1>
          <div className="p-serif mt-8 space-y-5 text-[1.25rem] text-plum">
            {about.paragraphs.map((p, i) => (
              <p key={p} data-reveal style={{ "--d": `${120 + i * 80}ms` } as React.CSSProperties}>
                {p}
              </p>
            ))}
          </div>
          <p className="p-serif mt-8 text-[1.35rem] font-semibold text-ink" data-reveal style={{ "--d": "400ms" } as React.CSSProperties}>
            {about.founderNote}
          </p>
          <Link href="/shop" className="btn btn-primary mt-10" data-reveal style={{ "--d": "460ms" } as React.CSSProperties}>
            Shop the Collection <ArrowRightIcon width={14} height={14} />
          </Link>
        </div>
      </section>

      <section id="values" className="hairline-t scroll-mt-20 bg-pink/40" aria-labelledby="values-heading">
        <div className="container-lb py-16 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow" data-reveal>
              What we stand for
            </p>
            <h2 id="values-heading" className="h-display mt-4 text-4xl md:text-5xl" data-reveal style={{ "--d": "100ms" } as React.CSSProperties}>
              Gentle formulas. Honest ingredients.
            </h2>
            <p className="p-serif mt-5 text-[1.2rem] text-plum" data-reveal style={{ "--d": "200ms" } as React.CSSProperties}>
              Every Loved Beauty product is verified by our manufacturing partner as vegan, cruelty-free, paraben-free and sulfate-free. Full ingredient lists are printed on every box and
              listed on each product page.
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
          <p className="pt-10 text-center text-sm text-plum">
            Questions about an ingredient?{" "}
            <a href={`mailto:${site.supportEmail}`} className="link-underline text-ink">
              Email us
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
