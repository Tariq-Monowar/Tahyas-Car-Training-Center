/** Small top-view tiles for road markings. */
export function Marking({ id }: { id: "broken" | "solid" | "double" | "zebra" | "stopline" }) {
  return (
    <svg viewBox="0 0 120 80" width="120" height="80" aria-hidden="true">
      <rect width="120" height="80" rx="10" fill="#5f6572" />
      {id === "broken" && <path d="M60 0v80" stroke="#fff" strokeWidth="5" strokeDasharray="14 10" />}
      {id === "solid" && <path d="M60 0v80" stroke="#fff" strokeWidth="5" />}
      {id === "double" && <path d="M55 0v80M65 0v80" stroke="#ffd43b" strokeWidth="4" />}
      {id === "zebra" && [12, 30, 48, 66, 84, 102].map((x) => <rect key={x} x={x - 6} y="10" width="10" height="60" fill="#fff" />)}
      {id === "stopline" && (
        <>
          <path d="M10 40h100" stroke="#fff" strokeWidth="7" />
          <path d="M60 46v34" stroke="#fff" strokeWidth="3" strokeDasharray="8 6" />
        </>
      )}
    </svg>
  );
}
