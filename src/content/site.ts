/**
 * Site-wide content and settings.
 * Everything a non-developer might want to change lives here, so copy edits
 * never require touching components. Product data comes from Shopify.
 */

/**
 * Public site URL. Order: NEXT_PUBLIC_SITE_URL → Vercel's production/preview URL → the real domain.
 * Empty strings are treated as unset (Vercel passes "" when a variable is created blank).
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = (process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || "").trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "")}`;
  return "https://lovedbeautyshop.net";
}

export const site = {
  name: "Loved Beauty",
  legalName: "Loved Beauty LLC",
  tagline: "Clean, cruelty-free lip and glow essentials.",
  description:
    "Loved Beauty is a clean, vegan, cruelty-free beauty brand. Shop hydrating lip gloss, lip oil, lip liner, sugar lip scrub and luminous shimmer sprays for face and body.",
  url: resolveSiteUrl(),
  supportEmail: "lovedbeautyshop@gmail.com",
  location: "Cypress, Texas",
  founded: "2025",
  social: {
    instagram: "https://www.instagram.com/lovedbeautyllc/",
    instagramHandle: "@lovedbeautyllc",
    tiktok: "", // add when the handle is confirmed
  },
  agency: {
    name: "Smart Scale, LLC",
    url: "https://smartscaleagent.com/portfolio",
  },
};

export const announcements = [
  { text: "Free U.S. shipping on orders $200+", href: "/shop" },
  { text: "10% off your first order with code LOVED10", href: "/shop" },
  { text: "Vegan · Cruelty-free · Paraben-free", href: "/about" },
  { text: "New: find your shade in 30 seconds", href: "/shade-finder" },
];

export const freeShippingThreshold = 200; // USD. Keep in sync with Shopify shipping profile.
export const firstOrderCode = "LOVED10";

export const nav = {
  primary: [
    { label: "Shop All", href: "/shop" },
    { label: "Lips", href: "/collections/lips" },
    { label: "Lip Care", href: "/collections/lip-care" },
    { label: "Face & Body Glow", href: "/collections/face-and-body-glow" },
  ],
  secondary: [
    { label: "Shade Finder", href: "/shade-finder" },
    { label: "Sets", href: "/collections/sets" },
    { label: "Bestsellers", href: "/collections/bestsellers" },
    { label: "Our Story", href: "/about" },
  ],
  footer: {
    shop: [
      { label: "Shop All", href: "/shop" },
      { label: "Lips", href: "/collections/lips" },
      { label: "Lip Care", href: "/collections/lip-care" },
      { label: "Face & Body Glow", href: "/collections/face-and-body-glow" },
      { label: "Sets & Bundles", href: "/collections/sets" },
      { label: "Bestsellers", href: "/collections/bestsellers" },
    ],
    help: [
      { label: "Find Your Shade", href: "/shade-finder" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact Us", href: "/contact" },
      { label: "Shipping & Returns", href: "/policies/shipping-returns" },
      { label: "Privacy Policy", href: "/policies/privacy" },
      { label: "Terms of Service", href: "/policies/terms" },
    ],
    about: [
      { label: "Our Story", href: "/about" },
      { label: "Ingredients & Values", href: "/about#values" },
      { label: "Instagram", href: "https://www.instagram.com/lovedbeautyllc/" },
    ],
  },
};

export const hero = {
  eyebrow: "Clean · Vegan · Cruelty-free",
  headlineLead: "Loved, from the first",
  headlineItalic: "swipe.",
  subhead: "Hydrating glosses, buttery liners and light-catching shimmer. Soft, luminous, and made to be worn every day.",
  primaryCta: { label: "Shop Bestsellers", href: "/collections/bestsellers" },
  secondaryCta: { label: "Explore lips", href: "/collections/lips" },
  // Placeholder editorial photography (see public/editorial/CREDITS.md). Replace with the campaign shot.
  image: {
    src: "/editorial/hero.webp",
    alt: "Glossy peach lips being painted with a lip brush",
  },
};

/** Home page category panels. Images are editorial placeholders until the photoshoot. */
export const categoryPanels = [
  { handle: "lips", title: "Lips", text: "Glosses, oils, lacquers and liners.", image: "/editorial/cat-lips.webp", alt: "A pink lip gloss wand applied to soft pink lips" },
  { handle: "lip-care", title: "Lip Care", text: "Prep and treat for the softest lips.", image: "/editorial/cat-lip-care.webp", alt: "Natural glossy lips on glowing skin" },
  { handle: "face-and-body-glow", title: "Face & Body Glow", text: "Light-catching sprays, lit from within.", image: "/editorial/cat-glow.webp", alt: "Luminous skin catching golden light" },
  { handle: "sets", title: "Sets & Bundles", text: "Curated pairings that save a little.", image: "/editorial/cat-sets.webp", alt: "Lip liner and lipsticks arranged on blush pink" },
];

export const statement = {
  eyebrow: "Our promise",
  lineOne: "Vegan. Cruelty-free.",
  lineTwo: "Loved.",
  text: "Every formula is chosen to be gentle enough for every day and beautiful enough to feel like a little luxury. Nothing tested on animals, nothing you have to think twice about.",
  cta: { label: "Read our story", href: "/about" },
  image: { src: "/editorial/silk.webp", alt: "Soft blush silk folds" },
};

export const values = [
  {
    key: "vegan",
    title: "Vegan",
    text: "No animal-derived ingredients, ever.",
  },
  {
    key: "cruelty-free",
    title: "Cruelty-free",
    text: "Never tested on animals.",
  },
  {
    key: "clean",
    title: "Clean formulas",
    text: "Thoughtfully made, gentle on lips and skin.",
  },
  {
    key: "paraben-free",
    title: "Paraben-free",
    text: "Free of parabens and sulfates.",
  },
];

export const editorial = {
  eyebrow: "The Loved ritual",
  headline: "Prep. Define. Glow.",
  text: "Three quiet steps to a lip that looks cared for. Polish with sugar, line with a buttery pencil, then finish with a glossy veil of hydration.",
  steps: [
    { n: "01", title: "Prep", text: "Sugar Lip Scrub, thirty seconds, twice a week.", href: "/products/sugar-lip-scrub", linkLabel: "Sugar Lip Scrub" },
    { n: "02", title: "Define", text: "Lip Liner Pencil to outline, then fill for a long-wear base.", href: "/products/lip-liner-pencil", linkLabel: "Lip Liner Pencil" },
    { n: "03", title: "Glow", text: "Lustre Gloss or Ultra Light Lip Oil to finish.", href: "/products/lustre-lip-gloss", linkLabel: "Lustre Lip Gloss" },
  ],
  cta: { label: "Shop the ritual set", href: "/products/the-lip-ritual-set" },
  image: { src: "/editorial/ritual.webp", alt: "Lip gloss applied to glossy lips" },
};

export const instagram = {
  handle: "@lovedbeautyllc",
  url: "https://www.instagram.com/lovedbeautyllc/",
  headline: "Wearing Loved",
  text: "Tag @lovedbeautyllc to be featured.",
  // Replace with real posts. Each image should be square-ish.
  posts: [
    { src: "/editorial/cat-lips.webp", alt: "Pink lip gloss application" },
    { src: "/products/lustre-lip-gloss-1.webp", alt: "Lustre Lip Gloss in Nude" },
    { src: "/editorial/lips-wide.webp", alt: "Peach lip oil on glossy lips" },
    { src: "/products/shimmer-glow-oil-spray-1.webp", alt: "Shimmer Glow Oil Spray" },
    { src: "/editorial/cat-glow.webp", alt: "Luminous skin catching golden light" },
    { src: "/products/sugar-lip-scrub-2.webp", alt: "Sugar Lip Scrub beside its box" },
  ],
};

export const newsletter = {
  eyebrow: "Join the list",
  headline: "Get 10% off your first order.",
  headlineLead: "Get 10% off your",
  headlineItalic: "first order.",
  text: "New shades, restocks and members-only offers. No noise, just the good stuff.",
  placeholder: "Your email address",
  cta: "Sign me up",
  success: "You're in. Check your inbox for your welcome code.",
  legal: "By subscribing you agree to receive marketing emails from Loved Beauty. Unsubscribe anytime.",
};

export const faqs = [
  {
    q: "Are Loved Beauty products vegan and cruelty-free?",
    a: "Yes. Every Loved Beauty product is vegan, cruelty-free, paraben-free and sulfate-free, verified by our manufacturing partner.",
  },
  {
    q: "How long does shipping take?",
    a: "Orders ship from Texas within 1 to 3 business days. Standard U.S. shipping typically arrives in 3 to 6 business days. You'll receive a tracking number by email as soon as your order ships.",
  },
  {
    q: "Do you offer free shipping?",
    a: "Yes. U.S. orders over $200 ship free. Shipping on smaller orders is calculated at checkout.",
  },
  {
    q: "What is your return policy?",
    a: "For hygiene reasons we can't accept returns on opened cosmetics. If your order arrives damaged or incorrect, email lovedbeautyshop@gmail.com within 7 days of delivery with a photo and we'll make it right.",
  },
  {
    q: "Is the Lustre Lip Gloss really transfer-proof?",
    a: "Once set, the Lustre Lip Gloss wears for up to 6 hours without transferring. Layer it over your Lip Liner for the longest wear.",
  },
  {
    q: "Can I use the shimmer sprays on my face?",
    a: "Yes. The Shimmer Highlighter Powder Spray and Shimmer Glow Setting Spray are made for face and body. The Shimmer Glow Oil Spray is best on collarbones, shoulders, legs and hair ends.",
  },
  {
    q: "Where can I find the full ingredient list?",
    a: "Full ingredient lists are printed on every box and listed on each product page under Ingredients.",
  },
  {
    q: "Do you ship internationally?",
    a: "Right now we ship within the United States only. International shipping is coming soon. Follow @lovedbeautyllc for updates.",
  },
];

export const about = {
  eyebrow: "Our story",
  headline: "Beauty that feels like being loved.",
  paragraphs: [
    "Loved Beauty began with a simple idea: the products you reach for every day should feel as good as they look. Soft textures. Hydrating formulas. Colors that flatter without trying too hard.",
    "Everything we make is vegan, cruelty-free and paraben-free, because caring for yourself should never cost anything else. From our first sugar lip scrub to our light-catching shimmer sprays, each formula is chosen to be gentle enough for daily wear and beautiful enough to feel like a little luxury.",
    "Founded in Cypress, Texas, and made for every girl who deserves to feel loved.",
  ],
  founderNote:
    "Thank you for being here. Every order is packed with care and a lot of heart. — Loved Beauty",
};

/** Swatch colours for shade selectors. Keys must match Shopify variant option values. PLACEHOLDER until shades are confirmed. */
export const shadeColors: Record<string, string> = {
  Bare: "#d9a996",
  Petal: "#e6a6b0",
  "Nude Rose": "#c9847f",
  Mauve: "#a76b7e",
  Cocoa: "#7a4a3a",
  Spice: "#b45a3f",
  Berry: "#7d2f4a",
  Cherry: "#c8102e",
  Nude: "#c47a66",
  "Sheer Nude": "#d8b3a4",
  "Clear with Gold Foil": "linear-gradient(135deg,#f6e7c8,#e9cf93 45%,#fff5dd)",
};
