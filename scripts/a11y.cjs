/* eslint-disable */
// Accessibility scan: axe-core against every route, at desktop and phone widths,
// plus the states a page scan cannot reach (bag open, bag empty, phone menu open).
// Usage: node scripts/a11y.cjs [baseUrl]      (server must be running; see README)
//   A11Y_REPORT=path.json   write the full results
//   A11Y_VERBOSE=1          also list "needs review" items (text over photos etc.)
const fs = require("fs");
const puppeteer = require("puppeteer-core");
const axeSource = require("axe-core").source;

const BASE = (process.argv[2] || "http://localhost:3111").replace(/\/$/, "");
const CHROME = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];
const VIEWPORTS = [
  { name: "desktop", width: 1366, height: 900, deviceScaleFactor: 1 },
  { name: "phone", width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
];

const STATIC_ROUTES = [
  "/",
  "/shop",
  "/about",
  "/contact",
  "/faq",
  "/accessibility",
  "/search",
  "/search?q=gloss",
  "/search?q=zzzzzz",
  "/policies/shipping-returns",
  "/policies/privacy",
  "/policies/terms",
  "/shade-finder",
  "/checkout-preview",
  "/this-page-does-not-exist",
];

const { visit, drawn, sleep } = require("./a11y-visit.cjs");

/** Product and collection routes come from the sitemap, so new products are scanned without editing this file. */
async function discoverRoutes() {
  const res = await fetch(`${BASE}/sitemap.xml`);
  const xml = await res.text();
  const found = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => new URL(m[1]).pathname)
    .filter((p) => p.startsWith("/products/") || p.startsWith("/collections/"));
  return [...new Set([...STATIC_ROUTES, ...found])];
}

/** Everything animated in is shown, as it is once a shopper has scrolled the page. */
async function settle(page) {
  await page.evaluate(() => document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-in")));
  await sleep(1100);
}

async function runAxe(page) {
  await page.evaluate(axeSource);
  return page.evaluate(async (tags) => {
    const r = await window.axe.run(document, { runOnly: { type: "tag", values: tags }, resultTypes: ["violations", "incomplete"] });
    const slim = (list) =>
      list.map((v) => ({
        id: v.id,
        impact: v.impact,
        help: v.help,
        nodes: v.nodes.map((n) => ({ target: n.target.join(" "), html: n.html.slice(0, 200), summary: (n.failureSummary || "").replace(/\s+/g, " ").slice(0, 300) })),
      }));
    return { violations: slim(r.violations), incomplete: slim(r.incomplete) };
  }, TAGS);
}

/** Fail if anything hidden can still take keyboard focus. axe does not check this when the hiding is visual only. */
async function hiddenFocusables(page) {
  return page.evaluate(() => {
    const sel = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';
    const out = [];
    for (const el of document.querySelectorAll(sel)) {
      if (el.closest("[inert]")) continue;
      if (el.tabIndex < 0) continue;
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden") continue;
      if (el.closest('[aria-hidden="true"]')) out.push(`inside aria-hidden: ${el.outerHTML.slice(0, 120)}`);
    }
    return out;
  });
}

async function addFirstProductToBag(page) {
  await visit(page, `${BASE}/shop`);
  await settle(page);
  const btn = await page.$('button[aria-label^="Add "][aria-label$=" to bag"]');
  if (!btn) throw new Error("no quick-add button on /shop");
  await btn.click();
  await page.waitForSelector('[role="dialog"][aria-labelledby="cart-heading"] li', { timeout: 10000 });
  await sleep(900);
}

(async () => {
  const routes = await discoverRoutes();
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new", args: ["--no-sandbox"] });
  const report = [];
  let failures = 0;

  const record = (viewport, label, res, extra = []) => {
    const count = res.violations.reduce((n, v) => n + v.nodes.length, 0) + extra.length;
    failures += count;
    report.push({ viewport, label, ...res, hiddenFocusables: extra });
    console.log(`${count === 0 ? "pass" : "FAIL"}  ${viewport.padEnd(8)} ${label}${count ? `  (${count})` : ""}`);
    for (const v of res.violations) {
      console.log(`      [${v.impact}] ${v.id}: ${v.help}`);
      for (const n of v.nodes.slice(0, 6)) console.log(`        ${n.target}\n          ${n.summary}`);
      if (v.nodes.length > 6) console.log(`        … ${v.nodes.length - 6} more`);
    }
    for (const e of extra) console.log(`      [serious] focusable while hidden: ${e}`);
    if (process.env.A11Y_VERBOSE) for (const v of res.incomplete) console.log(`      (review) ${v.id}: ${v.nodes.map((n) => n.target).join(" | ").slice(0, 300)}`);
  };

  try {
    for (const vp of VIEWPORTS) {
      const { name, ...viewport } = vp;
      const context = await browser.createBrowserContext();
      const page = await context.newPage();
      await page.setViewport(viewport);
      // The welcome offer is scanned on its own at the end; keep it from opening over the other scans.
      const quietOffer = await page.evaluateOnNewDocument(() => localStorage.setItem("lb_welcome_dismissed", String(Date.now() + 864e5)));
      page.on("pageerror", (e) => console.error("PAGE ERROR:", e.message));

      for (const route of routes) {
        await visit(page, BASE + route);
        await settle(page);
        record(name, route, await runAxe(page), await hiddenFocusables(page));
      }

      // Bag open, empty.
      await visit(page, `${BASE}/`);
      await settle(page);
      await page.click('button[aria-label^="Open bag"]');
      await page.waitForSelector('[role="dialog"][aria-labelledby="cart-heading"]', { timeout: 10000 });
      await sleep(900);
      record(name, "bag open (empty)", await runAxe(page), await hiddenFocusables(page));

      // Bag open, with a product in it.
      await addFirstProductToBag(page);
      record(name, "bag open (one product)", await runAxe(page), await hiddenFocusables(page));

      // Phone menu open.
      if (name === "phone") {
        await visit(page, `${BASE}/`);
        await settle(page);
        await page.click('button[aria-label="Open menu"]');
        await page.waitForSelector('#mobile-menu[role="dialog"]:not([inert])', { timeout: 10000 });
        await sleep(900);
        record(name, "menu open", await runAxe(page), await hiddenFocusables(page));
      }

      // Welcome offer (only when NEXT_PUBLIC_SHOW_WELCOME_POPUP=true). It appears after a scroll.
      await page.removeScriptToEvaluateOnNewDocument(quietOffer.identifier);
      await visit(page, `${BASE}/about`);
      await page.evaluate(() => localStorage.removeItem("lb_welcome_dismissed"));
      await page.reload({ waitUntil: "load" });
    await drawn(page);
      await settle(page);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.6));
      const offer = await page.waitForSelector('[role="dialog"][aria-labelledby="welcome-heading"]', { timeout: 2500 }).catch(() => null);
      if (offer) {
        await sleep(1100);
        record(name, "welcome offer open", await runAxe(page), await hiddenFocusables(page));
      } else {
        console.log(`skip  ${name.padEnd(8)} welcome offer (switched off on this server)`);
      }

      await context.close();
    }
  } finally {
    await browser.close();
  }

  if (process.env.A11Y_REPORT) fs.writeFileSync(process.env.A11Y_REPORT, JSON.stringify(report, null, 2));
  console.log(failures === 0 ? `\nZERO VIOLATIONS across ${report.length} scans` : `\n${failures} violation(s) across ${report.length} scans`);
  process.exit(failures === 0 ? 0 : 1);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
