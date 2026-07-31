"use client";

import { useRouter } from "next/navigation";

export default function PricingCTAButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/tarifs")}
      className="inline-block px-6 py-3.5 rounded-lg text-[14.5px] font-semibold bg-blue text-white hover:bg-[#5279ff] transition"
    >
      Voir les offres
    </button>
  );
}
