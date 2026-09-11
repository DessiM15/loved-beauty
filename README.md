# Loved Beauty — storefront

Headless Shopify storefront for [lovedbeautyshop.net](https://lovedbeautyshop.net), built with Next.js 16, React 19 and Tailwind 4. Designed and maintained by Smart Scale, LLC.

## Run locally

```bash
npm install
cp .env.example .env.local   # optional; the site runs on a built-in mock catalog without it
npm run dev                  # http://localhost:3000
```

Without Shopify credentials the site serves the mock catalog in `src/lib/mock/catalog.ts` (the client's 10 products plus 2 proposed sets) and a cookie-backed cart. Every page, the cart drawer, search, newsletter and contact form work in this mode so the site can be demoed before the store exists.

## Connect Shopify (when the client's store is ready)

1. **Plan**: Shopify Basic or above (Starter does not expose the Storefront API the way we need).
2. **Storefront token**: Shopify Admin → Sales channels → *Headless* (install if needed) → create a storefront → copy the **public access token**. Alternatively Apps → Develop apps → create app → Storefront API scopes: `unauthenticated_read_product_listings`, `unauthenticated_read_product_inventory`, `unauthenticated_read_collection_listings`, `unauthenticated_write_checkouts`, `unauthenticated_read_checkouts`, `unauthenticated_write_customers`, `unauthenticated_read_content`.
3. **Env vars** (Vercel → Project → Settings → Environment Variables):
   - `SHOPIFY_STORE_DOMAIN` = `xxxx.myshopify.com`
   - `SHOPIFY_STOREFRONT_ACCESS_TOKEN` = token from step 2
   - `SHOPIFY_WEBHOOK_SECRET` = Admin → Settings → Notifications → Webhooks → signing secret
   - `COMMERCE_SOURCE` = `mock` keeps the placeholder catalog on the live site while the Shopify store is still empty. Delete the var (and redeploy) once real products exist.
4. **Collections**: create collections with these exact handles so the nav and home page light up: `lips`, `lip-care`, `face-and-body-glow`, `sets`, `bestsellers`. Category chips and the sitemap pick up any additional collections automatically.
5. **Product content**: description = short paragraph. Optional metafields (namespace `custom`) render as accordions: `benefits` (list or one per line), `how_to_use` (text), `ingredients` (text). Tag products `bestseller` or `new` to show badges. Set **Compare-at price** on sets to show "Set & save".
6. **Webhooks** → `https://lovedbeautyshop.net/api/revalidate` for topics `products/create|update|delete` and `collections/create|update|delete`. This is what makes edits in Shopify appear on the site within seconds. Even without webhooks, pages refresh every 60 s.
7. **Policies**: write Shipping, Refund, Privacy and Terms in Shopify → Settings → Policies. The site reads them from there; the drafts in `src/content/policies.ts` are only the fallback.
8. **Checkout**: the cart's Checkout button goes to Shopify's hosted checkout automatically (Shop Pay, Apple Pay, Google Pay). Turn on **abandoned checkout recovery** in Shopify → Settings → Checkout.
9. **Email**: newsletter signups create Shopify customers with marketing consent; use Shopify Email (free tier) or connect Klaviyo.

## Shade finder (AI)

`/shade-finder` recommends a liner, gloss and prep product from the shopper's undertone, skin depth and desired vibe.

- **Quiz path** (3 questions) runs with no API key, using the rules in `src/lib/shade/recommend.ts`.
- **Selfie path** sends a browser-downscaled photo to Claude (`claude-opus-5`, vision) which returns undertone, depth and lip tone as structured JSON. Set `ANTHROPIC_API_KEY` in Vercel to switch it on. Photos are analyzed in memory and never stored. Cost is about one cent per match.
- Update the shade names in `recommend.ts` when the client confirms the real liner shades; they must match the Shopify variant option values.

## Other services

| Feature | Env var | Notes |
| --- | --- | --- |
| Contact form email | `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | Free Resend account; verify the sending domain once DNS access exists. Without a key, messages are logged only. |
| Google Analytics 4 | `NEXT_PUBLIC_GA_ID` | Also add the same ID in Shopify → Customer events so purchases are tracked. |
| Meta Pixel | `NEXT_PUBLIC_META_PIXEL_ID` | Same: add in Shopify for purchase events. |
| Reviews section | `NEXT_PUBLIC_SHOW_REVIEWS=true` | Hidden until there are real reviews. Wire to Judge.me / Loox / Shopify Reviews. |
| Welcome popup | `NEXT_PUBLIC_SHOW_WELCOME_POPUP=true` | Delayed 12 s / 40 % scroll, remembers dismissal 14 days. |

## Where things live

```
src/content/site.ts        all editable copy: announcements, nav, hero, values, FAQ, about, Instagram grid
src/content/policies.ts    fallback policy drafts (Shopify is the source of truth once connected)
src/lib/shopify/           Storefront API client, GraphQL, and the commerce facade (index.ts)
src/lib/mock/              mock catalog + cookie cart used when Shopify env vars are absent
src/lib/cart/actions.ts    server actions for the cart (cart id in httpOnly cookie)
src/components/            layout, cart, product, home, marketing, ui
src/app/                   routes: /, /shop, /collections/[handle], /products/[handle], /about, /faq, /contact,
                           /policies/[handle], /search, sitemap, robots, manifest, /api/*
scripts/process-images.cjs converts the client's photos into optimized WebP + logo variants + icons
scripts/e2e.cjs            headless-Chrome smoke test of the purchase flow (node scripts/e2e.cjs http://localhost:3000)
```

## SEO checklist (done in code)

Per-page titles and meta descriptions, canonical URLs, Open Graph image, `Product` + `AggregateOffer`, `BreadcrumbList`, `CollectionPage`/`ItemList`, `FAQPage`, `Organization` and `WebSite` JSON-LD, image sitemap, robots.txt, descriptive alt text on every image, semantic headings, static/ISR pages for fast Core Web Vitals, AVIF/WebP images.

Still to do once live: Google Search Console verification + sitemap submission, Google Business Profile (Cypress, TX), Instagram Shopping via Shopify catalog.

## Deploy

Vercel, framework preset Next.js. Add the env vars above. Point `lovedbeautyshop.net` (A/ALIAS) and `www` (CNAME) at Vercel when DNS access is granted.
