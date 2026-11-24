/**
 * POST /api/chat/transcribe — voice → text for the chat (Bengali or English, auto-detected).
 * The browser records a short clip; this proxies it to Groq Whisper. Works in every
 * browser that can record audio (unlike the Web Speech API), and its quota is separate
 * from the chat model's token budget.
 */
import { allowedOrigin, clientIp, createRateLimiter } from "@/features/chat/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GROQ_URL = "https://api.groq.com/openai/v1/audio/transcriptions";
/* Pass 1 (auto language): fast turbo model. Pass 2 (only for Bengali speech): the full
   model with language forced to Bengali — noticeably better Bengali spelling in tests,
   and it never drifts into Hindi script. English stays a single, fast call. */
const AUTO_MODELS = ["whisper-large-v3-turbo", "whisper-large-v3"];
const BENGALI_MODELS = ["whisper-large-v3", "whisper-large-v3-turbo"];
const MAX_BYTES = 2 * 1024 * 1024; // ~2 min of compressed speech; we cap recordings at 30s
const limited = createRateLimiter(15, 10 * 60 * 1000);

/* Context words help Whisper spell Bengali + English driving terms correctly. */
const HINT = "তাহয়াস কার ট্রেনিং সেন্টার, ড্রাইভিং কোর্স, ভর্তি, ফি, লাইসেন্স, ক্লাচ, গিয়ার, ব্রেক। Driving course, fee, licence, clutch, brake.";

const json = (status: number, body: object) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });

async function transcribe(key: string, audio: Blob, name: string, language?: string) {
  for (const model of language ? BENGALI_MODELS : AUTO_MODELS) {
    const form = new FormData();
    form.append("file", audio, name);
    form.append("model", model);
    form.append("response_format", "json");
    form.append("temperature", "0");
    form.append("prompt", HINT);
    if (language) form.append("language", language);
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}` },
      body: form,
      signal: AbortSignal.timeout(25_000),
    });
    if (res.ok) return ((await res.json()) as { text?: string }).text?.trim() ?? "";
    if (![400, 404, 429, 503].includes(res.status)) throw new Error(String(res.status));
  }
  throw new Error("no_model");
}

export async function POST(req: Request) {
  if (!allowedOrigin(req.headers.get("origin"))) return json(403, { error: "forbidden" });
  const key = process.env.GROQ_API_KEY;
  if (!key) return json(503, { error: "not_configured" });
  if (limited(clientIp(req))) return json(429, { error: "rate_limited" });

  let audio: File;
  try {
    const form = await req.formData();
    const f = form.get("audio");
    if (!(f instanceof File) || f.size < 800) return json(400, { error: "empty" });
    if (f.size > MAX_BYTES) return json(413, { error: "too_large" });
    if (f.type && !f.type.startsWith("audio/") && f.type !== "video/webm") return json(415, { error: "bad_type" });
    audio = f;
  } catch {
    return json(400, { error: "bad_request" });
  }

  const ext = audio.type.includes("mp4") || audio.type.includes("m4a") ? "m4a"
    : audio.type.includes("ogg") ? "ogg"
    : audio.type.includes("wav") ? "wav" : "webm";

  try {
    let text = await transcribe(key, audio, `voice.${ext}`);
    // Bengali speech (or Bengali heard as Hindi/Urdu script) → redo with Bengali forced.
    if (/[ঀ-৿ऀ-ॿ؀-ۿ]/.test(text)) {
      const first = text;
      text = await transcribe(key, audio, `voice.${ext}`, "bn").catch(() => first);
    }
    // Whisper "hallucinates" these on silence
    if (!text || /^(thank you\.?|thanks for watching!?|\.+|♪+)$/i.test(text)) return json(200, { text: "" });
    return json(200, { text: text.slice(0, 400) });
  } catch {
    return json(502, { error: "upstream_error" });
  }
}
