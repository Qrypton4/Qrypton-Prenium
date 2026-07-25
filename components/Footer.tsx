import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-line px-6 md:px-12 py-14">
      <div className="max-w-[1160px] mx-auto flex justify-between items-center flex-wrap gap-3">
        <p className="text-[12.5px] text-muted-2">© 2026 Qrypton. Tous droits réservés.</p>
        <Link href="/risques" className="text-[12.5px] text-muted-2 hover:text-blue-soft hover:underline">
          Risques et responsabilités
        </Link>
        <p className="font-mono text-[12.5px] text-muted-2">Precision. Discipline. Performance.</p>
      </div>
    </footer>
  );
}
