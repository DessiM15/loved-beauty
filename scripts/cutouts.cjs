/* eslint-disable */
// Turns the client's studio product photos into transparent cut-outs by
// flood-filling the near-uniform backdrop from the image edges.
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const src = "/Users/dessidaniel/Projects/Loved Beauty";
const out = path.join(process.cwd(), "public/cutouts");
fs.mkdirSync(out, { recursive: true });

const files = {
  "lustre-lip-gloss": "bba15e9e-08b8-4fd1-91db-2172d7dde26e.JPG",
  "ultra-light-lip-oil": "7d17fdd0-9d9d-485a-b0e9-af377be63371.JPG",
  "peptide-lip-lacquer": "ebd58a4b-3fe4-40a0-8374-9654312c0eae.JPG",
  "sugar-lip-scrub": "90743fe5-e40f-4563-8f8a-574a93766d1c.JPG",
  "shimmer-glow-oil-spray": "ae0f35f0-d75d-4442-8aa9-a7ad25a388ae.JPG",
};

async function cutout(file, name, tol = 26) {
  const { data, info } = await sharp(path.join(src, file)).rotate().resize({ width: 1000, withoutEnlargement: true }).raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  const px = (x, y) => (y * W + x) * C;
  // background colour: median of a border ring
  const ring = [];
  for (let x = 0; x < W; x += 4) { ring.push(px(x, 0), px(x, H - 1)); }
  for (let y = 0; y < H; y += 4) { ring.push(px(0, y), px(W - 1, y)); }
  const med = (i) => { const a = ring.map((p) => data[p + i]).sort((a, b) => a - b); return a[a.length >> 1]; };
  const bg = [med(0), med(1), med(2)];
  // flood fill from edges through "background-like" pixels (colour distance + low saturation)
  const mask = new Uint8Array(W * H); // 1 = background
  const stack = [];
  const isBg = (i) => {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const d = Math.abs(r - bg[0]) + Math.abs(g - bg[1]) + Math.abs(b - bg[2]);
    const sat = Math.max(r, g, b) - Math.min(r, g, b);
    // allow darker/lighter greys (shadows, vignette) as long as they're neutral
    return d < tol * 3 || (sat < 14 && Math.max(r, g, b) > 120);
  };
  for (let x = 0; x < W; x++) { stack.push(x, 0, x, H - 1); }
  for (let y = 0; y < H; y++) { stack.push(0, y, W - 1, y); }
  while (stack.length) {
    const y = stack.pop(), x = stack.pop();
    if (x < 0 || y < 0 || x >= W || y >= H) continue;
    const k = y * W + x;
    if (mask[k]) continue;
    if (!isBg(px(x, y))) continue;
    mask[k] = 1;
    stack.push(x + 1, y, x - 1, y, x, y + 1, x, y - 1);
  }
  // alpha = inverse mask, then erode slightly + feather
  const alpha = Buffer.alloc(W * H);
  for (let i = 0; i < W * H; i++) alpha[i] = mask[i] ? 0 : 255;
  const feathered = await sharp(alpha, { raw: { width: W, height: H, channels: 1 } })
    .blur(1.2)
    .toColourspace("b-w")
    .raw().toBuffer();
  const rgba = Buffer.alloc(W * H * 4);
  for (let i = 0; i < W * H; i++) {
    rgba[i * 4] = data[i * C]; rgba[i * 4 + 1] = data[i * C + 1]; rgba[i * 4 + 2] = data[i * C + 2];
    rgba[i * 4 + 3] = feathered[i];
  }
  const png = sharp(rgba, { raw: { width: W, height: H, channels: 4 } }).trim({ threshold: 10 });
  await png.clone().webp({ quality: 85, alphaQuality: 90 }).toFile(path.join(out, `${name}.webp`));
  const bgPct = Math.round((mask.reduce((a, b) => a + b, 0) / (W * H)) * 100);
  console.log("ok", name, `bg ${bg.join(",")} removed ${bgPct}%`);
}

(async () => {
  // Silver / pale-white products can't be separated from the grey backdrop by colour; they keep their studio photos.
  for (const [name, file] of Object.entries(files)) await cutout(file, name, name === "sugar-lip-scrub" ? 16 : 26);
})();
