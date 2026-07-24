import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://qrypton.vercel.app";
  const routes = ["", "/performance", "/challenge-prop-firm", "/tarifs", "/faq", "/guide-qrypton", "/guide-qrypton/broker", "/guide-qrypton/prop-firm", "/contact", "/connexion", "/inscription", "/cgu", "/confidentialite"];

  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.7,
  }));
}
