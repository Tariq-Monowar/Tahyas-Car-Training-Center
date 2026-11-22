"use client";

import { useEffect } from "react";

/**
 * One tiny observer for the whole page:
 *  • [data-reveal]  → adds .is-visible when scrolled into view (CSS does the animation)
 *  • [data-count]   → animates a number from 0 to its value (keeps Bengali/Latin digits)
 */
const BN = "০১২৩৪৫৬৭৮৯";

function animateCount(el: HTMLElement) {
  const target = Number(el.dataset.count);
  const bn = el.dataset.lang === "bn";
  const format = (n: number) => {
    const s = Math.round(n).toLocaleString("en-IN");
    return bn ? s.replace(/\d/g, (d) => BN[Number(d)]) : s;
  };
  const start = performance.now();
  const dur = 1400;
  const step = (now: number) => {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = format(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export function MotionObserver() {
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.classList.contains("lite");
    const els = document.querySelectorAll<HTMLElement>("[data-reveal], [data-count]");
    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.classList.add("is-visible");
          if (el.dataset.count) animateCount(el);
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
