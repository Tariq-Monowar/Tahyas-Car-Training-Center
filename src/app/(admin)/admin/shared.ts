/* Shared types + helpers for the admin panel. */

export type Status = "pending" | "confirmed" | "cancelled";

export interface Certificate {
  code: string;
  no: string;
  name: string;
  course: string;
  line?: string;
  issuedAt: string;
}

export interface Enrollment {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  course: string;
  age?: string;
  gender?: string;
  message?: string;
  adminNote?: string;
  status: Status;
  trainingStart?: string | null;
  trainingEnd?: string | null;
  certificate?: Certificate | null;
  source?: string;
  createdAt: string;
}

export const STATUS_LABEL: Record<Status, string> = { pending: "অপেক্ষমান", confirmed: "নিশ্চিত", cancelled: "বাতিল" };
export const GENDER_LABEL: Record<string, string> = { male: "পুরুষ", female: "নারী", other: "অন্যান্য" };

export const DAY = 86_400_000;
export const bn = (n: number) => n.toLocaleString("bn-BD");

/** Certificates are English-only — the certificate fonts have no Bengali glyphs. */
export const hasBengali = (s: string) => /[\u0980-\u09FF]/.test(s);

export function waNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("880")) return digits;
  if (digits.startsWith("0")) return "88" + digits;
  return digits;
}

/* ── Training dates ────────────────────────────────────────────────────────
   Stored as UTC-midnight dates; handled here as plain calendar days.        */

/** ISO date → "YYYY-MM-DD" (for <input type="date">). */
export const dayStr = (iso?: string | null) => (iso ? iso.slice(0, 10) : "");

/** "YYYY-MM-DD" (or ISO) → local-midnight timestamp. */
function dayTs(s: string) {
  const [y, m, d] = s.slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d).getTime();
}

export function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function addDays(s: string, n: number) {
  const d = new Date(dayTs(s) + n * DAY + 12 * 3_600_000); // noon avoids DST edge cases
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export const fmtDay = (iso: string) =>
  new Date(dayTs(iso)).toLocaleDateString("bn-BD", { day: "numeric", month: "short", year: "numeric" });

export type TrainingState = "upcoming" | "ongoing" | "lastDay" | "ended";

export interface TrainingInfo {
  state: TrainingState;
  label: string;          // e.g. "১২ দিন বাকি"
  progress: number | null; // 0..1 when both dates are known
  totalDays: number | null;
}

export function trainingInfo(start?: string | null, end?: string | null): TrainingInfo | null {
  if (!start && !end) return null;
  const today = dayTs(todayStr());
  const s = start ? dayTs(start) : null;
  const e = end ? dayTs(end) : null;
  const diff = (a: number, b: number) => Math.round((a - b) / DAY);
  const totalDays = s !== null && e !== null ? diff(e, s) + 1 : null;

  if (s !== null && today < s) {
    const n = diff(s, today);
    return { state: "upcoming", label: n === 1 ? "আগামীকাল শুরু" : `${bn(n)} দিন পর শুরু`, progress: 0, totalDays };
  }
  if (e !== null && today > e) {
    return { state: "ended", label: "ট্রেনিং শেষ", progress: 1, totalDays };
  }
  if (e === null) return { state: "ongoing", label: "চলমান", progress: null, totalDays };

  const left = diff(e, today);
  const progress = totalDays && s !== null ? Math.min(1, (diff(today, s) + 1) / totalDays) : null;
  if (left === 0) return { state: "lastDay", label: "আজ শেষ দিন", progress, totalDays };
  return { state: "ongoing", label: `${bn(left)} দিন বাকি`, progress, totalDays };
}

/** WhatsApp message sent along with the certificate image. */
export function certificateMessage(e: Pick<Enrollment, "name" | "course">, cert: Certificate) {
  return [
    `আসসালামু আলাইকুম ${e.name},`,
    ``,
    `🎉 অভিনন্দন! আপনি সফলভাবে "${e.course}" সম্পন্ন করেছেন।`,
    ``,
    `আপনার সার্টিফিকেট এই মেসেজের সাথে পাঠানো হলো।`,
    `সার্টিফিকেট নং: ${cert.no}`,
    `— তাহয়াস কার ট্রেনিং সেন্টার`,
  ].join("\n");
}
