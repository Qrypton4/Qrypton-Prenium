"use client";

import { useRouter, usePathname } from "next/navigation";

const SCROLL_TARGET_KEY = "qrypton_scroll_target";

export default function PricingCTAButton() {
  const router = useRouter();
  const pathname = usePathname();

  function handleClick() {
    if (pathname === "/") {
      document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
    } else {
      sessionStorage.setItem(SCROLL_TARGET_KEY, "pricing");
      router.push("/");
    }
  }

  return (
    <button
      onClick={handleClick}
      className="inline-block px-6 py-3.5 rounded-lg text-[14.5px] font-semibold bg-blue text-white hover:bg-[#5279ff] transition"
    >
      Voir les offres
    </button>
  );
}
