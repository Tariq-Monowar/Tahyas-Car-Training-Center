import "server-only";
import { site } from "@/config/site";

/** Only our own site (and local dev) may call the chat/voice APIs. */
export function allowedOrigin(origin: string | null): boolean {
  if (!origin) return true; // same-origin requests may omit it
  const vercel = [process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL]
    .filter(Boolean)
    .map((host) => `https://${host}`);
  const allowed = [site.url, ...vercel, ...(process.env.ALLOWED_ORIGINS ?? "").split(",")]
    .map((s) => s.trim().replace(/\/$/, ""))
    .filter(Boolean)
    // accept both example.com and www.example.com
    .flatMap((o) => [o, o.replace("://www.", "://"), o.replace("://", "://www.")]);
  if (allowed.includes(origin)) return true;
  // local testing (npm run dev / next start on any port)
  return /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) && !process.env.VERCEL;
}

/** In-memory per-IP rate limiter (per server instance — fine for a small site). */
export function createRateLimiter(max: number, windowMs: number) {
  const hits = new Map<string, { count: number; reset: number }>();
  return function limited(ip: string): boolean {
    const now = Date.now();
    const entry = hits.get(ip);
    if (!entry || entry.reset < now) {
      hits.set(ip, { count: 1, reset: now + windowMs });
      if (hits.size > 5000) for (const [k, v] of hits) if (v.reset < now) hits.delete(k);
      return false;
    }
    entry.count += 1;
    return entry.count > max;
  };
}

export const clientIp = (req: Request) =>
  (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
