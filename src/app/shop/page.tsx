import type { Metadata } from "next";
import { getCollections, getProducts } from "@/lib/shopify";
import { CollectionView } from "@/components/product/collection-view";
import { collectionBanners, noir } from "@/content/site";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Shop All | Vegan Lip Gloss, Lip Care & Shimmer Sprays",
  description:
    "Shop every Loved Beauty product: hydrating lip gloss, lip oil, lip liner, sugar lip scrub, lip balm and shimmer sprays for face and body. Vegan and cruelty-free.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage() {
  const [products, collections] = await Promise.all([getProducts(), getCollections()]);
  const visibleCollections = collections.filter((c) => c.handle !== "bestsellers");

  return (
    <CollectionView
      title="Shop All"
      description="Everything, in one place. Clean, vegan and cruelty-free."
      products={products}
      collections={visibleCollections}
      banner={collectionBanners.shop}
      bannerDark={noir.banners.shop}
    />
  );
}
