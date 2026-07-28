import Link from "next/link";

export function Card({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`border border-line rounded-2xl bg-bg-2 p-7 ${className}`}>
      {title && (
        <h3 className="text-sm text-muted uppercase tracking-wide mb-5">{title}</h3>
      )}
      {children}
    </div>
  );
}

export function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center mb-3 last:mb-0">
      <span className="text-muted text-sm">{k}</span>
      <span className="font-mono text-white text-sm">{v}</span>
    </div>
  );
}

export function Kpi({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-bg-2 border border-line rounded-xl p-5">
      <div className="text-[11px] text-muted uppercase tracking-wide mb-1.5">{label}</div>
      <div className="font-mono text-lg text-white">{value}</div>
    </div>
  );
}

export function EmptyPage({
  title,
  text,
  cta,
}: {
  title: string;
  text: string;
  cta?: { href: string; label: string };
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-[440px] text-center border border-line rounded-2xl bg-bg-2 p-10">
        <h1 className="font-display text-lg font-semibold mb-3">{title}</h1>
        <p className="text-muted text-sm leading-relaxed mb-6">{text}</p>
        {cta && (
          <Link
            href={cta.href}
            className="inline-block px-5 py-2.5 rounded-lg bg-white text-bg text-sm font-semibold hover:bg-blue-soft transition"
          >
            {cta.label}
          </Link>
        )}
      </div>
    </div>
  );
}
