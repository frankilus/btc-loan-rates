import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Disclaimer } from "@/components/Disclaimer";
import {
  COMPARE_AMOUNTS,
  btcDropToLiquidation,
  computeCost,
  formatPct,
  formatUsd,
} from "@/lib/calc";
import {
  SITE_URL,
  getAllComparePairs,
  resolveComparePair,
  type ComparePair,
} from "@/lib/compares";
import { LAST_UPDATED, SCENARIO, type Lender } from "@/lib/lenders";

export function generateStaticParams() {
  return getAllComparePairs().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pair = resolveComparePair(slug);
  if (!pair) return {};
  return {
    title: `${pair.a.name} vs ${pair.b.name} Bitcoin-backed loans — BTC Loan Rates`,
    description: `All-in cost, custody, and liquidation risk: ${pair.a.name} vs ${pair.b.name} for a Bitcoin-backed loan. Official sources, labeled estimates.`,
    alternates: { canonical: `${SITE_URL}/compare/${pair.slug}` },
  };
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pair = resolveComparePair(slug);
  if (!pair) notFound();

  return (
    <article className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <Link href="/compare" className="text-sm text-amber-400 hover:underline">
        ← All comparisons
      </Link>
      <h1 className="mt-4 text-3xl font-semibold text-zinc-50">
        {pair.a.name} vs {pair.b.name}
      </h1>
      <p className="mt-3 text-sm text-zinc-400">
        Bitcoin-backed loans compared on true all-in cost, custody, and liquidation risk.
        Rates reviewed {LAST_UPDATED} (America/New_York).
      </p>
      <div className="mt-6">
        <Disclaimer compact />
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-medium text-zinc-100">
          All-in cost at 12 months, 50% LTV
        </h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/80 text-xs uppercase tracking-wide text-zinc-400">
                <th className="px-4 py-3">Loan amount</th>
                <th className="px-4 py-3">{pair.a.name}</th>
                <th className="px-4 py-3">{pair.b.name}</th>
                <th className="px-4 py-3">Difference</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE_AMOUNTS.map((amt) => {
                const ca = computeCost(pair.a, amt, 12, 50);
                const cb = computeCost(pair.b, amt, 12, 50);
                const both = ca.eligible && cb.eligible;
                const diff = both ? ca.allInUsd - cb.allInUsd : null;
                return (
                  <tr key={amt} className="border-b border-zinc-800/70 last:border-0 text-zinc-200">
                    <td className="px-4 py-3 tabular-nums font-medium">{formatUsd(amt, 0)}</td>
                    <Cell cost={ca} />
                    <Cell cost={cb} />
                    <td className="px-4 py-3 tabular-nums text-zinc-400">
                      {diff == null
                        ? "—"
                        : diff === 0
                          ? "Tie"
                          : `${diff < 0 ? pair.a.name : pair.b.name} cheaper by ${formatUsd(Math.abs(diff))}`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        <LenderCard lender={pair.a} />
        <LenderCard lender={pair.b} />
      </section>

      <SideBySide pair={pair} />

      <p className="mt-10 text-sm text-zinc-500">
        Reversed URL{" "}
        <code className="text-zinc-400">
          /compare/{pair.b.id}-vs-{pair.a.id}
        </code>{" "}
        permanently redirects here.
      </p>
    </article>
  );
}

function Cell({ cost }: { cost: ReturnType<typeof computeCost> }) {
  if (!cost.eligible) {
    return (
      <td className="px-4 py-3 text-xs text-zinc-500">
        {cost.ineligibleReason ?? "Not priced"}
      </td>
    );
  }
  return (
    <td className="px-4 py-3 tabular-nums">
      {formatUsd(cost.allInUsd)}
      <div className="text-xs text-zinc-500">
        {formatPct(cost.allInPct)}
        {cost.confidence === "estimate" ? " · estimate" : ""}
      </div>
    </td>
  );
}

function LenderCard({ lender }: { lender: Lender }) {
  const cost = computeCost(lender);
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
      <h3 className="text-lg font-medium text-zinc-50">
        <Link href={`/lenders/${lender.slug}`} className="hover:text-amber-400">
          {lender.name}
        </Link>
      </h3>
      <p className="mt-1 text-sm text-zinc-400">{lender.aprRangeLabel}</p>
      {cost.eligible ? (
        <p className="mt-3 text-sm text-zinc-200">
          {SCENARIO.label}: <strong>{formatUsd(cost.allInUsd)}</strong>
          {cost.confidence === "estimate" ? (
            <span className="ml-2 text-xs uppercase text-amber-400">Estimate</span>
          ) : null}
        </p>
      ) : (
        <p className="mt-3 text-sm text-zinc-400">{cost.ineligibleReason}</p>
      )}
      <Link href={`/lenders/${lender.slug}`} className="mt-3 inline-block text-sm text-amber-400 hover:underline">
        Full {lender.name} page →
      </Link>
    </div>
  );
}

function SideBySide({ pair }: { pair: ComparePair }) {
  const rows: { k: string; a: string; b: string }[] = [
    { k: "Rate type", a: pair.a.rateType, b: pair.b.rateType },
    { k: "Max starting LTV", a: `${pair.a.maxLtvPct}%`, b: `${pair.b.maxLtvPct}%` },
    {
      k: "Liquidation LTV",
      a: pair.a.liquidationLtvPct != null ? `${pair.a.liquidationLtvPct}% (${pair.a.liquidationType})` : `Not published (${pair.a.liquidationType})`,
      b: pair.b.liquidationLtvPct != null ? `${pair.b.liquidationLtvPct}% (${pair.b.liquidationType})` : `Not published (${pair.b.liquidationType})`,
    },
    {
      k: "BTC drop from 50% LTV to liquidation",
      a: dropLabel(pair.a),
      b: dropLabel(pair.b),
    },
    { k: "Origination", a: pair.a.originationFeeLabel, b: pair.b.originationFeeLabel },
    { k: "Term", a: pair.a.termsLabel, b: pair.b.termsLabel },
    { k: "Minimum", a: pair.a.minLoanNote, b: pair.b.minLoanNote },
    { k: "Custody", a: pair.a.custodyShort, b: pair.b.custodyShort },
    { k: "Rehypothecation", a: pair.a.rehypothecationDetail, b: pair.b.rehypothecationDetail },
    { k: "US availability", a: pair.a.usAvailability, b: pair.b.usAvailability },
    { k: "KYC", a: pair.a.kyc, b: pair.b.kyc },
  ];
  return (
    <section className="mt-10">
      <h2 className="text-lg font-medium text-zinc-100">Side by side</h2>
      <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/80 text-xs uppercase tracking-wide text-zinc-400">
              <th className="px-4 py-3"> </th>
              <th className="px-4 py-3">{pair.a.name}</th>
              <th className="px-4 py-3">{pair.b.name}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.k} className="border-b border-zinc-800/70 last:border-0 align-top">
                <th className="px-4 py-3 font-medium text-zinc-400">{r.k}</th>
                <td className="px-4 py-3 text-zinc-200">{r.a}</td>
                <td className="px-4 py-3 text-zinc-200">{r.b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function dropLabel(l: Lender): string {
  const d = btcDropToLiquidation(SCENARIO.ltvPct, l.liquidationLtvPct);
  return d != null ? formatPct(d, 1) : "Cannot compute";
}
