import type { Metadata } from "next";
import { getProducts } from "@/lib/shopify";
import { ProductGrid } from "@/components/product/product-grid";
import { SearchIcon } from "@/components/ui/icons";

function query(sp: Awaited<PageProps<"/search">["searchParams"]>): string {
  return (typeof sp.q === "string" ? sp.q : "").trim();
}

function countLabel(n: number): string {
  return n === 0 ? "No results" : `${n} ${n === 1 ? "result" : "results"}`;
}

/** The tab title carries the search and the count: it is the first thing a screen reader announces when the results load. */
export async function generateMetadata({ searchParams }: PageProps<"/search">): Promise<Metadata> {
  const q = query(await searchParams);
  const products = q ? await getProducts({ query: q }) : [];
  return {
    title: q ? `${countLabel(products.length)} for “${q}”` : "Search",
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const q = query(await searchParams);
  const products = q ? await getProducts({ query: q }) : [];

  return (
    <div className="container-lb py-10 md:py-14">
      <h1 className="h-display text-4xl md:text-5xl">{q ? `Results for “${q}”` : "Search"}</h1>
      <form action="/search" role="search" className="focus-ring-within mt-6 flex max-w-xl items-center gap-2 rounded-sm border border-line bg-white px-4">
        <SearchIcon className="text-plum" width={18} height={18} />
        <label htmlFor="search-q" className="sr-only">
          Search products
        </label>
        <input
          id="search-q"
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search lip gloss, shimmer spray…"
          className="w-full bg-transparent py-3 text-base placeholder:text-plum placeholder:opacity-100"
          autoFocus={!q}
        />
        <button type="submit" className="btn btn-primary min-h-0 px-4 py-2">
          Go
        </button>
      </form>
      <div className="mt-8">
        {q ? (
          <>
            {/* Cards are H3, so the grid needs an H2 above it. The count is that heading, styled as before. */}
            <h2 className="mb-6 text-sm font-normal text-plum">{countLabel(products.length)}</h2>
            <ProductGrid
              products={products}
              empty={{ title: `Nothing found for “${q}”.`, text: "Check the spelling, or try “gloss”, “liner” or “shimmer”." }}
            />
          </>
        ) : (
          <p className="text-sm text-plum">Try &ldquo;gloss&rdquo;, &ldquo;liner&rdquo; or &ldquo;shimmer&rdquo;.</p>
        )}
      </div>
    </div>
  );
}
