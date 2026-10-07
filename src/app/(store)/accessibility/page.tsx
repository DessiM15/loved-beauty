import type { Metadata } from "next";
import Link from "next/link";
import { accessibility, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "Loved Beauty's accessibility statement: the standard we build to, known limitations, and how to tell us about a problem.",
  alternates: { canonical: "/accessibility" },
};

/**
 * Accessibility statement. Keep it true: when a limitation below is fixed, delete it;
 * when a new one is found, add it. Update `accessibility.reviewed` in content/site.ts
 * after every full check.
 */
export default function AccessibilityPage() {
  const days = accessibility.responseDays;
  return (
    <div className="container-lb py-12 md:py-16">
      <div className="mx-auto max-w-2xl">
        <p className="eyebrow">Help</p>
        <h1 className="h-display mt-3 text-5xl">Accessibility</h1>
        <div className="mt-8 text-[0.95rem] leading-relaxed text-plum [&_a]:text-ink [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-8 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-ink [&_li]:mt-1 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
          <p>
            {site.name} wants everyone to be able to browse and shop with us, whatever device or assistive technology they use. This page explains the standard we
            build to, what we know still falls short, and how to reach us if something gets in your way.
          </p>

          <h2>Our standard</h2>
          <p>
            This site is built to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at Level AA. We check every page with automated testing at desktop and
            phone sizes, and we check the shopping journey by hand, using only a keyboard, from the home page to the bag.
          </p>

          <h2>What that means in practice</h2>
          <ul>
            <li>Every page can be used with a keyboard alone, and the item in focus is always outlined.</li>
            <li>The bag and the menu keep focus inside while they are open, close with the Escape key, and return you to where you were.</li>
            <li>Changes to your bag are announced to screen readers.</li>
            <li>Product photos have text descriptions, and shades are named in text, not shown by colour alone.</li>
            <li>Form fields are labelled, and errors are explained in words next to the field.</li>
            <li>The rotating announcement at the top of the page can be paused, and motion is reduced if your device asks for that.</li>
            <li>Text can be enlarged to 200% without losing content.</li>
          </ul>

          <h2>Known limitations</h2>
          <ul>
            <li>
              <strong className="text-ink">Home page headline.</strong> The second line of the headline, &ldquo;Loves You Back&rdquo;, is set in our light brand pink
              over a photograph and does not meet the contrast level we aim for. The same words are in the page title, and the rest of the page does meet it.
            </li>
            <li>
              <strong className="text-ink">Checkout.</strong> Payment is completed on Shopify&rsquo;s secure checkout, which Shopify builds and maintains. We cannot
              change it, but we will pass on any problem you report.
            </li>
            <li>
              <strong className="text-ink">Instagram and TikTok.</strong> Links to our social pages open on those platforms, which we do not control.
            </li>
            <li>
              <strong className="text-ink">Photographs still to come.</strong> A few products do not have photographs yet. Their names, descriptions and prices are
              complete.
            </li>
          </ul>

          <h2>Tell us about a problem</h2>
          <p>
            If you have trouble using any part of this site, or need information in another format, email{" "}
            <a href={`mailto:${accessibility.email}?subject=Accessibility`}>{accessibility.email}</a> or use our <Link href="/contact">contact form</Link>. Tell us
            the page you were on and what happened, and the device or assistive technology you were using if you can.
          </p>
          <p>
            We will reply within {days} business {days === 1 ? "day" : "days"}, and we will help you complete your order another way while we fix the problem.
          </p>

          <p className="text-xs">Last reviewed {accessibility.reviewed}.</p>
        </div>
      </div>
    </div>
  );
}
