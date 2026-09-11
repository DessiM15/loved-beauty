import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { CartProvider } from "@/components/cart/cart-context";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WelcomePopup } from "@/components/marketing/welcome-popup";
import { Analytics } from "@/components/layout/analytics";
import { JsonLd } from "@/components/ui/json-ld";
import { Loader } from "@/components/motion/loader";
import { RevealObserver } from "@/components/motion/reveal-observer";
import { ScrollManager } from "@/components/motion/scroll-manager";
import { themeInitScript } from "@/lib/theme";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
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
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${site.name} logo on blush` }],
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
  themeColor: "#fbf7f5",
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
  logo: `${site.url}/brand/logo-rose.png`,
  email: site.supportEmail,
  address: { "@type": "PostalAddress", addressLocality: "Cypress", addressRegion: "TX", addressCountry: "US" },
  sameAs: [site.social.instagram].filter(Boolean),
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <CartProvider>
          <AnnouncementBar />
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <WelcomePopup />
        </CartProvider>
        <Loader />
        <RevealObserver />
        <ScrollManager />
        <JsonLd data={[organizationLd, websiteLd]} />
        <Analytics />
      </body>
    </html>
  );
}
