const puppeteer = require("puppeteer-core");
const BASE = "http://localhost:3111";
const OUT = process.argv[2];
const paths = process.argv.slice(3);
(async () => {
  const browser = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--no-sandbox"] });
  for (const [name, vp] of [["desk", { width: 1440, height: 900, deviceScaleFactor: 1 }], ["phone", { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }]]) {
    const page = await browser.newPage();
    await page.setViewport(vp);
    page.on("pageerror", (e) => console.error("PAGE ERROR:", e.message));
    for (const p of paths) {
      await page.goto(BASE + p, { waitUntil: "networkidle0" });
      await page.evaluate(() => document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-in")));
      await new Promise((r) => setTimeout(r, 1200));
      const slug = p === "/" ? "home" : p.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
      await page.screenshot({ path: `${OUT}/${name}-${slug}.png`, fullPage: p !== "/" });
      const { sw, cw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
      if (sw > cw) console.error("OVERFLOW", name, p, sw, cw);
    }
    await page.close();
  }
  await browser.close();
})();
