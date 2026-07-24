// lib/email.ts
// Couche d'envoi d'emails, indépendante du fournisseur.
// Par défaut : Resend (https://resend.com) — simple, bonne intégration Next.js.
// Pour passer à Brevo ou un autre service : ne modifier QUE la fonction sendEmail
// ci-dessous ; aucun appelant (webhooks, routes cron, etc.) n'a besoin de changer.

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "Qrypton <contact.qrypton@gmail.com>";

  if (!apiKey) {
    console.warn(`[email] RESEND_API_KEY manquante — email "${subject}" à ${to} non envoyé (simulation).`);
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html }),
    });

    if (!res.ok) {
      console.error(`[email] Échec d'envoi vers ${to} :`, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error(`[email] Erreur réseau lors de l'envoi vers ${to} :`, err);
    return false;
  }
}

/*
  Pour basculer vers Brevo (ex-Sendinblue) à la place de Resend, remplacer le corps
  de sendEmail() par :

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: { email: "contact.qrypton@gmail.com", name: "Qrypton" },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  Le reste du projet (templates, déclencheurs) n'a besoin d'aucune modification.
*/
