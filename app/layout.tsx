import "./globals.css";
import type { Metadata, Viewport } from "next";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import InstallPromptAndroid from "@/components/InstallPromptAndroid";
import InstallPromptIOS from "@/components/InstallPromptIOS";
import { PWAInstallProvider } from "@/components/PWAInstallContext";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Qrypton — Trading algorithmique, conçu avec précision.",
  description:
    "Qrypton développe des solutions de trading algorithmique professionnelles. Discipline, précision, gestion du risque, transparence.",
  openGraph: {
    title: "Qrypton — Trading algorithmique, conçu avec précision.",
    description:
      "Solutions de trading algorithmique professionnelles pour Nasdaq, sur MetaTrader 5.",
    images: ["/assets/qrypton-logo-full.png"],
    locale: "fr_FR",
    type: "website",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Qrypton",
  },
};

export const viewport: Viewport = {
  themeColor: "#080B14",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "OPR Edge™",
    applicationCategory: "FinanceApplication",
    operatingSystem: "MetaTrader 5",
    offers: {
      "@type": "Offer",
      price: "79.00",
      priceCurrency: "EUR",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        billingDuration: "P1M",
      },
    },
    provider: {
      "@type": "Organization",
      name: "Qrypton",
      url: process.env.NEXT_PUBLIC_SITE_URL,
    },
  };

  return (
    <html lang="fr">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="grid-bg" />
        <ScrollToTop />
        <ScrollProgressBar />
        <ServiceWorkerRegister />
        <PWAInstallProvider>
          <InstallPromptAndroid />
          <InstallPromptIOS />
          {children}
        </PWAInstallProvider>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
