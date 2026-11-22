"use client";

import dynamic from "next/dynamic";
import { MessageCircle, X } from "lucide-react";
import { useState } from "react";
import type { Lang } from "@/lib/i18n";
import styles from "./Chat.module.css";

export type Topic = { icon: "fee" | "women" | "beginner" | "license" | "map" | "enrol"; label: string; ask: string };

export type ChatStrings = {
  title: string; subtitle: string; open: string; close: string; greeting: string;
  pickTopic: string; more: string; topics: Topic[];
  placeholder: string; listening: string; mic: string; micStop: string; send: string; restart: string;
  askWhatsapp: string; disclaimer: string; tooLong: string;
  whatsappCta: string; whatsappHref: string;
};

/* The chat panel (and its logic) is only downloaded when the visitor opens it. */
const loadPanel = () => import("./ChatPanel");
const ChatPanel = dynamic(loadPanel, { ssr: false });

/** Floating "প্রশ্ন করুন" button (label visible on wider screens) that opens the chat. */
export function ChatLauncher({ lang, strings }: { lang: Lang; strings: ChatStrings }) {
  const [open, setOpen] = useState(false);
  const [everOpened, setEverOpened] = useState(false);

  return (
    <>
      <button
        type="button"
        className={styles.launcher}
        data-open={open || undefined}
        aria-label={open ? strings.close : strings.open}
        aria-expanded={open}
        aria-controls="chat-panel"
        onPointerEnter={loadPanel}
        onFocus={loadPanel}
        onClick={() => { setOpen((o) => !o); setEverOpened(true); }}
      >
        {open ? <X aria-hidden="true" /> : <MessageCircle aria-hidden="true" />}
        {!open && <span className={styles.launcherLabel}>{strings.open}</span>}
        {!open && <span className={styles.ping} aria-hidden="true" />}
      </button>
      {everOpened && <ChatPanel lang={lang} strings={strings} open={open} onClose={() => setOpen(false)} />}
    </>
  );
}
