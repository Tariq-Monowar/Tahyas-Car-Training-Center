/**
 * POST /api/chat — tiny server-side proxy to Groq.
 * The GROQ_API_KEY stays on the server (env variable), never in the browser.
 * Protections: allowed-origin check, per-IP rate limit, message length cap, max_tokens cap.
 */
import { site } from "@/config/site";
import { buildSystemPrompt } from "@/features/chat/systemPrompt";
import { allowedOrigin, clientIp, createRateLimiter } from "@/features/chat/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
/**
 * Tried in order — if Groq retires a model (404/400), the next one answers instead
 * of the whole chat falling back to canned replies. Override the first with GROQ_MODEL.
 */
const MODELS = [
  process.env.GROQ_MODEL,
  "openai/gpt-oss-120b", // best Bengali + natural tone
  "openai/gpt-oss-20b",
  "qwen/qwen3.8-27b",
].filter((m, i, a): m is string => !!m && a.indexOf(m) === i);
const MAX_MESSAGE_CHARS = 400;
/* Token budget (Groq free tier ≈ 8k tokens/min per model; Bengali is token-heavy):
   only the last few turns are sent, and earlier bot answers are shortened to their gist. */
const MAX_HISTORY = 4;
const HISTORY_ANSWER_CHARS = 320;
const MAX_TOKENS = 600; // a dense ~100-word answer + short hidden reasoning

/* First questions are mostly the same topic buttons — answer those from memory
   (0 tokens) for a few hours. Per server instance; small and self-expiring. */
const CACHE_TTL = 6 * 60 * 60 * 1000;
const answerCache = new Map<string, { text: string; exp: number }>();
const cacheKey = (q: string) => q.trim().toLowerCase().replace(/\s+/g, " ");

function textResponse(body: BodyInit, origin: string | null) {
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      ...(origin ? { "Access-Control-Allow-Origin": origin, Vary: "Origin" } : {}),
    },
  });
}

/** Model-specific options: keep reasoning short and out of the visible answer. */
function modelOptions(model: string) {
  if (model.startsWith("openai/gpt-oss")) return { reasoning_effort: "low", include_reasoning: false };
  if (model.startsWith("qwen/")) return { reasoning_format: "hidden" };
  return {};
}
// Generous: Bangladeshi mobile carriers put many users behind one shared IP (CGNAT)
const rateLimited = createRateLimiter(80, 10 * 60 * 1000);

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

  if (rateLimited(clientIp(req))) {
    console.warn("[chat] rate limited", clientIp(req));
    return json(429, { error: "rate_limited" }, origin);
  }

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
      .map((m) => ({
        role: m.role,
        content: m.role === "user"
          ? m.content.slice(0, MAX_MESSAGE_CHARS)
          : m.content.length > HISTORY_ANSWER_CHARS ? m.content.slice(0, HISTORY_ANSWER_CHARS) + "…" : m.content,
      }));
    const last = messages[messages.length - 1];
    if (!last || last.role !== "user" || !last.content.trim()) throw new Error();
  } catch {
    return json(400, { error: "bad_request" }, origin);
  }

  // Same opening question as someone before? Serve the remembered answer (no AI call).
  const firstQuestion = messages.length === 1 ? cacheKey(messages[0].content) : null;
  if (firstQuestion) {
    const hit = answerCache.get(firstQuestion);
    if (hit && hit.exp > Date.now()) return textResponse(hit.text, origin);
  }

  let upstream: Response | null = null;
  let lastStatus = 0;
  for (const model of MODELS) {
    try {
      const res = await fetch(GROQ_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          messages: [{ role: "system", content: buildSystemPrompt() }, ...messages],
          max_completion_tokens: MAX_TOKENS,
          temperature: 0.3, // low = more accurate facts (Bengali answers drift at higher values); variety comes from the prompt
          stream: true,
          ...modelOptions(model),
        }),
        signal: AbortSignal.timeout(20_000),
      });
      if (res.ok && res.body) { upstream = res; break; }
      lastStatus = res.status;
      console.error(`[chat] ${model} → ${res.status}`, (await res.text().catch(() => "")).slice(0, 300));
      // move on when this model can't serve right now — retired (404/400), busy (503)
      // or its per-model rate limit is used up (429; each model has its own quota)
      if (![400, 404, 413, 422, 429, 503].includes(res.status)) break;
    } catch (err) {
      lastStatus = 0;
      console.error(`[chat] ${model} → fetch failed`, err instanceof Error ? err.message : err);
    }
  }
  if (!upstream?.body) return json(502, { error: "upstream_error", status: lastStatus }, origin);

  // Convert Groq's SSE stream into a plain text stream for the widget.
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";
  let full = "";
  const stream = upstream.body.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      flush() {
        if (firstQuestion && full.trim().length > 20) {
          if (answerCache.size > 200) answerCache.delete(answerCache.keys().next().value!);
          answerCache.set(firstQuestion, { text: full, exp: Date.now() + CACHE_TTL });
        }
      },
      transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          const data = line.replace(/^data:\s*/, "").trim();
          if (!data || data === "[DONE]" || !line.startsWith("data:")) continue;
          try {
            const delta = JSON.parse(data).choices?.[0]?.delta?.content;
            if (delta) { full += delta; controller.enqueue(encoder.encode(delta)); }
          } catch {
            /* ignore partial lines */
          }
        }
      },
    }),
  );

  return textResponse(stream, origin);
}
