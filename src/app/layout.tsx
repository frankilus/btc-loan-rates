import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { SITE_URL } from "@/lib/compares";
import { SITE_NAME } from "@/lib/lenders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "BTC Loan Rates — True All-In Cost of a US Bitcoin-Backed Loan (2026)",
  description:
    "Compare the true all-in cost of a $10,000, 12-month Bitcoin-backed loan across US lenders: APR, origination, custody, and liquidation risk. Official sources linked, estimates labeled, no affiliate links.",
  openGraph: {
    title: "BTC Loan Rates — The real all-in cost of a Bitcoin-backed loan",
    description:
      "APR plus mandatory fees, with a custody and liquidation-risk column, for US Bitcoin-backed lenders. Official sources, labeled estimates.",
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "BTC Loan Rates — True all-in cost of a Bitcoin-backed loan",
    description:
      "Compare US Bitcoin-backed lenders on all-in first-year cost, custody, and liquidation risk.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      description: "Independent true-cost comparison of US Bitcoin-backed loans. A PYMTW project.",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      inLanguage: "en-US",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-zinc-950 text-zinc-100 antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <header className="border-b border-zinc-800/80">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
            <a href="/" className="text-lg font-semibold tracking-tight text-zinc-50">
              BTC Loan<span className="text-amber-400">Rates</span>
            </a>
            <nav className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-zinc-400">
              <a href="/#ranking" className="hover:text-zinc-100">
                Ranking
              </a>
              <a href="/calculator" className="hover:text-zinc-100">
                Calculator
              </a>
              <a href="/lenders" className="hover:text-zinc-100">
                Lenders
              </a>
              <a href="/compare" className="hover:text-zinc-100">
                Compare
              </a>
              <a href="/rate-changes" className="hover:text-zinc-100">
                Rate changes
              </a>
              <a href="/methodology" className="hover:text-zinc-100">
                Methodology
              </a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
