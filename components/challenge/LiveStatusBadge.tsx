"use client";

import { useEffect, useState } from "react";

type Status = { level: "active" | "closed"; label: string };

function computeStatus(now: Date): Status {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Paris",
    month: "numeric",
    weekday: "short",
    hour: "numeric",
    hourCycle: "h23",
  }).formatToParts(now);

  const get = (type: string) => parts.find((p) => p.type === type)?.value;
  const month = Number(get("month"));
  const weekday = get("weekday"); // "Mon".."Sun"
  const hour = Number(get("hour"));

  // Priorité 1 : pause saisonnière (août à septembre), quel que soit le jour/heure
  if (month === 8 || month === 9) {
    return { level: "closed", label: "Pause saisonnière" };
  }

  // Priorité 2 : marché fermé le week-end (vendredi 23h → dimanche 23h, heure de Paris)
  const isFridayNight = weekday === "Fri" && hour >= 23;
  const isSaturday = weekday === "Sat";
  const isSundayBeforeReopen = weekday === "Sun" && hour < 23;

  if (isFridayNight || isSaturday || isSundayBeforeReopen) {
    return { level: "closed", label: "Marché fermé" };
  }

  return { level: "active", label: "Algorithme actif" };
}

export default function LiveStatusBadge() {
  const [status, setStatus] = useState<Status>(() => computeStatus(new Date()));

  useEffect(() => {
    const update = () => setStatus(computeStatus(new Date()));
    update();
    const interval = setInterval(update, 60000); // vérifie chaque minute
    return () => clearInterval(interval);
  }, []);

  const isActive = status.level === "active";

  return (
    <div>
      <div className="text-[10px] text-muted uppercase tracking-wide mb-1">Statut</div>
      <div className="flex items-center gap-2">
        <span
          className="w-2 h-2 rounded-full transition-colors duration-700"
          style={{ background: isActive ? "#6FE3A5" : "#F87171" }}
        />
        <span
          className="font-mono transition-colors duration-700"
          style={{ color: isActive ? "#6FE3A5" : "#F87171" }}
        >
          {status.label}
        </span>
      </div>
    </div>
  );
}
