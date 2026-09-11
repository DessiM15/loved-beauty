/**
 * Site-wide content and settings.
 * Everything a non-developer might want to change lives here, so copy edits
 * never require touching components. Product data comes from Shopify.
 */

export const site = {
  name: "Loved Beauty",
  legalName: "Loved Beauty LLC",
  tagline: "Clean, cruelty-free lip and glow essentials.",
  description:
    "Loved Beauty is a clean, vegan, cruelty-free beauty brand. Shop hydrating lip gloss, lip oil, lip liner, sugar lip scrub and luminous shimmer sprays for face and body.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://lovedbeautyshop.net",
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
  eyebrow: "New · Clean lip & glow essentials",
  headline: "Loved, from the first swipe.",
  subhead:
    "Hydrating glosses, buttery liners and light-catching shimmer, made vegan and cruelty-free. Soft, luminous, and made to be worn every day.",
  primaryCta: { label: "Shop Bestsellers", href: "/collections/bestsellers" },
  secondaryCta: { label: "Shop Lips", href: "/collections/lips" },
  // Swap these for the photoshoot images when they arrive.
  image: {
    src: "/products/shimmer-glow-oil-spray-1.webp",
    alt: "Loved Beauty Shimmer Glow Oil Spray in a gold glass bottle",
  },
  imageSecondary: {
    src: "/products/ultra-light-lip-oil-2.webp",
    alt: "Loved Beauty Ultra Light Lip Oil in a pink square bottle beside its box",
  },
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
  cta: { label: "Shop the ritual", href: "/collections/sets" },
  image: {
    src: "/products/sugar-lip-scrub-2.webp",
    alt: "Loved Beauty Sugar Lip Scrub jar beside its pink box",
  },
};

export const instagram = {
  handle: "@lovedbeautyllc",
  url: "https://www.instagram.com/lovedbeautyllc/",
  headline: "Wearing Loved",
  text: "Tag @lovedbeautyllc to be featured.",
  // Replace with real posts. Each image should be square-ish.
  posts: [
    { src: "/products/lustre-lip-gloss-1.webp", alt: "Lustre Lip Gloss in a nude shade" },
    { src: "/products/shimmer-glow-setting-spray-1.webp", alt: "Shimmer Glow Setting Spray bottle" },
    { src: "/products/peptide-lip-lacquer-2.webp", alt: "Peptide Lip Lacquer in Berry" },
    { src: "/products/hyaluronic-lip-gloss-2.webp", alt: "Hyaluronic Acid Lip Gloss holographic tube" },
    { src: "/products/sugar-lip-scrub-1.webp", alt: "Sugar Lip Scrub jar" },
    { src: "/products/ultra-light-lip-oil-1.webp", alt: "Ultra Light Lip Oil in Cherry" },
  ],
};

export const newsletter = {
  eyebrow: "Join the list",
  headline: "Get 10% off your first order.",
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
