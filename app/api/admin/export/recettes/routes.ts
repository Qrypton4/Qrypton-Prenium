import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getAllInvoices, toCSV } from "@/lib/adminData";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ ok: false }, { status: auth.status });

  const from = req.nextUrl.searchParams.get("from");
  const to = req.nextUrl.searchParams.get("to");

  const invoices = await getAllInvoices();
  const filtered = invoices.filter((i) => {
    const d = i.date.slice(0, 10);
    return (!from || d >= from) && (!to || d <= to);
  });

  // Livre des recettes : uniquement les encaissements confirmés (table `invoices`,
  // qui n'est alimentée QUE sur l'événement Stripe "invoice.paid" — les paiements
  // échoués, annulés ou non finalisés n'y figurent jamais).
  const csv = toCSV(
    [
      "Date d'encaissement",
      "Numéro de facture",
      "Nom du client",
      "Email",
      "Description",
      "Montant encaissé",
      "Devise",
      "Prestataire",
      "ID transaction",
    ],
    filtered.map((i) => [
      new Date(i.date).toLocaleDateString("fr-FR"),
      i.stripeInvoiceId,
      i.clientName,
      i.email,
      "Abonnement Qrypton",
      i.amountEUR.toFixed(2).replace(".", ","),
      "EUR",
      "Stripe",
      i.stripeInvoiceId,
    ])
  );

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="livre_recettes_qrypton_${from ?? "debut"}_${to ?? "fin"}.csv"`,
    },
  });
}
