"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { nav, site } from "@/content/site";
import { useCart } from "@/components/cart/cart-context";
import { BagIcon, CloseIcon, InstagramIcon, MenuIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { useNavStyle } from "@/lib/nav-style";

/**
 * Sticky header: the logo centered, the four links, Shop Now and the bag
 * on the right. V1 (light): transparent over the home hero, solid cream
 * once the page scrolls, logo over a soft haze. V2 (dark): solid ink bar,
 * logo as supplied, no haze.
 */
export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { cart, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const count = cart?.totalQuantity ?? 0;
  const dark = useNavStyle() === "dark";
  const overHero = pathname === "/" && !dark;
  const transparent = overHero && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setMenuOpen(false);
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

  /** Logo always lands on the top of the home page, even when already there. */
  function goHome(e: React.MouseEvent) {
    setMenuOpen(false);
    e.preventDefault();
    if (pathname === "/") window.scrollTo({ top: 0, behavior: "smooth" });
    else router.push("/");
  }

  const fg = dark ? "text-cream" : "text-ink";
  const linkClass = cn("link-underline text-[0.7rem] font-medium tracking-luxe uppercase", fg);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-[background-color,border-color] duration-500",
        dark ? "border-b border-white/10 bg-ink" : transparent ? "border-b border-transparent bg-transparent" : "border-b border-line bg-cream",
        overHero && "-mb-[var(--header-h)]",
      )}
    >
      <div className="container-lb grid h-[var(--header-h)] grid-cols-[1fr_auto_1fr] items-center">
        {/* Left: menu (mobile only) */}
        <div className="flex items-center">
          <button
            type="button"
            className={cn("-ml-2 inline-flex h-10 w-10 items-center justify-center md:hidden", fg)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(true)}
          >
            <MenuIcon />
          </button>
        </div>

        {/* Center: the logo, exactly as supplied. Light bar: over a soft haze so the pale pink reads. Dark bar: as is. */}
        <Link href="/" onClick={goHome} className={cn("flex items-center justify-center px-3", !dark && "logo-smoke")} aria-label={`${site.name} home`}>
          <Image src="/brand/logo.png" alt={site.name} width={2100} height={600} priority className="h-14 w-auto md:h-[4.5rem]" sizes="(min-width: 768px) 260px, 200px" />
        </Link>

        {/* Right: links (desktop), Shop Now, bag */}
        <div className="flex items-center justify-end gap-3 md:gap-5">
          <nav aria-label="Primary" className="mr-2 hidden md:block lg:mr-4">
            <ul className="flex items-center gap-7 lg:gap-8">
              {nav.primary.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} aria-current={isActive(item.href) ? "page" : undefined} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Link href="/shop" className="btn btn-primary hidden min-h-0 px-5 py-2.5 sm:inline-flex">
            Shop Now
          </Link>
          <button
            type="button"
            onClick={openCart}
            className={cn("relative -mr-2 inline-flex h-10 w-10 items-center justify-center", fg)}
            aria-label={`Open bag, ${count} ${count === 1 ? "item" : "items"}`}
          >
            <BagIcon width={21} height={21} />
            {count > 0 && (
              <span className={cn("absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[0.58rem] font-medium", dark ? "bg-pink text-ink" : "bg-ink text-white")}>{count}</span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu: rendered on <body> via a portal so no header effect can clip it */}
      {mounted &&
        createPortal(
          <div
            id="mobile-menu"
            className={cn(
              "fixed inset-0 z-50 flex flex-col bg-cream transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] md:hidden",
              menuOpen ? "translate-x-0" : "-translate-x-full",
            )}
            aria-hidden={!menuOpen}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="container-lb grid h-[var(--header-h)] shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b border-line">
              <button type="button" className="-ml-2 inline-flex h-10 w-10 items-center justify-center text-ink" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
                <CloseIcon />
              </button>
              <Link href="/" onClick={goHome} aria-label={`${site.name} home`} className="logo-smoke px-3">
                <Image src="/brand/logo.png" alt={site.name} width={2100} height={600} className="h-14 w-auto" sizes="200px" />
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  openCart();
                }}
                className="-mr-2 inline-flex h-10 w-10 items-center justify-center justify-self-end text-ink"
                aria-label="Open bag"
              >
                <BagIcon width={21} height={21} />
              </button>
            </div>
            <div className="container-lb flex-1 overflow-y-auto pt-4 pb-10">
              <ul>
                {nav.primary.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} onClick={() => setMenuOpen(false)} className="flex items-baseline justify-between border-b border-line py-5 text-2xl font-semibold text-ink">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="mt-8 space-y-3 text-[0.7rem] tracking-luxe uppercase text-plum">
                <li>
                  <Link href="/faq" onClick={() => setMenuOpen(false)}>
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/policies/shipping-returns" onClick={() => setMenuOpen(false)}>
                    Shipping &amp; Returns
                  </Link>
                </li>
              </ul>
              <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="mt-10 inline-flex items-center gap-2 text-sm text-rose-deep">
                <InstagramIcon /> {site.social.instagramHandle}
              </a>
            </div>
          </div>,
          document.body,
        )}
    </header>
  );
}
