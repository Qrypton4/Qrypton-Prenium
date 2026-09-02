import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import { requireAdmin } from "@/lib/admin";
import { getAllInvoices } from "@/lib/adminData";

const MONTHS_FR = [
  "01-Janvier", "02-Février", "03-Mars", "04-Avril", "05-Mai", "06-Juin",
  "07-Juillet", "08-Août", "09-Septembre", "10-Octobre", "11-Novembre", "12-Décembre",
];

export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ ok: false }, { status: auth.status });

  const from = req.nextUrl.searchParams.get("from");
  const to = req.nextUrl.searchParams.get("to");

  const invoices = await getAllInvoices();
  const filtered = invoices.filter((i) => {
    const d = i.date.slice(0, 10);
    const inRange = (!from || d >= from) && (!to || d <= to);
    return inRange && !!i.pdfUrl;
  });

  if (filtered.length === 0) {
    return NextResponse.json({ ok: false, message: "no_invoices_in_range" }, { status: 404 });
  }

  const zip = new JSZip();
  const year = new Date(filtered[0].date).getFullYear();
  const root = zip.folder(`Factures_Qrypton_${year}`)!;

  // On récupère chaque PDF réellement disponible sur Stripe — on ne fabrique
  // jamais de facture qui n'existe pas.
  await Promise.all(
    filtered.map(async (inv) => {
      try {
        const res = await fetch(inv.pdfUrl!);
        if (!res.ok) return;
        const buf = await res.arrayBuffer();
        const d = new Date(inv.date);
        const monthFolder = root.folder(MONTHS_FR[d.getMonth()])!;
        const safeName = inv.stripeInvoiceId.replace(/[^a-zA-Z0-9_-]/g, "");
        monthFolder.file(`${safeName}.pdf`, buf);
      } catch {
        // Facture ignorée si le PDF n'a pas pu être récupéré — on ne bloque
        // jamais tout l'export pour un seul document indisponible.
      }
    })
  );

  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

  return new NextResponse(zipBuffer, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="Factures_Qrypton_${from ?? "debut"}_${to ?? "fin"}.zip"`,
    },
  });
}
