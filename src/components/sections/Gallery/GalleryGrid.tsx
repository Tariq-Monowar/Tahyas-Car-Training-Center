"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Gallery.module.css";

type Photo = { src: string; caption: string };

/** Bento photo grid + lightbox (keyboard ← → Esc, swipe on touch, native pinch-zoom). */
export function GalleryGrid({ photos, closeLabel }: { photos: Photo[]; closeLabel: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchX = useRef<number | null>(null);

  const go = useCallback(
    (dir: number) => setIndex((i) => (i === null ? i : (i + dir + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (index !== null && !d.open) d.showModal();
    if (index === null && d.open) d.close();
  }, [index]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, go]);

  const current = index !== null ? photos[index] : null;

  return (
    <>
      <ul className={styles.grid}>
        {photos.map((p, i) => (
          <li key={p.src} className={`${styles.tile} ${i === 0 ? styles.feature : ""}`} data-reveal style={{ "--i": i } as React.CSSProperties}>
            <button type="button" className={`photo ${styles.open}`} onClick={() => setIndex(i)} aria-label={p.caption}>
              <Image src={p.src} alt={p.caption} fill sizes="(min-width: 768px) 33vw, 50vw" quality={70} />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        className={styles.lightbox}
        onClose={() => setIndex(null)}
        onClick={(e) => { if (e.target === e.currentTarget) setIndex(null); }}
        onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touchX.current === null || e.touches.length > 0) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
        aria-label={current?.caption}
      >
        {current && (
          <figure className={styles.figure}>
            <Image src={current.src} alt={current.caption} width={1600} height={1200} sizes="96vw" quality={75} className={styles.big} />
            <figcaption>{current.caption}</figcaption>
          </figure>
        )}
        <button type="button" className={`${styles.lbBtn} ${styles.lbClose}`} onClick={() => setIndex(null)} aria-label={closeLabel}><X /></button>
        {photos.length > 1 && (
          <>
            <button type="button" className={`${styles.lbBtn} ${styles.lbPrev}`} onClick={() => go(-1)} aria-label="Previous"><ChevronLeft /></button>
            <button type="button" className={`${styles.lbBtn} ${styles.lbNext}`} onClick={() => go(1)} aria-label="Next"><ChevronRight /></button>
          </>
        )}
      </dialog>
    </>
  );
}
