import Image from "next/image";
import Link from "next/link";
import { nav, site, values } from "@/content/site";
import { BunnyIcon, DropIcon, InstagramIcon, LeafIcon, ShieldIcon, TikTokIcon } from "@/components/ui/icons";
import { NewsletterForm } from "@/components/marketing/newsletter-form";

const valueIcons: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  vegan: LeafIcon,
  "cruelty-free": BunnyIcon,
  clean: DropIcon,
  "paraben-free": ShieldIcon,
};

/** Footer: the vegan / cruelty-free promise, then links, email sign-up and credits. */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="hairline-t bg-cream">
      {/* Our promise */}
      <section aria-label="Our values" className="bg-pink/50">
        <ul className="container-lb grid grid-cols-2 gap-x-6 gap-y-8 py-10 md:grid-cols-4 md:py-12">
          {values.map((v) => {
            const Icon = valueIcons[v.key] ?? LeafIcon;
            return (
              <li key={v.key} className="flex flex-col items-center gap-3 text-center">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-rose-deep">
                  <Icon />
                </span>
                <p className="text-sm font-semibold">{v.title}</p>
                <p className="-mt-2 text-xs text-plum">{v.text}</p>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="footer-main hairline-t">
        <div className="container-lb grid gap-12 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <span className="logo-smoke inline-block">
              <Image src="/brand/logo.png" alt={site.name} width={2100} height={600} className="h-12 w-auto" />
            </span>
            <p className="mt-6 mb-4 max-w-sm text-sm text-plum">10% off your first order, new shades and restocks. No noise.</p>
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
