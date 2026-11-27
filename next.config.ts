import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Shopify CDN for product and collection images
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "*.myshopify.com" },
    ],
  },
  /**
   * Addresses from the Shopify-hosted store (5quhs5-yf.myshopify.com), which now forwards here
   * with its path kept. Shopify emails link to these, so each one must land on a real page.
   */
  async redirects() {
    const to = (source: string, destination: string) => ({ source, destination, permanent: false });
    return [
      to("/collections", "/shop"),
      to("/collections/all", "/shop"),
      to("/collections/frontpage", "/shop"),
      to("/collections/:collection/products/:handle", "/products/:handle"),
      to("/cart", "/shop"),
      to("/cart/:path*", "/shop"),
      to("/pages/contact", "/contact"),
      to("/pages/:path*", "/"),
      to("/account", "/"),
      to("/account/:path*", "/"),
      to("/policies/refund-policy", "/policies/shipping-returns"),
      to("/policies/shipping-policy", "/policies/shipping-returns"),
      to("/policies/terms-of-service", "/policies/terms"),
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
