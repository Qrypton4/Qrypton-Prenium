const SALES_OPEN_AT = new Date("2026-09-22T00:00:00+02:00");

function isTestBypass(email: string | null | undefined): boolean {
  const bypassEmail = process.env.SALES_TEST_BYPASS_EMAIL;
  return !!bypassEmail && !!email && email.toLowerCase() === bypassEmail.toLowerCase();
}

export function isSalesOpen(userEmail?: string | null): boolean {
  if (isTestBypass(userEmail)) return true;
  return Date.now() >= SALES_OPEN_AT.getTime();
}

export const SALES_CLOSED_MESSAGE =
  "Les abonnements Qrypton ouvriront officiellement le 22 septembre 2026.";
