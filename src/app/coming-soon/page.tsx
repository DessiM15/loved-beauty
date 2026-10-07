import type { Metadata, Viewport } from "next";
import { ComingSoon } from "@/components/coming-soon/coming-soon";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Coming Soon",
  description: `${site.name} is launching soon. Clean, vegan lip gloss, lip care and shimmer sprays. Sign up to be the first to know.`,
  alternates: { canonical: "/" },
  openGraph: { title: `${site.name} | Coming Soon`, images: [{ url: "/coming-soon/poster.jpg", width: 720, height: 1280, alt: `${site.name} launch film` }] },
};

export const viewport: Viewport = {
  themeColor: "#0b0908",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "dark",
};

export default function ComingSoonPage() {
  return <ComingSoon />;
}
