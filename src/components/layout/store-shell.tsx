import type { ReactNode } from "react";
import { CartProvider } from "@/components/cart/cart-context";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { CartAnnouncer } from "@/components/cart/cart-announcer";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WelcomePopup } from "@/components/marketing/welcome-popup";
import { RevealObserver } from "@/components/motion/reveal-observer";
import { ScrollManager } from "@/components/motion/scroll-manager";

/**
 * The store's chrome: announcement bar, header, footer, bag drawer and the
 * welcome offer. Every store page renders inside it; the coming-soon page
 * does not, which is why it lives apart from the root layout.
 */
export function StoreShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <CartProvider>
        <AnnouncementBar />
        <Header />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <Footer />
        <CartDrawer />
        <CartAnnouncer />
        <WelcomePopup />
      </CartProvider>
      <RevealObserver />
      <ScrollManager />
    </>
  );
}
