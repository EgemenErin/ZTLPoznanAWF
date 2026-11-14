// One-off generator for favicons, app icons and the social share image.
// Usage: node scripts/generate-seo-graphics.mjs
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const logoPath = path.join(root, "public", "logo", "ztllogo.png");
const heroPath = path.join(root, "public", "images", "final414.jpg");
const PAPER = "#f7f1e8";

await mkdir(path.join(root, "public", "icons"), { recursive: true });

const logoAt = (size) =>
  sharp(logoPath).resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } });

// --- Browser tab icons -------------------------------------------------------
await logoAt(512).png().toFile(path.join(root, "app", "icon.png"));

// Apple touch icons must be opaque; give the round logo a paper background.
const apple = await sharp({
  create: { width: 180, height: 180, channels: 4, background: PAPER },
})
  .composite([{ input: await logoAt(152).png().toBuffer(), gravity: "center" }])
  .png()
  .toBuffer();
await writeFile(path.join(root, "app", "apple-icon.png"), apple);

// --- PWA icons ---------------------------------------------------------------
await logoAt(192).png().toFile(path.join(root, "public", "icons", "icon-192.png"));
await logoAt(512).png().toFile(path.join(root, "public", "icons", "icon-512.png"));

const maskable = await sharp({
  create: { width: 512, height: 512, channels: 4, background: PAPER },
})
  .composite([{ input: await logoAt(380).png().toBuffer(), gravity: "center" }])
  .png()
  .toBuffer();
await writeFile(path.join(root, "public", "icons", "icon-maskable-512.png"), maskable);

// --- favicon.ico (PNG-compressed 16/32/48) ------------------------------------
const icoSizes = [16, 32, 48];
const pngs = await Promise.all(icoSizes.map((s) => logoAt(s).png().toBuffer()));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(pngs.length, 4);
let offset = 6 + 16 * pngs.length;
const entries = pngs.map((buf, i) => {
  const entry = Buffer.alloc(16);
  entry.writeUInt8(icoSizes[i], 0);
  entry.writeUInt8(icoSizes[i], 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(buf.length, 8);
  entry.writeUInt32LE(offset, 12);
  offset += buf.length;
  return entry;
});
await writeFile(path.join(root, "app", "favicon.ico"), Buffer.concat([header, ...entries, ...pngs]));

// --- Open Graph / Twitter share image (1200x630) -------------------------------
const W = 1200;
const H = 630;

const background = await sharp(heroPath)
  .resize(W, H, { fit: "cover", position: "attention" })
  .modulate({ brightness: 0.8 })
  .toBuffer();

const overlay = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#11100e" stop-opacity="0.92"/>
      <stop offset="0.55" stop-color="#11100e" stop-opacity="0.72"/>
      <stop offset="1" stop-color="#5c1f25" stop-opacity="0.35"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <rect x="64" y="64" width="72" height="4" fill="#a1743b"/>
  <g font-family="Georgia, 'Times New Roman', serif" fill="#f7f1e8">
    <text x="64" y="150" font-size="26" letter-spacing="6" fill="#d9b27a" font-family="Arial, Helvetica, sans-serif">AKADEMIA WYCHOWANIA FIZYCZNEGO</text>
    <text x="64" y="270" font-size="84" font-weight="700">Zespół Tańca</text>
    <text x="64" y="360" font-size="84" font-weight="700">Ludowego Poznań</text>
    <text x="64" y="440" font-size="40" fill="#f7f1e8" fill-opacity="0.9">Polski zespół folklorystyczny od 1982 roku</text>
  </g>
  <g font-family="Arial, Helvetica, sans-serif" fill="#f7f1e8" fill-opacity="0.85" font-size="26">
    <text x="64" y="560">Tańce narodowe  •  Kapela na żywo  •  Występy w kraju i za granicą</text>
  </g>
</svg>`);

const logoCircle = await logoAt(210).png().toBuffer();

const og = await sharp(background)
  .composite([
    { input: overlay, top: 0, left: 0 },
    { input: logoCircle, top: 60, left: W - 210 - 70 },
  ])
  .jpeg({ quality: 84, mozjpeg: true })
  .toBuffer();

await writeFile(path.join(root, "public", "og-image.jpg"), og);

console.log("SEO graphics generated.");
