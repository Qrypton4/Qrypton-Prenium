// lib/email-templates.ts
// Templates HTML pour tous les emails automatiques du parcours client.
// Fond clair volontaire (meilleure délivrabilité et lisibilité qu'un email tout en
// sombre), avec les couleurs de marque en accent (bleu #3D6BFF).

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://qrypton.vercel.app";

function wrapper(title: string, bodyHtml: string, ctaLabel?: string, ctaUrl?: string) {
  return `
  <div style="background:#f4f5f7;padding:32px 16px;font-family:-apple-system,Segoe UI,Roboto,sans-serif;">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
     <div style="background:#080B14;padding:24px 32px;display:flex;align-items:center;gap:10px;">
  <img src="${SITE_URL}/assets/qrypton-mark.png" alt="Qrypton" width="24" height="24" style="border-radius:6px;display:block;" />
  <span style="color:#ffffff;font-weight:700;font-size:15px;letter-spacing:0.5px;">QRYPTON</span>
</div>
      <div style="padding:32px;">
        <h1 style="font-size:19px;font-weight:600;color:#111827;margin:0 0 16px;">${title}</h1>
        <div style="font-size:14px;line-height:1.7;color:#4b5563;">${bodyHtml}</div>
        ${
          ctaLabel && ctaUrl
            ? `<div style="margin-top:28px;"><a href="${ctaUrl}" style="display:inline-block;background:#3D6BFF;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 22px;border-radius:8px;">${ctaLabel}</a></div>`
            : ""
        }
      </div>
      <div style="padding:20px 32px;border-top:1px solid #e5e7eb;">
        <span style="font-size:11px;color:#9ca3af;">© ${new Date().getFullYear()} Qrypton. Tous droits réservés.</span>
      </div>
    </div>
  </div>`;
}

export function welcomeEmail(firstName: string) {
  return {
    subject: "Bienvenue chez Qrypton",
    html: wrapper(
      `Bienvenue, ${firstName} !`,
      `<p>Votre compte Qrypton a bien été créé.</p>
       <p>Qrypton développe OPR Edge™, un robot de trading algorithmique 100% automatique,
       conçu pour exécuter une stratégie disciplinée avec une gestion du risque stricte —
       sans que vous ayez besoin d'être trader vous-même.</p>
       <p>Complétez votre compte pour découvrir la performance du robot et, si vous le
       souhaitez, souscrire à OPR Edge™.</p>`,
      "Compléter mon compte",
      `${SITE_URL}/mon-espace`
    ),
  };
}

export function paymentConfirmationEmail(firstName: string, planName: string, amount: string, invoiceUrl?: string) {
  return {
    subject: "Votre abonnement Qrypton est confirmé",
    html: wrapper(
      `Merci, ${firstName} !`,
      `<p>Votre paiement a bien été confirmé.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        <tr><td style="padding:8px 0;color:#6b7280;">Abonnement</td><td style="padding:8px 0;text-align:right;font-weight:600;color:#111827;">${planName}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7280;">Montant</td><td style="padding:8px 0;text-align:right;font-weight:600;color:#111827;">${amount}</td></tr>
      </table>
      ${invoiceUrl ? `<p><a href="${invoiceUrl}" style="color:#3D6BFF;text-decoration:underline;">📄 Télécharger ma facture (PDF)</a></p>` : ""}
      <p><strong>Prochaines étapes :</strong></p>
      <ol style="padding-left:18px;margin:8px 0;">
        <li>Installer MetaTrader 5</li>
        <li>Installer OPR Edge™ (fichier disponible dans votre espace client)</li>
        <li>Suivre le Guide de démarrage, étape par étape</li>
      </ol>
      <p>Notre support reste disponible si vous avez la moindre question.</p>`,
      "Accéder à mon espace client",
      `${SITE_URL}/mon-espace`
    ),
  };
}

export function renewalUpcomingEmail(firstName: string, renewalDate: string, amount: string) {
  return {
    subject: "Votre abonnement Qrypton se renouvelle bientôt",
    html: wrapper(
      `Bonjour ${firstName},`,
      `<p>Votre abonnement OPR Edge™ sera renouvelé le <strong>${renewalDate}</strong>
       pour un montant de <strong>${amount}</strong>.</p>
       <p>Aucune action n'est nécessaire si vous souhaitez continuer à utiliser le robot.
       Vous pouvez gérer ou annuler votre abonnement à tout moment depuis votre espace
       client.</p>`,
      "Gérer mon abonnement",
      `${SITE_URL}/mon-espace`
    ),
  };
}

export function renewalConfirmedEmail(firstName: string, nextBillingDate: string) {
  return {
    subject: "Votre abonnement Qrypton a été renouvelé",
    html: wrapper(
      `Merci, ${firstName} !`,
      `<p>Votre abonnement OPR Edge™ a été renouvelé avec succès.</p>
       <p>Prochain renouvellement : <strong>${nextBillingDate}</strong>.</p>`,
      "Voir mon espace client",
      `${SITE_URL}/mon-espace`
    ),
  };
}

export function paymentFailedEmail(firstName: string) {
  return {
    subject: "Échec du paiement — action requise",
    html: wrapper(
      `Bonjour ${firstName},`,
      `<p>Le paiement de votre abonnement OPR Edge™ n'a pas pu être traité.</p>
       <p>Pour éviter toute interruption de votre licence, merci de mettre à jour votre
       moyen de paiement.</p>`,
      "Mettre à jour mon paiement",
      `${SITE_URL}/api/stripe/portal`
    ),
  };
}

export function abandonedCheckout24hEmail(firstName: string) {
  return {
    subject: "Votre inscription à OPR Edge™ vous attend",
    html: wrapper(
      `Bonjour ${firstName},`,
      `<p>Vous avez commencé votre inscription à OPR Edge™ mais ne l'avez pas finalisée.</p>
       <p>Si vous avez rencontré une difficulté ou avez la moindre question, n'hésitez pas
       à nous contacter — nous répondons rapidement.</p>`,
      "Reprendre mon inscription",
      `${SITE_URL}/tarifs`
    ),
  };
}

export function abandonedCheckout3dEmail(firstName: string) {
  return {
    subject: "Une question avant de rejoindre Qrypton ?",
    html: wrapper(
      `Bonjour ${firstName},`,
      `<p>Nous avons remarqué que vous n'avez pas terminé votre inscription à OPR Edge™.</p>
       <p>Si vous avez des questions sur le fonctionnement du robot, la gestion du risque,
       ou la compatibilité avec votre broker ou votre Prop Firm, notre guide peut vous
       aider — ou vous pouvez nous écrire directement.</p>`,
      "Consulter le Guide Qrypton",
      `${SITE_URL}/guide-qrypton`
    ),
  };
}

export function cancellationEmail(firstName: string) {
  return {
    subject: "Votre abonnement Qrypton a été résilié",
    html: wrapper(
      `Bonjour ${firstName},`,
      `<p>Votre abonnement OPR Edge™ a bien été résilié. Votre licence a été désactivée.</p>
       <p>Vous êtes bien entendu libre de revenir quand vous le souhaitez — votre compte
       reste actif et vos données sont conservées.</p>`,
      "Revenir sur Qrypton",
      `${SITE_URL}/tarifs`
    ),
  };
}

export function checkIn7DaysEmail(firstName: string) {
  return {
    subject: "Comment se passe l'installation d'OPR Edge™ ?",
    html: wrapper(
      `Bonjour ${firstName},`,
      `<p>Cela fait une semaine que vous utilisez OPR Edge™ — nous espérons que
       l'installation s'est bien passée !</p>
       <p>Si vous avez la moindre question, un doute sur un paramètre, ou simplement besoin
       d'aide, notre support est disponible.</p>`,
      "Contacter le support",
      `${SITE_URL}/contact`
    ),
  };
}
