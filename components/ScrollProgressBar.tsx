"use client";

import { useEffect, useRef, useState } from "react";

const IDLE_DELAY = 900; // ms sans scroll avant disparition

export default function ScrollProgressBar() {
  const [thumb, setThumb] = useState({ heightPct: 20, topPct: 0 });
  const [visible, setVisible] = useState(false);
  const idleTimeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    function update() {
      const doc = document.documentElement;
      const scrollTop = window.scrollY;
      const scrollableHeight = doc.scrollHeight - doc.clientHeight;

      if (scrollableHeight <= 0) {
        setThumb({ heightPct: 100, topPct: 0 });
      } else {
        const heightPct = Math.max(8, (doc.clientHeight / doc.scrollHeight) * 100);
        const maxTopPct = 100 - heightPct;
        const topPct = (scrollTop / scrollableHeight) * maxTopPct;
        setThumb({ heightPct, topPct });
      }

      setVisible(true);
      clearTimeout(idleTimeout.current);
      idleTimeout.current = setTimeout(() => setVisible(false), IDLE_DELAY);
    }

    update();
    idleTimeout.current = setTimeout(() => setVisible(false), IDLE_DELAY);

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      clearTimeout(idleTimeout.current);
    };
  }, []);

  return (
    <div
      className="fixed top-0 right-0 h-screen w-[3px] bg-line/50 z-[80] pointer-events-none"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 300ms ease" }}
    >
      <div
        className="absolute right-0 w-full bg-blue-soft rounded-full"
        style={{ height: `${thumb.heightPct}%`, top: `${thumb.topPct}%`, transition: "top 60ms linear" }}
      />
    </div>
  );
}
