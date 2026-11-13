import type { Metadata } from "next";
import Link from "next/link";
import { computeCost, formatPct, formatUsd } from "@/lib/calc";
import { SITE_URL } from "@/lib/compares";
import { LAST_UPDATED, SCENARIO, lenders } from "@/lib/lenders";

export const metadata: Metadata = {
  title: "Bitcoin-backed loan lenders — BTC Loan Rates",
  description:
    "Every US-available Bitcoin-backed lender we track: rates, LTV, custody, liquidation, and official sources.",
  alternates: { canonical: `${SITE_URL}/lenders` },
};

export default function LendersIndexPage() {
  return (
    <article className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <Link href="/" className="text-sm text-amber-400 hover:underline">
        ← Back to ranking
      </Link>
      <h1 className="mt-4 text-3xl font-semibold text-zinc-50">Lenders</h1>
      <p className="mt-3 max-w-2xl text-sm text-zinc-400">
        {lenders.length} Bitcoin-backed lenders reviewed {LAST_UPDATED} (America/New_York)
        against official pages. All-in below is the homepage scenario: {SCENARIO.label}.
      </p>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {lenders.map((l) => {
          const cost = computeCost(l);
          return (
            <li key={l.id}>
              <Link
                href={`/lenders/${l.slug}`}
                className="block h-full rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 transition hover:border-amber-500/40"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="text-lg font-medium text-zinc-50">{l.name}</h2>
                  <span className="text-xs uppercase tracking-wide text-zinc-500">
                    {l.rateType}
                  </span>
                </div>
                <p className="mt-1 text-sm text-amber-400/90">{l.aprRangeLabel}</p>
                <p className="mt-2 text-sm text-zinc-400">
                  {cost.eligible
                    ? `All-in at $10k / 12 mo / 50% LTV: ${formatUsd(cost.allInUsd)} (${formatPct(cost.allInPct)})${cost.confidence === "estimate" ? " · estimate" : ""}`
                    : l.eligibleAt10kNote}
                </p>
                <p className="mt-2 text-xs text-zinc-500">{l.custodyShort}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </article>
  );
}
