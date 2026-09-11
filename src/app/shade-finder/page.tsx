import type { Metadata } from "next";
import { ShadeFinder } from "@/components/shade/shade-finder";
import { JsonLd } from "@/components/ui/json-ld";
import { site } from "@/content/site";

export const metadata: Metadata = {
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
    <div className="bg-blush/50">
      <div className="container-lb py-12 md:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Shade finder</p>
          <h1 className="h-display mt-3 text-5xl md:text-6xl">Find your shade in 30 seconds.</h1>
          <p className="mt-4 text-[0.98rem] leading-relaxed text-plum">
            Not sure which liner or gloss is yours? Snap a selfie or answer three quick questions and we&rsquo;ll match you to the shades that
            flatter your undertone.
          </p>
        </div>
        <div className="mt-10">
          <ShadeFinder selfieEnabled={selfieEnabled} />
        </div>
      </div>
      <JsonLd data={ld} />
    </div>
  );
}
