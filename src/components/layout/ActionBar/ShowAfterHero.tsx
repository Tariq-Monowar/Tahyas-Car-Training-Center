"use client";

import { useEffect, useState } from "react";

export function ShowAfterHero({ className, children }: { className: string; children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.75);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className={className} data-show={show || undefined} inert={!show}>
      {children}
    </div>
  );
}
