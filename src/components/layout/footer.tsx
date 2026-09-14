import Image from "next/image";
import Link from "next/link";
import { nav, site } from "@/content/site";
import { InstagramIcon, TikTokIcon } from "@/components/ui/icons";
import { NewsletterForm } from "@/components/marketing/newsletter-form";

/** Footer (option 1G): light tan ground, the logo (larger, per the client), email sign-up, links, socials, credits. */
export function Footer() {
  const year = new Date().getFullYear();
  const social = "inline-flex h-10 w-10 items-center justify-center border border-tan-line text-ink transition-colors hover:border-ink";
  return (
    <footer className="border-t border-tan-line bg-tan text-ink">
      <div className="container-lb grid gap-12 py-16 md:grid-cols-[1.5fr_1fr_1fr_1fr] md:gap-10 md:py-[4.5rem]">
        <div>
          <Image src="/brand/logo.png" alt={site.name} width={2100} height={600} className="h-[4.5rem] w-auto" sizes="300px" />
          <p className="mt-6 mb-4 max-w-sm text-sm text-plum">10% off your first order, new shades and restocks. No noise.</p>
          <NewsletterForm variant="line" source="footer" className="max-w-sm" />
          <div className="mt-8 flex items-center gap-3">
            <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Loved Beauty on Instagram" className={social}>
              <InstagramIcon width={18} height={18} />
            </a>
            <a href={site.social.tiktok} target="_blank" rel="noopener noreferrer" aria-label="Loved Beauty on TikTok" className={social}>
              <TikTokIcon width={18} height={18} />
            </a>
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

      <div className="border-t border-black/10">
        <div className="container-lb flex flex-col items-center justify-between gap-2 py-6 text-center text-[0.6rem] tracking-[0.14em] uppercase text-ink/75 md:flex-row md:text-left">
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
      <p className="eyebrow mb-5 text-[#7c5f4e]">{title}</p>
      <ul className="space-y-2.5">
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
