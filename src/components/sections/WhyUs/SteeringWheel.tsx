"use client";

import { useEffect, useRef } from "react";

/** Decorative steering wheel that rotates as the page scrolls. */
export function SteeringWheel({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      el.style.transform = `rotate(${window.scrollY * 0.12}deg)`;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, []);

  return (
    <svg ref={ref} viewBox="0 0 200 200" className={className} aria-hidden="true">
      <circle cx="100" cy="100" r="86" fill="none" stroke="currentColor" strokeWidth="16" />
      <circle cx="100" cy="100" r="20" fill="currentColor" />
      <path d="M18 88c27-9 55-13 82-13s55 4 82 13M86 116l-30 66M114 116l30 66" fill="none" stroke="currentColor" strokeWidth="14" strokeLinecap="round" />
    </svg>
  );
}
