/**
 * Road signs as small SVGs (100×100), following the standard shapes used in Bangladesh:
 *  • Prohibitory  — white circle, red border (often a red slash)
 *  • Mandatory    — blue circle, white symbol
 *  • Warning      — white triangle, red border
 *  • Informative  — blue square, white symbol
 */
import type { ReactNode } from "react";

const RED = "#d62828";
const BLUE = "#1f5fbf";
const INK = "#111827";

export type SignKind =
  | "stop" | "no-entry" | "speed-limit" | "no-overtaking" | "no-horn" | "no-right-turn" | "no-left-turn" | "no-u-turn" | "no-parking" | "no-stopping"
  | "keep-left" | "ahead-only" | "turn-left" | "roundabout"
  | "bend-left" | "bend-right" | "pedestrian-crossing" | "school" | "speed-breaker" | "railway-crossing" | "narrow-road" | "signals-ahead" | "two-way" | "crossroads"
  | "parking" | "hospital" | "fuel" | "bus-stop" | "one-way";

/* ── Frames ─────────────────────────────────────────────── */
const Prohib = ({ children, slash }: { children?: ReactNode; slash?: boolean }) => (
  <>
    <circle cx="50" cy="50" r="44" fill="#fff" stroke={RED} strokeWidth="10" />
    {children}
    {slash && <path d="M21 21 79 79" stroke={RED} strokeWidth="9" />}
  </>
);
const Mand = ({ children }: { children: ReactNode }) => (
  <>
    <circle cx="50" cy="50" r="46" fill={BLUE} stroke="#fff" strokeWidth="3" />
    {children}
  </>
);
const Warn = ({ children }: { children: ReactNode }) => (
  <>
    <path d="M50 6 96 90H4Z" fill="#fff" stroke={RED} strokeWidth="8" strokeLinejoin="round" />
    <g transform="translate(0 12) scale(1)">{children}</g>
  </>
);
const Info = ({ children }: { children: ReactNode }) => (
  <>
    <rect x="5" y="5" width="90" height="90" rx="10" fill={BLUE} stroke="#fff" strokeWidth="3" />
    {children}
  </>
);

/* ── Small pictograms ───────────────────────────────────── */
const arrow = (d: string, color = "#fff", w = 9) => <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />;
const Person = ({ x, y, s = 1, c = INK }: { x: number; y: number; s?: number; c?: string }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={c} stroke={c}>
    <circle cx="0" cy="-22" r="5" stroke="none" />
    <path d="M0 -15 L-3 2 M-3 2 L-9 16 M-3 2 L5 16 M-1 -12 L-9 -2 M-1 -12 L8 -4" fill="none" strokeWidth="4" strokeLinecap="round" />
  </g>
);
const CarTop = ({ x, y, c }: { x: number; y: number; c: string }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x="-9" y="-16" width="18" height="32" rx="5" fill={c} />
    <rect x="-6" y="-10" width="12" height="7" rx="2" fill="#fff" opacity=".85" />
  </g>
);

export function RoadSign({ kind, label, size = 88, num = "40" }: { kind: SignKind; label: string; size?: number; num?: string }) {
  let body: ReactNode;
  switch (kind) {
    case "stop":
      body = (
        <>
          <path d="M30 4h40l26 26v40L70 96H30L4 70V30Z" fill={RED} stroke="#fff" strokeWidth="3" />
          <text x="50" y="60" textAnchor="middle" fontSize="27" fontWeight="800" fill="#fff" fontFamily="Arial, sans-serif">STOP</text>
        </>
      );
      break;
    case "no-entry":
      body = (<><circle cx="50" cy="50" r="46" fill={RED} /><rect x="18" y="42" width="64" height="16" rx="2" fill="#fff" /></>);
      break;
    case "speed-limit":
      body = <Prohib><text x="50" y="63" textAnchor="middle" fontSize="36" fontWeight="800" fill={INK} fontFamily="Arial, sans-serif">{num}</text></Prohib>;
      break;
    case "no-overtaking":
      body = <Prohib><CarTop x={36} y={52} c={INK} /><CarTop x={64} y={52} c={RED} /></Prohib>;
      break;
    case "no-horn":
      body = (
        <Prohib slash>
          <path d="M28 44h10l22-12v36L38 56H28Z" fill={INK} />
          <path d="M66 40q6 10 0 20" stroke={INK} strokeWidth="4" fill="none" />
        </Prohib>
      );
      break;
    case "no-right-turn":
      body = <Prohib slash>{arrow("M42 74V46q0-8 8-8h14", INK, 8)}<path d="M60 28l12 10-12 10Z" fill={INK} /></Prohib>;
      break;
    case "no-left-turn":
      body = <Prohib slash>{arrow("M58 74V46q0-8-8-8H36", INK, 8)}<path d="M40 28 28 38l12 10Z" fill={INK} /></Prohib>;
      break;
    case "no-u-turn":
      body = <Prohib slash>{arrow("M60 74V44a10 10 0 0 0-20 0v14", INK, 8)}<path d="M30 54h20L40 68Z" fill={INK} /></Prohib>;
      break;
    case "no-parking":
      body = (<><circle cx="50" cy="50" r="44" fill={BLUE} stroke={RED} strokeWidth="10" /><path d="M21 21 79 79" stroke={RED} strokeWidth="9" /></>);
      break;
    case "no-stopping":
      body = (<><circle cx="50" cy="50" r="44" fill={BLUE} stroke={RED} strokeWidth="10" /><path d="M21 21 79 79M79 21 21 79" stroke={RED} strokeWidth="9" /></>);
      break;
    case "keep-left":
      body = <Mand>{arrow("M64 30 38 62")}<path d="M28 50v22h22Z" fill="#fff" /></Mand>;
      break;
    case "ahead-only":
      body = <Mand>{arrow("M50 78V34")}<path d="M34 40 50 20l16 20Z" fill="#fff" /></Mand>;
      break;
    case "turn-left":
      body = <Mand>{arrow("M60 78V52q0-10-10-10H38")}<path d="M42 28 26 42l16 14Z" fill="#fff" /></Mand>;
      break;
    case "roundabout":
      body = (
        <Mand>
          {[0, 120, 240].map((r) => (
            <g key={r} transform={`rotate(${r} 50 50)`}>
              <path d="M50 26a24 24 0 0 1 20 12" stroke="#fff" strokeWidth="8" fill="none" strokeLinecap="round" />
              <path d="M64 30l12 10-14 4Z" fill="#fff" />
            </g>
          ))}
        </Mand>
      );
      break;
    case "bend-left":
      body = <Warn>{arrow("M56 66V50q0-10-12-16", INK, 7)}<path d="M36 26l14 2-6 12Z" fill={INK} /></Warn>;
      break;
    case "bend-right":
      body = <Warn>{arrow("M44 66V50q0-10 12-16", INK, 7)}<path d="M64 26l-14 2 6 12Z" fill={INK} /></Warn>;
      break;
    case "pedestrian-crossing":
      body = (
        <Warn>
          <path d="M26 68h48" stroke={INK} strokeWidth="3" strokeDasharray="6 4" />
          <Person x={50} y={60} s={1} />
        </Warn>
      );
      break;
    case "school":
      body = <Warn><Person x={42} y={62} s={0.95} /><Person x={60} y={64} s={0.8} /></Warn>;
      break;
    case "speed-breaker":
      body = <Warn><path d="M24 66h14q12-20 24 0h14" stroke={INK} strokeWidth="6" fill="none" strokeLinejoin="round" /></Warn>;
      break;
    case "railway-crossing":
      body = (
        <Warn>
          <path d="M30 66V44h40v22" stroke={INK} strokeWidth="5" fill="none" />
          <path d="M26 44h48M34 36l32 0" stroke={INK} strokeWidth="5" />
          <path d="M38 44v-8M62 44v-8" stroke={INK} strokeWidth="4" />
        </Warn>
      );
      break;
    case "narrow-road":
      body = <Warn><path d="M38 70q0-14 6-20V34M62 70q0-14-6-20V34" stroke={INK} strokeWidth="6" fill="none" /></Warn>;
      break;
    case "signals-ahead":
      body = (
        <Warn>
          <rect x="41" y="26" width="18" height="44" rx="5" fill={INK} />
          <circle cx="50" cy="35" r="5" fill={RED} />
          <circle cx="50" cy="48" r="5" fill="#f5b301" />
          <circle cx="50" cy="61" r="5" fill="#16a34a" />
        </Warn>
      );
      break;
    case "two-way":
      body = (
        <Warn>
          {arrow("M42 70V36", INK, 6)}<path d="M34 42 42 28l8 14Z" fill={INK} />
          {arrow("M58 30v34", INK, 6)}<path d="M50 58l8 14 8-14Z" fill={INK} />
        </Warn>
      );
      break;
    case "crossroads":
      body = <Warn><path d="M50 28v44M30 52h40" stroke={INK} strokeWidth="8" /></Warn>;
      break;
    case "parking":
      body = <Info><text x="50" y="72" textAnchor="middle" fontSize="60" fontWeight="800" fill="#fff" fontFamily="Arial, sans-serif">P</text></Info>;
      break;
    case "hospital":
      body = <Info><rect x="26" y="26" width="48" height="48" rx="4" fill="#fff" /><text x="50" y="66" textAnchor="middle" fontSize="38" fontWeight="800" fill={RED} fontFamily="Arial, sans-serif">H</text></Info>;
      break;
    case "fuel":
      body = (
        <Info>
          <rect x="30" y="26" width="28" height="50" rx="4" fill="#fff" />
          <rect x="35" y="32" width="18" height="12" fill={BLUE} />
          <path d="M58 38h6l4 6v22a4 4 0 0 1-8 0V52" stroke="#fff" strokeWidth="4" fill="none" />
        </Info>
      );
      break;
    case "bus-stop":
      body = (
        <Info>
          <rect x="24" y="28" width="52" height="38" rx="6" fill="#fff" />
          <rect x="30" y="34" width="40" height="14" rx="2" fill={BLUE} />
          <circle cx="34" cy="70" r="5" fill="#fff" /><circle cx="66" cy="70" r="5" fill="#fff" />
        </Info>
      );
      break;
    case "one-way":
      body = <Info>{arrow("M24 50h44")}<path d="M62 36l16 14-16 14Z" fill="#fff" /></Info>;
      break;
  }
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label={label}>
      {body}
    </svg>
  );
}

/** A traffic light drawing; `on` lights one lamp. */
export function TrafficLightSvg({ on, size = 140 }: { on: "red" | "yellow" | "green"; size?: number }) {
  const lamp = (cy: number, color: string, active: boolean) => (
    <g>
      {active && <circle cx="40" cy={cy} r="22" fill={color} opacity=".35" />}
      <circle cx="40" cy={cy} r="15" fill={active ? color : "#3a4252"} />
    </g>
  );
  return (
    <svg viewBox="0 0 80 190" width={size * 0.42} height={size} aria-hidden="true">
      <rect x="14" y="4" width="52" height="150" rx="14" fill="#111827" />
      {lamp(32, "#ef4444", on === "red")}
      {lamp(79, "#f5b301", on === "yellow")}
      {lamp(126, "#22c55e", on === "green")}
      <rect x="35" y="154" width="10" height="34" fill="#4b5563" />
    </svg>
  );
}
