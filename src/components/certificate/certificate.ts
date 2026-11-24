"use client";
/**
 * Course-completion certificate, drawn entirely in the browser on a <canvas>.
 * No server rendering → zero extra load on the (free) host.
 *
 * Fonts live in /public/fonts/certificate and are loaded with the FontFace API
 * before drawing (CSS-declared fonts were not reliably ready on mobile).
 */
import { useEffect, useState } from "react";
import { site } from "@/config/site";

/* Unique family names so they never clash with the site's own fonts. */
const F = {
  display: "TCertCinzel",
  script: "TCertGreatVibes",
  serif: "TCertCormorant",
  sign: "TCertSignature",
};

const FONT_FILES: { family: string; file: string; weight: string; style: string }[] = [
  { family: F.display, file: "cinzel.woff2", weight: "400 900", style: "normal" },
  { family: F.script, file: "great-vibes.woff2", weight: "400", style: "normal" },
  { family: F.serif, file: "cormorant.woff2", weight: "300 700", style: "normal" },
  { family: F.serif, file: "cormorant-italic.woff2", weight: "300 700", style: "italic" },
  { family: F.sign, file: "herr-von-muellerhoff.woff2", weight: "400", style: "normal" },
];

export interface CertificateData {
  name: string;
  course: string;
  no: string;
  code: string;
  issuedAt: string | Date;
  /** Custom description line; falls back to the default statement. */
  line?: string | null;
  from?: string | Date | null;
  to?: string | Date | null;
}

/* Logical canvas size — A4 landscape ratio (1 : √2). Output is scaled up. */
const W = 1000;
const H = 707;

const C = {
  ivory: "#fdfaf2",
  ivoryEdge: "#f3ead3",
  navy: "#0f1f3d",
  navy2: "#1d2e4f",
  gold: "#c9962b",
  goldLight: "#f2cf6a",
  goldDark: "#94660f",
  ink: "#27304a",
  muted: "#6b7385",
};

const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 64 64"><defs><linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d2e4f"/><stop offset="1" stop-color="#0b1324"/></linearGradient><linearGradient id="a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd34d"/><stop offset="1" stop-color="#f59e0b"/></linearGradient></defs><path d="M32 2.5 58 10.5V30c0 16.5-11 27-26 31.5C17 57 6 46.5 6 30V10.5Z" fill="url(#b)" stroke="url(#a)" stroke-width="2.6"/><path d="M26.5 60 30 34h4l3.5 26" fill="#e8edf5"/><path d="M32 39v3.5M32 46v4M32 53.5v4.5" stroke="#0b1324" stroke-width="1.6" stroke-linecap="round"/><circle cx="32" cy="27" r="13.5" fill="none" stroke="url(#a)" stroke-width="4.2"/><path d="M19 25.5c8.5-2.6 17.5-2.6 26 0" stroke="url(#a)" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="32" cy="27" r="4" fill="url(#a)"/></svg>`;

export const DEFAULT_LINE = "demonstrating the knowledge, skill and responsibility of a safe and confident driver.";

/** utc=true for calendar-day values (training dates are stored at UTC midnight). */
const fmtDate = (d: string | Date, utc = false) =>
  new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", ...(utc && { timeZone: "UTC" }) });

/** English course title for a stored (Bengali or English) course name. */
export function courseEnglish(course: string) {
  const c = site.courses.find((x) => x.title.bn === course || x.title.en === course);
  return c ? c.title.en : course;
}

/* ── Asset loading ─────────────────────────────────────────────────────── */
let logoPromise: Promise<HTMLImageElement> | null = null;
function loadLogo() {
  logoPromise ??= new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(LOGO_SVG);
  });
  return logoPromise;
}

let fontsPromise: Promise<void> | null = null;
function loadFonts() {
  fontsPromise ??= (async () => {
    const load = (x: (typeof FONT_FILES)[number]) =>
      new FontFace(x.family, `url(/fonts/certificate/${x.file}) format("woff2")`, { weight: x.weight, style: x.style }).load();
    const faces = await Promise.all(FONT_FILES.map((x) => load(x).catch(() => load(x)))); // one retry on flaky networks
    faces.forEach((face) => document.fonts.add(face));
  })().catch((err) => {
    fontsPromise = null; // allow a later retry
    throw err;
  });
  return fontsPromise;
}

/* ── Drawing helpers ───────────────────────────────────────────────────── */
type Ctx = CanvasRenderingContext2D;

function setFont(ctx: Ctx, font: string, spacing = 0) {
  ctx.font = font;
  if ("letterSpacing" in ctx) (ctx as Ctx & { letterSpacing: string }).letterSpacing = `${spacing}px`;
}

/** Shrink font size until the text fits maxW. `tpl` gets the size. */
function fitText(ctx: Ctx, text: string, maxW: number, size: number, tpl: (s: number) => string, spacing = 0) {
  let s = size;
  setFont(ctx, tpl(s), spacing);
  while (ctx.measureText(text).width > maxW && s > 8) {
    s -= 1;
    setFont(ctx, tpl(s), spacing);
  }
  return s;
}

function diamond(ctx: Ctx, x: number, y: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.lineTo(x + r, y);
  ctx.lineTo(x, y + r);
  ctx.lineTo(x - r, y);
  ctx.closePath();
  ctx.fill();
}

function goldRule(ctx: Ctx, x1: number, x2: number, y: number, width = 1) {
  const g = ctx.createLinearGradient(x1, 0, x2, 0);
  g.addColorStop(0, "rgba(201,150,43,0)");
  g.addColorStop(0.5, C.gold);
  g.addColorStop(1, "rgba(201,150,43,0)");
  ctx.strokeStyle = g;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y);
  ctx.lineTo(x2, y);
  ctx.stroke();
}

function cornerOrnament(ctx: Ctx) {
  // drawn for the top-left corner; caller mirrors it
  ctx.strokeStyle = C.gold;
  ctx.fillStyle = C.gold;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(44, 110); ctx.lineTo(44, 44); ctx.lineTo(110, 44);
  ctx.stroke();
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(50, 92); ctx.lineTo(50, 50); ctx.lineTo(92, 50);
  ctx.stroke();
  diamond(ctx, 44, 44, 5);
  diamond(ctx, 110, 44, 2.2);
  diamond(ctx, 44, 110, 2.2);
}

function seal(ctx: Ctx, cx: number, cy: number, year: number) {
  // ribbons
  ctx.fillStyle = C.navy2;
  for (const dir of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(cx + dir * 10, cy + 30);
    ctx.lineTo(cx + dir * 34, cy + 66);
    ctx.lineTo(cx + dir * 24, cy + 63);
    ctx.lineTo(cx + dir * 18, cy + 72);
    ctx.lineTo(cx + dir * -6, cy + 36);
    ctx.closePath();
    ctx.fill();
  }

  // serrated gold disc
  const g = ctx.createRadialGradient(cx - 14, cy - 18, 4, cx, cy, 58);
  g.addColorStop(0, C.goldLight);
  g.addColorStop(0.6, C.gold);
  g.addColorStop(1, C.goldDark);
  ctx.fillStyle = g;
  ctx.beginPath();
  const points = 44;
  for (let i = 0; i <= points * 2; i++) {
    const a = (Math.PI * i) / points - Math.PI / 2;
    const r = i % 2 === 0 ? 54 : 49.5;
    const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();

  // navy core with gold rings
  ctx.fillStyle = C.navy;
  ctx.beginPath(); ctx.arc(cx, cy, 44, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = C.goldLight;
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(cx, cy, 41, 0, Math.PI * 2); ctx.stroke();
  ctx.lineWidth = 0.7;
  ctx.beginPath(); ctx.arc(cx, cy, 27, 0, Math.PI * 2); ctx.stroke();

  // text around the ring
  const ring = "TAHYAS CAR TRAINING CENTER • CERTIFIED • ";
  setFont(ctx, `600 6.6px ${F.display}`, 0);
  ctx.fillStyle = C.goldLight;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const chars = [...ring];
  chars.forEach((ch, i) => {
    const a = (i / chars.length) * Math.PI * 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(a);
    ctx.fillText(ch, 0, -34);
    ctx.restore();
  });

  // centre
  ctx.fillStyle = C.goldLight;
  diamond(ctx, cx, cy - 14, 3);
  setFont(ctx, `700 12px ${F.display}`, 1);
  ctx.fillText(site.certificate.prefix, cx, cy + 1);
  setFont(ctx, `600 7px ${F.display}`, 1.5);
  ctx.fillText(String(year), cx, cy + 14);
  ctx.textBaseline = "alphabetic";
}

/** Handwritten-style signature in blue ink, slightly tilted, with a pen flourish. */
function signature(ctx: Ctx, name: string, x: number, baseline: number) {
  const ink = "#1c2f7a";
  ctx.save();
  ctx.translate(x, baseline);
  ctx.rotate(-0.06);
  ctx.fillStyle = ink;
  fitText(ctx, name, 185, 40, (sz) => `400 ${sz}px ${F.sign}`);
  const w = ctx.measureText(name).width;
  ctx.fillText(name, 0, 0);

  // flourish: a quick stroke sweeping back under the name
  ctx.strokeStyle = ink;
  ctx.lineCap = "round";
  ctx.lineWidth = 1.1;
  ctx.globalAlpha = 0.9;
  ctx.beginPath();
  ctx.moveTo(w / 2 - 6, -4);
  ctx.bezierCurveTo(w / 2 + 22, 6, -w / 2 + 10, 10, -w / 2 - 14, 2);
  ctx.stroke();
  ctx.restore();
}

/* ── Main renderer ─────────────────────────────────────────────────────── */
export async function renderCertificate(d: CertificateData, scale = 2.4): Promise<HTMLCanvasElement> {
  await loadFonts();
  const logo = await loadLogo().catch(() => null);

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(W * scale);
  canvas.height = Math.round(H * scale);
  const ctx = canvas.getContext("2d")!;
  ctx.scale(scale, scale);
  ctx.textAlign = "center";

  /* paper */
  const bg = ctx.createRadialGradient(W / 2, H / 2, 80, W / 2, H / 2, 620);
  bg.addColorStop(0, "#fffdf8");
  bg.addColorStop(1, C.ivoryEdge);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  /* guilloche security pattern */
  ctx.save();
  ctx.translate(W / 2, H / 2 + 10);
  ctx.lineWidth = 0.5;
  for (let i = 0; i < 60; i++) {
    ctx.rotate(Math.PI / 60);
    ctx.strokeStyle = "rgba(201,150,43,0.075)";
    ctx.beginPath(); ctx.ellipse(0, 0, 340, 120, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = "rgba(29,46,79,0.04)";
    ctx.beginPath(); ctx.ellipse(0, 0, 220, 70, 0, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.restore();

  /* watermark */
  if (logo) {
    ctx.save();
    ctx.globalAlpha = 0.05;
    ctx.drawImage(logo, W / 2 - 150, H / 2 - 140, 300, 300);
    ctx.restore();
  }

  /* frame */
  ctx.strokeStyle = C.navy;
  ctx.lineWidth = 24;
  ctx.strokeRect(12, 12, W - 24, H - 24);
  ctx.strokeStyle = C.goldLight;
  ctx.lineWidth = 0.8;
  ctx.strokeRect(6, 6, W - 12, H - 12);
  ctx.strokeStyle = C.gold;
  ctx.lineWidth = 2;
  ctx.strokeRect(30, 30, W - 60, H - 60);
  ctx.lineWidth = 0.6;
  ctx.strokeRect(36, 36, W - 72, H - 72);

  for (const [sx, sy] of [[1, 1], [-1, 1], [1, -1], [-1, -1]] as const) {
    ctx.save();
    ctx.translate(sx === 1 ? 0 : W, sy === 1 ? 0 : H);
    ctx.scale(sx, sy);
    cornerOrnament(ctx);
    ctx.restore();
  }

  /* certificate number (top-left) */
  ctx.textAlign = "left";
  ctx.fillStyle = C.muted;
  setFont(ctx, `600 7.5px ${F.display}`, 1.5);
  ctx.fillText("CERTIFICATE NO.", 66, 74);
  ctx.fillStyle = C.navy;
  setFont(ctx, `700 11px ${F.display}`, 0.8);
  ctx.fillText(d.no, 66, 89);

  /* date of issue (top-right, mirrors the number) */
  const issued = new Date(d.issuedAt);
  ctx.textAlign = "right";
  ctx.fillStyle = C.muted;
  setFont(ctx, `600 7.5px ${F.display}`, 1.5);
  ctx.fillText("DATE OF ISSUE", W - 66, 74);
  ctx.fillStyle = C.navy;
  setFont(ctx, `700 11px ${F.display}`, 0.8);
  ctx.fillText(fmtDate(issued).toUpperCase(), W - 66, 89);
  ctx.textAlign = "center";

  /* header */
  if (logo) ctx.drawImage(logo, W / 2 - 28, 44, 56, 56);
  ctx.fillStyle = C.navy;
  setFont(ctx, `700 17px ${F.display}`, 3);
  ctx.fillText(site.name.en.toUpperCase(), W / 2, 128);
  ctx.fillStyle = C.goldDark;
  setFont(ctx, `italic 500 12.5px ${F.serif}`, 0.4);
  ctx.fillText(site.address.en, W / 2, 148);

  /* title */
  ctx.fillStyle = C.navy;
  setFont(ctx, `700 50px ${F.display}`, 6);
  ctx.fillText("CERTIFICATE", W / 2 + 3, 222);
  ctx.fillStyle = C.goldDark;
  setFont(ctx, `600 14px ${F.display}`, 7);
  ctx.fillText("OF COMPLETION", W / 2 + 3.5, 249);
  goldRule(ctx, W / 2 - 270, W / 2 - 138, 244, 1);
  goldRule(ctx, W / 2 + 138, W / 2 + 270, 244, 1);
  ctx.fillStyle = C.gold;
  diamond(ctx, W / 2 - 130, 244, 2.6);
  diamond(ctx, W / 2 + 130, 244, 2.6);

  /* body */
  ctx.fillStyle = C.muted;
  setFont(ctx, `italic 500 19px ${F.serif}`, 0.2);
  ctx.fillText("This is to proudly certify that", W / 2, 292);

  ctx.fillStyle = C.navy;
  fitText(ctx, d.name, 620, 62, (s) => `400 ${s}px ${F.script}`);
  ctx.fillText(d.name, W / 2, 354);
  goldRule(ctx, W / 2 - 250, W / 2 + 250, 372, 1.2);

  ctx.fillStyle = C.muted;
  setFont(ctx, `italic 500 18px ${F.serif}`, 0.2);
  ctx.fillText("has successfully completed the", W / 2, 404);

  ctx.fillStyle = C.goldDark;
  fitText(ctx, d.course.toUpperCase(), 640, 22, (s) => `700 ${s}px ${F.display}`, 2);
  ctx.fillText(d.course.toUpperCase(), W / 2, 437);

  let y = 465;
  if (d.from || d.to) {
    const period = d.from && d.to ? `${fmtDate(d.from, true)}  –  ${fmtDate(d.to, true)}`
      : d.from ? `from ${fmtDate(d.from, true)}` : `until ${fmtDate(d.to!, true)}`;
    ctx.fillStyle = C.ink;
    setFont(ctx, `600 14.5px ${F.serif}`, 0.4);
    ctx.fillText(`Training period: ${period}`, W / 2, y);
    y += 22;
  }
  ctx.fillStyle = C.muted;
  setFont(ctx, `italic 500 15px ${F.serif}`, 0.2);
  const line = d.line?.trim() || DEFAULT_LINE;
  fitText(ctx, line, 720, 15, (s) => `italic 500 ${s}px ${F.serif}`, 0.2);
  ctx.fillText(line, W / 2, y);

  /* signatures */
  const sigs: readonly { name: string; title: string }[] = site.certificate.signatories;
  const sigX = [230, W - 230];
  sigs.slice(0, 2).forEach((s, i) => {
    const x = sigX[i];
    if (s.name) signature(ctx, s.name, x, 594);
    ctx.strokeStyle = C.ink;
    ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(x - 100, 600); ctx.lineTo(x + 100, 600); ctx.stroke();
    if (s.name) {
      ctx.fillStyle = C.navy;
      setFont(ctx, `700 9.5px ${F.display}`, 1.5);
      ctx.fillText(s.name.toUpperCase(), x, 614);
      ctx.fillStyle = C.muted;
      setFont(ctx, `600 7.5px ${F.display}`, 2);
      ctx.fillText(s.title.toUpperCase(), x, 626);
    } else {
      ctx.fillStyle = C.muted;
      setFont(ctx, `600 9px ${F.display}`, 2);
      ctx.fillText(s.title.toUpperCase(), x, 617);
    }
  });

  /* seal */
  seal(ctx, W / 2, 572, issued.getFullYear());

  return canvas;
}

/* ── React hook: render → object URL + Blob ────────────────────────────── */
export function useCertificateImage(data: CertificateData | null) {
  const [state, setState] = useState<{ url: string; blob: Blob } | null>(null);
  const [error, setError] = useState(false);
  const key = data ? JSON.stringify(data) : "";

  useEffect(() => {
    if (!data) { setState(null); return; }
    let cancelled = false;
    let url = "";
    setError(false);
    renderCertificate(data)
      .then((canvas) => new Promise<Blob>((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej()), "image/png")))
      .then((blob) => {
        if (cancelled) return;
        url = URL.createObjectURL(blob);
        setState({ url, blob });
      })
      .catch(() => { if (!cancelled) setError(true); });
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { url: state?.url ?? null, blob: state?.blob ?? null, error };
}

export function certificateFileName(d: Pick<CertificateData, "name" | "no">) {
  const slug = d.name.replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "").slice(0, 40) || "certificate";
  return `${slug}-${d.no}.png`;
}

export function downloadBlob(blob: Blob, filename: string) {
  const a = document.createElement("a");
  const url = URL.createObjectURL(blob);
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Share the PNG through the OS share sheet (WhatsApp etc.). Returns false if unsupported. */
export async function shareImage(blob: Blob, filename: string, text: string) {
  const file = new File([blob], filename, { type: "image/png" });
  if (typeof navigator === "undefined" || !navigator.canShare?.({ files: [file] })) return false;
  try {
    await navigator.share({ files: [file], text });
  } catch { /* user cancelled */ }
  return true;
}
