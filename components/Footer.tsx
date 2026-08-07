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
        <div className="flex items-center gap-2">
            <Link
              href="https://www.instagram.com/qrypton.edge"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-line text-muted-2 transition hover:border-blue-soft hover:bg-white/[0.06] hover:text-white"
              aria-label="Instagram Qrypton"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </Link>
            <Link
              href="https://www.facebook.com/share/1CwXQfxMXE/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-line text-muted-2 transition hover:border-blue-soft hover:bg-white/[0.06] hover:text-white"
              aria-label="Facebook Qrypton"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M15 3h-2a5 5 0 0 0-5 5v2H6v4h2v7h4v-7h3l1-4h-4V8a1 1 0 0 1 1-1h3z" />
              </svg>
            </Link>
          </div>
        <p className="font-mono text-[12.5px] text-muted-2">Precision. Discipline. Performance.</p>
      </div>
    </footer>
  );
}
