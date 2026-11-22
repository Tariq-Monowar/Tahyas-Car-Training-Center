"use client";

import {
  BadgeDollarSign, Bot, FileText, MapPin, Mic, MicOff, RotateCcw, SendHorizontal, Sparkles, UserPlus, UserRound, X,
} from "lucide-react";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { WhatsAppIcon } from "@/components/ui/Icon";
import type { Lang } from "@/lib/i18n";
import type { ChatStrings, Topic } from "./ChatLauncher";
import { fallbackReply } from "./fallback";
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

  useEffect(() => setCanSpeak(!!getSpeech()), []);

  // Remember the conversation while the tab is open
  useEffect(() => {
    try { sessionStorage.setItem(storeKey, JSON.stringify(messages.slice(-20))); } catch {}
  }, [messages, storeKey]);

  // Focus input on desktop only (on phones the keyboard would cover the topics)
  useEffect(() => {
    if (open && matchMedia("(min-width: 640px)").matches) inputRef.current?.focus({ preventScroll: true });
  }, [open]);

  // Lock page scroll behind the full-screen sheet on phones
  useEffect(() => {
    if (!open || matchMedia("(min-width: 640px)").matches) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  useEffect(() => {
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
      setLast(fallbackReply(question, lang)); // graceful offline answer
    } finally {
      setBusy(false);
    }
  }, [busy, messages, lang, strings.tooLong]);

  function toggleMic() {
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
      role="dialog"
      aria-modal="false"
      aria-labelledby="chat-title"
      inert={!open}
    >
      <span className={styles.grabber} aria-hidden="true" />
      <header className={styles.head}>
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

      <div ref={listRef} className={styles.list} aria-live="polite" aria-busy={busy}>
        {/* Welcome */}
        <div className={styles.row}>
          <span className={styles.miniAvatar} aria-hidden="true"><Bot /></span>
          <p className={styles.bot}>{strings.greeting}</p>
        </div>

        {!started && (
          <div className={styles.topics}>
            <p className={styles.topicsTitle}>{strings.pickTopic}</p>
            <div className={styles.topicGrid}>
              {strings.topics.map((tp: Topic) => {
                const I = topicIcons[tp.icon];
                return (
                  <button key={tp.label} type="button" className={styles.topic} onClick={() => ask(tp.ask)}>
                    <I aria-hidden="true" />
                    <span>{tp.label}</span>
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
                  /(?:ভর্তির জন্য|ভর্তি.*whatsapp|enrol.*whatsapp|whatsapp.*(?:ভর্তি|করুন|করুন)|01[3-9]\d{8})/i.test(m.content) && (
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

      <form className={styles.form} onSubmit={(e) => { e.preventDefault(); ask(input); }}>
        <label htmlFor="chat-input" className="sr-only">{strings.placeholder}</label>
        <div className={styles.inputWrap} data-listening={listening || undefined}>
          <textarea
            ref={inputRef}
            id="chat-input"
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); ask(input); }
            }}
            placeholder={listening ? strings.listening : strings.placeholder}
            maxLength={MAX_CHARS}
            autoComplete="off"
            enterKeyHint="send"
          />
          {canSpeak && (
            <button
              type="button"
              className={styles.mic}
              data-on={listening || undefined}
              onClick={toggleMic}
              aria-label={listening ? strings.micStop : strings.mic}
              title={listening ? strings.micStop : strings.mic}
            >
              {listening ? <MicOff aria-hidden="true" /> : <Mic aria-hidden="true" />}
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
