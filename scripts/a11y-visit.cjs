/* eslint-disable */
// Shared by the accessibility scripts: open a page and wait until it has really finished drawing.
// Not "network idle": in production Next.js prefetches linked pages, and prefetches cut short by
// the next navigation never report back, so the network never looks idle to the browser driver.
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function drawn(page) {
  await page
    .evaluate(async () => {
      await document.fonts.ready;
      const pending = [...document.images].filter((img) => img.loading !== "lazy" && !img.complete);
      await Promise.race([Promise.all(pending.map((img) => new Promise((done) => ((img.onload = done), (img.onerror = done))))), new Promise((done) => setTimeout(done, 4000))]);
    })
    .catch(() => {});
  await sleep(500); // hydration and the cart fetch
}

async function visit(page, url) {
  await page.goto(url, { waitUntil: "load" });
  await drawn(page);
}

module.exports = { visit, drawn, sleep };
