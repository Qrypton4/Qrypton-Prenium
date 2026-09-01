import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getAllClients, toCSV } from "@/lib/adminData";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ ok: false }, { status: auth.status });

  const clients = await getAllClients();

  const csv = toCSV(
    ["Nom", "Prénom", "Email", "Date d'inscription", "Offre actuelle", "Statut abonnement", "Date de début", "Date de fin"],
    clients.map((c) => [
      c.lastName,
      c.firstName,
      c.email,
      c.signupDate ? new Date(c.signupDate).toLocaleDateString("fr-FR") : "",
      c.plan ?? "",
      c.status ?? "",
      c.startDate ? new Date(c.startDate).toLocaleDateString("fr-FR") : "",
      c.endDate ? new Date(c.endDate).toLocaleDateString("fr-FR") : "",
    ])
  );

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="clients_qrypton_${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
