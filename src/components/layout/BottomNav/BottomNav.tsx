"use client";
import { usePathname } from "next/navigation";
import styles from "./BottomNav.module.css";

function IconCourses() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M9 7h7M9 11h5" />
    </svg>
  );
}

function IconLocation() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

function IconApply() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M12 12v6M9 15h6" />
    </svg>
  );
}

function IconChat() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <circle cx="8" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="16" cy="10" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.07 3.4 2 2 0 0 1 3 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16l.92.92z" />
    </svg>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const isEnroll = pathname.includes("/enroll");

  function openChat() {
    window.dispatchEvent(new CustomEvent("open-chat"));
  }

  return (
    <nav className={styles.nav} aria-label="Quick navigation">
      {/* কোর্স */}
      <a href="/#courses" className={styles.item} aria-label="কোর্স">
        <span className={styles.icon}><IconCourses /></span>
        <span className={styles.label}>কোর্স</span>
      </a>

      {/* ঠিকানা */}
      <a href="/#location" className={styles.item} aria-label="ঠিকানা">
        <span className={styles.icon}><IconLocation /></span>
        <span className={styles.label}>ঠিকানা</span>
      </a>

      {/* আবেদন — CTA */}
      <a
        href="/enroll"
        className={`${styles.item} ${styles.cta} ${isEnroll ? styles.activeItem : ""}`}
        aria-label="আবেদন"
        aria-current={isEnroll ? "page" : undefined}
      >
        <span className={styles.icon}><IconApply /></span>
        <span className={styles.label}>আবেদন</span>
      </a>

      {/* চ্যাট — opens AI chat full screen */}
      <button
        type="button"
        className={styles.item}
        aria-label="চ্যাট"
        onClick={openChat}
      >
        <span className={styles.icon}><IconChat /></span>
        <span className={styles.label}>চ্যাট</span>
      </button>

      {/* যোগাযোগ */}
      <a
        href="https://wa.me/8801320381356"
        className={styles.item}
        aria-label="যোগাযোগ"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className={styles.icon}><IconPhone /></span>
        <span className={styles.label}>যোগাযোগ</span>
      </a>
    </nav>
  );
}
