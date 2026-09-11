import type { ShopPolicy } from "@/lib/shopify/types";

/**
 * Fallback policies shown until Shopify's policy pages are published.
 * Once connected, the site reads Shipping, Refund, Privacy and Terms directly
 * from Shopify (Settings → Policies), so edit them there, not here.
 *
 * DRAFT for the client's review. Not legal advice.
 */
export const policies: ShopPolicy[] = [
  {
    handle: "shipping-returns",
    title: "Shipping & Returns",
    body: `
<h2>Shipping</h2>
<p>All orders ship from Cypress, Texas within 1 to 3 business days. Standard U.S. shipping usually arrives in 3 to 6 business days after dispatch. You will receive a confirmation email with tracking as soon as your order ships.</p>
<p>U.S. orders over $200 ship free. Shipping on all other orders is calculated at checkout based on weight and destination. We currently ship within the United States only.</p>
<h2>Returns &amp; exchanges</h2>
<p>Because our products are cosmetics, we are unable to accept returns or exchanges on opened or used items for hygiene and safety reasons. All sales of opened cosmetics are final.</p>
<p>Unopened, unused products in their original sealed packaging may be returned within 14 days of delivery for store credit. Return shipping is the customer's responsibility.</p>
<h2>Damaged or incorrect orders</h2>
<p>If your order arrives damaged, defective or incorrect, please email <a href="mailto:lovedbeautyshop@gmail.com">lovedbeautyshop@gmail.com</a> within 7 days of delivery with your order number and a photo. We will send a replacement or issue a refund right away.</p>
<h2>Lost packages</h2>
<p>If tracking shows delivered but you have not received your package, please check with neighbors and your local carrier first, then contact us within 7 days so we can help.</p>
`,
  },
  {
    handle: "privacy",
    title: "Privacy Policy",
    body: `
<p>Loved Beauty LLC ("we", "us") respects your privacy. This policy explains what information we collect when you visit lovedbeautyshop.net, how we use it, and the choices you have.</p>
<h2>Information we collect</h2>
<p>When you place an order we collect the information needed to fulfil it: your name, shipping address, email address, phone number and payment details. Payments are processed securely by Shopify Payments; we never see or store your full card number.</p>
<p>When you browse our site we automatically collect standard device and usage information (such as IP address, browser type and the pages you view) through cookies and similar technologies, including Google Analytics and, if enabled, Meta Pixel.</p>
<h2>How we use it</h2>
<ul>
<li>To process and ship your order and send order updates</li>
<li>To respond to your questions and provide customer support</li>
<li>To send marketing emails if you have opted in (you can unsubscribe anytime)</li>
<li>To understand how our site is used so we can improve it</li>
<li>To prevent fraud and comply with legal obligations</li>
</ul>
<h2>Sharing</h2>
<p>We share information only with service providers who help us run the store, such as Shopify (our e-commerce platform), shipping carriers, payment processors and email providers. We do not sell your personal information.</p>
<h2>Your choices</h2>
<p>You may request access to, correction of, or deletion of your personal information by emailing <a href="mailto:lovedbeautyshop@gmail.com">lovedbeautyshop@gmail.com</a>. You can opt out of marketing emails using the unsubscribe link in any message.</p>
<h2>Contact</h2>
<p>Questions about this policy can be sent to <a href="mailto:lovedbeautyshop@gmail.com">lovedbeautyshop@gmail.com</a>.</p>
`,
  },
  {
    handle: "terms",
    title: "Terms of Service",
    body: `
<p>By using lovedbeautyshop.net and purchasing from Loved Beauty LLC you agree to the following terms.</p>
<h2>Products</h2>
<p>We do our best to display product colors and details accurately. Because screens vary, actual shades may differ slightly from what you see. All products are for external cosmetic use only. Discontinue use if irritation occurs. Please review ingredient lists carefully if you have known allergies.</p>
<h2>Pricing &amp; payment</h2>
<p>All prices are in U.S. dollars. We reserve the right to change prices, correct errors and limit quantities at any time. Orders are processed securely through Shopify.</p>
<h2>Orders</h2>
<p>We reserve the right to refuse or cancel any order, including orders that appear to be placed by resellers or that we suspect are fraudulent. If we cancel an order after payment, you will receive a full refund.</p>
<h2>Promotions</h2>
<p>Discount codes cannot be combined unless stated otherwise and cannot be applied to previous purchases.</p>
<h2>Intellectual property</h2>
<p>All content on this site, including the Loved Beauty name, logo, images and text, is the property of Loved Beauty LLC and may not be used without permission.</p>
<h2>Contact</h2>
<p>Questions about these terms can be sent to <a href="mailto:lovedbeautyshop@gmail.com">lovedbeautyshop@gmail.com</a>.</p>
`,
  },
];
