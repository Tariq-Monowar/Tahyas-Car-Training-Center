"use client";
/**
 * Native-app style bottom sheet for phones. Opens full — right up to the bottom
 * of the app's top bar — and can be dragged down to half, then closed
 * (or dragged back up). Flick velocity counts.
 * Does nothing on wider screens (the drawer stays a side panel there).
 */
import { useCallback, useEffect, useRef, useState } from "react";

const MOBILE = "(max-width: 760px)";
const HALF = 0.55; // share of the viewport height

export function useBottomSheet(open: boolean, onClose: () => void) {
  const [mobile, setMobile] = useState(false);
  const [snap, setSnap] = useState<"half" | "full">("half");
  const [drag, setDrag] = useState(0);          // px, + = dragged down
  const [dragging, setDragging] = useState(false);
  const [closing, setClosing] = useState(false);
  const [vh, setVh] = useState(800);
  const [topGap, setTopGap] = useState(56); // height of the sticky top bar (incl. notch)
  const start = useRef<{ y: number; t: number } | null>(null);
  const lastMove = useRef(0); // distance of the last drag, so a drag isn't also treated as a tap

  useEffect(() => {
    const mq = window.matchMedia(MOBILE);
    const update = () => {
      setMobile(mq.matches);
      setVh(window.innerHeight);
      const bar = document.querySelector("header");
      if (bar) setTopGap(Math.round(bar.getBoundingClientRect().bottom));
    };
    update();
    mq.addEventListener("change", update);
    window.addEventListener("resize", update);
    return () => { mq.removeEventListener("change", update); window.removeEventListener("resize", update); };
  }, []);

  // every time the sheet opens, start from the half position
  useEffect(() => {
    if (open) { setSnap("full"); setDrag(0); setClosing(false); }
  }, [open]);

  const fullH = Math.max(200, vh - topGap); // sheet top meets the top bar's bottom edge

  const close = useCallback(() => {
    if (!mobile) { onClose(); return; }
    setClosing(true);
    setTimeout(onClose, 220); // let the slide-down finish
  }, [mobile, onClose]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (!mobile) return;
    if ((e.target as HTMLElement).closest("button, a, input, select, textarea")) return; // keep the ✕ etc. clickable
    start.current = { y: e.clientY, t: performance.now() };
    setDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, [mobile]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!start.current) return;
    setDrag(e.clientY - start.current.y);
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (!start.current) return;
    const dy = e.clientY - start.current.y;
    lastMove.current = Math.abs(dy);
    const v = dy / Math.max(1, performance.now() - start.current.t); // px per ms
    start.current = null;
    setDragging(false);
    setDrag(0);

    const down = dy > 70 || v > 0.6;
    const up = dy < -50 || v < -0.6;
    if (up) setSnap("full");
    else if (down) {
      if (snap === "full" && dy < fullH - vh * HALF + 80 && v < 1.2) setSnap("half");
      else close();
    }
  }, [snap, vh, fullH, close]);

  const tap = useCallback(() => {
    if (lastMove.current > 6) { lastMove.current = 0; return; }
    setSnap((s) => (s === "half" ? "full" : "half"));
  }, []);

  if (!mobile) {
    return { mobile, close, sheetStyle: undefined, handleProps: {}, toggle: tap };
  }

  // At rest use CSS viewport units (always the real visible height); px only while dragging.
  const base = snap === "full" ? fullH : HALF * vh;
  const height = dragging
    ? Math.max(120, Math.min(fullH, base - drag))
    : snap === "full" ? `calc(100dvh - ${topGap}px)` : `${HALF * 100}dvh`;
  const sheetStyle: React.CSSProperties = {
    height,
    transform: closing ? "translateY(100%)" : undefined,
    transition: dragging ? "none" : "height 0.28s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.22s ease-in",
  };
  const handleProps = {
    onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp,
    style: { touchAction: "none" as const, cursor: "grab" },
  };
  return { mobile, close, sheetStyle, handleProps, toggle: tap };
}
