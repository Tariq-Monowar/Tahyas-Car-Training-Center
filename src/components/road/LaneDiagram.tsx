/** Top view of a two-lane road in Bangladesh: keep left, overtake on the right. */
export function LaneDiagram({ you, overtake, oncoming }: { you: string; overtake: string; oncoming: string }) {
  const car = (x: number, y: number, color: string, flip = false) => (
    <g transform={`translate(${x} ${y}) ${flip ? "rotate(180)" : ""}`}>
      <rect x="-16" y="-28" width="32" height="56" rx="9" fill={color} />
      <rect x="-12" y="-18" width="24" height="12" rx="3" fill="#cfe3f2" />
      <rect x="-12" y="10" width="24" height="8" rx="3" fill="#cfe3f2" opacity=".7" />
    </g>
  );
  return (
    <figure style={{ margin: 0 }}>
      <svg viewBox="0 0 320 360" width="100%" style={{ maxWidth: 360, display: "block", margin: "0 auto" }} role="img" aria-label={`${you}. ${overtake}. ${oncoming}.`}>
        <rect x="0" y="0" width="320" height="360" rx="20" fill="#7cc26b" />
        <rect x="60" y="0" width="200" height="360" fill="#5f6572" />
        <path d="M66 0v360M254 0v360" stroke="#fff" strokeWidth="4" />
        <path d="M160 0v360" stroke="#ffd43b" strokeWidth="5" strokeDasharray="22 16" />
        {/* left lane: you (going up), car ahead */}
        {car(110, 250, "#2563eb")}
        {car(110, 110, "#94a3b8")}
        {/* overtaking path on the right */}
        <path d="M110 215 C110 190 205 190 205 150 C205 110 110 100 110 60" stroke="#f5b301" strokeWidth="5" fill="none" strokeDasharray="10 7" strokeLinecap="round" />
        <path d="M100 66 110 46l10 20Z" fill="#f5b301" />
        {/* oncoming (right lane, going down) */}
        {car(210, 300, "#e5484d", true)}
        <path d="M232 250v40" stroke="#fff" strokeWidth="4" markerEnd="" />
        <path d="M226 284 232 298l6-14Z" fill="#fff" />
        <path d="M88 330v-40" stroke="#fff" strokeWidth="4" />
        <path d="M82 296 88 282l6 14Z" fill="#fff" />
      </svg>
      <figcaption style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.5rem 1.25rem", marginTop: "0.75rem", fontSize: "0.92rem" }}>
        <span><b style={{ color: "#2563eb" }}>■</b> {you}</span>
        <span><b style={{ color: "#f5b301" }}>┅</b> {overtake}</span>
        <span><b style={{ color: "#e5484d" }}>■</b> {oncoming}</span>
      </figcaption>
    </figure>
  );
}
