import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { about, site, values } from "@/content/site";
import { Parallax } from "@/components/motion/parallax";
import { ArrowRightIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Our Story | Clean, Vegan Beauty from Cypress, Texas",
  description:
    "Loved Beauty is a vegan, cruelty-free beauty brand founded in Cypress, Texas. Learn about our clean formulas, our values and why every product is made to feel like a little luxury.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      {/* Full-bleed opener, header sits over it */}
      <section className="relative flex min-h-[80vh] flex-col justify-end overflow-hidden bg-blush">
        <Image src="/editorial/about.webp" alt="Model in a pink dress with a soft pink eye" fill priority sizes="100vw" className="object-cover object-[50%_20%]" style={{ animation: "ken-burns 2.4s cubic-bezier(0.16,1,0.3,1) both" }} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(251,247,245,0.05)_0%,rgba(251,247,245,0)_40%,rgba(251,247,245,0.9)_100%)]" />
        <div className="container-lb relative pt-[calc(var(--header-h)+6rem)] pb-12 md:pb-16">
          <p className="eyebrow animate-fade-up">{about.eyebrow}</p>
          <h1 className="h-display mt-4 max-w-4xl text-6xl md:text-8xl animate-fade-up" style={{ animationDelay: "120ms" }}>
            Beauty that feels like being <em className="h-italic text-rose-deep">loved.</em>
          </h1>
        </div>
      </section>

      <section className="hairline-t grid lg:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-20 lg:py-28">
          <div className="space-y-5 text-[1.02rem] leading-relaxed text-plum">
            {about.paragraphs.map((p, i) => (
              <p key={p} data-reveal style={{ "--d": `${i * 100}ms` } as React.CSSProperties}>
                {p}
              </p>
            ))}
          </div>
          <p className="h-italic mt-10 text-2xl text-ink" data-reveal style={{ "--d": "320ms" } as React.CSSProperties}>
            {about.founderNote}
          </p>
          <Link href="/shop" className="btn btn-primary mt-10 self-start" data-reveal style={{ "--d": "400ms" } as React.CSSProperties}>
            Shop the collection <ArrowRightIcon width={14} height={14} />
          </Link>
        </div>
        <Parallax amount={6} className="relative aspect-[4/5] border-t border-line lg:aspect-auto lg:border-t-0 lg:border-l">
          <Image src="/products/shimmer-glow-setting-spray-1.webp" alt="Loved Beauty Shimmer Glow Setting Spray" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </Parallax>
      </section>

      <section id="values" className="hairline-t scroll-mt-20" aria-labelledby="values-heading">
        <div className="container-lb py-16 md:py-24">
          <div className="max-w-2xl">
            <p className="eyebrow" data-reveal>
              What we stand for
            </p>
            <h2 id="values-heading" className="h-display mt-4 text-5xl md:text-6xl" data-reveal style={{ "--d": "100ms" } as React.CSSProperties}>
              Gentle formulas. <em className="h-italic text-rose-deep">Honest</em> ingredients.
            </h2>
            <p className="mt-5 text-[0.98rem] leading-relaxed text-plum" data-reveal style={{ "--d": "200ms" } as React.CSSProperties}>
              Every Loved Beauty product is verified by our manufacturing partner as vegan, cruelty-free, paraben-free and sulfate-free. Full ingredient lists are printed on every box and
              listed on each product page.
            </p>
          </div>
        </div>
        <ul className="grid hairline-t sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <li key={v.key} className="border-b border-line p-8 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0" data-reveal style={{ "--d": `${i * 90}ms` } as React.CSSProperties}>
              <span className="eyebrow-num">0{i + 1}</span>
              <p className="mt-3 font-serif text-3xl">{v.title}</p>
              <span className="mt-4 block gold-rule" />
              <p className="mt-4 text-sm text-plum">{v.text}</p>
            </li>
          ))}
        </ul>
        <p className="container-lb py-10 text-center text-sm text-plum">
          Questions about an ingredient?{" "}
          <a href={`mailto:${site.supportEmail}`} className="link-underline text-ink">
            Email us
          </a>
        </p>
      </section>
    </>
  );
}
