import Image from "next/image";
import Link from "next/link";
import { editorial } from "@/content/site";
import { Parallax } from "@/components/motion/parallax";
import { ArrowRightIcon } from "@/components/ui/icons";

/** Split editorial: full-height image left, numbered ritual right. */
export function Ritual() {
  return (
    <section className="hairline-t grid lg:grid-cols-2" aria-labelledby="ritual-heading">
      <Parallax amount={6} className="relative aspect-[4/5] lg:aspect-auto lg:min-h-[100vh]">
        <Image src={editorial.image.src} alt={editorial.image.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
      </Parallax>
      <div className="flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-20 lg:py-24">
        <p className="eyebrow" data-reveal>
          {editorial.eyebrow}
        </p>
        <h2 id="ritual-heading" className="h-display mt-4 text-5xl md:text-6xl" data-reveal style={{ "--d": "100ms" } as React.CSSProperties}>
          {editorial.headline}
        </h2>
        <p className="mt-6 max-w-md text-[0.98rem] leading-relaxed text-plum" data-reveal style={{ "--d": "180ms" } as React.CSSProperties}>
          {editorial.text}
        </p>
        <ol className="mt-12 divide-y divide-line border-y border-line">
          {editorial.steps.map((s, i) => (
            <li key={s.n} className="grid grid-cols-[3.5rem_1fr] items-baseline gap-4 py-6" data-reveal style={{ "--d": `${240 + i * 90}ms` } as React.CSSProperties}>
              <span className="eyebrow-num">{s.n}</span>
              <div>
                <h3 className="font-serif text-2xl">{s.title}</h3>
                <p className="mt-1 text-sm text-plum">{s.text}</p>
                <Link href={s.href} className="link-underline mt-3 inline-block text-[0.62rem] tracking-luxe uppercase text-ink">
                  {s.linkLabel}
                </Link>
              </div>
            </li>
          ))}
        </ol>
        <Link href={editorial.cta.href} className="btn btn-primary mt-10 self-start" data-reveal style={{ "--d": "560ms" } as React.CSSProperties}>
          {editorial.cta.label} <ArrowRightIcon width={14} height={14} />
        </Link>
      </div>
    </section>
  );
}
