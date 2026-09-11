const sharp = require("sharp");
const path = require("path");
const src = "/Users/dessidaniel/Projects/Loved Beauty";
const out = process.cwd() + "/public";
const map = {
  "peptide-lip-lacquer-1.webp": "002524b6-87f6-406f-8610-f1893b42bbdc.JPG",
  "peptide-lip-lacquer-2.webp": "ebd58a4b-3fe4-40a0-8374-9654312c0eae.JPG",
  "hyaluronic-lip-gloss-1.webp": "3c0daeff-4568-43f9-bfb5-69033404799a.JPG",
  "hyaluronic-lip-gloss-2.webp": "29e24186-1549-4754-b945-5944b34ddacf.JPG",
  "shimmer-glow-setting-spray-1.webp": "3b295a87-a67e-4135-bb34-ddaf5dc37900.JPG",
  "shimmer-glow-setting-spray-2.webp": "916290b8-d187-4eae-83c4-c4d033ad8354.JPG",
  "ultra-light-lip-oil-1.webp": "7d17fdd0-9d9d-485a-b0e9-af377be63371.JPG",
  "ultra-light-lip-oil-2.webp": "4afff3ce-ff39-4b06-99b8-476b616dc90b.JPG",
  "sugar-lip-scrub-1.webp": "90743fe5-e40f-4563-8f8a-574a93766d1c.JPG",
  "sugar-lip-scrub-2.webp": "a4139e29-d649-4892-a06c-aee2528e3562.JPG",
  "shimmer-glow-oil-spray-1.webp": "ae0f35f0-d75d-4442-8aa9-a7ad25a388ae.JPG",
  "lustre-lip-gloss-1.webp": "bba15e9e-08b8-4fd1-91db-2172d7dde26e.JPG",
};
(async () => {
  for (const [name, file] of Object.entries(map)) {
    // extend to a 4:5 frame by mirroring the photo's own edges so the studio background stays seamless
    const img = sharp(path.join(src, file)).rotate();
    const meta = await img.metadata();
    const targetH = Math.round(meta.width * 1.25);
    let ext;
    if (targetH >= meta.height) { const pad = targetH - meta.height; ext = { top: Math.floor(pad / 2), bottom: Math.ceil(pad / 2), left: 0, right: 0 }; }
    else { const targetW = Math.round(meta.height / 1.25); const pad = targetW - meta.width; ext = { top: 0, bottom: 0, left: Math.floor(pad / 2), right: Math.ceil(pad / 2) }; }
    const buf = await img.extend({ ...ext, extendWith: "mirror" }).toBuffer();
    await sharp(buf)
      .extend({ top: 60, bottom: 60, left: 48, right: 48, extendWith: "mirror" })
      .resize(1000, 1250, { fit: "cover" })
      .modulate({ brightness: 1.04, saturation: 1.04 })
      .webp({ quality: 82 })
      .toFile(path.join(out, "products", name));
    console.log("ok", name);
  }
  // Logos
  const logo = sharp(path.join(src, "Love Beauty Logo Pink.png")).trim();
  await logo.clone().png().toFile(path.join(out, "brand", "logo-blush.png"));
  // rose variant: recolor pale pink pixels to deep rose, keep coral heart
  const { data, info } = await logo.clone().raw().toBuffer({ resolveWithObject: true });
  const rose = [201, 122, 138]; // #C97A8A
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3]; if (a === 0) continue;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const isCoral = r > 200 && g < 170 && b < 140;
    if (!isCoral) { data[i] = rose[0]; data[i + 1] = rose[1]; data[i + 2] = rose[2]; }
  }
  await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toFile(path.join(out, "brand", "logo-rose.png"));
  const mono = sharp(path.join(src, "LB Logo Pink.png")).trim();
  await mono.clone().png().toFile(path.join(out, "brand", "monogram-blush.png"));
  const m = await mono.clone().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < m.data.length; i += 4) { if (m.data[i + 3] === 0) continue; m.data[i] = rose[0]; m.data[i + 1] = rose[1]; m.data[i + 2] = rose[2]; }
  const monoRose = sharp(m.data, { raw: { width: m.info.width, height: m.info.height, channels: 4 } });
  await monoRose.clone().png().toFile(path.join(out, "brand", "monogram-rose.png"));
  // icons: monogram on blush square
  const mk = async (px, file) => sharp({ create: { width: px, height: px, channels: 4, background: "#FBE9EC" } })
    .composite([{ input: await monoRose.clone().resize(Math.round(px * 0.68), Math.round(px * 0.68), { fit: "inside" }).png().toBuffer(), gravity: "center" }])
    .png().toFile(path.join(out, file));
  await mk(512, "icon-512.png"); await mk(192, "icon-192.png"); await mk(180, "apple-icon.png"); await mk(64, "icon.png");
  console.log("logos done");
})();
