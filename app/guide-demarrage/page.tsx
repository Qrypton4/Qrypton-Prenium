import Link from "next/link";
import GuideClient from "@/components/guide/GuideClient";

export const metadata = { title: "Guide de démarrage — Qrypton" };

export default function GuideDemarrage() {
  return (
    <>
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-bg/70 backdrop-blur-md border-b border-line">
        <Link href="/mon-espace" className="font-semibold text-[17px]">QRYPTON</Link>
        <Link href="/mon-espace" className="text-sm text-muted hover:text-white transition">← Retour à mon espace</Link>
      </nav>
      <main className="px-6 md:px-12 py-14">
        <GuideClient />
      </main>
    </>
  );
}
