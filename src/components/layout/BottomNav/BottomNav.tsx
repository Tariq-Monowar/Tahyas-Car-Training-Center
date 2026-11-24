"use client";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./BottomNav.module.css";

const svg = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

const IconHome = () => (
  <svg {...svg}><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" /></svg>
);
const IconCourses = () => (
  <svg {...svg}><path d="M22 10 12 5 2 10l10 5 10-5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
);
const IconApply = () => (
  <svg {...svg}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M12 12v6M9 15h6" /></svg>
);
const IconLocation = () => (
  <svg {...svg}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>
);
const IconChat = () => (
  <svg {...svg}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><path d="M8 10h.01M12 10h.01M16 10h.01" strokeWidth={2.6} /></svg>
);

const HOME = 0, COURSES = 1, APPLY = 2, LOCATION = 3, CHAT = 4;

const items = [
  { label: "হোম", href: "/", Icon: IconHome },
  { label: "কোর্স", href: "/#courses", Icon: IconCourses },
  { label: "আবেদন", href: "/enroll", Icon: IconApply },
  { label: "ঠিকানা", href: "/#location", Icon: IconLocation },
  { label: "চ্যাট", Icon: IconChat },
];

const HASH_INDEX: Record<string, number> = { "#courses": COURSES, "#location": LOCATION };

export function BottomNav() {
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "/en";
  const [active, setActive] = useState(-1);
  const [chatOpen, setChatOpen] = useState(false);
  // Transitions stay off until the bubble has been placed once, so it never flies in from the left
  const [ready, setReady] = useState(false);
  const lastShown = useRef(0);

  // Set once per page from the URL; after that only a tap moves the bubble (scrolling never does)
  useLayoutEffect(() => {
    if (pathname.includes("/enroll")) setActive(APPLY);
    else if (isHome) setActive(HASH_INDEX[location.hash] ?? HOME);
    else setActive(-1);
    let r2 = 0;
    const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setReady(true)); });
    return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); };
  }, [pathname, isHome]);

  useEffect(() => {
    const onClose = () => setChatOpen(false);
    window.addEventListener("chat-closed", onClose);
    return () => window.removeEventListener("chat-closed", onClose);
  }, []);

  const current = chatOpen ? CHAT : active;
  // When nothing is active, keep the bubble where it was so it shrinks in place instead of sliding left
  if (current >= 0) lastShown.current = current;

  return (
    <nav
      className={styles.nav}
      aria-label="Quick navigation"
      style={{ "--i": lastShown.current } as React.CSSProperties}
      data-has-active={current >= 0 || undefined}
      data-ready={ready || undefined}
    >
      <span className={styles.track} aria-hidden="true"><span className={styles.bubble} /></span>
      {items.map(({ label, href, Icon }, idx) => {
        const cls = `${styles.item} ${idx === current ? styles.activeItem : ""}`;
        const inner = (
          <>
            <span className={styles.icon}><Icon /></span>
            <span className={styles.label}>{label}</span>
          </>
        );
        if (!href) {
          return (
            <button
              key={label}
              type="button"
              className={cls}
              onClick={() => { setChatOpen(true); window.dispatchEvent(new CustomEvent("open-chat")); }}
            >
              {inner}
            </button>
          );
        }
        return (
          <a
            key={label}
            href={href}
            className={cls}
            aria-current={idx === current ? "page" : undefined}
            onClick={() => setActive(idx)}
          >
            {inner}
          </a>
        );
      })}
    </nav>
  );
}
