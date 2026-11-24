"use client";

import { Languages, Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./Header.module.css";

/** Sticky header that gets a solid glass background once the page scrolls. */
export function HeaderShell({ className, children }: { className: string; children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={className} data-scrolled={scrolled || undefined}>
      {children}
    </header>
  );
}

/** Sun/moon toggle. The initial theme is set by the inline script in <head>. */
export function ThemeToggle({ label, className }: { label: string; className: string }) {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    const apply = () => {
      root.dataset.theme = next;
      try { localStorage.setItem("theme", next); } catch {}
    };
    // Smooth crossfade where the View Transitions API exists; instant elsewhere
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
    if (doc.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) doc.startViewTransition(apply);
    else apply();
  };
  return (
    <button type="button" className={`${className} ${styles.theme}`} onClick={toggle} aria-label={label} title={label}>
      <Sun className={styles.sun} aria-hidden="true" />
      <Moon className={styles.moon} aria-hidden="true" />
    </button>
  );
}

/** BN ⇄ EN link that also remembers the choice. */
export function LangSwitch({ to, href, label, className }: { to: string; href: string; label: string; className: string }) {
  return (
    <a
      href={href}
      hrefLang={to}
      className={`${className} ${styles.lang}`}
      aria-label={label}
      title={label}
      onClick={() => { try { localStorage.setItem("lang", to); } catch {} }}
    >
      <Languages aria-hidden="true" />
      <span>{to === "en" ? "EN" : "বাং"}</span>
    </a>
  );
}

const NAV_ICONS = ["🏠", "🎓", "📋", "📍", "💬", "📞"];

type MenuProps = {
  items: { href: string; label: string }[];
  menuLabel: string;
  closeLabel: string;
  className: string;
};

/** Hamburger + slide-in drawer (mobile/tablet). Esc closes, focus is managed, body scroll is locked. */
export function MobileMenu({ items, menuLabel, closeLabel, className }: MenuProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a,button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>("a,button");
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      triggerRef.current?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={`${className} ${styles.burger}`}
        aria-label={menuLabel}
        aria-expanded={open}
        aria-controls="mobile-drawer"
        onClick={() => setOpen(true)}
      >
        <Menu aria-hidden="true" />
      </button>

      {mounted &&
        createPortal(
          <div className={styles.drawerRoot} data-open={open || undefined} aria-hidden={!open}>
            <div className={styles.backdrop} onClick={() => setOpen(false)} />
            <div
              ref={panelRef}
              id="mobile-drawer"
              className={styles.drawer}
              role="dialog"
              aria-modal="true"
              aria-label={menuLabel}
              inert={!open}
            >
              <div className={styles.drawerHandle} aria-hidden="true" />
              <button type="button" className={styles.close} onClick={() => setOpen(false)} aria-label={closeLabel}>
                <X aria-hidden="true" />
              </button>
              <nav className={styles.drawerNav}>
                {items.map((i, idx) => (
                  <a key={i.href} href={i.href} onClick={() => setOpen(false)} style={{ "--i": idx } as React.CSSProperties}>
                    <span className={styles.drawerNavIcon} aria-hidden="true">{NAV_ICONS[idx] ?? "▸"}</span>
                    {i.label}
                  </a>
                ))}
              </nav>
              <div className={styles.drawerActions}>
                <a
                  href="https://wa.me/8801320381356"
                  className={`${styles.drawerActionBtn} ${styles.drawerActionWa}`}
                  target="_blank" rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                >
                  <span>💬</span> WhatsApp
                </a>
                <a
                  href="tel:+8801320381356"
                  className={`${styles.drawerActionBtn} ${styles.drawerActionCall}`}
                  onClick={() => setOpen(false)}
                >
                  <span>📞</span> কল করুন
                </a>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
