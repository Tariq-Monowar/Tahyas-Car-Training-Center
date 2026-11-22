import "server-only";
import fs from "node:fs";
import path from "node:path";

/**
 * Real-photo slots.
 * Drop a file named `<slot>.jpg|.jpeg|.png|.webp` into public/images/real/
 * and it is used automatically at build time; otherwise a hand-drawn Lakshmipur
 * illustration (src/components/illustrations) is shown — never a broken image.
 *
 * Slots: hero, center-front, course-basic, course-advance, course-parking,
 *        course-highway, course-women, women, trainer-1, trainer-2 …
 * Gallery: every image inside public/images/real/gallery/ (sorted by name).
 */
const REAL_DIR = path.join(process.cwd(), "public", "images", "real");
const EXT = [".webp", ".jpg", ".jpeg", ".png", ".avif"];

export type Photo = { src: string };

/** New file contents must be a new URL. The image responses are cached for 30 days. */
function versioned(urlPath: string, fullPath: string): string {
  const v = Math.round(fs.statSync(fullPath).mtimeMs);
  return `${urlPath}?v=${v}`;
}

/** The owner's real photo for a slot, if one was added — otherwise null (an illustration is shown). */
export function realPhoto(slot: string | undefined): Photo | null {
  if (!slot) return null;
  for (const ext of EXT) {
    const full = path.join(REAL_DIR, slot + ext);
    if (fs.existsSync(full)) return { src: versioned(`/images/real/${slot}${ext}`, full) };
  }
  return null;
}

export function galleryPhotos(): { file: string; src: string }[] {
  const dir = path.join(REAL_DIR, "gallery");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => EXT.includes(path.extname(f).toLowerCase()))
    .sort()
    .map((file) => ({ file, src: versioned(`/images/real/gallery/${file}`, path.join(dir, file)) }));
}
