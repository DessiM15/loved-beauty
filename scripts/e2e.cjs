/* eslint-disable */
// End-to-end smoke test of the purchase flow against a running server.
// Usage: node scripts/e2e.cjs [baseUrl]
const puppeteer = require("puppeteer-core");

const BASE = process.argv[2] || "http://localhost:3111";
const CHROME = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT = process.env.SHOTS_DIR || ".";

function assert(cond, msg) {
  if (!cond) throw new Error("ASSERT: " + msg);
  console.log("ok -", msg);
}

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new", args: ["--no-sandbox"] });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 414, height: 896, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    page.on("pageerror", (e) => console.error("PAGE ERROR:", e.message));

    // 1. No horizontal overflow on mobile.
    for (const path of ["/", "/shop", "/products/lip-liner-pencil", "/about", "/faq"]) {
      await page.goto(BASE + path, { waitUntil: "networkidle0" });
      const { sw, cw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
      assert(sw <= cw, `no horizontal overflow on ${path} (${sw} <= ${cw})`);
    }

    // 2. Quick add from the shop grid opens the drawer with the item.
    await page.goto(BASE + "/shop", { waitUntil: "networkidle0" });
    const addButtons = await page.$$('button[aria-label^="Add "][aria-label$=" to bag"]');
    assert(addButtons.length > 0, "shop grid has quick-add buttons");
    await addButtons[0].click();
    await page.waitForSelector('[aria-label="Your bag"] li', { timeout: 8000 });
    let count = await page.$eval('[aria-label="Your bag"] h2 span', (el) => el.textContent);
    assert(count.includes("1"), `drawer shows 1 item (${count})`);
    await page.screenshot({ path: `${OUT}/e2e-drawer-mobile.png` });

    // 3. Increase quantity, then persist across reload.
    await page.click('[aria-label="Your bag"] button[aria-label^="Increase quantity"]');
    await page.waitForFunction(() => document.querySelector('[aria-label="Your bag"] h2 span')?.textContent?.includes("2"), { timeout: 8000 });
    assert(true, "quantity increments to 2");
    await page.reload({ waitUntil: "networkidle0" });
    await page.waitForFunction(() => /2/.test(document.querySelector('button[aria-label^="Open bag"]')?.getAttribute("aria-label") || ""), { timeout: 8000 });
    assert(true, "cart persists across reload (badge shows 2)");

    // 4. Shade product: choose shade on PDP and add.
    await page.goto(BASE + "/products/lip-liner-pencil", { waitUntil: "networkidle0" });
    await page.click('button[aria-pressed="false"]');
    await page.click("button::-p-text(Add to bag)");
    await page.waitForFunction(() => document.querySelector('[aria-label="Your bag"] h2 span')?.textContent?.includes("3"), { timeout: 8000 });
    assert(true, "shade variant added; drawer shows 3 items");
    const lineText = await page.$eval('[aria-label="Your bag"] ul', (el) => el.textContent);
    assert(/Lip Liner Pencil/.test(lineText), "drawer lists the lip liner");

    // 5. Checkout link points somewhere.
    const checkoutHref = await page.$eval('[aria-label="Your bag"] a::-p-text(Checkout)', (a) => a.getAttribute("href"));
    assert(checkoutHref && checkoutHref.length > 1, `checkout href set (${checkoutHref})`);

    // 6. Remove a line.
    await page.click('[aria-label="Your bag"] button[aria-label^="Remove"]');
    await page.waitForFunction(() => !(document.querySelector('[aria-label="Your bag"] h2 span')?.textContent || "").includes("3"), { timeout: 8000 });
    assert(true, "remove works");

    // 7. Newsletter + contact endpoints.
    const nl = await page.evaluate(async () => {
      const r = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: "test@example.com" }) });
      return r.status;
    });
    assert(nl === 200, "newsletter endpoint accepts a valid email");
    const bad = await page.evaluate(async () => {
      const r = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: "nope" }) });
      return r.status;
    });
    assert(bad === 400, "newsletter endpoint rejects an invalid email");
    const ct = await page.evaluate(async () => {
      const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "T", email: "t@example.com", message: "hi" }) });
      return r.status;
    });
    assert(ct === 200, "contact endpoint accepts a message");

    // 8. Desktop screenshots with the drawer open.
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await page.goto(BASE + "/products/lustre-lip-gloss", { waitUntil: "networkidle0" });
    await page.click("button::-p-text(Add to bag)");
    await page.waitForSelector('[aria-label="Your bag"] li', { timeout: 8000 });
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: `${OUT}/e2e-drawer-desktop.png` });

    console.log("\nALL E2E CHECKS PASSED");
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
