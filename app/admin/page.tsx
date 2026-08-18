import SiteNavContainer from "@/components/SiteNavContainer";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";
import { getAllPropFirmAllocationStatuses } from "@/lib/propFirm";

export const metadata = { title: "Admin — Allocation Prop Firm" };

// Accès restreint par email — pas de système de rôle en base pour le moment.
// À définir dans les variables d'environnement Vercel : ADMIN_EMAIL=ton.email@exemple.com
function isAdmin(email: string | null | undefined): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  return !!adminEmail && !!email && email.toLowerCase() === adminEmail.toLowerCase();
}

type ReservationRow = {
  id: string;
  capital: number;
  status: string;
  created_at: string;
  released_at: string | null;
  user_id: string;
  prop_firm_accounts: { mt5_account: string } | null;
  licenses: { license_key: string } | null;
};

export default async function AdminPropFirm() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) {
    return (
      <>
        <SiteNavContainer />
        <main className="max-w-[600px] mx-auto px-6 py-24 text-center">
          <h1 className="font-display text-xl font-semibold mb-3">Accès refusé</h1>
          <p className="text-muted text-sm">Cette page est réservée à l&apos;administrateur.</p>
        </main>
      </>
    );
  }

  const allocations = await getAllPropFirmAllocationStatuses();

  const { data: reservations } = await supabaseAdmin
    .from("allocation_reservations")
    .select(
      "id, capital, status, created_at, released_at, user_id, prop_firm_accounts(mt5_account), licenses(license_key), prop_firms(slug)"
    )
    .order("created_at", { ascending: false });

  // Résout les emails des clients concernés (Admin API — pas de jointure SQL possible sur auth.users)
  const userIds = [...new Set((reservations ?? []).map((r: any) => r.user_id))];
  const emailByUserId: Record<string, string> = {};
  await Promise.all(
    userIds.map(async (id) => {
      const { data } = await supabaseAdmin.auth.admin.getUserById(id);
      if (data?.user?.email) emailByUserId[id] = data.user.email;
    })
  );

  return (
    <>
      <SiteNavContainer />
      <main className="max-w-[960px] mx-auto px-6 md:px-12 py-16">
        <div className="mb-10">
          <span className="font-mono text-xs text-blue-soft uppercase tracking-widest block mb-3">
            Admin
          </span>
          <h1 className="font-display text-2xl font-semibold">Allocation Prop Firm</h1>
          <p className="text-muted text-sm mt-2">
            Vue en lecture seule. Aucune action possible depuis cette page pour le moment.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {allocations.map((firm) => (
            <div key={firm.slug} className="border border-line-strong rounded-2xl bg-bg-2 p-6">
              <h2 className="font-display text-lg font-semibold mb-4">{firm.name}</h2>
              {firm.allocationMax === null ? (
                <p className="text-muted-2 text-sm">Règle d&apos;allocation non confirmée.</p>
              ) : (
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted">Capacité totale</span>
                    <span className="font-mono">{fmt(firm.allocationMax)} $</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Utilisée</span>
                    <span className="font-mono">{fmt(firm.allocationUsed)} $</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Disponible</span>
                    <span className="font-mono text-blue-soft">
                      {fmt(firm.allocationAvailable ?? 0)} $
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="border border-line-strong rounded-2xl bg-bg-2 overflow-hidden">
          <h2 className="font-display text-base font-semibold px-6 pt-6 pb-4">Réservations</h2>
          {!reservations || reservations.length === 0 ? (
            <p className="text-muted text-sm px-6 pb-6">Aucune réservation pour le moment.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-t border-line text-left text-muted-2 text-[11.5px] uppercase tracking-wide">
                    <th className="px-6 py-3 font-medium">Client</th>
                    <th className="px-4 py-3 font-medium">Prop Firm</th>
                    <th className="px-4 py-3 font-medium">Compte MT5</th>
                    <th className="px-4 py-3 font-medium">Capital</th>
                    <th className="px-4 py-3 font-medium">Statut</th>
                    <th className="px-6 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {(reservations as any[]).map((r) => (
                    <tr key={r.id} className="border-t border-line">
                      <td className="px-6 py-3">{emailByUserId[r.user_id] ?? r.user_id}</td>
                      <td className="px-4 py-3 uppercase text-muted-2">{r.prop_firms?.slug ?? "—"}</td>
                      <td className="px-4 py-3 font-mono">
                        {r.prop_firm_accounts?.mt5_account ?? "—"}
                      </td>
                      <td className="px-4 py-3 font-mono">{fmt(r.capital)} $</td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            r.status === "active" ? "text-positive" : "text-muted-2"
                          }
                        >
                          {r.status === "active" ? "Active" : "Libérée"}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-muted-2">
                        {new Date(r.created_at).toLocaleDateString("fr-FR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function fmt(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(Math.round(n));
}
