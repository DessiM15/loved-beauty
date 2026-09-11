import Image from "next/image";
import Link from "next/link";
import { nav, site } from "@/content/site";
import { InstagramIcon, TikTokIcon } from "@/components/ui/icons";
import { NewsletterForm } from "@/components/marketing/newsletter-form";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="hairline-t bg-cream">
      {/* Big brand line */}
      <div className="container-lb flex flex-col items-center gap-6 py-16 text-center md:py-20">
        <Image src="/brand/logo-rose.png" alt={site.name} width={1725} height={447} className="h-14 w-auto md:h-20" data-reveal />
        <p className="h-italic max-w-xl text-2xl text-plum md:text-3xl" data-reveal style={{ "--d": "120ms" } as React.CSSProperties}>
          Beauty that feels like being loved.
        </p>
      </div>

      <div className="hairline-t">
        <div className="container-lb grid gap-12 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="eyebrow mb-4">Join the list</p>
            <p className="mb-5 max-w-sm text-sm text-plum">10% off your first order, new shades and restocks. No noise.</p>
            <NewsletterForm variant="line" source="footer" className="max-w-sm" />
            <div className="mt-8 flex items-center gap-3">
              <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Loved Beauty on Instagram" className="inline-flex h-10 w-10 items-center justify-center border border-line text-ink transition-colors hover:border-ink">
                <InstagramIcon width={18} height={18} />
              </a>
              {site.social.tiktok && (
                <a href={site.social.tiktok} target="_blank" rel="noopener noreferrer" aria-label="Loved Beauty on TikTok" className="inline-flex h-10 w-10 items-center justify-center border border-line text-ink transition-colors hover:border-ink">
                  <TikTokIcon width={18} height={18} />
                </a>
              )}
            </div>
          </div>
          <FooterColumn title="Shop" links={nav.footer.shop} />
          <FooterColumn title="Help" links={nav.footer.help} />
          <div>
            <FooterColumn title="About" links={nav.footer.about} />
            <p className="mt-8 text-sm text-plum">
              <a href={`mailto:${site.supportEmail}`} className="link-underline text-ink">
                {site.supportEmail}
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="hairline-t">
        <div className="container-lb flex flex-col items-center justify-between gap-3 py-6 text-center text-[0.62rem] tracking-[0.12em] uppercase text-plum md:flex-row md:text-left">
          <p>
            © {year} {site.legalName} · {site.location}
          </p>
          <p>
            Designed by{" "}
            <a href={site.agency.url} target="_blank" rel="noopener noreferrer" className="link-underline text-ink">
              {site.agency.name}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="eyebrow mb-5">{title}</p>
      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l.href}>
            {l.href.startsWith("http") ? (
              <a href={l.href} target="_blank" rel="noopener noreferrer" className="link-underline text-sm text-ink">
                {l.label}
              </a>
            ) : (
              <Link href={l.href} className="link-underline text-sm text-ink">
                {l.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
