// Open Graph images that Astro's image pipeline does not cover: the site
// default card and entry images taken from the entry body. Rendered by the
// static endpoint src/pages/og/[...file].ts into dist/og/.
import fs from 'node:fs';
import sharp from 'sharp';
import { entryProject, entryStem, firstImageFile, url, type Entry } from './content';

export const OG_W = 1200;
export const OG_H = 630;
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

export const DEFAULT_OG = 'default.png';

/** File name under og/ for an entry's own image, or undefined if its body has none. */
export function entryOgFile(e: Entry): string | undefined {
  const src = firstImageFile(e);
  if (!src) return undefined;
  const ext = /\.svg$/i.test(src) ? 'png' : 'jpg';
  return `${entryProject(e)}/${entryStem(e)}.${ext}`;
}

export function ogUrl(file: string): string {
  return url(`/og/${file}`);
}

/** The default card: white, "Adit Bhargava" and "engineering notebook" in a system face. */
export async function renderDefaultOg(): Promise<Buffer> {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_W}" height="${OG_H}" viewBox="0 0 ${OG_W} ${OG_H}">
<rect width="100%" height="100%" fill="#ffffff"/>
<text x="96" y="300" font-family="Segoe UI, Helvetica Neue, Arial, sans-serif" font-size="84" fill="#111111">Adit Bhargava</text>
<text x="96" y="384" font-family="Segoe UI, Helvetica Neue, Arial, sans-serif" font-size="44" fill="#111111">engineering notebook</text>
</svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

/**
 * Rasterize an image to 1200x630. SVG (ink pages): scaled to 1200 wide and
 * cropped from the top of the page on white, PNG. Raster: cover crop, JPEG.
 */
export async function renderImageOg(file: string): Promise<Buffer> {
  if (/\.svg$/i.test(file)) {
    const buf = fs.readFileSync(file);
    const meta = await sharp(buf).metadata();
    const density = Math.min(600, Math.max(72, (72 * OG_W) / (meta.width || OG_W)));
    const scaled = await sharp(buf, { density })
      .resize({ width: OG_W })
      .flatten({ background: WHITE })
      .png()
      .toBuffer({ resolveWithObject: true });
    const h = scaled.info.height;
    const top = await sharp(scaled.data)
      .extract({ left: 0, top: 0, width: OG_W, height: Math.min(h, OG_H) })
      .toBuffer();
    return sharp(top)
      .extend({ bottom: Math.max(0, OG_H - h), background: WHITE })
      .flatten({ background: WHITE })
      .png()
      .toBuffer();
  }
  return sharp(file)
    .resize({ width: OG_W, height: OG_H, fit: 'cover' })
    .flatten({ background: WHITE })
    .jpeg({ quality: 82 })
    .toBuffer();
}
