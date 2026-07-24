import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://qrypton.vercel.app";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/mon-espace", "/guide-demarrage", "/paiement", "/api/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
