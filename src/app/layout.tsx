import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { Analytics } from "@/components/layout/analytics";
import { JsonLd } from "@/components/ui/json-ld";

/**
 * Two families. Cormorant Garamond (the client's "luxury" serif) carries every
 * heading, the hero copy, the story and the values. Jost carries the UI:
 * nav, buttons, labels, prices, product details.
 */
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Clean, Vegan Lip Gloss, Lip Care & Shimmer Sprays`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "Loved Beauty",
    "vegan lip gloss",
    "cruelty-free makeup",
    "hyaluronic acid lip gloss",
    "lip oil",
    "lip liner",
    "sugar lip scrub",
    "shimmer body oil",
    "setting spray",
    "clean beauty Texas",
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    url: site.url,
    title: `${site.name} | Clean, Vegan Lip Gloss, Lip Care & Shimmer Sprays`,
    description: site.description,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${site.name} logo` }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  icons: {
    icon: [{ url: "/icon.png", sizes: "64x64", type: "image/png" }, { url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#fcdee1",
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.legalName,
  alternateName: site.name,
  url: site.url,
  logo: `${site.url}/brand/logo.png`,
  email: site.supportEmail,
  address: { "@type": "PostalAddress", addressLocality: "Houston", addressRegion: "TX", addressCountry: "US" },
  sameAs: [site.social.instagram, site.social.tiktok].filter(Boolean),
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  url: site.url,
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${site.url}/search?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
};

/**
 * The root layout carries only what every page shares: fonts, metadata,
 * analytics and structured data. The store's chrome (header, footer, bag)
 * lives in the (store) route group; the coming-soon page has none of it.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {children}
        <JsonLd data={[organizationLd, websiteLd]} />
        <Analytics />
      </body>
    </html>
  );
}
