"use client";

import { useState } from "react";
import { ConsentForm } from "./ConsentForm";
import PropFirmDeclarationForm from "@/components/tarifs/PropFirmDeclarationForm";

export function PaiementGate({
  hasDeclaredAccount,
  plan,
}: {
  hasDeclaredAccount: boolean;
  plan: string;
}) {
  const [step, setStep] = useState<"declare" | "payment">(
    hasDeclaredAccount ? "payment" : "declare"
  );

  if (step === "declare") {
    return (
      <div className="flex flex-col gap-4">
        <PropFirmDeclarationForm
          redirectPath="/paiement"
          startOpen
          onDone={() => setStep("payment")}
        />
        <button
          onClick={() => setStep("payment")}
          className="text-muted-2 text-[12.5px] hover:text-white transition text-center"
        >
          Je n&apos;ai pas de compte Prop Firm →
        </button>
      </div>
    );
  }

  return <ConsentForm plan={plan} />;
}
