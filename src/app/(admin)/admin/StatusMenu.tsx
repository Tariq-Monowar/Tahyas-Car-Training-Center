"use client";
/**
 * Status picker that replaces the native <select> (whose popup is drawn by the
 * browser and looked out of place). Phones: an action sheet from the bottom.
 * Larger screens: a small menu anchored to the pill (flips up near the bottom).
 */
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, CircleCheck, CircleX, Clock } from "lucide-react";
import styles from "./admin.module.css";
import { STATUS_LABEL, type Status } from "./shared";

const ORDER: Status[] = ["pending", "confirmed", "cancelled"];
const ICON = { pending: Clock, confirmed: CircleCheck, cancelled: CircleX };

export default function StatusMenu({
  value, onChange, name,
}: { value: Status; onChange: (s: Status) => void; name?: string }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number; up: boolean } | null>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const isPhone = () => window.matchMedia("(max-width: 760px)").matches;

  function toggle() {
    if (open) { setOpen(false); return; }
    if (!isPhone() && btn.current) {
      const r = btn.current.getBoundingClientRect();
      const up = window.innerHeight - r.bottom < 170;
      setPos({ top: up ? r.top - 6 : r.bottom + 6, left: r.left, up });
    } else setPos(null);
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const onScroll = () => { if (!isPhone()) setOpen(false); };
    window.addEventListener("keydown", close);
    window.addEventListener("scroll", onScroll, true);
    return () => { window.removeEventListener("keydown", close); window.removeEventListener("scroll", onScroll, true); };
  }, [open]);

  function pick(s: Status) {
    setOpen(false);
    if (s !== value) onChange(s);
  }

  const options = ORDER.map((s) => {
    const Icon = ICON[s];
    return (
      <button key={s} type="button" className={`${styles.smItem} ${styles[`sm_${s}`]}`} data-on={s === value || undefined}
        onClick={() => pick(s)}>
        <Icon size={18} /> <span>{STATUS_LABEL[s]}</span>
        {s === value && <Check size={16} className={styles.smCheck} />}
      </button>
    );
  });

  return (
    <>
      <button ref={btn} type="button" className={`${styles.statusPill} ${styles[value]}`} onClick={toggle}
        aria-haspopup="menu" aria-expanded={open} aria-label="অবস্থা পরিবর্তন">
        {STATUS_LABEL[value]} <ChevronDown size={14} />
      </button>

      {open && typeof document !== "undefined" && createPortal(
        // portal to <body>, wrapped in .layout so the theme variables apply
        <div className={styles.layout} style={{ minHeight: 0 }}>
          {pos ? (
            <>
              <div className={styles.smBackdropClear} onClick={() => setOpen(false)} />
              <div role="menu" className={styles.smPopover}
                style={{ top: pos.top, left: pos.left, transform: pos.up ? "translateY(-100%)" : undefined }}>
                {options}
              </div>
            </>
          ) : (
            <div className={styles.smBackdrop} onClick={() => setOpen(false)}>
              <div role="menu" className={styles.smSheet} onClick={(e) => e.stopPropagation()}>
                <div className={styles.smGrab}><span /></div>
                <div className={styles.smTitle}>অবস্থা পরিবর্তন{name ? ` — ${name}` : ""}</div>
                {options}
                <button type="button" className={styles.smCancel} onClick={() => setOpen(false)}>বন্ধ করুন</button>
              </div>
            </div>
          )}
        </div>,
        document.body,
      )}
    </>
  );
}
