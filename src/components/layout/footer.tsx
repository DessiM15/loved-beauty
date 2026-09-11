import Image from "next/image";
import Link from "next/link";
import { nav, site } from "@/content/site";
import { InstagramIcon, TikTokIcon } from "@/components/ui/icons";
import { NewsletterForm } from "@/components/marketing/newsletter-form";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-petal bg-white">
      <div className="container-lb py-14">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Image src="/brand/logo-rose.png" alt={site.name} width={1725} height={447} className="h-9 w-auto" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-plum">{site.tagline}</p>
            <div className="mt-6">
              <p className="eyebrow mb-3">Get 10% off your first order</p>
              <NewsletterForm compact source="footer" />
            </div>
            <div className="mt-6 flex items-center gap-4">
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Loved Beauty on Instagram"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-petal text-ink hover:border-rose hover:text-rose-deep"
              >
                <InstagramIcon />
              </a>
              {site.social.tiktok && (
                <a
                  href={site.social.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Loved Beauty on TikTok"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-petal text-ink hover:border-rose hover:text-rose-deep"
                >
                  <TikTokIcon />
                </a>
              )}
            </div>
          </div>

          <FooterColumn title="Shop" links={nav.footer.shop} />
          <FooterColumn title="Help" links={nav.footer.help} />
          <div>
            <FooterColumn title="About" links={nav.footer.about} />
            <p className="mt-6 text-sm text-plum">
              Questions?{" "}
              <a href={`mailto:${site.supportEmail}`} className="text-ink underline decoration-petal underline-offset-4 hover:decoration-rose">
                {site.supportEmail}
              </a>
            </p>
          </div>
        </div>

        <div className="gold-rule mt-12" />

        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-center text-[0.7rem] tracking-wide text-plum md:flex-row md:text-left">
          <p>
            © {year} {site.legalName}. {site.location}. All rights reserved.
          </p>
          <p>
            This website is designed by{" "}
            <a
              href={site.agency.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink underline decoration-petal underline-offset-4 hover:decoration-rose"
            >
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
      <p className="eyebrow mb-4">{title}</p>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            {l.href.startsWith("http") ? (
              <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-sm text-ink hover:text-rose-deep">
                {l.label}
              </a>
            ) : (
              <Link href={l.href} className="text-sm text-ink hover:text-rose-deep">
                {l.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
