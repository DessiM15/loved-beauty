/* eslint-disable */
// Keyboard-only walkthrough, with real key presses: home → shop → product → add to bag →
// bag → checkout link, then the phone menu. Also tabs through every page and checks
// that whatever has focus shows a ring, is on screen, and is not hidden.
// Usage: node scripts/a11y-keyboard.cjs [baseUrl]
const puppeteer = require("puppeteer-core");

const BASE = (process.argv[2] || "http://localhost:3111").replace(/\/$/, "");
const CHROME = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PAGES = ["/", "/shop", "/collections/lips", "/products/lip-liner-pencil", "/products/lustre-lip-gloss", "/about", "/contact", "/faq", "/search?q=gloss", "/policies/shipping-returns", "/accessibility"];
const { visit, drawn, sleep } = require("./a11y-visit.cjs");

let failures = 0;
function check(cond, msg) {
  if (cond) console.log("ok   -", msg);
  else {
    failures++;
    console.log("FAIL -", msg);
  }
}

/** What has focus, and whether a keyboard user can see it. */
const focusState = () => {
  const el = document.activeElement;
  if (!el || el === document.body) return { none: true };
  const cs = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  let ring = cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) >= 2;
  // A borderless field shows its ring on the box around it.
  if (!ring) {
    const box = el.closest(".focus-ring-within");
    if (box) {
      const b = getComputedStyle(box);
      ring = b.outlineStyle !== "none" && parseFloat(b.outlineWidth) >= 2;
    }
  }
  let clipped = false;
  const offset = parseFloat(cs.outlineOffset) || 0;
  if (offset > 0) {
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const ps = getComputedStyle(p);
      if (!/(hidden|clip)/.test(ps.overflowX + ps.overflowY)) continue;
      const pr = p.getBoundingClientRect();
      // Clipped on every side means the ring cannot be seen at all.
      if (r.left - offset < pr.left && r.right + offset > pr.right && r.top - offset < pr.top && r.bottom + offset > pr.bottom) clipped = true;
      break;
    }
  }
  const name = (el.getAttribute("aria-label") || el.textContent || el.getAttribute("name") || el.id || "").replace(/\s+/g, " ").trim().slice(0, 50);
  return {
    tag: el.tagName.toLowerCase(),
    name,
    ring,
    clipped,
    hidden: !!el.closest('[aria-hidden="true"], [inert]') || cs.visibility === "hidden" || cs.opacity === "0",
    onScreen: r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth,
    inDialog: !!el.closest('[role="dialog"]'),
    key: `${el.tagName}|${name}|${Math.round(r.left + scrollX)}|${Math.round(r.top + scrollY)}`,
  };
};

async function tabThrough(page, label, max = 200) {
  const seen = new Set();
  const problems = [];
  let count = 0;
  for (let i = 0; i < max; i++) {
    await page.keyboard.press("Tab");
    await sleep(40);
    const s = await page.evaluate(focusState);
    if (s.none) break; // focus left the page for the browser chrome: the end
    if (s.tag.startsWith("nextjs-")) continue; // the dev server's own badge; not part of the site
    if (seen.has(s.key)) break;
    seen.add(s.key);
    count++;
    if (!s.ring) problems.push(`no focus ring: <${s.tag}> "${s.name}"`);
    if (s.clipped) problems.push(`focus ring clipped: <${s.tag}> "${s.name}"`);
    if (s.hidden) problems.push(`hidden but focusable: <${s.tag}> "${s.name}"`);
    if (!s.onScreen) problems.push(`focus off screen: <${s.tag}> "${s.name}"`);
  }
  check(problems.length === 0, `${label}: ${count} stops, every one visible with a ring${problems.length ? "\n         " + problems.join("\n         ") : ""}`);
}

async function pressUntil(page, key, test, max = 80) {
  for (let i = 0; i < max; i++) {
    await page.keyboard.press(key);
    await sleep(40);
    const s = await page.evaluate(focusState);
    if (!s.none && test(s)) return s;
  }
  return null;
}

(async () => {
  const launched = await puppeteer.launch({ executablePath: CHROME, headless: "new", args: ["--no-sandbox"] });
  // Every page starts with the welcome offer dismissed, except the one that tests it.
  const browser = {
    close: () => launched.close(),
    newPage: async () => {
      const p = await launched.newPage();
      p.quietOffer = await p.evaluateOnNewDocument(() => localStorage.setItem("lb_welcome_dismissed", String(Date.now() + 864e5)));
      return p;
    },
  };
  try {
    // ---------- Desktop
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 900 });
    page.on("pageerror", (e) => console.error("PAGE ERROR:", e.message));

    console.log("\n# Every page, tabbed end to end (desktop)");
    for (const path of PAGES) {
      await visit(page, BASE + path);
      await page.evaluate(() => document.querySelectorAll("details").forEach((d) => (d.open = true)));
      await tabThrough(page, path);
    }

    console.log("\n# The shopping journey, keyboard only");
    await visit(page, BASE + "/");
    await page.keyboard.press("Tab");
    let s = await page.evaluate(focusState);
    check(s.name === "Skip to content" && s.onScreen, "first Tab lands on a visible Skip to content link");
    await page.keyboard.press("Enter");
    await sleep(150);
    check(await page.evaluate(() => document.activeElement?.id === "main"), "Skip to content moves focus to the main content");

    s = await pressUntil(page, "Tab", (f) => f.name === "Shop the Collection");
    check(!!s, "Tab reaches Shop the Collection in the hero");
    await Promise.all([page.waitForNavigation({ waitUntil: "load" }), page.keyboard.press("Enter")]);
    await drawn(page);
    check(page.url().endsWith("/shop"), "Enter opens the shop");

    s = await pressUntil(page, "Tab", (f) => f.tag === "a" && f.name === "Lustre Lip Gloss");
    check(!!s, "Tab reaches the first product by name (one link per card)");
    await Promise.all([page.waitForNavigation({ waitUntil: "load" }), page.keyboard.press("Enter")]);
    await drawn(page);
    check(page.url().includes("/products/lustre-lip-gloss"), "Enter opens the product page");

    s = await pressUntil(page, "Tab", (f) => f.tag === "button" && /Add to bag/.test(f.name));
    check(!!s, "Tab reaches Add to bag");
    await page.keyboard.press("Enter");
    await page.waitForSelector('[role="dialog"][aria-labelledby="cart-heading"] li', { timeout: 10000 });
    await sleep(700);
    s = await page.evaluate(focusState);
    check(s.inDialog && s.name === "Close bag" && s.ring, "bag opens and focus moves to Close bag, with a ring");
    const announced = await page.evaluate(() => document.querySelector("[data-live-region]")?.textContent);
    check(/Lustre Lip Gloss added to bag, 1 item in bag/.test(announced || ""), `bag change announced ("${announced}")`);
    check(
      await page.evaluate(() => ["header", "main", "footer"].every((t) => document.querySelector(`body > ${t}`)?.hasAttribute("inert"))),
      "page behind the bag is inert (header, main, footer)",
    );

    let escaped = 0;
    const names = [];
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press("Tab");
      await sleep(30);
      const f = await page.evaluate(focusState);
      if (f.none || !f.inDialog) escaped++;
      else if (!names.includes(f.name)) names.push(f.name);
    }
    check(escaped === 0, `Tab ×30 never leaves the bag (stops: ${names.join(" · ")})`);
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press("Tab", { shift: true });
      await page.keyboard.down("Shift");
      await page.keyboard.press("Tab");
      await page.keyboard.up("Shift");
      const f = await page.evaluate(focusState);
      if (f.none || !f.inDialog) escaped++;
    }
    check(escaped === 0, "Shift+Tab never leaves the bag");
    check(names.some((n) => /^Increase quantity of Lustre Lip Gloss/.test(n)) && names.some((n) => /^Remove Lustre Lip Gloss.* from bag/.test(n)), "quantity and remove buttons name the product");

    s = await pressUntil(page, "Tab", (f) => /^Increase quantity/.test(f.name));
    await page.keyboard.press("Enter");
    await page.waitForFunction(() => /quantity 2, 2 items in bag/.test(document.querySelector("[data-live-region]")?.textContent || ""), { timeout: 8000 });
    check(true, "quantity change announced (“Lustre Lip Gloss quantity 2, 2 items in bag”)");
    s = await page.evaluate(focusState);
    check(/^Increase quantity/.test(s.name), "focus stays on the quantity button after the change");

    s = await pressUntil(page, "Tab", (f) => f.tag === "a" && /Checkout/.test(f.name));
    const href = await page.evaluate(() => document.activeElement.getAttribute("href"));
    check(!!s && s.ring && href && href.length > 1, `Tab reaches Checkout, with a ring (goes to ${href})`);

    await page.keyboard.press("Escape");
    await sleep(500);
    s = await page.evaluate(focusState);
    check(/Add to bag|Added to bag/.test(s.name) && !s.inDialog, `Escape closes the bag and focus returns to the button that opened it ("${s.name}")`);
    check(await page.evaluate(() => !document.querySelector("body > main").hasAttribute("inert")), "page is usable again after the bag closes");
    check(await page.evaluate(() => document.querySelector('[aria-labelledby="cart-heading"]').closest("[inert]") !== null), "closed bag is inert: nothing in it can be reached");

    await page.evaluate(() => document.querySelector("[data-cart-trigger]").focus());
    await page.keyboard.press("Enter");
    await sleep(700);
    s = await page.evaluate(focusState);
    check(s.inDialog && s.name === "Close bag", "header bag button opens the bag");
    await page.keyboard.press("Enter");
    await sleep(500);
    s = await page.evaluate(focusState);
    check(/^Open bag, 2 items/.test(s.name), `Close returns focus to the bag button, which reads the count ("${s.name}")`);

    // Remove, from the keyboard.
    await page.keyboard.press("Enter");
    await sleep(700);
    s = await pressUntil(page, "Tab", (f) => /^Remove Lustre Lip Gloss.* from bag/.test(f.name));
    await page.keyboard.press("Enter");
    await page.waitForFunction(() => /removed from bag, 0 items in bag/.test(document.querySelector("[data-live-region]")?.textContent || ""), { timeout: 8000 });
    await sleep(300);
    s = await page.evaluate(focusState);
    check(s.inDialog, `removing the last product keeps focus inside the bag ("${s.name}")`);
    await page.keyboard.press("Escape");
    await sleep(400);

    // Shade product
    console.log("\n# Shades, gallery, forms");
    await visit(page, BASE + "/products/lip-liner-pencil");
    const shades = await page.evaluate(() => [...document.querySelectorAll("fieldset button[aria-pressed]")].map((b) => ({ name: b.getAttribute("aria-label"), pressed: b.getAttribute("aria-pressed"), w: b.getBoundingClientRect().width })));
    check(shades.length > 1 && shades.every((b) => b.name && b.w >= 24) && shades.filter((b) => b.pressed === "true").length === 1, `shades are buttons named by shade, one pressed (${shades.map((b) => b.name).join(", ")})`);
    s = await pressUntil(page, "Tab", (f) => f.name === "Petal");
    await page.keyboard.press("Space");
    await sleep(100);
    check(await page.evaluate(() => document.activeElement.getAttribute("aria-pressed") === "true" && /Petal/.test(document.querySelector("fieldset legend").textContent)), "Space selects a shade; the choice is shown in words");

    await visit(page, BASE + "/products/hyaluronic-acid-lip-gloss");
    const thumbs = await page.evaluate(() => [...document.querySelectorAll("button[aria-label^='View image']")].map((b) => b.getAttribute("aria-label")));
    check(thumbs.length > 1, `gallery thumbnails are named (${thumbs.join(", ")})`);
    s = await pressUntil(page, "Tab", (f) => /^View image 2/.test(f.name));
    await page.keyboard.press("Enter");
    await sleep(100);
    check(await page.evaluate(() => document.activeElement.getAttribute("aria-current") === "true"), "Enter on a thumbnail shows that photo");

    await visit(page, BASE + "/contact");
    s = await pressUntil(page, "Tab", (f) => f.name === "Send message");
    await page.keyboard.press("Enter");
    await sleep(200);
    const err = await page.evaluate(() => {
      const el = document.activeElement;
      const d = el.getAttribute("aria-describedby");
      return { id: el.id, invalid: el.getAttribute("aria-invalid"), text: d ? document.getElementById(d)?.textContent : null, all: [...document.querySelectorAll("[id$='-error']")].map((e) => e.textContent) };
    });
    check(err.id === "name" && err.invalid === "true" && /Enter your name/.test(err.text || ""), `empty contact form: focus moves to the first field in error, which reads "${err.text}"`);
    check(err.all.length === 3, `every field in error says so in words (${err.all.join(" / ")})`);
    const auto = await page.evaluate(() => Object.fromEntries([...document.querySelectorAll("form input:not([type=hidden]):not(.hidden), form textarea, form select")].map((e) => [e.id || e.name, { label: !!document.querySelector(`label[for="${e.id}"]`), autocomplete: e.getAttribute("autocomplete") }])));
    check(Object.values(auto).every((f) => f.label) && auto.name.autocomplete === "name" && auto.email.autocomplete === "email", "every field has a label; name and email carry autocomplete");

    await page.evaluate(() => document.querySelector("footer input[type=email]").focus());
    await page.keyboard.type("not-an-email");
    await page.keyboard.press("Enter");
    await sleep(200);
    const nl = await page.evaluate(() => {
      const el = document.activeElement;
      const d = el.getAttribute("aria-describedby");
      return { type: el.type, text: d ? document.getElementById(d)?.textContent : null };
    });
    check(nl.type === "email" && /Enter an email address like/.test(nl.text || ""), `newsletter: a bad address keeps focus on the field, which reads "${nl.text}"`);

    await visit(page, BASE + "/");
    s = await pressUntil(page, "Tab", (f) => f.name === "Pause announcements");
    check(!!s && s.ring, "announcement bar has a Pause button that the keyboard can reach");
    const before = await page.evaluate(() => document.querySelector('[aria-label="Announcements"] a:not([inert])').textContent);
    await page.keyboard.press("Enter");
    await sleep(5200);
    const after = await page.evaluate(() => ({ text: document.querySelector('[aria-label="Announcements"] a:not([inert])').textContent, label: document.activeElement.getAttribute("aria-label") }));
    check(after.text === before && after.label === "Play announcements", "paused, the announcement stops rotating");
    const newTab = await page.evaluate(() => [...document.querySelectorAll('a[target="_blank"]')].filter((a) => !a.closest("[inert]")).map((a) => ({ name: (a.getAttribute("aria-label") || a.textContent).trim(), ok: /\(opens in new tab\)/.test(a.getAttribute("aria-label") || a.textContent) })));
    check(newTab.length > 0 && newTab.every((a) => a.ok), `every link that opens a new tab says so (${newTab.length} links)`);
    await page.close();

    // ---------- Reduced motion
    const calm = await browser.newPage();
    await calm.setViewport({ width: 1366, height: 900 });
    await calm.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
    await visit(calm, BASE + "/");
    const first = await calm.evaluate(() => document.querySelector('[aria-label="Announcements"] a:not([inert])').textContent);
    await sleep(5200);
    const rm = await calm.evaluate(() => ({
      text: document.querySelector('[aria-label="Announcements"] a:not([inert])').textContent,
      play: !!document.querySelector('button[aria-label="Play announcements"]'),
      revealed: [...document.querySelectorAll("[data-reveal]")].every((el) => getComputedStyle(el).opacity === "1"),
      longest: Math.max(0, ...[...document.querySelectorAll("*")].map((el) => Math.max(...getComputedStyle(el).transitionDuration.split(",").map(parseFloat), ...getComputedStyle(el).animationDuration.split(",").map(parseFloat)))),
    }));
    check(rm.text === first && rm.play, "reduced motion: the announcement bar starts paused");
    check(rm.revealed && rm.longest < 0.01, `reduced motion: nothing fades, slides or zooms (longest animation ${rm.longest}s)`);
    await calm.close();

    // ---------- Welcome offer (only when NEXT_PUBLIC_SHOW_WELCOME_POPUP=true)
    const offerPage = await browser.newPage();
    await offerPage.setViewport({ width: 1366, height: 900 });
    await offerPage.removeScriptToEvaluateOnNewDocument(offerPage.quietOffer.identifier);
    await visit(offerPage, BASE + "/about");
    await offerPage.evaluate(() => localStorage.removeItem("lb_welcome_dismissed"));
    await offerPage.reload({ waitUntil: "load" });
    await drawn(offerPage);
    await pressUntil(offerPage, "Tab", (f) => f.name === "Shop the Collection");
    await offerPage.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.6));
    if (await offerPage.waitForSelector('[role="dialog"][aria-labelledby="welcome-heading"]', { timeout: 2500 }).catch(() => null)) {
      console.log("\n# Welcome offer");
      await sleep(300);
      s = await offerPage.evaluate(focusState);
      check(s.inDialog && s.name === "Close offer" && s.ring, "offer opens and focus moves to Close offer");
      let left = 0;
      for (let i = 0; i < 12; i++) {
        await offerPage.keyboard.press("Tab");
        const f = await offerPage.evaluate(focusState);
        if (f.none || !f.inDialog || !f.ring) left++;
      }
      check(left === 0, "Tab ×12 never leaves the offer");
      await offerPage.keyboard.press("Escape");
      await sleep(300);
      s = await offerPage.evaluate(focusState);
      check(s.name === "Shop the Collection", `Escape closes the offer and focus returns to where it was ("${s.name}")`);
    } else {
      console.log("\n# Welcome offer: switched off on this server, skipped");
    }
    await offerPage.close();

    // ---------- Phone
    console.log("\n# Phone menu");
    const phone = await browser.newPage();
    await phone.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await visit(phone, BASE + "/");
    await sleep(300);
    check(await phone.evaluate(() => document.getElementById("mobile-menu")?.hasAttribute("inert")), "closed menu is inert: nothing in it can be reached");
    await tabThrough(phone, "/ (phone)");
    await visit(phone, BASE + "/");
    await sleep(300);
    s = await pressUntil(phone, "Tab", (f) => f.name === "Open menu");
    await phone.keyboard.press("Enter");
    await sleep(800);
    s = await phone.evaluate(focusState);
    check(s.inDialog && s.name === "Close menu" && s.ring, "menu opens and focus moves to Close menu");
    let out = 0;
    const stops = [];
    for (let i = 0; i < 24; i++) {
      await phone.keyboard.press("Tab");
      await sleep(30);
      const f = await phone.evaluate(focusState);
      if (f.none || !f.inDialog) out++;
      else {
        if (!f.ring || f.clipped) out++;
        if (!stops.includes(f.name)) stops.push(f.name);
      }
    }
    check(out === 0, `Tab ×24 never leaves the menu, every stop has a ring (${stops.length} stops)`);
    await phone.keyboard.press("Escape");
    await sleep(700);
    s = await phone.evaluate(focusState);
    check(s.name === "Open menu", "Escape closes the menu and focus returns to the menu button");
    await phone.close();
  } finally {
    await browser.close();
  }
  console.log(failures === 0 ? "\nKEYBOARD WALKTHROUGH PASSED" : `\n${failures} check(s) failed`);
  process.exit(failures === 0 ? 0 : 1);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
