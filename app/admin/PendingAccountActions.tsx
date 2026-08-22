"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PendingAccountActions({ accountId }: { accountId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"verify" | "reject" | null>(null);

  async function act(action: "verify" | "reject") {
    setLoading(action);
    try {
      await fetch(`/api/admin/prop-firm/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId }),
      });
      router.refresh();
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => act("verify")}
        disabled={loading !== null}
        className="px-3 py-1.5 rounded-lg bg-positive/20 text-positive text-[12px] font-medium hover:bg-positive/30 transition disabled:opacity-50"
      >
        {loading === "verify" ? "..." : "Valider"}
      </button>
      <button
        onClick={() => act("reject")}
        disabled={loading !== null}
        className="px-3 py-1.5 rounded-lg bg-red-400/20 text-red-400 text-[12px] font-medium hover:bg-red-400/30 transition disabled:opacity-50"
      >
        {loading === "reject" ? "..." : "Refuser"}
      </button>
    </div>
  );
}
