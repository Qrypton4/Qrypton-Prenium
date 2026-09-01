"use client";

import { useMemo, useState } from "react";
import type { ClientRow, SubscriptionRow, InvoiceRow, OverviewStats } from "@/lib/adminData";

function fmtEUR(n: number): string {
  return n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}
function fmtDate(d: string | null): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-FR");
}

function StatusBadge({ status }: { status: string | null }) {
  if (!status) return <span className="text-muted-2 text-[12px]">—</span>;
  const isActive = status === "active" || status === "trialing";
  const isCanceled = status === "canceled";
  const cls = isActive
    ? "text-positive bg-positive/10 border-positive/30"
    : isCanceled
    ? "text-muted-2 bg-white/[0.04] border-line-strong"
    : "text-blue-soft bg-blue/10 border-blue-soft/30";
  return (
    <span className={`inline-block text-[11px] font-mono px-2 py-0.5 rounded-full border ${cls}`}>
      {status}
    </span>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="border border-line-strong rounded-2xl bg-bg-2 p-6">{children}</div>;
}

const TABS = [
  { key: "overview", label: "Vue d'ensemble" },
  { key: "clients", label: "Clients" },
  { key: "subscriptions", label: "Abonnements" },
  { key: "invoices", label: "Factures" },
  { key: "exports", label: "Exports comptables" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function GestionClient({
  stats,
  clients,
  subscriptions,
  invoices,
}: {
  stats: OverviewStats;
  clients: ClientRow[];
  subscriptions: SubscriptionRow[];
  invoices: InvoiceRow[];
}) {
  const [tab, setTab] = useState<TabKey>("overview");

  return (
    <div>
      {/* Navigation par onglets */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-line pb-4">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-[13px] font-medium transition ${
              tab === t.key
                ? "bg-blue text-white"
                : "text-muted-2 hover:text-white hover:bg-white/[0.06]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && <OverviewTab stats={stats} />}
      {tab === "clients" && <ClientsTab clients={clients} />}
      {tab === "subscriptions" && <SubscriptionsTab subscriptions={subscriptions} />}
      {tab === "invoices" && <InvoicesTab invoices={invoices} />}
      {tab === "exports" && <ExportsTab />}
    </div>
  );
}

/* ===================== VUE D'ENSEMBLE ===================== */

function OverviewTab({ stats }: { stats: OverviewStats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <Card>
        <h3 className="text-muted-2 text-[11px] uppercase tracking-wide font-mono mb-4">Clients</h3>
        <div className="flex flex-col gap-2 text-sm">
          <Row label="Total" value={stats.totalClients} />
          <Row label="Abonnement actif" value={stats.activeSubscriptions} highlight />
          <Row label="Annulé" value={stats.canceledSubscriptions} />
          <Row label="Expiré" value={stats.expiredSubscriptions} />
        </div>
      </Card>

      <Card>
        <h3 className="text-muted-2 text-[11px] uppercase tracking-wide font-mono mb-4">Abonnements</h3>
        <div className="flex flex-col gap-2 text-sm">
          <Row label="Actifs" value={stats.activeSubscriptions} highlight />
          <Row label="Annulés" value={stats.canceledSubscriptions} />
          <Row label="Expirés" value={stats.expiredSubscriptions} />
        </div>
      </Card>

      <Card>
        <h3 className="text-muted-2 text-[11px] uppercase tracking-wide font-mono mb-4">
          Chiffre d&apos;affaires
        </h3>
        <div className="flex flex-col gap-2 text-sm">
          <Row label="Ce mois" value={fmtEUR(stats.revenueThisMonthEUR)} highlight />
          <Row label="Cette année" value={fmtEUR(stats.revenueThisYearEUR)} />
          <Row label="Paiements encaissés" value={stats.paymentsCount} />
        </div>
      </Card>

      <div className="sm:col-span-3">
        <p className="text-muted-2 text-[11px] leading-relaxed">
          Le chiffre d&apos;affaires est calculé uniquement à partir des paiements réellement
          encaissés (facture Stripe confirmée) — les paiements échoués, annulés ou non finalisés
          ne sont jamais comptés.
        </p>
      </div>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted">{label}</span>
      <span className={`font-mono ${highlight ? "text-blue-soft font-semibold" : ""}`}>{value}</span>
    </div>
  );
}

/* ===================== CLIENTS ===================== */

function ClientsTab({ clients }: { clients: ClientRow[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "canceled" | "expired">("all");
  const [selected, setSelected] = useState<ClientRow | null>(null);

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        c.firstName.toLowerCase().includes(q) ||
        c.lastName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q);

      const isActive = c.status === "active" || c.status === "trialing";
      const isCanceled = c.status === "canceled";
      const isExpired = !isActive && !isCanceled;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && isActive) ||
        (statusFilter === "canceled" && isCanceled) ||
        (statusFilter === "expired" && isExpired);

      return matchesSearch && matchesStatus;
    });
  }, [clients, search, statusFilter]);

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-5">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par nom, prénom ou email…"
          className="flex-1 min-w-[220px] bg-bg-2 border border-line-strong rounded-lg px-3 py-2 text-[13.5px]"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="bg-bg-2 border border-line-strong rounded-lg px-3 py-2 text-[13.5px]"
        >
          <option value="all">Tous les clients</option>
          <option value="active">Actifs</option>
          <option value="canceled">Annulés</option>
          <option value="expired">Expirés</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-2 text-sm py-10 text-center">Aucun client ne correspond.</p>
      ) : (
        <div className="border border-line-strong rounded-2xl bg-bg-2 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-2 text-[11px] uppercase tracking-wide font-mono border-b border-line">
                <th className="px-5 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Inscription</th>
                <th className="px-4 py-3 font-medium">Offre</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium">Fin</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.userId}
                  onClick={() => setSelected(c)}
                  className="border-b border-line last:border-0 hover:bg-white/[0.03] cursor-pointer transition"
                >
                  <td className="px-5 py-3">{`${c.firstName} ${c.lastName}`.trim() || "—"}</td>
                  <td className="px-4 py-3 text-muted-2">{c.email}</td>
                  <td className="px-4 py-3 text-muted-2">{fmtDate(c.signupDate)}</td>
                  <td className="px-4 py-3 font-mono text-[12px]">{c.plan ?? "—"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-4 py-3 text-muted-2">{fmtDate(c.endDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && <ClientDetailModal client={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

interface ClientDetail {
  email: string;
  firstName: string;
  lastName: string;
  signupDate: string | null;
  stripeCustomerId: string | null;
  subscriptions: Array<{
    id: string;
    plan: string | null;
    status: string | null;
    current_period_end: string | null;
    created_at: string | null;
  }>;
  invoices: Array<{ id: string; date: string; amountEUR: number; pdfUrl: string | null }>;
  licenses: Array<{ license_key: string; status: string | null; mt5_account_login: string | null }>;
}

function ClientDetailModal({ client, onClose }: { client: ClientRow; onClose: () => void }) {
  const [detail, setDetail] = useState<ClientDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useMemo(() => {
    fetch(`/api/admin/client/${client.userId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setDetail(d.client);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [client.userId]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 backdrop-blur-sm p-5"
      onClick={onClose}
    >
      <div
        className="max-w-[640px] w-full max-h-[85vh] overflow-y-auto bg-bg-2 border border-line-strong rounded-2xl p-7 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-2 hover:text-white text-lg"
          aria-label="Fermer"
        >
          ✕
        </button>

        <h3 className="font-display text-lg font-semibold mb-1">
          {`${client.firstName} ${client.lastName}`.trim() || client.email}
        </h3>
        <p className="text-muted-2 text-[12.5px] mb-6">{client.email}</p>

        {loading ? (
          <p className="text-muted-2 text-sm">Chargement…</p>
        ) : !detail ? (
          <p className="text-muted-2 text-sm">Impossible de charger la fiche.</p>
        ) : (
          <div className="flex flex-col gap-6">
            <div>
              <h4 className="text-[11px] uppercase tracking-wide font-mono text-muted-2 mb-2">Compte</h4>
              <div className="grid grid-cols-2 gap-2 text-[13px]">
                <Row label="Inscrit le" value={fmtDate(detail.signupDate)} />
                <Row label="ID Stripe" value={detail.stripeCustomerId ?? "—"} />
              </div>
            </div>

            <div>
              <h4 className="text-[11px] uppercase tracking-wide font-mono text-muted-2 mb-2">Abonnements</h4>
              {detail.subscriptions.length === 0 ? (
                <p className="text-muted-2 text-[13px]">Aucun abonnement.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {detail.subscriptions.map((s) => (
                    <div key={s.id} className="border border-line rounded-lg p-3 text-[13px] flex justify-between items-center">
                      <span className="font-mono">{s.plan}</span>
                      <StatusBadge status={s.status} />
                      <span className="text-muted-2">{fmtDate(s.current_period_end)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h4 className="text-[11px] uppercase tracking-wide font-mono text-muted-2 mb-2">
                Historique des paiements
              </h4>
              {detail.invoices.length === 0 ? (
                <p className="text-muted-2 text-[13px]">Aucun paiement enregistré.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {detail.invoices.map((inv) => (
                    <div key={inv.id} className="border border-line rounded-lg p-3 text-[13px] flex justify-between items-center gap-3">
                      <span className="text-muted-2">{fmtDate(inv.date)}</span>
                      <span className="font-mono">{fmtEUR(inv.amountEUR)}</span>
                      {inv.pdfUrl ? (
                        <a
                          href={inv.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-soft hover:underline text-[12px]"
                        >
                          Voir / Télécharger
                        </a>
                      ) : (
                        <span className="text-muted-2 text-[12px]">—</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {detail.licenses.length > 0 && (
              <div>
                <h4 className="text-[11px] uppercase tracking-wide font-mono text-muted-2 mb-2">Licences</h4>
                <div className="flex flex-col gap-2">
                  {detail.licenses.map((l) => (
                    <div key={l.license_key} className="border border-line rounded-lg p-3 text-[13px] flex justify-between">
                      <span className="font-mono">{l.license_key}</span>
                      <StatusBadge status={l.status} />
                      <span className="text-muted-2">{l.mt5_account_login ?? "—"}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ===================== ABONNEMENTS ===================== */

function SubscriptionsTab({ subscriptions }: { subscriptions: SubscriptionRow[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const statuses = useMemo(
    () => [...new Set(subscriptions.map((s) => s.status).filter(Boolean))] as string[],
    [subscriptions]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return subscriptions.filter((s) => {
      const matchesSearch = !q || s.clientName.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || s.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [subscriptions, search, statusFilter]);

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-5">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un client…"
          className="flex-1 min-w-[220px] bg-bg-2 border border-line-strong rounded-lg px-3 py-2 text-[13.5px]"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-bg-2 border border-line-strong rounded-lg px-3 py-2 text-[13.5px]"
        >
          <option value="all">Tous les statuts</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-2 text-sm py-10 text-center">Aucun abonnement ne correspond.</p>
      ) : (
        <div className="border border-line-strong rounded-2xl bg-bg-2 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-2 text-[11px] uppercase tracking-wide font-mono border-b border-line">
                <th className="px-5 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Offre</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium">Début</th>
                <th className="px-4 py-3 font-medium">Renouvellement / Fin</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b border-line last:border-0">
                  <td className="px-5 py-3">{s.clientName}</td>
                  <td className="px-4 py-3 text-muted-2">{s.email}</td>
                  <td className="px-4 py-3 font-mono text-[12px]">{s.plan ?? "—"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={s.status} />
                  </td>
                  <td className="px-4 py-3 text-muted-2">{fmtDate(s.startDate)}</td>
                  <td className="px-4 py-3 text-muted-2">{fmtDate(s.endDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ===================== FACTURES ===================== */

function InvoicesTab({ invoices }: { invoices: InvoiceRow[] }) {
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("all");

  const months = useMemo(() => {
    const set = new Set(invoices.map((i) => i.date.slice(0, 7)));
    return [...set].sort().reverse();
  }, [invoices]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return invoices.filter((i) => {
      const matchesSearch =
        !q ||
        i.clientName.toLowerCase().includes(q) ||
        i.email.toLowerCase().includes(q) ||
        i.stripeInvoiceId.toLowerCase().includes(q);
      const matchesMonth = month === "all" || i.date.slice(0, 7) === month;
      return matchesSearch && matchesMonth;
    });
  }, [invoices, search, month]);

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-5">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par numéro, nom ou email…"
          className="flex-1 min-w-[220px] bg-bg-2 border border-line-strong rounded-lg px-3 py-2 text-[13.5px]"
        />
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="bg-bg-2 border border-line-strong rounded-lg px-3 py-2 text-[13.5px]"
        >
          <option value="all">Tous les mois</option>
          {months.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-2 text-sm py-10 text-center">Aucune facture ne correspond.</p>
      ) : (
        <div className="border border-line-strong rounded-2xl bg-bg-2 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-2 text-[11px] uppercase tracking-wide font-mono border-b border-line">
                <th className="px-5 py-3 font-medium">Facture</th>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Montant</th>
                <th className="px-4 py-3 font-medium">Document</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => (
                <tr key={i.id} className="border-b border-line last:border-0">
                  <td className="px-5 py-3 font-mono text-[12px]">{i.stripeInvoiceId}</td>
                  <td className="px-4 py-3">{i.clientName}</td>
                  <td className="px-4 py-3 text-muted-2">{i.email}</td>
                  <td className="px-4 py-3 text-muted-2">{fmtDate(i.date)}</td>
                  <td className="px-4 py-3 font-mono">{fmtEUR(i.amountEUR)}</td>
                  <td className="px-4 py-3">
                    {i.pdfUrl ? (
                      <a
                        href={i.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-soft hover:underline text-[12.5px]"
                      >
                        👁️ Voir / ⬇️ Télécharger
                      </a>
                    ) : (
                      <span className="text-muted-2 text-[12px]">Indisponible</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ===================== EXPORTS COMPTABLES ===================== */

function shortcutRange(key: string): { from: string; to: string } {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const iso = (d: Date) => d.toISOString().slice(0, 10);

  switch (key) {
    case "thisMonth":
      return { from: iso(new Date(y, m, 1)), to: iso(new Date(y, m + 1, 0)) };
    case "lastMonth":
      return { from: iso(new Date(y, m - 1, 1)), to: iso(new Date(y, m, 0)) };
    case "thisYear":
      return { from: iso(new Date(y, 0, 1)), to: iso(new Date(y, 11, 31)) };
    case "lastYear":
      return { from: iso(new Date(y - 1, 0, 1)), to: iso(new Date(y - 1, 11, 31)) };
    default:
      return { from: iso(new Date(y, m, 1)), to: iso(now) };
  }
}

function ExportsTab() {
  const [from, setFrom] = useState(() => shortcutRange("thisMonth").from);
  const [to, setTo] = useState(() => shortcutRange("thisMonth").to);

  function applyShortcut(key: string) {
    const r = shortcutRange(key);
    setFrom(r.from);
    setTo(r.to);
  }

  return (
    <div className="flex flex-col gap-8 max-w-[560px]">
      <Card>
        <h3 className="text-[13.5px] font-semibold mb-4">Période</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            ["thisMonth", "Ce mois"],
            ["lastMonth", "Mois dernier"],
            ["thisYear", "Cette année"],
            ["lastYear", "Année dernière"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => applyShortcut(key)}
              className="px-3 py-1.5 rounded-lg border border-line-strong text-[12.5px] text-muted-2 hover:text-white hover:border-blue-soft transition"
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex gap-3 items-center text-[13px]">
          <label className="flex flex-col gap-1">
            <span className="text-muted-2 text-[11px]">Du</span>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="bg-bg border border-line-strong rounded-lg px-2 py-1.5"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-muted-2 text-[11px]">Au</span>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="bg-bg border border-line-strong rounded-lg px-2 py-1.5"
            />
          </label>
        </div>
      </Card>

      <Card>
        <h3 className="text-[13.5px] font-semibold mb-1">Livre des recettes</h3>
        <p className="text-muted-2 text-[12px] mb-4">
          Encaissements confirmés uniquement, format CSV compatible Excel.
        </p>
        <a
          href={`/api/admin/export/recettes?from=${from}&to=${to}`}
          className="inline-block px-5 py-2.5 rounded-lg bg-white text-bg text-[13px] font-semibold hover:bg-blue-soft transition"
        >
          ⬇️ Télécharger le livre des recettes
        </a>
      </Card>

      <Card>
        <h3 className="text-[13.5px] font-semibold mb-1">Toutes les ventes</h3>
        <p className="text-muted-2 text-[12px] mb-4">
          Détail complet (statuts, IDs Stripe) sur la période sélectionnée.
        </p>
        <a
          href={`/api/admin/export/ventes?from=${from}&to=${to}`}
          className="inline-block px-5 py-2.5 rounded-lg border border-line-strong text-[13px] font-semibold hover:border-blue-soft hover:text-white transition"
        >
          ⬇️ Télécharger toutes les ventes
        </a>
      </Card>

      <Card>
        <h3 className="text-[13.5px] font-semibold mb-1">Clients</h3>
        <p className="text-muted-2 text-[12px] mb-4">Export complet de la base clients (hors période).</p>
        <a
          href="/api/admin/export/clients"
          className="inline-block px-5 py-2.5 rounded-lg border border-line-strong text-[13px] font-semibold hover:border-blue-soft hover:text-white transition"
        >
          ⬇️ Exporter les clients
        </a>
      </Card>

      <Card>
        <h3 className="text-[13.5px] font-semibold mb-1">Toutes les factures (ZIP)</h3>
        <p className="text-muted-2 text-[12px] mb-4">
          Génère une archive .zip avec chaque facture PDF disponible sur la période.
        </p>
        <a
          href={`/api/admin/export/factures-zip?from=${from}&to=${to}`}
          className="inline-block px-5 py-2.5 rounded-lg border border-line-strong text-[13px] font-semibold hover:border-blue-soft hover:text-white transition"
        >
          📦 Télécharger toutes les factures
        </a>
      </Card>
    </div>
  );
}
