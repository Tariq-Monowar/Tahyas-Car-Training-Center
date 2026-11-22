/**
 * POST /api/chat — tiny server-side proxy to Groq.
 * The GROQ_API_KEY stays on the server (env variable), never in the browser.
 * Protections: allowed-origin check, per-IP rate limit, message length cap, max_tokens cap.
 */
import { site } from "@/config/site";
import { buildSystemPrompt } from "@/features/chat/systemPrompt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
// llama-3.3-70b-versatile was retired by Groq; gpt-oss-120b handles Bengali well. Override with GROQ_MODEL.
const MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
const MAX_MESSAGE_CHARS = 500;
const MAX_HISTORY = 8;
const MAX_TOKENS = 700; // includes the model's short internal reasoning
const RATE_LIMIT = { max: 20, windowMs: 10 * 60 * 1000 }; // 20 messages / 10 min / IP

/* In-memory rate limit (per server instance — fine for a small site). */
const hits = new Map<string, { count: number; reset: number }>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.reset < now) {
    hits.set(ip, { count: 1, reset: now + RATE_LIMIT.windowMs });
    if (hits.size > 5000) for (const [k, v] of hits) if (v.reset < now) hits.delete(k);
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT.max;
}

function allowedOrigin(origin: string | null): boolean {
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

const json = (status: number, body: object, origin?: string | null) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...(origin ? { "Access-Control-Allow-Origin": origin, Vary: "Origin" } : {}) },
  });

type Msg = { role: "user" | "assistant"; content: string };

export async function OPTIONS(req: Request) {
  const origin = req.headers.get("origin");
  if (!allowedOrigin(origin)) return new Response(null, { status: 403 });
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin ?? site.url,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
      Vary: "Origin",
    },
  });
}

export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  if (!allowedOrigin(origin)) return json(403, { error: "forbidden" });

  const key = process.env.GROQ_API_KEY;
  if (!key) return json(503, { error: "not_configured" }, origin);

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) return json(429, { error: "rate_limited" }, origin);

  let messages: Msg[];
  try {
    const body = (await req.json()) as { messages?: unknown };
    if (!Array.isArray(body.messages)) throw new Error();
    messages = body.messages
      .filter(
        (m): m is Msg =>
          !!m && typeof m === "object" &&
          ((m as Msg).role === "user" || (m as Msg).role === "assistant") &&
          typeof (m as Msg).content === "string",
      )
      .slice(-MAX_HISTORY)
      .map((m) => ({ role: m.role, content: m.content.slice(0, m.role === "user" ? MAX_MESSAGE_CHARS : 1200) }));
    const last = messages[messages.length - 1];
    if (!last || last.role !== "user" || !last.content.trim()) throw new Error();
  } catch {
    return json(400, { error: "bad_request" }, origin);
  }

  let upstream: Response;
  try {
    upstream = await fetch(GROQ_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "system", content: buildSystemPrompt() }, ...messages],
        max_tokens: MAX_TOKENS,
        temperature: 0.3,
        ...(MODEL.startsWith("openai/gpt-oss") ? { reasoning_effort: "low", include_reasoning: false } : {}),
        stream: true,
      }),
      signal: AbortSignal.timeout(20_000),
    });
  } catch {
    return json(502, { error: "upstream_unreachable" }, origin);
  }
  if (!upstream.ok || !upstream.body) return json(502, { error: "upstream_error", status: upstream.status }, origin);

  // Convert Groq's SSE stream into a plain text stream for the widget.
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";
  const stream = upstream.body.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          const data = line.replace(/^data:\s*/, "").trim();
          if (!data || data === "[DONE]" || !line.startsWith("data:")) continue;
          try {
            const delta = JSON.parse(data).choices?.[0]?.delta?.content;
            if (delta) controller.enqueue(encoder.encode(delta));
          } catch {
            /* ignore partial lines */
          }
        }
      },
    }),
  );

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      ...(origin ? { "Access-Control-Allow-Origin": origin, Vary: "Origin" } : {}),
    },
  });
}
