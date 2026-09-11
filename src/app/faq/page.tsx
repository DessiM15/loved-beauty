import type { Metadata } from "next";
import Link from "next/link";
import { faqs, site } from "@/content/site";
import { Accordion } from "@/components/ui/accordion";
import { JsonLd } from "@/components/ui/json-ld";

export const metadata: Metadata = {
  title: "FAQ | Shipping, Returns & Ingredients",
  description:
    "Answers to common questions about Loved Beauty shipping times, returns on cosmetics, vegan and cruelty-free ingredients, and how to use our lip and glow products.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="container-lb py-12 md:py-16">
      <div className="mx-auto max-w-2xl">
        <p className="eyebrow">Help</p>
        <h1 className="h-display mt-3 text-5xl">Frequently asked questions</h1>
        <p className="mt-3 text-[0.95rem] text-plum">
          Can&rsquo;t find what you need?{" "}
          <Link href="/contact" className="text-ink underline underline-offset-4">
            Contact us
          </Link>{" "}
          or email{" "}
          <a href={`mailto:${site.supportEmail}`} className="text-ink underline underline-offset-4">
            {site.supportEmail}
          </a>
          .
        </p>
        <Accordion className="mt-8" items={faqs.map((f) => ({ title: f.q, content: <p>{f.a}</p> }))} defaultOpen={0} />
      </div>
      <JsonLd data={ld} />
    </div>
  );
}
