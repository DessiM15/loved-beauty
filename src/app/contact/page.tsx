import type { Metadata } from "next";
import { site } from "@/content/site";
import { ContactForm } from "@/components/marketing/contact-form";
import { InstagramIcon, MailIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Loved Beauty about an order, a product or a collaboration. We reply within one business day.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="container-lb py-12 md:py-16">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <div>
          <p className="eyebrow">Say hello</p>
          <h1 className="h-display mt-3 text-5xl">We&rsquo;d love to hear from you.</h1>
          <p className="mt-4 text-[0.95rem] leading-relaxed text-plum">
            Questions about an order, a shade, or a collaboration? Send a note and we&rsquo;ll get back to you within one business day.
          </p>
          <ul className="mt-8 space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <MailIcon className="text-rose" />
              <a href={`mailto:${site.supportEmail}`} className="underline decoration-petal underline-offset-4 hover:decoration-rose">
                {site.supportEmail}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <InstagramIcon className="text-rose" />
              <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="underline decoration-petal underline-offset-4 hover:decoration-rose">
                {site.social.instagramHandle}
              </a>
            </li>
          </ul>
          <p className="mt-8 text-xs text-plum">{site.legalName} · {site.location}</p>
        </div>
        <div className="rounded-3xl border border-petal bg-white p-6 md:p-8">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
