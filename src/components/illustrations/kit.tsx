/**
 * Illustration kit — small SVG building blocks in one soft, hand-painted style
 * (Lakshmipur / Bangladesh: paddy fields, coconut trees, tin-roof houses, rickshaws,
 * CNGs, right-hand-drive cars that keep LEFT).
 * Every scene in Scenes.tsx is composed from these.
 */
import type { ReactNode } from "react";

export const C = {
  navy: "#13203a",
  white: "#f8fafc",
  body: "#eef2f7",
  bodyShade: "#c9d3e0",
  glass: "#3b5578",
  tyre: "#1a2233",
  amber: "#f5b301",
  red: "#e5484d",
  skin: "#c98e62",
  skinShade: "#a8714b",
  grass: "#7cc26b",
  grassDark: "#4f9a4a",
  paddy: "#a6d65f",
  tree: "#3f8a4b",
  treeDark: "#2c6b3d",
  road: "#6d7381",
  roadDark: "#565c69",
  mud: "#c9a36b",
};

/** Whole-scene wrapper: fills its box (slice), decorative only. */
export function Scene({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <svg
      viewBox="0 0 800 500"
      preserveAspectRatio="xMidYMid slice"
      width="100%"
      height="100%"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={{ display: "block" }}
    >
      {children}
    </svg>
  );
}

export function Sky({ id, top, bottom }: { id: string; top: string; bottom: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={bottom} />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill={`url(#${id}-sky)`} />
    </>
  );
}

export function Sun({ x, y, r = 34, color = "#fff3c4" }: { x: number; y: number; r?: number; color?: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r * 2.4} fill={color} opacity=".18" />
      <circle cx={x} cy={y} r={r * 1.5} fill={color} opacity=".3" />
      <circle cx={x} cy={y} r={r} fill={color} />
    </g>
  );
}

/** Soft cumulus cloud. */
export function Cloud({ x, y, s = 1, o = 0.95 }: { x: number; y: number; s?: number; o?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <ellipse cx="0" cy="18" rx="78" ry="16" fill="#dbe9f5" />
      <circle cx="-42" cy="6" r="22" fill="#fff" />
      <circle cx="-12" cy="-10" r="32" fill="#fff" />
      <circle cx="24" cy="-4" r="26" fill="#fff" />
      <circle cx="52" cy="8" r="18" fill="#fff" />
      <ellipse cx="0" cy="12" rx="72" ry="14" fill="#fff" />
    </g>
  );
}

export function Birds({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} fill="none" stroke="#3a4a63" strokeWidth="2" strokeLinecap="round" opacity=".55">
      <path d="M0 0q6-6 12 0q6-6 12 0" />
      <path d="M30 -14q5-5 10 0q5-5 10 0" />
      <path d="M-22 -18q4-4 8 0q4-4 8 0" />
    </g>
  );
}

/** Distant, bumpy tree line on the horizon. */
export function TreeLine({ y, color = C.treeDark, o = 1 }: { y: number; color?: string; o?: number }) {
  let d = `M0 ${y + 30} L0 ${y}`;
  for (let x = 0; x <= 800; x += 40) d += ` q20 ${-18 - (x % 80 === 0 ? 10 : 0)} 40 0`;
  d += ` L800 ${y + 30} Z`;
  return <path d={d} fill={color} opacity={o} />;
}

/** Coconut tree. (x,y) = base of trunk. */
export function Palm({ x, y, s = 1, lean = 1 }: { x: number; y: number; s?: number; lean?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s * lean} ${s})`}>
      <path d="M0 0 C6 -60 4 -120 22 -170 L30 -168 C14 -118 16 -60 10 0 Z" fill="#8a6a45" />
      <path d="M2 -20h8M3 -45h8M5 -70h8M8 -95h8M12 -120h8M17 -145h8" stroke="#6e5234" strokeWidth="2" />
      <g transform="translate(26 -170)" fill={C.tree}>
        <path d="M0 0 C-30 -18 -62 -8 -84 18 C-56 2 -28 0 0 6 Z" />
        <path d="M0 0 C30 -18 62 -8 84 18 C56 2 28 0 0 6 Z" />
        <path d="M0 0 C-14 -32 -44 -44 -70 -36 C-42 -26 -20 -14 0 4 Z" fill={C.treeDark} />
        <path d="M0 0 C14 -32 44 -44 70 -36 C42 -26 20 -14 0 4 Z" fill={C.treeDark} />
        <path d="M0 0 C-22 10 -40 36 -44 62 C-30 38 -14 22 2 8 Z" />
        <path d="M0 0 C22 10 40 36 44 62 C30 38 14 22 -2 8 Z" />
        <circle cx="-4" cy="6" r="6" fill="#6b4f2a" />
        <circle cx="5" cy="8" r="6" fill="#7a5a30" />
      </g>
    </g>
  );
}

/** Banana / leafy bush. */
export function Bush({ x, y, s = 1, color = C.tree }: { x: number; y: number; s?: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={color}>
      <circle cx="-26" cy="-14" r="20" />
      <circle cx="0" cy="-26" r="26" />
      <circle cx="28" cy="-14" r="20" />
      <rect x="-46" y="-16" width="92" height="16" rx="8" />
    </g>
  );
}

/** Village house with a corrugated tin roof. (x,y) = bottom-left. */
export function Hut({ x, y, s = 1, wall = "#e9d3a8", roof = "#7f97ad" }: { x: number; y: number; s?: number; wall?: string; roof?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="0" y="-46" width="96" height="46" fill={wall} />
      <rect x="38" y="-30" width="18" height="30" fill="#8a6a45" />
      <rect x="10" y="-34" width="16" height="14" fill="#5b7088" />
      <rect x="70" y="-34" width="16" height="14" fill="#5b7088" />
      <path d="M-10 -44 L48 -78 L106 -44 Z" fill={roof} />
      <path d="M2 -50 L48 -76M14 -47 L48 -72M82 -47 L48 -72M94 -50 L48 -76" stroke="#a9bccd" strokeWidth="2" opacity=".7" />
    </g>
  );
}

/** Perspective road from the bottom edge to a vanishing point. */
export function Road({
  vx = 400, vy = 250, bl = 160, br = 640, color = C.road, line = "#fff", edge = "#e8e2d3",
}: { vx?: number; vy?: number; bl?: number; br?: number; color?: string; line?: string; edge?: string }) {
  const mid = (bl + br) / 2;
  return (
    <g>
      <path d={`M${bl - 26} 500 L${vx - 8} ${vy} L${vx + 8} ${vy} L${br + 26} 500 Z`} fill={edge} opacity=".9" />
      <path d={`M${bl} 500 L${vx - 5} ${vy} L${vx + 5} ${vy} L${br} 500 Z`} fill={color} />
      {[0.08, 0.22, 0.4, 0.62, 0.9].map((t, i) => {
        const y1 = vy + (500 - vy) * t;
        const y2 = vy + (500 - vy) * Math.min(t + 0.07 + t * 0.05, 1);
        const x1 = vx + (mid - vx) * t;
        const x2 = vx + (mid - vx) * Math.min(t + 0.07 + t * 0.05, 1);
        return <path key={i} d={`M${x1} ${y1} L${x2} ${y2}`} stroke={line} strokeWidth={2 + t * 7} strokeLinecap="round" opacity=".9" />;
      })}
    </g>
  );
}

/** Paddy field band with soft row stripes. */
export function Paddy({ y, h, color = C.paddy, stripe = "#8fc44f" }: { y: number; h: number; color?: string; stripe?: string }) {
  const rows = [];
  for (let i = 1; i < 6; i++) {
    const yy = y + (h * i * i) / 36;
    rows.push(<path key={i} d={`M0 ${yy} Q400 ${yy - 6} 800 ${yy}`} stroke={stripe} strokeWidth={1 + i * 0.8} fill="none" opacity=".7" />);
  }
  return (
    <g>
      <rect x="0" y={y} width="800" height={h} fill={color} />
      {rows}
    </g>
  );
}

/** White sedan seen from behind (driving away, keeping left). (x,y) = bottom-centre. */
export function CarRear({ x, y, s = 1, plateL = true }: { x: number; y: number; s?: number; plateL?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="2" rx="68" ry="8" fill="#000" opacity=".22" />
      <rect x="-62" y="-14" width="18" height="16" rx="4" fill={C.tyre} />
      <rect x="44" y="-14" width="18" height="16" rx="4" fill={C.tyre} />
      <path d="M-64 -12 L-64 -44 Q-64 -54 -54 -56 L54 -56 Q64 -54 64 -44 L64 -12 Q64 -6 58 -6 L-58 -6 Q-64 -6 -64 -12 Z" fill={C.body} />
      <path d="M-50 -56 L-40 -86 Q-38 -92 -30 -92 L30 -92 Q38 -92 40 -86 L50 -56 Z" fill={C.body} />
      <path d="M-42 -58 L-34 -82 Q-33 -86 -28 -86 L28 -86 Q33 -86 34 -82 L42 -58 Z" fill={C.glass} />
      <path d="M-30 -84 L-10 -84 L-28 -60 L-38 -60 Z" fill="#fff" opacity=".18" />
      <rect x="-60" y="-46" width="22" height="9" rx="3" fill={C.red} />
      <rect x="38" y="-46" width="22" height="9" rx="3" fill={C.red} />
      <rect x="-18" y="-34" width="36" height="14" rx="2" fill="#fff" stroke="#9aa6b8" />
      {plateL && (
        <>
          <rect x="-58" y="-32" width="14" height="14" rx="2" fill="#fff" />
          <text x="-51" y="-21" textAnchor="middle" fontSize="11" fontWeight="800" fill={C.red} fontFamily="sans-serif">L</text>
        </>
      )}
      <path d="M-64 -16 H64" stroke={C.bodyShade} strokeWidth="5" />
    </g>
  );
}

/** White sedan from the side. facing = 1 (right) or -1 (left). (x,y) = bottom-centre. */
export function CarSide({ x, y, s = 1, facing = 1, driver, window: win = C.glass }: { x: number; y: number; s?: number; facing?: 1 | -1; driver?: ReactNode; window?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s * facing} ${s})`}>
      <ellipse cx="0" cy="2" rx="128" ry="8" fill="#000" opacity=".2" />
      <path d="M-124 -22 C-124 -40 -114 -48 -96 -50 L-62 -54 L-30 -82 C-24 -88 -16 -90 -8 -90 L40 -90 C50 -90 56 -88 62 -82 L90 -56 L112 -52 C124 -50 130 -42 130 -30 L130 -18 C130 -12 126 -8 120 -8 L-118 -8 C-122 -8 -124 -12 -124 -16 Z" fill={C.body} />
      <path d="M-52 -56 L-26 -80 C-22 -84 -18 -85 -12 -85 L14 -85 L14 -56 Z" fill={win} />
      <path d="M22 -85 L38 -85 C46 -85 52 -83 57 -78 L80 -56 L22 -56 Z" fill={win} />
      {driver}
      <path d="M-120 -30 H128" stroke={C.amber} strokeWidth="5" />
      <path d="M-118 -14 H126" stroke={C.bodyShade} strokeWidth="6" />
      <rect x="118" y="-44" width="12" height="8" rx="3" fill="#ffd34d" />
      <rect x="-126" y="-44" width="8" height="8" rx="3" fill={C.red} />
      <path d="M18 -54 v40" stroke={C.bodyShade} strokeWidth="2" />
      {[-76, 80].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="-8" r="22" fill={C.tyre} />
          <circle cx={cx} cy="-8" r="11" fill="#b8c2d0" />
          <circle cx={cx} cy="-8" r="4" fill={C.tyre} />
        </g>
      ))}
    </g>
  );
}

/** Cycle rickshaw (side view), facing right. (x,y) = ground. */
export function Rickshaw({ x, y, s = 1, facing = 1 }: { x: number; y: number; s?: number; facing?: 1 | -1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s * facing} ${s})`}>
      <ellipse cx="0" cy="2" rx="60" ry="5" fill="#000" opacity=".18" />
      <circle cx="-34" cy="-22" r="22" fill="none" stroke="#333" strokeWidth="3" />
      <circle cx="48" cy="-16" r="16" fill="none" stroke="#333" strokeWidth="3" />
      <path d="M-34 -22 L10 -30 L48 -16 M10 -30 L26 -62" stroke="#444" strokeWidth="4" fill="none" />
      <rect x="-56" y="-56" width="40" height="12" rx="4" fill="#d6336c" />
      <path d="M-60 -56 C-60 -96 -30 -110 -6 -100 L-14 -56 Z" fill="#1c7ed6" />
      <path d="M-56 -70 H-14M-52 -84 H-12" stroke="#ffd43b" strokeWidth="3" />
      <circle cx="22" cy="-92" r="9" fill={C.skin} />
      <path d="M14 -82 L30 -82 L28 -56 L16 -56 Z" fill="#f1f3f5" />
      <path d="M18 -56 L10 -30 M26 -56 L34 -36" stroke="#495057" strokeWidth="5" strokeLinecap="round" />
      <path d="M26 -76 L42 -66" stroke={C.skin} strokeWidth="4" strokeLinecap="round" />
    </g>
  );
}

/** Green CNG auto-rickshaw (side view), facing right. */
export function Cng({ x, y, s = 1, facing = 1 }: { x: number; y: number; s?: number; facing?: 1 | -1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s * facing} ${s})`}>
      <ellipse cx="0" cy="2" rx="62" ry="6" fill="#000" opacity=".2" />
      <path d="M-58 -16 L-58 -66 C-58 -84 -46 -92 -28 -92 L22 -92 C44 -92 58 -76 62 -54 L64 -16 Z" fill="#2f9e44" />
      <path d="M-60 -90 C-56 -98 -44 -100 -28 -100 L22 -100 C40 -100 50 -96 56 -88 L-60 -88 Z" fill="#212529" />
      <path d="M-40 -82 L-4 -82 L-4 -54 L-40 -54 Z" fill="#2b2b2b" opacity=".85" />
      <path d="M8 -82 L28 -82 C40 -82 48 -72 50 -58 L8 -58 Z" fill="#9fc5e8" />
      <rect x="-60" y="-24" width="126" height="8" rx="4" fill="#212529" />
      <circle cx="-34" cy="-10" r="13" fill={C.tyre} />
      <circle cx="-34" cy="-10" r="5" fill="#adb5bd" />
      <circle cx="46" cy="-10" r="13" fill={C.tyre} />
      <circle cx="46" cy="-10" r="5" fill="#adb5bd" />
      <rect x="58" y="-50" width="8" height="8" rx="2" fill="#ffd34d" />
    </g>
  );
}

/** Colourful Bangladeshi bus seen from behind. */
export function BusRear({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="2" rx="74" ry="7" fill="#000" opacity=".2" />
      <rect x="-70" y="-150" width="140" height="146" rx="12" fill="#e03131" />
      <rect x="-70" y="-60" width="140" height="18" fill="#ffd43b" />
      <path d="M-70 -42 h140" stroke="#1971c2" strokeWidth="8" />
      <rect x="-56" y="-136" width="112" height="56" rx="6" fill="#3b5578" />
      <rect x="-60" y="-28" width="20" height="10" rx="3" fill="#ffd34d" />
      <rect x="40" y="-28" width="20" height="10" rx="3" fill="#ffd34d" />
      <rect x="-66" y="-6" width="26" height="10" rx="3" fill={C.tyre} />
      <rect x="40" y="-6" width="26" height="10" rx="3" fill={C.tyre} />
      <path d="M-50 -150 q50 -14 100 0" fill="#c92a2a" />
    </g>
  );
}

export function Cone({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-14" y="-4" width="28" height="6" rx="2" fill="#e8590c" />
      <path d="M-10 -4 L-3 -40 L3 -40 L10 -4 Z" fill="#fd7e14" />
      <path d="M-7.6 -16 L7.6 -16 L6.2 -24 L-6.2 -24 Z" fill="#fff" />
    </g>
  );
}

/** Simple standing person. hijab = draws a head scarf instead of hair. */
export function Person({
  x, y, s = 1, shirt = "#4dabf7", pants = "#343a40", hair = "#2b2118", hijab, arm = "down",
}: { x: number; y: number; s?: number; shirt?: string; pants?: string; hair?: string; hijab?: string; arm?: "down" | "point" | "thumb" }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="2" rx="22" ry="5" fill="#000" opacity=".18" />
      <path d="M-9 -60 L-11 0 L-2 0 L0 -40 L2 0 L11 0 L9 -60 Z" fill={pants} />
      <path d="M-18 -112 C-18 -122 -10 -126 0 -126 C10 -126 18 -122 18 -112 L14 -58 L-14 -58 Z" fill={shirt} />
      {arm === "down" && <path d="M-16 -108 L-22 -70 M16 -108 L22 -70" stroke={shirt} strokeWidth="9" strokeLinecap="round" />}
      {arm === "point" && (
        <>
          <path d="M-16 -108 L-22 -70" stroke={shirt} strokeWidth="9" strokeLinecap="round" />
          <path d="M16 -110 L46 -124" stroke={shirt} strokeWidth="9" strokeLinecap="round" />
          <circle cx="50" cy="-126" r="5" fill={C.skin} />
        </>
      )}
      {arm === "thumb" && (
        <>
          <path d="M-16 -108 L-22 -70" stroke={shirt} strokeWidth="9" strokeLinecap="round" />
          <path d="M16 -108 L30 -86 L30 -110" stroke={shirt} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <circle cx="30" cy="-114" r="6" fill={C.skin} />
          <path d="M30 -120 v-8" stroke={C.skin} strokeWidth="4" strokeLinecap="round" />
        </>
      )}
      <rect x="-4" y="-134" width="8" height="10" fill={C.skin} />
      {hijab ? (
        <>
          <path d="M-20 -146 C-20 -168 -10 -176 0 -176 C10 -176 20 -168 20 -146 C20 -132 14 -122 0 -118 C-14 -122 -20 -132 -20 -146 Z" fill={hijab} />
          <ellipse cx="0" cy="-150" rx="11" ry="13" fill={C.skin} />
        </>
      ) : (
        <>
          <ellipse cx="0" cy="-150" rx="14" ry="16" fill={C.skin} />
          <path d="M-15 -152 C-16 -168 -6 -170 0 -170 C10 -170 16 -164 15 -152 C10 -160 -8 -160 -15 -152 Z" fill={hair} />
        </>
      )}
      <circle cx="-5" cy="-148" r="1.8" fill="#2b2118" />
      <circle cx="5" cy="-148" r="1.8" fill="#2b2118" />
      <path d="M-5 -139 q5 4 10 0" stroke="#7a4a2c" strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>
  );
}

/** Electric pole with sagging wires — a very Bangladeshi street detail. */
export function Pole({ x, y, h = 180 }: { x: number; y: number; h?: number }) {
  return (
    <g>
      <rect x={x - 3} y={y - h} width="6" height={h} fill="#7d8597" />
      <rect x={x - 22} y={y - h + 10} width="44" height="5" fill="#7d8597" />
    </g>
  );
}
