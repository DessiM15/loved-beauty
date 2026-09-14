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
  location: "Houston, TX",
  founded: "2025",
  social: {
    instagram: "https://www.instagram.com/lovedbeautyllc/",
    instagramHandle: "@lovedbeautyllc",
    tiktok: "https://www.tiktok.com/@lovedbeautyshop",
    tiktokHandle: "@lovedbeautyshop",
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
];

export const freeShippingThreshold = 200; // USD. Keep in sync with Shopify shipping profile.
export const firstOrderCode = "LOVED10";

/** Four links, nothing to guess at. Categories live on the shop page as tabs. */
export const nav = {
  primary: [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  footer: {
    shop: [
      { label: "Shop All", href: "/shop" },
      { label: "Lips", href: "/collections/lips" },
      { label: "Lip Care", href: "/collections/lip-care" },
      { label: "Face & Body Glow", href: "/collections/face-and-body-glow" },
      { label: "Sets & Bundles", href: "/collections/sets" },
    ],
    help: [
      { label: "FAQ", href: "/faq" },
      { label: "Contact Us", href: "/contact" },
      { label: "Shipping & Returns", href: "/policies/shipping-returns" },
      { label: "Privacy Policy", href: "/policies/privacy" },
      { label: "Terms of Service", href: "/policies/terms" },
    ],
    about: [
      { label: "Our Story", href: "/about" },
      { label: "Instagram", href: "https://www.instagram.com/lovedbeautyllc/" },
      { label: "TikTok", href: "https://www.tiktok.com/@lovedbeautyshop" },
    ],
  },
};

/**
 * Home page hero (option 1G, the client's pick, 14 Sept 2026): her counter photo full-bleed,
 * the slogan floating on the wall beside the spray. "Beauty That" in letter-spaced capitals,
 * "Loves You Back" in the brand pink italic. Copy approved by the client (Sept 2026).
 * The eyebrow is no longer shown on the hero; it is kept here for the launch popup and any future use.
 */
export const hero = {
  eyebrow: "Launching October 2026",
  photo: { src: "/hero/scene.jpg", alt: "Loved Beauty glosses, lip oil and shimmer spray on a marble counter" },
  headlineLead: "Beauty That",
  headlineAccent: "Loves You Back",
  subhead: "Luxury makeup crafted for every skin tone. From bold lips to flawless skin, discover your perfect look with Loved Beauty.",
  primaryCta: { label: "Shop the Collection", href: "/shop" },
  secondaryCta: { label: "Our Story", href: "/about" },
};

/** Home page trust strip under the hero (1G). Three short promises. */
export const trust = [
  { key: "clean", label: "Clean formulas" },
  { key: "tones", label: "For all skin tones" },
  { key: "results", label: "Real results" },
];

/** Home page bestsellers grid (1G). Products come from the Shopify "bestsellers" collection. */
export const bestsellers = {
  eyebrow: "Featured",
  headline: "Shop Our Bestsellers",
  count: 4,
  link: { label: "Shop all", href: "/shop" },
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
    "Founded in Houston, Texas, and made for every girl who deserves to feel loved.",
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


