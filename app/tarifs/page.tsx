import Link from "next/link";
import SiteNavContainer from "@/components/SiteNavContainer";

export const metadata = {
  title: "Tarifs — Qrypton",
  description: "Choisissez la formule adaptée à votre situation : Fonds propres ou Prop Firm.",
};

export default function Tarifs() {
  return (
    <>
      <SiteNavContainer />
      <main className="max-w-[720px] mx-auto px-6 md:px-12 py-16">
        <div className="text-center max-w-[560px] mx-auto mb-14">
          <span className="font-mono text-xs text-blue-soft uppercase tracking-widest block mb-3.5">
            Tarifs
          </span>
          <h1 className="font-display text-[30px] md:text-[38px] font-semibold tracking-tight">
            Comment tradez-vous ?
          </h1>
          <p className="text-muted mt-3.5 text-[15px] leading-relaxed">
            Le même robot OPR Edge™, aux mêmes tarifs — choisissez simplement la formule
            adaptée à votre situation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link
            href="/tarifs/fonds-propres"
            className="block border border-line-strong rounded-2xl bg-bg-2 p-8 hover:border-blue-soft transition"
          >
            <h2 className="font-display text-lg font-semibold mb-2">Fonds propres</h2>
            <p className="text-muted text-[13.5px] leading-relaxed">
              Vous tradez avec votre propre compte de trading.
            </p>
          </Link>

          <Link
            href="/tarifs/prop-firm"
            className="block border border-line-strong rounded-2xl bg-bg-2 p-8 hover:border-blue-soft transition"
          >
            <h2 className="font-display text-lg font-semibold mb-2">Prop Firm</h2>
            <p className="text-muted text-[13.5px] leading-relaxed">
              Vous tradez avec un compte Prop Firm (FTMO).
            </p>
          </Link>
        </div>
      </main>
    </>
  );
}
