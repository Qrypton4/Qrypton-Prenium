"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const SCROLL_TARGET_KEY = "qrypton_scroll_target";

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    const target = sessionStorage.getItem(SCROLL_TARGET_KEY);
    if (target) {
      sessionStorage.removeItem(SCROLL_TARGET_KEY);
      requestAnimationFrame(() => {
        const el = document.getElementById(target);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }
      });
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
}
