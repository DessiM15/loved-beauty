import type { Metadata } from "next";
import { getProducts } from "@/lib/shopify";
import { ProductGrid } from "@/components/product/product-grid";
import { SearchIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: true },
};

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const sp = await searchParams;
  const q = (typeof sp.q === "string" ? sp.q : "").trim();
  const products = q ? await getProducts({ query: q }) : [];

  return (
    <div className="container-lb py-10 md:py-14">
      <h1 className="h-display text-4xl md:text-5xl">{q ? `Results for “${q}”` : "Search"}</h1>
      <form action="/search" className="mt-6 flex max-w-xl items-center gap-2 rounded-full border border-petal bg-white px-4">
        <SearchIcon className="text-plum" width={18} height={18} />
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search lip gloss, shimmer spray…"
          className="w-full bg-transparent py-3 text-base outline-none"
          aria-label="Search products"
          autoFocus={!q}
        />
        <button type="submit" className="btn btn-primary min-h-0 px-4 py-2">
          Go
        </button>
      </form>
      <div className="mt-8">
        {q ? (
          <>
            <p className="mb-6 text-sm text-plum">
              {products.length} {products.length === 1 ? "result" : "results"}
            </p>
            <ProductGrid products={products} />
          </>
        ) : (
          <p className="text-sm text-plum">Try &ldquo;gloss&rdquo;, &ldquo;liner&rdquo; or &ldquo;shimmer&rdquo;.</p>
        )}
      </div>
    </div>
  );
}
