import { site } from "@/config/site";
import type { Lang } from "@/lib/i18n";
import styles from "./Logo.module.css";

/**
 * Logo mark: a safety shield holding a steering wheel, with the road running out
 * of it — "learn to drive, safely". Works on light and dark backgrounds.
 */
export function LogoMark({ size = 46, id = "lm" }: { size?: number; id?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className={styles.mark}>
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1d2e4f" />
          <stop offset="1" stopColor="#0b1324" />
        </linearGradient>
        <linearGradient id={`${id}-am`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffd34d" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <path d="M32 2.5 58 10.5V30c0 16.5-11 27-26 31.5C17 57 6 46.5 6 30V10.5Z" fill={`url(#${id}-bg)`} stroke={`url(#${id}-am)`} strokeWidth="2.6" />
      <path d="M26.5 60 30 34h4l3.5 26" fill="#e8edf5" />
      <path d="M32 39v3.5M32 46v4M32 53.5v4.5" stroke="#0b1324" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="32" cy="27" r="13.5" fill="none" stroke={`url(#${id}-am)`} strokeWidth="4.2" />
      <path d="M19 25.5c8.5-2.6 17.5-2.6 26 0" stroke={`url(#${id}-am)`} strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="32" cy="27" r="4" fill={`url(#${id}-am)`} />
    </svg>
  );
}

export function Logo({ lang, size = 46, id }: { lang: Lang; size?: number; id?: string }) {
  return (
    <span className={styles.logo}>
      <LogoMark size={size} id={id} />
      <span className={styles.text}>
        <span className={styles.word} lang="bn">{site.shortName.bn}</span>
        <span className={styles.sub}>CAR TRAINING CENTER</span>
      </span>
      <span className="sr-only">{site.name[lang]}</span>
    </span>
  );
}
