import Image from "next/image";
import Link from "next/link";
import { editorial } from "@/content/site";
import { ArrowRightIcon } from "@/components/ui/icons";

/** One editorial moment. Image plus a three-step ritual that ends in a CTA. */
export function EditorialSplit() {
  const steps = [
    { n: "01", title: "Prep", text: "Sugar Lip Scrub, 30 seconds, twice a week." },
    { n: "02", title: "Define", text: "Lip Liner Pencil to outline and fill." },
    { n: "03", title: "Glow", text: "Lustre Gloss or Lip Oil to finish." },
  ];
  return (
    <section className="container-lb py-16 md:py-24" aria-labelledby="editorial-heading">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
        <div className="relative order-2 aspect-[4/5] overflow-hidden rounded-[2rem] bg-blush lg:order-1">
          <Image src={editorial.image.src} alt={editorial.image.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
        <div className="order-1 lg:order-2">
          <p className="eyebrow">{editorial.eyebrow}</p>
          <h2 id="editorial-heading" className="h-display mt-3 text-4xl md:text-5xl">
            {editorial.headline}
          </h2>
          <p className="mt-4 max-w-md text-[0.98rem] leading-relaxed text-plum">{editorial.text}</p>
          <ol className="mt-8 space-y-5">
            {steps.map((s) => (
              <li key={s.n} className="flex gap-4">
                <span className="font-serif text-2xl text-gold">{s.n}</span>
                <div>
                  <p className="font-medium">{s.title}</p>
                  <p className="text-sm text-plum">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <Link href={editorial.cta.href} className="btn btn-outline mt-8">
            {editorial.cta.label} <ArrowRightIcon width={14} height={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
