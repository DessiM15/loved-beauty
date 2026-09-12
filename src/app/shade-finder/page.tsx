import type { Metadata } from "next";
import Image from "next/image";
import { ShadeFinder } from "@/components/shade/shade-finder";
import { JsonLd } from "@/components/ui/json-ld";
import { site } from "@/content/site";

/** Hidden for launch: not linked anywhere and not indexed. The tool itself keeps working at /shade-finder for review. */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Find Your Shade | Lip Liner & Gloss Shade Finder",
  description:
    "Find your perfect Loved Beauty lip liner and gloss shade in 30 seconds. Use a selfie or answer three quick questions to get a personalized lip match for your undertone.",
  alternates: { canonical: "/shade-finder" },
};

export default function ShadeFinderPage() {
  const selfieEnabled = Boolean(process.env.ANTHROPIC_API_KEY);
  const ld = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Find Your Shade",
    description: "Personalized lip liner and gloss shade recommendations from Loved Beauty.",
    url: `${site.url}/shade-finder`,
    isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
  };

  return (
    <div>
      <section className="relative flex min-h-[60vh] flex-col justify-end overflow-hidden bg-blush">
        <Image src="/editorial/shade-page.webp" alt="Lip color swatches on the back of a hand" fill priority sizes="100vw" className="object-cover" style={{ objectPosition: "50% 40%" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(var(--veil),0.1) 0%, rgba(var(--veil),0) 40%, rgba(var(--veil),0.9) 100%)" }} />
        <div className="container-lb relative pt-[calc(var(--header-h)+5rem)] pb-12 text-center">
          <div className="relative mx-auto flex max-w-4xl flex-col items-center">
            <div aria-hidden="true" className="pointer-events-none absolute -inset-x-24 -inset-y-14 md:-inset-x-48 md:-inset-y-24" style={{ background: "radial-gradient(ellipse at center, rgba(var(--veil),0.96) 0%, rgba(var(--veil),0.85) 40%, rgba(var(--veil),0.4) 62%, rgba(var(--veil),0) 76%)" }} />
            <div className="relative">
          <p className="eyebrow animate-fade-up">Shade finder</p>
          <h1 className="h-display mx-auto mt-4 max-w-3xl text-6xl md:text-8xl animate-fade-up" style={{ animationDelay: "120ms" }}>
            Find your shade in <em className="h-italic text-rose-deep">30 seconds.</em>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[0.98rem] leading-relaxed text-plum animate-fade-up" style={{ animationDelay: "240ms" }}>
            Snap a selfie or answer three quick questions and we&rsquo;ll match you to the liner and gloss that flatter your undertone.
          </p>
            </div>
          </div>
        </div>
      </section>
      <div className="container-lb hairline-t py-14 md:py-20">
        <ShadeFinder selfieEnabled={selfieEnabled} />
      </div>
      <JsonLd data={ld} />
    </div>
  );
}
