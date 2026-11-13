import type { Metadata } from "next";
import Link from "next/link";
import { Disclaimer } from "@/components/Disclaimer";
import { SITE_URL } from "@/lib/compares";
import { LAST_UPDATED, SCENARIO } from "@/lib/lenders";
import { CalculatorClient } from "./CalculatorClient";

export const metadata: Metadata = {
  title: "Bitcoin-backed loan calculator — BTC Loan Rates",
  description:
    "Enter a loan amount, term, and LTV to rank US Bitcoin-backed lenders by true all-in first-year cost. Official sources, labeled estimates.",
  alternates: { canonical: `${SITE_URL}/calculator` },
};

export default function CalculatorPage() {
  return (
    <article className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <Link href="/" className="text-sm text-amber-400 hover:underline">
        ← Back to ranking
      </Link>
      <h1 className="mt-4 text-3xl font-semibold text-zinc-50">
        Bitcoin-backed loan calculator
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
        Set a loan amount, term, and starting LTV. Lenders that publish a matching rate are
        ranked by all-in cost (interest + mandatory fees). Lenders that cannot serve the
        combination — wrong size, term, or LTV — appear below with the reason. Rates last
        reviewed {LAST_UPDATED} (America/New_York). Default is the homepage scenario:{" "}
        {SCENARIO.label}.
      </p>
      <div className="mt-6">
        <Disclaimer compact />
      </div>
      <CalculatorClient />
    </article>
  );
}
