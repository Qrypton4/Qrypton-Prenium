import SiteNavContainer from "@/components/SiteNavContainer";
import { createClient } from "@/lib/supabase-server";
import { isAdminEmail } from "@/lib/admin";
import { getOverviewStats, getAllClients, getAllSubscriptions, getAllInvoices } from "@/lib/adminData";
import GestionClient from "./GestionClient";

export const metadata = { title: "Gestion & Comptabilité — Admin Qrypton" };

export default async function AdminGestion() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) {
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

  const [stats, clients, subscriptions, invoices] = await Promise.all([
    getOverviewStats(),
    getAllClients(),
    getAllSubscriptions(),
    getAllInvoices(),
  ]);

  return (
    <>
      <SiteNavContainer />
      <main className="max-w-[1100px] mx-auto px-6 md:px-12 py-16">
        <div className="mb-10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <span className="font-mono text-xs text-blue-soft uppercase tracking-widest block mb-3">
              Admin
            </span>
            <h1 className="font-display text-2xl font-semibold">🧾 Gestion &amp; Comptabilité</h1>
          </div>
          <a
            href="/admin"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-line-strong text-[13px] font-medium text-muted-2 hover:text-white hover:border-blue-soft transition"
          >
            ← Allocation Prop Firm
          </a>
        </div>

        <GestionClient stats={stats} clients={clients} subscriptions={subscriptions} invoices={invoices} />
      </main>
    </>
  );
}
