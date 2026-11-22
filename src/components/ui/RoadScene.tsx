import styles from "./RoadScene.module.css";

/** Animated road: lane lines slide, the car gently bounces, wheels spin. Pure CSS (transform only). */
export function RoadScene({ className = "" }: { className?: string }) {
  return (
    <div className={`${styles.scene} ${className}`} aria-hidden="true">
      <div className={styles.road}>
        <div className={styles.lanes} />
      </div>
      <div className={styles.car}>
        <svg viewBox="0 0 220 84" width="220" height="84">
          {/* shadow */}
          <ellipse cx="110" cy="76" rx="92" ry="6" fill="rgb(0 0 0 / .35)" />
          {/* body */}
          <path
            d="M14 58c0-9 5-14 14-16l26-6 22-18c4-3 8-4 13-4h50c6 0 10 2 14 5l22 17 24 4c9 2 15 8 15 17v4c0 3-2 5-5 5H19c-3 0-5-2-5-5v-3Z"
            fill="#f8fafc"
          />
          <path d="M14 60h192v3c0 3-2 5-5 5H19c-3 0-5-2-5-5v-3Z" fill="#cfd8e3" />
          {/* windows */}
          <path d="M66 36 84 21c3-2 5-3 9-3h24v18H66Z" fill="#1d2e4f" />
          <path d="M123 18h20c4 0 7 1 10 4l15 14h-45V18Z" fill="#1d2e4f" />
          {/* amber stripe + L plate */}
          <path d="M30 49h168" stroke="#f5b301" strokeWidth="4" strokeLinecap="round" />
          <rect x="188" y="40" width="14" height="10" rx="2" fill="#e5484d" />
          <text x="195" y="48" textAnchor="middle" fontSize="8" fontWeight="700" fill="#fff" fontFamily="sans-serif">L</text>
          {/* lights */}
          <rect x="196" y="52" width="10" height="5" rx="2" fill="#ffc531" />
          <rect x="14" y="52" width="7" height="5" rx="2" fill="#e5484d" />
          {/* wheels */}
          <g className={styles.wheel} style={{ transformOrigin: "58px 64px" }}>
            <circle cx="58" cy="64" r="14" fill="#0b1324" />
            <circle cx="58" cy="64" r="7" fill="#9aa6b8" />
            <path d="M58 57v14M51 64h14" stroke="#0b1324" strokeWidth="2" />
          </g>
          <g className={styles.wheel} style={{ transformOrigin: "164px 64px" }}>
            <circle cx="164" cy="64" r="14" fill="#0b1324" />
            <circle cx="164" cy="64" r="7" fill="#9aa6b8" />
            <path d="M164 57v14M157 64h14" stroke="#0b1324" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}
