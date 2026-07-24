import Link from "next/link";

export default function PathCard({
  href,
  emoji,
  title,
  description,
  recommended,
}: {
  href: string;
  emoji: string;
  title: string;
  description: string;
  recommended?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group relative block border rounded-2xl bg-bg-2 p-8 transition ${
        recommended
          ? "border-blue-soft/60 hover:border-blue-soft shadow-[0_0_28px_-8px_rgba(61,107,255,0.35)] hover:bg-blue/5"
          : "border-line-strong hover:border-blue-soft hover:bg-blue/5"
      }`}
    >
      {recommended && (
        <span className="absolute -top-3 right-4 px-3.5 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wide bg-blue/15 text-blue-soft border border-blue-soft/30 shadow-sm">
          Recommandé
        </span>
      )}
      <div className="w-12 h-12 rounded-xl border border-line-strong bg-blue/5 flex items-center justify-center mb-5 text-xl">
        {emoji}
      </div>
      <h3 className="font-display text-lg font-semibold mb-2.5">{title}</h3>
      <p className="text-muted text-[13.5px] leading-relaxed mb-5">{description}</p>
      <span className="text-blue-soft text-sm font-medium group-hover:underline">
        En savoir plus →
      </span>
    </Link>
  );
}
