import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { about, site, values } from "@/content/site";
import { ValueStrip } from "@/components/home/value-strip";
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
      <section className="bg-blush">
        <div className="container-lb grid items-center gap-10 py-16 md:py-24 lg:grid-cols-2">
          <div>
            <p className="eyebrow">{about.eyebrow}</p>
            <h1 className="h-display mt-3 text-5xl md:text-6xl">{about.headline}</h1>
            <div className="mt-6 space-y-4 text-[0.98rem] leading-relaxed text-plum">
              {about.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <p className="mt-8 font-serif text-xl italic text-ink">{about.founderNote}</p>
            <Link href="/shop" className="btn btn-primary mt-8">
              Shop the collection <ArrowRightIcon width={14} height={14} />
            </Link>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-soft">
              <Image
                src="/products/shimmer-glow-setting-spray-1.webp"
                alt="Loved Beauty Shimmer Glow Setting Spray"
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover"
              />
            </div>
            <Image
              src="/brand/monogram-rose.png"
              alt=""
              width={120}
              height={112}
              className="absolute -bottom-6 -left-6 h-20 w-auto rounded-2xl bg-cream p-3 shadow-card"
            />
          </div>
        </div>
      </section>

      <div id="values">
        <ValueStrip />
      </div>

      <section className="container-lb py-16 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">What we stand for</p>
          <h2 className="h-display mt-3 text-4xl">Gentle formulas. Honest ingredients.</h2>
          <p className="mt-4 text-[0.95rem] leading-relaxed text-plum">
            Every Loved Beauty product is verified by our manufacturing partner as vegan, cruelty-free, paraben-free and sulfate-free.
            Full ingredient lists are printed on every box and listed on each product page.
          </p>
        </div>
        <ul className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
          {values.map((v) => (
            <li key={v.key} className="rounded-2xl border border-petal bg-white p-5">
              <p className="font-serif text-2xl">{v.title}</p>
              <p className="mt-1 text-sm text-plum">{v.text}</p>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-center text-sm text-plum">
          Questions about an ingredient?{" "}
          <a href={`mailto:${site.supportEmail}`} className="text-ink underline underline-offset-4">
            Email us
          </a>
          .
        </p>
      </section>
    </>
  );
}
