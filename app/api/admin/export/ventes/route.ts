import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getAllInvoices, getAllClients, toCSV } from "@/lib/adminData";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ ok: false }, { status: auth.status });

  const from = req.nextUrl.searchParams.get("from");
  const to = req.nextUrl.searchParams.get("to");

  const [invoices, clients] = await Promise.all([getAllInvoices(), getAllClients()]);
  const clientByUserId = new Map<string, (typeof clients)[number]>(clients.map((c) => [c.userId, c]));

  const filtered = invoices.filter((i) => {
    const d = i.date.slice(0, 10);
    return (!from || d >= from) && (!to || d <= to);
  });

  const csv = toCSV(
    [
      "Date",
      "Numéro de facture",
      "Client",
      "Email",
      "Offre",
      "Montant",
      "Devise",
      "Statut du paiement",
      "Statut de l'abonnement",
      "ID Stripe",
      "ID interne",
    ],
    filtered.map((i) => {
      const client = clientByUserId.get(i.userId);
      return [
        new Date(i.date).toLocaleDateString("fr-FR"),
        i.stripeInvoiceId,
        i.clientName,
        i.email,
        client?.plan ?? "",
        i.amountEUR.toFixed(2).replace(".", ","),
        "EUR",
        "Payé",
        client?.status ?? "",
        i.stripeInvoiceId,
        i.userId,
      ];
    })
  );

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="ventes_qrypton_${from ?? "debut"}_${to ?? "fin"}.csv"`,
    },
  });
}
