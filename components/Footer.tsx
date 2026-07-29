import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-line px-6 md:px-12 pt-6 pb-14">
      <div className="max-w-[1160px] mx-auto flex justify-between items-center flex-wrap gap-3">
        <p className="text-[12.5px] text-muted-2">© 2026 Qrypton. Tous droits réservés.</p>
        <Link
  href="/risques"
  className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[12.5px] text-muted-2 transition hover:border-blue-soft hover:bg-white/[0.06] hover:text-white"
>
  🛡️ Risques et responsabilités →
</Link>
        <Link
          href="/mention-legales"
          className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[12.5px] text-muted-2 transition hover:border-blue-soft hover:bg-white/[0.06] hover:text-white"
        >
          📋 Mentions légales →
        </Link>
        <p className="font-mono text-[12.5px] text-muted-2">Precision. Discipline. Performance.</p>
      </div>
    </footer>
  );
}
