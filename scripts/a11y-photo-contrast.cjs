/* eslint-disable */
// Contrast of text that sits on a photograph, which axe cannot judge.
// Renders the page, hides the text, and samples the pixels behind every text box.
// Usage: node scripts/a11y-photo-contrast.cjs [baseUrl]
const puppeteer = require("puppeteer-core");
const sharp = require("sharp");
const { visit, drawn } = require("./a11y-visit.cjs");

const BASE = (process.argv[2] || "http://localhost:3111").replace(/\/$/, "");
// Known and accepted, listed on /accessibility: reported, but does not fail the run.
const ACCEPTED = (process.env.A11Y_ACCEPT || "").split(",").map((s) => s.trim()).filter(Boolean);
const CHROME = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
// scope: the section whose words are hidden for the sample. selectors: the text to judge.
const TARGETS = [
  { route: "/", scope: '[aria-labelledby="hero-heading"]', selectors: ["#hero-heading .h-lead", "#hero-heading .h-italic", "#hero-heading + p", "#hero-heading ~ div a:not(.btn)"] },
  { route: "/shade-finder", scope: "main section", selectors: ["main section .eyebrow", "main section h1", "main section h1 em", "main section h1 + p"] },
];
const VIEWPORTS = [
  { name: "phone-360", width: 360, height: 740, deviceScaleFactor: 1, isMobile: true, hasTouch: true },
  { name: "phone-390", width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true },
  { name: "tablet-768", width: 768, height: 1024, deviceScaleFactor: 1 },
  { name: "laptop-1024", width: 1024, height: 768, deviceScaleFactor: 1 },
  { name: "desktop-1366", width: 1366, height: 900, deviceScaleFactor: 1 },
  { name: "desktop-1920", width: 1920, height: 1080, deviceScaleFactor: 1 },
];

const lin = (c) => ((c /= 255) <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const lum = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new", args: ["--no-sandbox"] });
  let failed = 0;
  try {
    for (const { name, ...viewport } of VIEWPORTS) {
      const page = await browser.newPage();
      await page.setViewport(viewport);
      await page.evaluateOnNewDocument(() => localStorage.setItem("lb_welcome_dismissed", String(Date.now() + 864e5)));
      for (const t of TARGETS) {
        await visit(page, BASE + t.route);
        await new Promise((r) => setTimeout(r, 1500));
        const items = await page.evaluate((selectors, scope) => {
          const out = [];
          for (const sel of selectors) {
            const el = document.querySelector(sel);
            if (!el) continue;
            const cs = getComputedStyle(el);
            const px = parseFloat(cs.fontSize);
            const bold = Number(cs.fontWeight) >= 700;
            const range = document.createRange();
            range.selectNodeContents(el);
            // Own text only: a heading's box is judged through its own words, not a child that has its own colour.
            const rects = [...range.getClientRects()].map((r) => ({ x: r.x + window.scrollX, y: r.y + window.scrollY, w: r.width, h: r.height })).filter((r) => r.w > 1 && r.h > 1);
            out.push({ sel, color: cs.color, px, large: px >= 24 || (bold && px >= 18.66), rects, text: el.textContent.trim().slice(0, 40) });
          }
          // Hide the words, keep every background layer (photo, shadows, scrims).
          const style = document.createElement("style");
          style.textContent = `${scope} * { color: transparent !important; text-shadow: none !important; -webkit-text-stroke: 0 !important; border-color: transparent !important } ${scope} a { background: transparent !important } ${scope} svg { visibility: hidden }`;
          document.head.appendChild(style);
          return out;
        }, t.selectors, t.scope);
        await new Promise((r) => setTimeout(r, 300));
        const shot = await page.screenshot({ fullPage: false });
        const { data, info } = await sharp(shot).raw().toBuffer({ resolveWithObject: true });
        for (const it of items) {
          const m = it.color.match(/[\d.]+/g).map(Number);
          const fg = lum(m[0], m[1], m[2]);
          // Judged against the darkest and lightest 2% of the ground behind the words, so one speck of stone does not decide it.
          const seen = [];
          for (const r of it.rects) {
            for (let y = Math.max(0, Math.floor(r.y)); y < Math.min(info.height, Math.ceil(r.y + r.h)); y++) {
              for (let x = Math.max(0, Math.floor(r.x)); x < Math.min(info.width, Math.ceil(r.x + r.w)); x++) {
                const i = (y * info.width + x) * info.channels;
                seen.push(lum(data[i], data[i + 1], data[i + 2]));
              }
            }
          }
          seen.sort((a, b) => a - b);
          const lo = seen[Math.floor(seen.length * 0.02)];
          const hi = seen[Math.ceil(seen.length * 0.98) - 1];
          const worst = Math.min(ratio(fg, lo), ratio(fg, hi));
          const need = it.large ? 3 : 4.5;
          const ok = worst >= need;
          const accepted = !ok && ACCEPTED.includes(it.sel);
          if (!ok && !accepted) failed++;
          console.log(`${ok ? "pass" : accepted ? "KNOWN" : "FAIL"}  ${name.padEnd(13)} ${t.route}  "${it.text}"  ${it.px.toFixed(1)}px  text ${it.color}  worst ${worst.toFixed(2)}:1 (needs ${need}:1; ground luminance ${lo.toFixed(3)}–${hi.toFixed(3)})`);
        }
      }
      await page.close();
    }
  } finally {
    await browser.close();
  }
  process.exit(failed ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
