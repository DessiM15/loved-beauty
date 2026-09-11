import Image from "next/image";
import Link from "next/link";
import { statement } from "@/content/site";
import { Parallax } from "@/components/motion/parallax";

/** The big-type moment: one sentence over blush silk, drifting slowly. */
export function Statement() {
  return (
    <section className="relative overflow-hidden" aria-labelledby="statement-heading">
      <Parallax amount={7} className="absolute inset-0">
        <Image src={statement.image.src} alt={statement.image.alt} fill sizes="100vw" className="object-cover" />
      </Parallax>
      <div className="absolute inset-0 bg-cream/55" />
      <div className="container-lb relative flex min-h-[70vh] flex-col items-center justify-center py-28 text-center">
        <p className="eyebrow" data-reveal>
          {statement.eyebrow}
        </p>
        <h2 id="statement-heading" className="h-display mt-6 max-w-5xl text-5xl text-ink sm:text-6xl md:text-[5.5rem]" data-reveal style={{ "--d": "120ms" } as React.CSSProperties}>
          {statement.lineOne} <em className="h-italic text-rose-deep">{statement.lineTwo}</em>
        </h2>
        <span className="mt-8 gold-rule w-16" data-reveal="fade" style={{ "--d": "260ms" } as React.CSSProperties} />
        <p className="mt-6 max-w-lg text-[0.98rem] leading-relaxed text-plum" data-reveal style={{ "--d": "320ms" } as React.CSSProperties}>
          {statement.text}
        </p>
        <Link href={statement.cta.href} className="btn btn-outline mt-9" data-reveal style={{ "--d": "420ms" } as React.CSSProperties}>
          {statement.cta.label}
        </Link>
      </div>
    </section>
  );
}
