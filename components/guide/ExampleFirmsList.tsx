function FirmRow({ name, url, description }: { name: string; url: string; description: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between gap-4 py-4 border-b border-line last:border-0"
    >
      <div className="min-w-0">
        <div className="text-white text-[14px] font-medium mb-0.5">{name}</div>
        <div className="text-muted text-[12.5px] truncate">{description}</div>
      </div>
      <span className="shrink-0 text-blue-soft text-[12.5px] font-medium group-hover:underline whitespace-nowrap">
        Visiter ↗
      </span>
    </a>
  );
}

export default function ExampleFirmsList({
  items,
  note,
}: {
  items: { name: string; url: string; description: string }[];
  note: string;
}) {
  return (
    <div>
      <div>
        {items.map((item) => (
          <FirmRow key={item.name} {...item} />
        ))}
      </div>
      <p className="text-muted-2 text-[11px] leading-relaxed mt-4">{note}</p>
    </div>
  );
}
