import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getShopPolicies } from "@/lib/shopify";
import type { ShopPolicy } from "@/lib/shopify/types";

export const revalidate = 3600;

/** Map our friendly URLs to Shopify's policy handles. */
const ALIASES: Record<string, string[]> = {
  "shipping-returns": ["shipping-returns", "shipping-policy", "refund-policy"],
  privacy: ["privacy", "privacy-policy"],
  terms: ["terms", "terms-of-service"],
};

async function resolve(handle: string): Promise<ShopPolicy[] | null> {
  const policies = await getShopPolicies();
  const wanted = ALIASES[handle] ?? [handle];
  const hits = wanted.map((h) => policies.find((p) => p.handle === h)).filter((p): p is ShopPolicy => Boolean(p));
  return hits.length ? hits : null;
}

export async function generateStaticParams() {
  return Object.keys(ALIASES).map((handle) => ({ handle }));
}

export async function generateMetadata({ params }: PageProps<"/policies/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  const hits = await resolve(handle);
  if (!hits) return {};
  const title = handle === "shipping-returns" ? "Shipping & Returns" : hits[0].title;
  return { title, description: `${title} for Loved Beauty.`, alternates: { canonical: `/policies/${handle}` } };
}

export default async function PolicyPage({ params }: PageProps<"/policies/[handle]">) {
  const { handle } = await params;
  const hits = await resolve(handle);
  if (!hits) notFound();
  const title = handle === "shipping-returns" ? "Shipping & Returns" : hits[0].title;

  return (
    <div className="container-lb py-12 md:py-16">
      <div className="mx-auto max-w-2xl">
        <p className="eyebrow">Policies</p>
        <h1 className="h-display mt-3 text-5xl">{title}</h1>
        {hits.map((p) => (
          <article
            key={p.handle}
            className="mt-8 text-[0.95rem] leading-relaxed text-plum [&_a]:text-ink [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-8 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-ink [&_li]:mt-1 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: p.body }}
          />
        ))}
      </div>
    </div>
  );
}
