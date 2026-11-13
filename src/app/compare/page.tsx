import type { Metadata } from "next";
import Link from "next/link";
import { computeCost, formatPct, formatUsd } from "@/lib/calc";
import { SITE_URL, getAllComparePairs } from "@/lib/compares";
import { SCENARIO } from "@/lib/lenders";

export const metadata: Metadata = {
  title: "Compare Bitcoin-backed lenders — BTC Loan Rates",
  description:
    "Head-to-head all-in cost comparisons of US Bitcoin-backed loan lenders at $10,000, $50,000 and $100,000.",
  alternates: { canonical: `${SITE_URL}/compare` },
};

export default function CompareIndexPage() {
  const pairs = getAllComparePairs();
  return (
    <article className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <Link href="/" className="text-sm text-amber-400 hover:underline">
        ← Back to ranking
      </Link>
      <h1 className="mt-4 text-3xl font-semibold text-zinc-50">Head-to-head comparisons</h1>
      <p className="mt-3 max-w-2xl text-sm text-zinc-400">
        {pairs.length} pair pages. Each one shows all-in cost at $10,000, $50,000 and
        $100,000 for a 12-month loan at 50% LTV, plus custody and liquidation side by side.
        Reversed URLs (B vs A) redirect to the canonical A vs B page.
      </p>
      <ul className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {pairs.map((p) => {
          const ca = computeCost(p.a);
          const cb = computeCost(p.b);
          return (
            <li key={p.slug}>
              <Link
                href={`/compare/${p.slug}`}
                className="block rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-4 transition hover:border-amber-500/40"
              >
                <span className="font-medium text-zinc-100">
                  {p.a.name} vs {p.b.name}
                </span>
                <span className="mt-1 block text-xs text-zinc-500">
                  {SCENARIO.label}:{" "}
                  {ca.eligible ? formatUsd(ca.allInUsd) : "n/a"} vs{" "}
                  {cb.eligible ? formatUsd(cb.allInUsd) : "n/a"}
                  {ca.eligible && cb.eligible
                    ? ` · ${formatPct(Math.abs(ca.allInPct - cb.allInPct))} gap`
                    : ""}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </article>
  );
}
