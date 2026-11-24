"use client";

import {
  BadgeDollarSign, Bot, ChevronRight, FileText, Loader2, MapPin, Mic, MicOff, RotateCcw, SendHorizontal, Sparkles, UserPlus, UserRound, X,
} from "lucide-react";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { WhatsAppIcon } from "@/components/ui/Icon";
import type { Lang } from "@/lib/i18n";
import type { ChatStrings, Topic } from "./ChatLauncher";
import { fallbackReply, isGibberish } from "./fallback";
import styles from "./Chat.module.css";

type Msg = { role: "user" | "assistant"; content: string };
const MAX_CHARS = 500;
const topicIcons = { fee: BadgeDollarSign, women: UserRound, beginner: Sparkles, license: FileText, map: MapPin, enrol: UserPlus };

/* ── Small helpers ─────────────────────────────────────────────────────── */

/** Turn links, the licence page and phone numbers in a reply into tappable links. */
function RichText({ text, waHref }: { text: string; waHref: string }) {
  const clean = text.replace(/\*\*(.+?)\*\*/g, "$1").replace(/^#+\s*/gm, "");
  const parts = clean.split(/(https?:\/\/[^\s)]+|\/en\/license\b|\/license\b|01[3-9]\d{8}|০১[৩-৯][০-৯]{8})/g);
  return (
    <>
      {parts.map((p, i) => {
        if (/^https?:\/\//.test(p)) {
          const href = p.replace(/[.,।]+$/, "");
          return <a key={i} href={href} target="_blank" rel="noopener noreferrer">{href.replace(/^https?:\/\//, "")}</a>;
        }
        if (/^\/(en\/)?license$/.test(p)) return <a key={i} href={p}>{p}</a>;
        if (/^(01[3-9]\d{8}|০১[৩-৯][০-৯]{8})$/.test(p)) return <a key={i} href={waHref} target="_blank" rel="noopener noreferrer">{p}</a>;
        return <Fragment key={i}>{p}</Fragment>;
      })}
    </>
  );
}

type SpeechRec = { lang: string; interimResults: boolean; continuous: boolean; start(): void; stop(): void; onresult: ((e: { results: ArrayLike<{ 0: { transcript: string } }> }) => void) | null; onend: (() => void) | null; onerror: (() => void) | null };
function getSpeech(): (new () => SpeechRec) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: new () => SpeechRec; webkitSpeechRecognition?: new () => SpeechRec };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/* ── Panel ─────────────────────────────────────────────────────────────── */

export default function ChatPanel({ lang, strings, open, onClose }: { lang: Lang; strings: ChatStrings; open: boolean; onClose: () => void }) {
  const storeKey = `tahyas-chat-${lang}`;
  const [messages, setMessages] = useState<Msg[]>(() => {
    try {
      const saved = sessionStorage.getItem(storeKey);
      if (saved) return JSON.parse(saved) as Msg[];
    } catch {}
    return [];
  });
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const [canSpeak, setCanSpeak] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recRef = useRef<SpeechRec | null>(null);

  useEffect(() => {
    const canRecord = !!navigator.mediaDevices?.getUserMedia && typeof window.MediaRecorder !== "undefined";
    setCanSpeak(canRecord || !!getSpeech());
  }, []);

  /* ── Voice: record → Groq Whisper (Bengali + English auto-detected) → send ── */
  const V = lang === "bn"
    ? { rec: "শুনছি… বলা শেষ হলে থামবে", transcribing: "লিখছি…", denied: "মাইক্রোফোনের অনুমতি দিন (ব্রাউজারের ঠিকানার পাশের 🔒 থেকে)", short: "আরেকটু সময় নিয়ে বলুন 🙂", none: "কিছু শুনতে পাইনি — আবার চেষ্টা করুন", failed: "ভয়েস বোঝা যায়নি — লিখে প্রশ্ন করুন" }
    : { rec: "Listening… stops when you finish", transcribing: "Writing it down…", denied: "Please allow microphone access (🔒 next to the address bar)", short: "Speak a little longer 🙂", none: "Didn't catch that — please try again", failed: "Couldn't understand the audio — please type instead" };
  const [voice, setVoice] = useState<"idle" | "recording" | "transcribing">("idle");
  const [recSecs, setRecSecs] = useState(0);
  const [voiceNote, setVoiceNote] = useState("");
  const stopRecRef = useRef<(() => void) | null>(null);
  const askRef = useRef<(q: string) => void>(() => {});

  useEffect(() => {
    if (!voiceNote) return;
    const t = setTimeout(() => setVoiceNote(""), 4000);
    return () => clearTimeout(t);
  }, [voiceNote]);

  // stop recording if the panel closes
  useEffect(() => { if (!open) stopRecRef.current?.(); }, [open]);

  /* ── Phones: follow the *visible* viewport so the input always sits right above
     the on-screen keyboard (iOS does not shrink 100dvh for the keyboard). ── */
  const [vv, setVv] = useState<{ h: number; top: number; kb: boolean } | null>(null);
  useEffect(() => {
    const v = window.visualViewport;
    if (!open || !v) return;
    const mq = matchMedia("(max-width: 1023px)");
    const update = () => {
      if (!mq.matches) { setVv(null); return; }
      setVv({ h: v.height, top: v.offsetTop, kb: v.height < window.innerHeight * 0.78 });
      const list = listRef.current;
      if (list && list.dataset.started) list.scrollTo({ top: list.scrollHeight }); // keep the welcome at the top
    };
    update();
    v.addEventListener("resize", update);
    v.addEventListener("scroll", update);
    return () => { v.removeEventListener("resize", update); v.removeEventListener("scroll", update); };
  }, [open]);

  /* ── Phones: drag the header down to close ── */
  const [dragY, setDragY] = useState(0);
  const dragStart = useRef<number | null>(null);
  const onHeadDown = (e: React.PointerEvent) => {
    if (!matchMedia("(max-width: 1023px)").matches) return;
    if ((e.target as HTMLElement).closest("button, a")) return;
    dragStart.current = e.clientY;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onHeadMove = (e: React.PointerEvent) => {
    if (dragStart.current !== null) setDragY(Math.max(0, e.clientY - dragStart.current));
  };
  const onHeadUp = () => {
    if (dragStart.current === null) return;
    dragStart.current = null;
    if (dragY > 110) { inputRef.current?.blur(); onClose(); }
    setDragY(0);
  };

  // Remember the conversation while the tab is open
  useEffect(() => {
    try { sessionStorage.setItem(storeKey, JSON.stringify(messages.slice(-20))); } catch {}
  }, [messages, storeKey]);

  // Focus input on desktop only (on phones the keyboard would cover the topics)
  useEffect(() => {
    if (open && matchMedia("(min-width: 640px)").matches) inputRef.current?.focus({ preventScroll: true });
  }, [open]);

  useEffect(() => {
    if (messages.length === 0) { listRef.current?.scrollTo({ top: 0 }); return; }
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Auto-grow the text box (1 → 4 lines)
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }, [input]);

  const ask = useCallback(async (text: string) => {
    const question = text.trim();
    if (!question || busy) return;
    if (question.length > MAX_CHARS) {
      setMessages((m) => [...m, { role: "assistant", content: strings.tooLong }]);
      return;
    }
    const history: Msg[] = [...messages, { role: "user", content: question }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);
    const setLast = (content: string) => setMessages((m) => [...m.slice(0, -1), { role: "assistant", content }]);
    const previous = messages.filter((m) => m.role === "assistant").map((m) => m.content);

    // Keyboard-mash ("sds") → instant local reply, no AI call / tokens.
    if (isGibberish(question)) {
      setTimeout(() => { setLast(fallbackReply(question, lang, previous)); setBusy(false); }, 450);
      return;
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.slice(-8) }),
      });
      if (!res.ok || !res.body) throw new Error(String(res.status));
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        setLast(answer);
      }
      if (!answer.trim()) throw new Error("empty");
    } catch {
      // graceful offline answer that avoids repeating earlier replies
      setLast(fallbackReply(question, lang, previous));
    } finally {
      setBusy(false);
    }
  }, [busy, messages, lang, strings.tooLong]);

  async function startRecording() {
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
    } catch {
      setVoiceNote(V.denied);
      return;
    }
    const type = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"].find((t) => MediaRecorder.isTypeSupported?.(t));
    const rec = new MediaRecorder(stream, type ? { mimeType: type, audioBitsPerSecond: 32000 } : undefined);
    const chunks: Blob[] = [];
    const started = Date.now();
    let heardVoice = false;
    let quietSince = 0;

    // Auto-stop ~1.4s after the speaker goes quiet (simple loudness check).
    const ctx = new AudioContext();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    ctx.createMediaStreamSource(stream).connect(analyser);
    const buf = new Uint8Array(analyser.fftSize);
    const tick = setInterval(() => {
      const elapsed = Date.now() - started;
      setRecSecs(Math.floor(elapsed / 1000));
      analyser.getByteTimeDomainData(buf);
      let sum = 0;
      for (const v of buf) sum += (v - 128) ** 2;
      const loud = Math.sqrt(sum / buf.length) > 6;
      if (loud) { heardVoice = true; quietSince = 0; }
      else if (heardVoice) {
        quietSince ||= Date.now();
        if (Date.now() - quietSince > 1400) stop();
      }
      if (elapsed > 30_000) stop();
    }, 100);

    function stop() {
      if (rec.state !== "inactive") rec.stop();
    }
    stopRecRef.current = stop;

    rec.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
    rec.onstop = async () => {
      clearInterval(tick);
      stream.getTracks().forEach((t) => t.stop());
      ctx.close().catch(() => {});
      stopRecRef.current = null;
      setRecSecs(0);
      if (!open) { setVoice("idle"); return; }
      if (Date.now() - started < 700) { setVoice("idle"); setVoiceNote(V.short); return; }
      if (!heardVoice) { setVoice("idle"); setVoiceNote(V.none); return; }

      setVoice("transcribing");
      try {
        const form = new FormData();
        form.append("audio", new Blob(chunks, { type: rec.mimeType || "audio/webm" }), "voice");
        const r = await fetch("/api/chat/transcribe", { method: "POST", body: form });
        const d = (await r.json().catch(() => ({}))) as { text?: string };
        if (!r.ok) throw new Error();
        if (!d.text) setVoiceNote(V.none);
        else askRef.current(d.text); // speak → answer, no extra tap
      } catch {
        setVoiceNote(V.failed);
      } finally {
        setVoice("idle");
      }
    };

    rec.start(250);
    setVoice("recording");
  }

  function toggleMic() {
    if (voice === "recording") { stopRecRef.current?.(); return; }
    if (voice === "transcribing" || busy) return;
    if (!!navigator.mediaDevices?.getUserMedia && typeof window.MediaRecorder !== "undefined") { startRecording(); return; }
    // Fallback for browsers without MediaRecorder: built-in speech recognition (one language).
    if (listening) { recRef.current?.stop(); return; }
    const Rec = getSpeech();
    if (!Rec) return;
    const rec = new Rec();
    rec.lang = lang === "bn" ? "bn-BD" : "en-US";
    rec.interimResults = true;
    rec.continuous = false;
    rec.onresult = (e) => setInput(Array.from(e.results).map((r) => r[0].transcript).join(" "));
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    setListening(true);
    rec.start();
  }

  askRef.current = ask;

  const restart = () => { setMessages([]); setInput(""); };

  const asked = new Set(messages.filter((m) => m.role === "user").map((m) => m.content));
  const nextTopics = strings.topics.filter((tp) => !asked.has(tp.ask));
  const started = messages.length > 0;
  const lastIsBot = messages[messages.length - 1]?.role === "assistant";

  return (
    <div
      id="chat-panel"
      className={styles.panel}
      data-open={open || undefined}
      data-kb={vv?.kb || undefined}
      style={open && (vv || dragY) ? {
        ...(vv ? { height: vv.h, top: vv.top, bottom: "auto" } : {}),
        ...(dragY ? { transform: `translateY(${dragY}px)`, transition: "none" } : {}),
      } : undefined}
      role="dialog"
      aria-modal="false"
      aria-labelledby="chat-title"
      inert={!open}
    >
      <header className={styles.head} onPointerDown={onHeadDown} onPointerMove={onHeadMove} onPointerUp={onHeadUp} onPointerCancel={onHeadUp}>
        <span className={styles.grabber} aria-hidden="true" />
        <span className={styles.avatar}><Bot aria-hidden="true" /><i className={styles.online} /></span>
        <div className={styles.headText}>
          <p id="chat-title" className={styles.title}>{strings.title}</p>
          <p className={styles.sub}>{strings.subtitle}</p>
        </div>
        {started && (
          <button type="button" className={styles.iconBtn} onClick={restart} aria-label={strings.restart} title={strings.restart}>
            <RotateCcw aria-hidden="true" />
          </button>
        )}
        <a href={strings.whatsappHref} target="_blank" rel="noopener noreferrer" className={`${styles.iconBtn} ${styles.waBtn}`} aria-label={strings.whatsappCta} title={strings.whatsappCta}>
          <WhatsAppIcon size={20} />
        </a>
        <button type="button" className={styles.iconBtn} onClick={onClose} aria-label={strings.close}><X aria-hidden="true" /></button>
      </header>

      <div ref={listRef} className={styles.list} aria-live="polite" aria-busy={busy} data-started={messages.length > 0 || undefined}>
        {!started && (
          <div className={styles.topics}>
            <div className={styles.welcome}>
              <span className={styles.welcomeAvatar}><Bot aria-hidden="true" /></span>
              <p className={styles.welcomeTitle}>{strings.title}</p>
              <p className={styles.welcomeText}>{strings.greeting}</p>
            </div>
            <p className={styles.topicsTitle}>{strings.pickTopic}</p>
            <div className={styles.topicGrid}>
              {strings.topics.map((tp: Topic) => {
                const I = topicIcons[tp.icon];
                return (
                  <button key={tp.label} type="button" className={styles.topic} onClick={() => ask(tp.ask)}>
                    <span className={styles.topicIcon}><I aria-hidden="true" /></span>
                    <span className={styles.topicLabel}>{tp.label}</span>
                    <ChevronRight className={styles.topicArrow} aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Conversation */}
        {messages.map((m, i) => {
          const isLastBot = m.role === "assistant" && i === messages.length - 1;
          return m.role === "user" ? (
            <p key={i} className={styles.user}>{m.content}</p>
          ) : (
            <div key={i} className={styles.row}>
              <span className={styles.miniAvatar} aria-hidden="true"><Bot /></span>
              <div className={styles.botWrap}>
                <p className={styles.bot}>
                  {m.content ? <RichText text={m.content} waHref={strings.whatsappHref} /> : <span className={styles.typing} aria-label="…"><i /><i /><i /></span>}
                </p>
                {isLastBot && m.content && !busy &&
                  /(?:ভর্তির জন্য whatsapp|ভর্তি.*whatsapp করুন|enrol.*whatsapp|whatsapp.*(?:ভর্তি|enrol))/i.test(m.content) && (
                  <a href={strings.whatsappHref} target="_blank" rel="noopener noreferrer" className={styles.inlineWa}>
                    <WhatsAppIcon size={18} /> {strings.askWhatsapp}
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Follow-up suggestions */}
      {started && lastIsBot && !busy && nextTopics.length > 0 && (
        <div className={styles.suggest} aria-label={strings.more}>
          {nextTopics.map((tp) => (
            <button key={tp.label} type="button" onClick={() => ask(tp.ask)}>{tp.label}</button>
          ))}
        </div>
      )}

      {voiceNote && <p className={styles.voiceNote} role="status">{voiceNote}</p>}
      <form className={styles.form} onSubmit={(e) => { e.preventDefault(); ask(input); }}>
        <label htmlFor="chat-input" className="sr-only">{strings.placeholder}</label>
        <div className={styles.inputWrap} data-listening={listening || voice === "recording" || undefined} data-busy={voice === "transcribing" || undefined}>
          <textarea
            ref={inputRef}
            id="chat-input"
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); ask(input); }
            }}
            placeholder={voice === "recording" ? `● ${recSecs}s — ${V.rec}` : voice === "transcribing" ? V.transcribing : listening ? strings.listening : strings.placeholder}
            readOnly={voice !== "idle"}
            maxLength={MAX_CHARS}
            autoComplete="off"
            enterKeyHint="send"
          />
          {canSpeak && (
            <button
              type="button"
              className={styles.mic}
              data-on={listening || voice === "recording" || undefined}
              data-wait={voice === "transcribing" || undefined}
              onClick={toggleMic}
              disabled={voice === "transcribing"}
              aria-label={listening || voice === "recording" ? strings.micStop : strings.mic}
              title={listening || voice === "recording" ? strings.micStop : strings.mic}
            >
              {voice === "transcribing" ? <Loader2 aria-hidden="true" className={styles.spin} />
                : listening || voice === "recording" ? <MicOff aria-hidden="true" /> : <Mic aria-hidden="true" />}
            </button>
          )}
        </div>
        <button type="submit" className={styles.send} disabled={busy || !input.trim()} aria-label={strings.send}>
          <SendHorizontal aria-hidden="true" />
        </button>
      </form>
      <p className={styles.disclaimer}>{strings.disclaimer}</p>
    </div>
  );
}
