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

/* Professional SVG icons for each nav item (order matches nav array in copy.ts) */
const NAV_SVG_ICONS = [
  /* 0 Courses — graduation cap */
  <svg key="courses" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
  /* 1 Why us — award / star shield */
  <svg key="why" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  /* 2 Road rules — traffic light */
  <svg key="road" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><rect x="7" y="2" width="10" height="20" rx="2"/><circle cx="12" cy="7" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="17" r="1.5" fill="currentColor" stroke="none"/></svg>,
  /* 3 Licence — id card */
  <svg key="license" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="12" r="2"/><path d="M14 10h4M14 14h3"/></svg>,
  /* 4 Enrol — clipboard with pencil */
  <svg key="enroll" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M12 12v6M9 15h6"/></svg>,
  /* 5 FAQ — speech bubble with ? */
  <svg key="faq" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/></svg>,
  /* 6 Location — map pin */
  <svg key="loc" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>,
];

type MenuProps = {
  items: { href: string; label: string }[];
  menuLabel: string;
  closeLabel: string;
  className: string;
};

/** Hamburger + bottom-sheet drawer (mobile) / slide-in (tablet+). Swipe-down closes on mobile. */
export function MobileMenu({ items, menuLabel, closeLabel, className }: MenuProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dragStartY = useRef<number | null>(null);
  const dragDelta = useRef(0);

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

  /* Swipe-down to dismiss (mobile bottom sheet) */
  function onTouchStart(e: React.TouchEvent) {
    dragStartY.current = e.touches[0].clientY;
    dragDelta.current = 0;
  }
  function onTouchMove(e: React.TouchEvent) {
    if (dragStartY.current === null) return;
    const dy = e.touches[0].clientY - dragStartY.current;
    if (dy > 0 && panelRef.current) {
      dragDelta.current = dy;
      panelRef.current.style.transform = `translateY(${dy}px)`;
      panelRef.current.style.transition = "none";
    }
  }
  function onTouchEnd() {
    if (panelRef.current) {
      panelRef.current.style.transform = "";
      panelRef.current.style.transition = "";
    }
    if (dragDelta.current > 80) setOpen(false);
    dragStartY.current = null;
    dragDelta.current = 0;
  }

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
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <div className={styles.drawerHandle} aria-hidden="true" />
              <button type="button" className={styles.close} onClick={() => setOpen(false)} aria-label={closeLabel}>
                <X aria-hidden="true" />
              </button>
              <nav className={styles.drawerNav}>
                {items.map((i, idx) => (
                  <a key={i.href} href={i.href} onClick={() => setOpen(false)} style={{ "--i": idx } as React.CSSProperties}>
                    <span className={styles.drawerNavIcon} aria-hidden="true">{NAV_SVG_ICONS[idx]}</span>
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
