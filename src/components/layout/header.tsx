"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site } from "@/content/site";
import { useCart } from "@/components/cart/cart-context";
import { BagIcon, CloseIcon, InstagramIcon, MenuIcon, SearchIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * Header with the full logo centered, as the client requested.
 * Desktop: links left · logo center · search + bag right.
 * Mobile:  menu left  · logo center · bag right.
 */
export function Header() {
  const pathname = usePathname();
  const { cart, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const count = cart?.totalQuantity ?? 0;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close overlays when the route changes (state adjustment during render, per React guidance).
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setMenuOpen(false);
    setSearchOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const isActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href + "/"));

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-cream transition-shadow",
        scrolled ? "border-petal shadow-[0_8px_30px_-18px_rgba(43,34,36,0.25)]" : "border-transparent",
      )}
    >
      <div className="container-lb grid h-16 grid-cols-[1fr_auto_1fr] items-center md:h-20">
        {/* Left */}
        <div className="flex items-center gap-1 md:gap-7">
          <button
            type="button"
            className="-ml-2 inline-flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-blush md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-7">
              {nav.primary.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="link-underline text-[0.74rem] tracking-[0.14em] uppercase text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Center: full logo */}
        <Link href="/" className="flex items-center justify-center px-2" aria-label={`${site.name} home`}>
          <Image
            src="/brand/logo-rose.png"
            alt={site.name}
            width={1725}
            height={447}
            priority
            className="h-8 w-auto md:h-10"
            sizes="(min-width: 768px) 160px, 130px"
          />
        </Link>

        {/* Right */}
        <div className="flex items-center justify-end gap-1 md:gap-2">
          <nav aria-label="Secondary" className="mr-4 hidden lg:block">
            <ul className="flex items-center gap-7">
              {nav.secondary.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="link-underline text-[0.74rem] tracking-[0.14em] uppercase text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <button
            type="button"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-blush md:inline-flex"
            aria-label="Search"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((v) => !v)}
          >
            <SearchIcon />
          </button>
          <button
            type="button"
            onClick={openCart}
            className="relative -mr-2 inline-flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-blush"
            aria-label={`Open bag, ${count} ${count === 1 ? "item" : "items"}`}
          >
            <BagIcon />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-[1.15rem] min-w-[1.15rem] items-center justify-center rounded-full bg-rose px-1 text-[0.62rem] font-medium text-white">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Desktop search reveal */}
      <div
        className={cn(
          "hidden overflow-hidden border-t border-petal bg-cream transition-[max-height] duration-300 md:block",
          searchOpen ? "max-h-24" : "max-h-0 border-t-0",
        )}
      >
        <form action="/search" className="container-lb flex items-center gap-3 py-3">
          <SearchIcon className="text-plum" />
          <input
            type="search"
            name="q"
            placeholder="Search lip gloss, shimmer spray…"
            className="flex-1 bg-transparent py-2 text-base outline-none placeholder:text-plum/60"
            aria-label="Search products"
            autoFocus={searchOpen}
          />
          <button type="submit" className="btn btn-primary min-h-0 px-5 py-2">
            Search
          </button>
        </form>
      </div>

      {/* Mobile menu: full-screen overlay, independent of the sticky header */}
      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-0 z-50 flex flex-col bg-cream transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden",
          menuOpen ? "translate-x-0" : "-translate-x-full",
        )}
        aria-hidden={!menuOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="container-lb grid h-16 shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b border-petal">
          <button
            type="button"
            className="-ml-2 inline-flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-blush"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            <CloseIcon />
          </button>
          <Link href="/" onClick={() => setMenuOpen(false)} aria-label={`${site.name} home`}>
            <Image src="/brand/logo-rose.png" alt={site.name} width={1725} height={447} className="h-8 w-auto" sizes="130px" />
          </Link>
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              openCart();
            }}
            className="-mr-2 justify-self-end inline-flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-blush"
            aria-label="Open bag"
          >
            <BagIcon />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 pt-5 pb-10">
          <form action="/search" className="mb-6 flex items-center gap-2 rounded-full border border-petal bg-white px-4">
            <SearchIcon className="text-plum" width={18} height={18} />
            <input
              type="search"
              name="q"
              placeholder="Search"
              className="w-full bg-transparent py-3 text-base outline-none"
              aria-label="Search products"
            />
          </form>
          <ul className="space-y-1">
            {[...nav.primary, ...nav.secondary].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between border-b border-petal py-4 font-serif text-2xl text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="mt-6 space-y-3 text-sm text-plum">
            <li>
              <Link href="/faq" onClick={() => setMenuOpen(false)}>
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/contact" onClick={() => setMenuOpen(false)}>
                Contact
              </Link>
            </li>
            <li>
              <Link href="/policies/shipping-returns" onClick={() => setMenuOpen(false)}>
                Shipping &amp; Returns
              </Link>
            </li>
          </ul>
          <a
            href={site.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 text-sm text-rose-deep"
          >
            <InstagramIcon /> {site.social.instagramHandle}
          </a>
        </div>
      </div>
    </header>
  );
}
