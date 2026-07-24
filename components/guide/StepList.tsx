export default function StepList({ steps }: { steps: string[] }) {
  return (
    <ol className="flex flex-col gap-3">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-3">
          <span className="w-6 h-6 rounded-full bg-blue/10 text-blue-soft text-xs font-semibold flex items-center justify-center shrink-0 font-mono">
            {i + 1}
          </span>
          <span className="text-muted text-[13.5px] leading-relaxed">{step}</span>
        </li>
      ))}
    </ol>
  );
}
