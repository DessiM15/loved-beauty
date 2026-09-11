import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCollection, getCollectionProducts, getCollections } from "@/lib/shopify";
import { CollectionView } from "@/components/product/collection-view";
import { JsonLd } from "@/components/ui/json-ld";
import { site } from "@/content/site";
import { truncate } from "@/lib/utils";
import { collectionBanners } from "@/content/site";

export const revalidate = 60;

export async function generateStaticParams() {
  const collections = await getCollections();
  return collections.map((c) => ({ handle: c.handle }));
}

export async function generateMetadata({ params }: PageProps<"/collections/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  const collection = await getCollection(handle);
  if (!collection) return {};
  return {
    title: collection.seo.title ?? collection.title,
    description: collection.seo.description ?? truncate(collection.description || site.description),
    alternates: { canonical: `/collections/${handle}` },
    openGraph: collection.image ? { images: [{ url: collection.image.url, alt: collection.image.altText ?? collection.title }] } : undefined,
  };
}

export default async function CollectionPage({ params }: PageProps<"/collections/[handle]">) {
  const { handle } = await params;
  const [collection, products, collections] = await Promise.all([
    getCollection(handle),
    getCollectionProducts(handle),
    getCollections(),
  ]);
  if (!collection) notFound();

  const visibleCollections = collections.filter((c) => c.handle !== "bestsellers");

  const ld = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: collection.title,
    description: collection.description,
    url: `${site.url}/collections/${handle}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: products.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${site.url}/products/${p.handle}`,
        name: p.title,
      })),
    },
  };

  return (
    <>
      <CollectionView
        title={collection.title}
        description={collection.description}
        products={products}
        collections={visibleCollections}
        activeHandle={handle}
        banner={collectionBanners[handle] ?? (collection.image ? { src: collection.image.url, alt: collection.image.altText ?? collection.title, position: "50% 50%" } : null)}
      />
      <JsonLd data={ld} />
    </>
  );
}
