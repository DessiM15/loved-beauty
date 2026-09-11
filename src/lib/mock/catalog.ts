import type { Collection, Product, ProductVariant, Image } from "@/lib/shopify/types";

/**
 * Local catalog used until the Shopify Storefront API key is connected.
 * Copy is rewritten in Loved Beauty's voice from the manufacturer sheet.
 * Prices are from the client's price list (Sept 2026).
 *
 * When Shopify is live, this file is only used as a fallback for local dev.
 * Shade names marked PLACEHOLDER must be confirmed with the client.
 */

const USD = "USD";
const money = (amount: number) => ({ amount: amount.toFixed(2), currencyCode: USD });

const img = (src: string, alt: string): Image => ({ url: src, altText: alt, width: 1000, height: 1250 });

const BADGES = ["Vegan", "Cruelty-free", "Clean", "Paraben-free"];

type MockProductInput = {
  handle: string;
  title: string;
  productType: string;
  price: number;
  compareAt?: number;
  description: string;
  benefits: string[];
  howToUse: string;
  ingredients?: string;
  images: { src: string; alt: string }[];
  tags: string[];
  option?: { name: string; values: string[] };
  seoTitle?: string;
  seoDescription?: string;
  available?: boolean;
};

function build(p: MockProductInput): Product {
  const id = `gid://mock/Product/${p.handle}`;
  const images = p.images.map((i) => img(i.src, i.alt));
  const values = p.option?.values ?? ["Default Title"];
  const variants: ProductVariant[] = values.map((v, i) => ({
    id: `gid://mock/ProductVariant/${p.handle}-${i}`,
    title: v,
    availableForSale: p.available ?? true,
    selectedOptions: p.option ? [{ name: p.option.name, value: v }] : [{ name: "Title", value: "Default Title" }],
    price: money(p.price),
    compareAtPrice: p.compareAt ? money(p.compareAt) : null,
    image: images[0] ?? null,
    quantityAvailable: 25,
  }));
  const benefitsHtml = p.benefits.map((b) => `<li>${b}</li>`).join("");
  return {
    id,
    handle: p.handle,
    title: p.title,
    description: p.description,
    descriptionHtml: `<p>${p.description}</p><ul>${benefitsHtml}</ul>`,
    productType: p.productType,
    tags: p.tags,
    vendor: "Loved Beauty",
    availableForSale: p.available ?? true,
    featuredImage: images[0] ?? null,
    images,
    options: p.option
      ? [{ id: `${id}/opt`, name: p.option.name, values: p.option.values }]
      : [{ id: `${id}/opt`, name: "Title", values: ["Default Title"] }],
    variants,
    priceRange: { minVariantPrice: money(p.price), maxVariantPrice: money(p.price) },
    compareAtPriceRange: p.compareAt
      ? { minVariantPrice: money(p.compareAt), maxVariantPrice: money(p.compareAt) }
      : null,
    seo: { title: p.seoTitle ?? null, description: p.seoDescription ?? null },
    details: {
      benefits: p.benefits,
      howToUse: p.howToUse,
      ingredients: p.ingredients,
      badges: BADGES,
    },
    updatedAt: "2026-09-10T00:00:00Z",
  };
}

export const mockProducts: Product[] = [
  build({
    handle: "lustre-lip-gloss",
    title: "Lustre Lip Gloss",
    productType: "Lip Gloss",
    price: 12,
    description:
      "A creamy, vinyl-shine gloss that stays put. Lustre glides on non-sticky, wears for up to six hours without transferring, and leaves lips feeling hydrated and soft. Wear it alone or over your favorite nude liner.",
    benefits: [
      "Non-sticky, creamy vinyl texture",
      "Transfer-resistant for up to 6 hours",
      "Hydrates and soothes lips while you wear it",
      "High-gloss, glass-like finish",
      "Light coconut scent",
    ],
    howToUse:
      "Apply to bare lips or over lip liner. Let set for 30 seconds for the longest wear. Reapply as needed.",
    images: [
      { src: "/products/lustre-lip-gloss-1.webp", alt: "Loved Beauty Lustre Lip Gloss in Nude with a pink cap beside its box" },
    ],
    tags: ["bestseller", "lips", "gloss"],
    option: { name: "Shade", values: ["Nude"] },
    seoTitle: "Lustre Lip Gloss | Non-Sticky, Transfer-Proof Vegan Lip Gloss",
    seoDescription:
      "Shop Loved Beauty Lustre Lip Gloss: a non-sticky, transfer-resistant vegan lip gloss with a creamy vinyl shine and coconut scent. Cruelty-free and paraben-free.",
  }),
  build({
    handle: "hyaluronic-acid-lip-gloss",
    title: "Hyaluronic Acid Lip Gloss",
    productType: "Lip Gloss",
    price: 12,
    description:
      "A clear, high-shine gloss that treats while it shines. Hyaluronic acid draws in moisture for plump, cushioned lips, while flecks of gold foil catch the light. Non-sticky, long-lasting, and lovely on its own or layered over color.",
    benefits: [
      "Hydrates with hyaluronic acid",
      "Clear formula with real gold foil for a luminous finish",
      "High shine, non-sticky, long-wearing",
      "Smooths and nourishes lips",
    ],
    howToUse:
      "Sweep over bare lips for a glassy, hydrated look, or layer over lip liner or lipstick to add shine.",
    ingredients:
      "Polybutene, Hydrogenated Polyisobutene, Trimethylsiloxysilicate, Microcrystalline Wax, Ethylhexyl Palmitate, Hyaluronic Acid, Gold Foil (Colloidal Gold), Titanium Dioxide (CI 77891). See box for the full list.",
    images: [
      { src: "/products/hyaluronic-lip-gloss-1.webp", alt: "Loved Beauty Hyaluronic Acid Lip Gloss holographic tube beside its pink box" },
      { src: "/products/hyaluronic-lip-gloss-2.webp", alt: "Loved Beauty Hyaluronic Acid Lip Gloss holographic silver tube" },
    ],
    tags: ["bestseller", "lips", "gloss", "hydrating"],
    option: { name: "Shade", values: ["Clear with Gold Foil"] },
    seoTitle: "Hyaluronic Acid Lip Gloss with Gold Foil | Loved Beauty",
    seoDescription:
      "A clear, hydrating hyaluronic acid lip gloss with gold foil for high shine. Vegan, cruelty-free and non-sticky. Shop Loved Beauty.",
  }),
  build({
    handle: "ultra-light-lip-oil",
    title: "Ultra Light Lip Oil",
    productType: "Lip Oil",
    price: 10,
    description:
      "Glossy, weightless hydration in a sheer wash of color. Ultra Light Lip Oil melts into lips with natural plant oils for a high-shine look that never feels sticky. The precise applicator tip makes a perfect swipe every time.",
    benefits: [
      "Weightless, glossy hydration",
      "Sheer, buildable tint",
      "Natural oil ingredients, mineral-based formula",
      "Precise applicator tip",
    ],
    howToUse:
      "Apply to bare lips throughout the day whenever lips feel dry. Layer over liner for a soft-focus stained look.",
    images: [
      { src: "/products/ultra-light-lip-oil-1.webp", alt: "Loved Beauty Ultra Light Lip Oil in Cherry with a pink square cap" },
      { src: "/products/ultra-light-lip-oil-2.webp", alt: "Loved Beauty Ultra Light Lip Oil in Cherry beside its pink box" },
    ],
    tags: ["bestseller", "lips", "oil", "hydrating"],
    option: { name: "Shade", values: ["Cherry"] },
    seoTitle: "Ultra Light Lip Oil | Hydrating Tinted Lip Oil | Loved Beauty",
    seoDescription:
      "A glossy, non-sticky tinted lip oil made with natural plant oils. Vegan and cruelty-free. Shop Ultra Light Lip Oil by Loved Beauty.",
  }),
  build({
    handle: "peptide-lip-lacquer",
    title: "Peptide Lip Lacquer",
    productType: "Lip Lacquer",
    price: 12,
    description:
      "A glossy lacquer with a tasteful, mirror-like shine. Peptides gently plump and smooth, natural oils keep lips comfortable, and the precise tip lays down color exactly where you want it.",
    benefits: [
      "Glossy, mirror-shine finish",
      "Gentle peptide lip plumping",
      "Natural oil ingredients, mineral-based formula",
      "Precise applicator tip",
    ],
    howToUse:
      "Apply from the center of the lips outward. For extra definition, pair with Lip Liner in a matching shade.",
    images: [
      { src: "/products/peptide-lip-lacquer-1.webp", alt: "Loved Beauty Peptide Lip Lacquer in Sheer Nude beside its pink box" },
      { src: "/products/peptide-lip-lacquer-2.webp", alt: "Loved Beauty Peptide Lip Lacquer in Berry, a deep wine squeeze tube" },
    ],
    tags: ["lips", "lacquer", "plumping"],
    option: { name: "Shade", values: ["Sheer Nude", "Berry"] }, // PLACEHOLDER shade names
    seoTitle: "Peptide Lip Lacquer | Plumping Glossy Lip Lacquer | Loved Beauty",
    seoDescription:
      "A glossy, gently plumping peptide lip lacquer with natural oils. Vegan, cruelty-free and paraben-free. Shop Loved Beauty.",
  }),
  build({
    handle: "lip-liner-pencil",
    title: "Lip Liner Pencil",
    productType: "Lip Liner",
    price: 10,
    description:
      "Meet your new everyday liner. This creamy pencil glides on to line, define and sculpt with rich, ultra-pigmented color and a smooth semi-matte finish. Eight shades, one for every gloss in your bag.",
    benefits: [
      "All-in-one liner: line, fill and define",
      "Highly pigmented, creamy glide",
      "Smooth semi-matte finish",
      "Eight flattering shades",
    ],
    howToUse:
      "Outline the natural lip line, then fill in for a long-wear base. Top with Lustre Lip Gloss or Ultra Light Lip Oil.",
    images: [],
    tags: ["lips", "liner"],
    option: {
      name: "Shade",
      // PLACEHOLDER shade names. Replace with the real eight shades.
      values: ["Bare", "Petal", "Nude Rose", "Mauve", "Cocoa", "Spice", "Berry", "Cherry"],
    },
    seoTitle: "Lip Liner Pencil | Creamy Vegan Lip Liner in 8 Shades | Loved Beauty",
    seoDescription:
      "A creamy, highly pigmented vegan lip liner pencil with a semi-matte finish. Available in 8 shades. Cruelty-free. Shop Loved Beauty.",
  }),
  build({
    handle: "sugar-lip-scrub",
    title: "Sugar Lip Scrub",
    productType: "Lip Scrub",
    price: 10,
    description:
      "Wake up to baby-soft lips. Fine brown sugar crystals gently polish away flakes, then melt into a veil of plant oils that leaves lips smooth, protected and ready for color.",
    benefits: [
      "Gentle brown sugar exfoliation",
      "Smooths and removes flakes",
      "Plant oils for deep, lasting hydration",
      "Softens and protects delicate lip skin",
    ],
    howToUse:
      "Massage a small amount onto damp lips in circles for 30 seconds. Rinse or wipe away. Use 2 to 3 times a week, ideally before lip color.",
    images: [
      { src: "/products/sugar-lip-scrub-1.webp", alt: "Loved Beauty Sugar Lip Scrub jar with a peach lid" },
      { src: "/products/sugar-lip-scrub-2.webp", alt: "Loved Beauty Sugar Lip Scrub jar beside its pink box" },
    ],
    tags: ["lip-care", "scrub", "prep"],
    seoTitle: "Sugar Lip Scrub | Gentle Exfoliating Lip Scrub | Loved Beauty",
    seoDescription:
      "A gentle brown sugar lip scrub with hydrating plant oils for smooth, flake-free lips. Vegan and cruelty-free. Shop Loved Beauty.",
  }),
  build({
    handle: "soft-sphere-lip-balm",
    title: "Soft Sphere Lip Balm",
    productType: "Lip Balm",
    price: 9,
    description:
      "A sweetly scented sphere of lip therapy. Shea butter and nourishing oils soothe dry, cracked or chapped lips and keep them hydrated all day, under or over your lipstick.",
    benefits: [
      "All-day hydration",
      "Shea butter and nourishing oils",
      "Soothes dry, cracked and chapped lips",
      "Wear alone, under or over lip color",
    ],
    howToUse: "Glide over lips whenever they need a little love. Perfect as an overnight treatment.",
    images: [],
    tags: ["lip-care", "balm", "hydrating"],
    seoTitle: "Soft Sphere Lip Balm | Shea Butter Lip Treatment | Loved Beauty",
    seoDescription:
      "A hydrating shea butter lip balm sphere that soothes dry, chapped lips all day. Vegan and cruelty-free. Shop Loved Beauty.",
  }),
  build({
    handle: "shimmer-highlighter-powder-spray",
    title: "Shimmer Highlighter Powder Spray",
    productType: "Highlighter",
    price: 18,
    description:
      "A weightless, light-catching glow for face and body. Ultra-fine shimmer particles mist on evenly for a soft-focus radiance that never looks like glitter. Use it on cheekbones, eyes, collarbones, shoulders or legs.",
    benefits: [
      "Air-light powder spray, no heaviness or fallout",
      "Multi-use: face highlighter, eye shimmer, body illuminator",
      "Natural, buildable glow with no visible glitter",
    ],
    howToUse:
      "Shake well. Hold 6 to 8 inches away and mist lightly where you want to glow. Build in thin layers.",
    images: [],
    tags: ["face-and-body", "glow", "highlighter"],
    seoTitle: "Shimmer Highlighter Powder Spray | Face & Body Glow | Loved Beauty",
    seoDescription:
      "A weightless shimmer powder spray for a soft, light-catching glow on face and body. Vegan and cruelty-free. Shop Loved Beauty.",
  }),
  build({
    handle: "shimmer-glow-setting-spray",
    title: "Shimmer Glow Setting Spray",
    productType: "Setting Spray",
    price: 20,
    description:
      "Set your makeup and glow at the same time. This 2-in-1 mist locks everything in place, infuses skin with moisture, and leaves a lit-from-within radiance you can refresh all day without disturbing a thing.",
    benefits: [
      "Sets makeup and hydrates in one step",
      "Micro-shimmer for a natural dewy radiance",
      "Refresh throughout the day without disturbing makeup",
      "Quick-drying, weightless, non-sticky finish",
    ],
    howToUse:
      "Shake well. Close eyes and mist in an X and T motion over finished makeup. Reapply midday to revive your glow.",
    images: [
      { src: "/products/shimmer-glow-setting-spray-1.webp", alt: "Loved Beauty Shimmer Glow Setting Spray, a pink bottle with a white cap and gold band" },
      { src: "/products/shimmer-glow-setting-spray-2.webp", alt: "Loved Beauty Shimmer Glow Setting Spray beside its pink box" },
    ],
    tags: ["bestseller", "face-and-body", "glow", "setting"],
    seoTitle: "Shimmer Glow Setting Spray | Hydrating Glow Setting Mist | Loved Beauty",
    seoDescription:
      "A 2-in-1 hydrating setting spray with micro-shimmer for a dewy, lit-from-within glow. Vegan and cruelty-free. Shop Loved Beauty.",
  }),
  build({
    handle: "shimmer-glow-oil-spray",
    title: "Shimmer Glow Oil Spray",
    productType: "Body Oil",
    price: 22,
    description:
      "Sun-kissed radiance in a mist. A blend of skin-nourishing oils and light-reflecting pearls hydrates and illuminates in one step, for collarbones, shoulders, legs and even the ends of your hair.",
    benefits: [
      "Nourishing glow-oil formula with light-reflecting pearls",
      "Sheer, natural sun-kissed shimmer, never glittery",
      "Multi-use for face, body and hair",
    ],
    howToUse:
      "Shake well. Mist onto skin and smooth in with hands. For hair, mist lightly over ends. Best worn over moisturizer.",
    images: [
      { src: "/products/shimmer-glow-oil-spray-1.webp", alt: "Loved Beauty Shimmer Glow Oil Spray in a gold glass bottle with a gold cap" },
    ],
    tags: ["bestseller", "face-and-body", "glow", "oil"],
    seoTitle: "Shimmer Glow Oil Spray | Shimmering Body Oil | Loved Beauty",
    seoDescription:
      "A hydrating shimmer body oil spray with light-reflecting pearls for a sun-kissed glow. Vegan and cruelty-free. Shop Loved Beauty.",
  }),
  // ---- Proposed sets. Create these as products in Shopify (or as Shopify Bundles). ----
  build({
    handle: "the-lip-ritual-set",
    title: "The Lip Ritual Set",
    productType: "Set",
    price: 28,
    compareAt: 31,
    description:
      "Everything for a lip that looks cared for. Polish with the Sugar Lip Scrub, soothe with the Soft Sphere Lip Balm, then finish with a glossy veil of Lustre Lip Gloss. Three steps, one little ritual.",
    benefits: ["Sugar Lip Scrub", "Soft Sphere Lip Balm", "Lustre Lip Gloss in Nude", "Save $3 vs. buying separately"],
    howToUse: "Scrub 2 to 3 times a week, balm daily, gloss whenever you like.",
    images: [
      { src: "/products/sugar-lip-scrub-2.webp", alt: "The Lip Ritual Set featuring the Sugar Lip Scrub" },
      { src: "/products/lustre-lip-gloss-1.webp", alt: "Lustre Lip Gloss included in The Lip Ritual Set" },
    ],
    tags: ["set", "gift", "lips", "lip-care"],
    seoTitle: "The Lip Ritual Set | Lip Scrub, Balm & Gloss Set | Loved Beauty",
    seoDescription: "A three-step lip care set with Sugar Lip Scrub, Soft Sphere Lip Balm and Lustre Lip Gloss. Vegan and cruelty-free.",
  }),
  build({
    handle: "the-glow-duo",
    title: "The Glow Duo",
    productType: "Set",
    price: 38,
    compareAt: 42,
    description:
      "Face and body, lit from within. Set your makeup with the Shimmer Glow Setting Spray, then mist the Shimmer Glow Oil Spray over shoulders and collarbones for an all-over, sun-kissed finish.",
    benefits: ["Shimmer Glow Setting Spray", "Shimmer Glow Oil Spray", "Save $4 vs. buying separately"],
    howToUse: "Setting spray over finished makeup. Glow oil on skin and hair ends.",
    images: [
      { src: "/products/shimmer-glow-oil-spray-1.webp", alt: "The Glow Duo featuring the Shimmer Glow Oil Spray" },
      { src: "/products/shimmer-glow-setting-spray-1.webp", alt: "Shimmer Glow Setting Spray included in The Glow Duo" },
    ],
    tags: ["set", "gift", "face-and-body", "glow"],
    seoTitle: "The Glow Duo | Setting Spray & Shimmer Body Oil Set | Loved Beauty",
    seoDescription: "Shimmer Glow Setting Spray and Shimmer Glow Oil Spray together in one radiant set. Vegan and cruelty-free.",
  }),
];

const collection = (
  handle: string,
  title: string,
  description: string,
  image: { src: string; alt: string } | null,
  seoTitle?: string,
  seoDescription?: string,
): Collection => ({
  id: `gid://mock/Collection/${handle}`,
  handle,
  title,
  description,
  image: image ? img(image.src, image.alt) : null,
  seo: { title: seoTitle ?? null, description: seoDescription ?? null },
  updatedAt: "2026-09-10T00:00:00Z",
});

export const mockCollections: Collection[] = [
  collection(
    "bestsellers",
    "Bestsellers",
    "The ones everyone reaches for first.",
    { src: "/products/lustre-lip-gloss-1.webp", alt: "Lustre Lip Gloss, a Loved Beauty bestseller" },
    "Bestsellers | Loved Beauty",
    "Shop Loved Beauty's most-loved lip gloss, lip oil and shimmer sprays. Vegan and cruelty-free.",
  ),
  collection(
    "lips",
    "Lips",
    "Glosses, oils, lacquers and liners for every mood.",
    { src: "/products/ultra-light-lip-oil-1.webp", alt: "Ultra Light Lip Oil in Cherry" },
    "Lips | Vegan Lip Gloss, Lip Oil & Lip Liner | Loved Beauty",
    "Shop vegan, cruelty-free lip gloss, lip oil, lip lacquer and lip liner from Loved Beauty.",
  ),
  collection(
    "lip-care",
    "Lip Care",
    "Prep and treat for the softest lips of your life.",
    { src: "/products/sugar-lip-scrub-1.webp", alt: "Sugar Lip Scrub jar" },
    "Lip Care | Sugar Lip Scrub & Lip Balm | Loved Beauty",
    "Shop Loved Beauty lip care: gentle sugar lip scrub and hydrating shea butter lip balm. Vegan and cruelty-free.",
  ),
  collection(
    "face-and-body-glow",
    "Face & Body Glow",
    "Light-catching sprays for a lit-from-within finish.",
    { src: "/products/shimmer-glow-oil-spray-1.webp", alt: "Shimmer Glow Oil Spray gold bottle" },
    "Face & Body Glow | Shimmer Sprays & Body Oil | Loved Beauty",
    "Shop shimmer highlighter spray, glow setting spray and shimmer body oil from Loved Beauty. Vegan and cruelty-free.",
  ),
  collection(
    "sets",
    "Sets & Bundles",
    "Curated pairings that save you a little and give a lot.",
    { src: "/products/sugar-lip-scrub-2.webp", alt: "The Lip Ritual Set" },
    "Sets & Bundles | Loved Beauty",
    "Shop curated Loved Beauty sets and bundles. Perfect for gifting or treating yourself.",
  ),
];

/** Which mock products belong to which collection (Shopify handles this natively). */
export const mockCollectionMembership: Record<string, string[]> = {
  bestsellers: ["lustre-lip-gloss", "hyaluronic-acid-lip-gloss", "ultra-light-lip-oil", "shimmer-glow-oil-spray", "shimmer-glow-setting-spray"],
  lips: ["lustre-lip-gloss", "hyaluronic-acid-lip-gloss", "ultra-light-lip-oil", "peptide-lip-lacquer", "lip-liner-pencil"],
  "lip-care": ["sugar-lip-scrub", "soft-sphere-lip-balm"],
  "face-and-body-glow": ["shimmer-highlighter-powder-spray", "shimmer-glow-setting-spray", "shimmer-glow-oil-spray"],
  sets: ["the-lip-ritual-set", "the-glow-duo"],
};

/** Hand-picked cross-sells for "You may also like" in mock mode. */
export const mockRecommendations: Record<string, string[]> = {
  "lustre-lip-gloss": ["lip-liner-pencil", "sugar-lip-scrub", "hyaluronic-acid-lip-gloss", "the-lip-ritual-set"],
  "hyaluronic-acid-lip-gloss": ["lustre-lip-gloss", "soft-sphere-lip-balm", "lip-liner-pencil", "ultra-light-lip-oil"],
  "ultra-light-lip-oil": ["lip-liner-pencil", "sugar-lip-scrub", "peptide-lip-lacquer", "lustre-lip-gloss"],
  "peptide-lip-lacquer": ["lip-liner-pencil", "sugar-lip-scrub", "lustre-lip-gloss", "soft-sphere-lip-balm"],
  "lip-liner-pencil": ["lustre-lip-gloss", "ultra-light-lip-oil", "peptide-lip-lacquer", "hyaluronic-acid-lip-gloss"],
  "sugar-lip-scrub": ["soft-sphere-lip-balm", "lustre-lip-gloss", "the-lip-ritual-set", "ultra-light-lip-oil"],
  "soft-sphere-lip-balm": ["sugar-lip-scrub", "the-lip-ritual-set", "hyaluronic-acid-lip-gloss", "lustre-lip-gloss"],
  "shimmer-highlighter-powder-spray": ["shimmer-glow-setting-spray", "shimmer-glow-oil-spray", "the-glow-duo", "lustre-lip-gloss"],
  "shimmer-glow-setting-spray": ["shimmer-glow-oil-spray", "the-glow-duo", "shimmer-highlighter-powder-spray", "lustre-lip-gloss"],
  "shimmer-glow-oil-spray": ["shimmer-glow-setting-spray", "the-glow-duo", "shimmer-highlighter-powder-spray", "hyaluronic-acid-lip-gloss"],
  "the-lip-ritual-set": ["the-glow-duo", "lip-liner-pencil", "ultra-light-lip-oil", "hyaluronic-acid-lip-gloss"],
  "the-glow-duo": ["the-lip-ritual-set", "shimmer-highlighter-powder-spray", "lustre-lip-gloss", "hyaluronic-acid-lip-gloss"],
};
