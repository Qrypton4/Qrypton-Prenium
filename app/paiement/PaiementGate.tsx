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
  const [skipped, setSkipped] = useState(false);

  if (step === "declare") {
    return (
      <div className="flex flex-col gap-4">
        <PropFirmDeclarationForm
          redirectPath="/paiement"
          startOpen
          onDone={() => setStep("payment")}
        />
        <button
          onClick={() => {
            setSkipped(true);
            setStep("payment");
          }}
          className="text-muted-2 text-[12.5px] hover:text-white transition text-center"
        >
          Je n&apos;ai pas de compte Prop Firm →
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {skipped && (
        <div className="border border-blue-soft/30 rounded-2xl bg-blue/5 p-4 text-center">
          <p className="text-white text-[13px] font-medium mb-1">
            N&apos;oubliez pas de déclarer votre compte plus tard
          </p>
          <p className="text-muted-2 text-[12px] leading-relaxed">
            Dès que vous aurez un compte Prop Firm, déclarez-le depuis votre espace
            client, onglet Licence — pour que votre capacité d&apos;allocation soit
            prise en compte.
          </p>
        </div>
      )}
      <ConsentForm plan={plan} />
    </div>
  );
}
