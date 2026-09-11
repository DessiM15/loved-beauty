import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, getProductRecommendations, getProducts } from "@/lib/shopify";
import { ProductPurchase } from "@/components/product/product-purchase";
import { ProductGrid } from "@/components/product/product-grid";
import { Reviews } from "@/components/product/reviews";
import { Accordion } from "@/components/ui/accordion";
import { JsonLd } from "@/components/ui/json-ld";
import { SectionHeading } from "@/components/ui/section-heading";
import { site } from "@/content/site";
import { truncate } from "@/lib/utils";
import { BunnyIcon, DropIcon, LeafIcon, ShieldIcon } from "@/components/ui/icons";

export const revalidate = 60;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({ params }: PageProps<"/products/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return {};
  const title = product.seo.title ?? product.title;
  const description = product.seo.description ?? truncate(product.description);
  return {
    title,
    description,
    alternates: { canonical: `/products/${handle}` },
    openGraph: {
      type: "website",
      title,
      description,
      images: product.featuredImage ? [{ url: product.featuredImage.url, alt: product.featuredImage.altText ?? product.title }] : undefined,
    },
  };
}

const badgeIcons = {
  Vegan: LeafIcon,
  "Cruelty-free": BunnyIcon,
  Clean: DropIcon,
  "Paraben-free": ShieldIcon,
} as const;

export default async function ProductPage({ params }: PageProps<"/products/[handle]">) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();

  const related = await getProductRecommendations(product, 4);
  const details = product.details ?? {};

  const accordion = [
    details.benefits?.length
      ? {
          title: "Benefits",
          content: (
            <ul className="list-disc space-y-1 pl-5">
              {details.benefits.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          ),
        }
      : null,
    details.howToUse ? { title: "How to use", content: <p>{details.howToUse}</p> } : null,
    {
      title: "Ingredients",
      content: details.ingredients ? (
        <p>{details.ingredients}</p>
      ) : (
        <p>Full ingredient list is printed on the box. Vegan, cruelty-free, paraben-free and sulfate-free.</p>
      ),
    },
    {
      title: "Shipping & returns",
      content: (
        <p>
          Ships from Texas in 1 to 3 business days. Free U.S. shipping on orders over $200. Opened cosmetics can&rsquo;t be returned, but
          if anything arrives damaged we&rsquo;ll replace it.{" "}
          <Link href="/policies/shipping-returns" className="underline underline-offset-4">
            Read our policy
          </Link>
          .
        </p>
      ),
    },
  ].filter((i): i is NonNullable<typeof i> => Boolean(i));

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images.map((i) => (i.url.startsWith("http") ? i.url : `${site.url}${i.url}`)),
    sku: product.variants[0]?.id,
    brand: { "@type": "Brand", name: site.name },
    url: `${site.url}/products/${product.handle}`,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      lowPrice: product.priceRange.minVariantPrice.amount,
      highPrice: product.priceRange.maxVariantPrice.amount,
      offerCount: product.variants.length,
      availability: product.availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${site.url}/products/${product.handle}`,
      seller: { "@type": "Organization", name: site.legalName },
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "Shop", item: `${site.url}/shop` },
      { "@type": "ListItem", position: 3, name: product.title, item: `${site.url}/products/${product.handle}` },
    ],
  };

  return (
    <div className="container-lb py-8 md:py-12">
      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-plum">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:text-ink">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/shop" className="hover:text-ink">
              Shop
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-ink">
            {product.title}
          </li>
        </ol>
      </nav>

      <ProductPurchase product={product}>
        {details.badges && (
          <ul className="mb-6 flex flex-wrap gap-2">
            {details.badges.map((b) => {
              const Icon = badgeIcons[b as keyof typeof badgeIcons] ?? LeafIcon;
              return (
                <li key={b} className="inline-flex items-center gap-1.5 rounded-full border border-petal bg-white px-3 py-1.5 text-xs">
                  <Icon width={16} height={16} className="text-rose" /> {b}
                </li>
              );
            })}
          </ul>
        )}
        <Accordion items={accordion} defaultOpen={0} />
      </ProductPurchase>

      <Reviews productTitle={product.title} />

      {related.length > 0 && (
        <section className="mt-20" aria-labelledby="related-heading">
          <SectionHeading eyebrow="Complete the look" title="You may also like" align="left" link={{ label: "Shop all", href: "/shop" }} />
          <ProductGrid products={related} priorityCount={0} />
        </section>
      )}

      <JsonLd data={[productLd, breadcrumbLd]} />
    </div>
  );
}
