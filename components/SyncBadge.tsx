export default function SyncBadge({ date }: { date: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-line-strong text-[11px] font-mono text-muted">
      <span className="w-1.5 h-1.5 rounded-full bg-positive" />
      Dernière synchronisation : {new Date(date).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}
    </div>
  );
}
