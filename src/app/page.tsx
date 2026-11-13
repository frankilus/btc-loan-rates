import type { Metadata } from "next";
import Link from "next/link";
import { Disclaimer } from "@/components/Disclaimer";
import { LiquidationExplainer } from "@/components/LiquidationExplainer";
import { IneligibleTable, RankingTable } from "@/components/RankingTable";
import { rankLenders } from "@/lib/calc";
import { getAllComparePairs } from "@/lib/compares";
import { LAST_UPDATED, SCENARIO, lenders } from "@/lib/lenders";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const hubs = [
  {
    href: "/calculator",
    title: "Loan-cost calculator",
    body: "Any amount, term, and LTV — ranked all-in cost.",
  },
  {
    href: "/lenders",
    title: "Every lender, one page",
    body: "APR tiers, custody, liquidation, US states, and sources.",
  },
  {
    href: "/compare",
    title: "Head-to-head comparisons",
    body: "Lender vs lender at $10k, $50k, and $100k.",
  },
  {
    href: "/methodology",
    title: "Methodology",
    body: "The formula, assumptions, and how estimates are labeled.",
  },
  {
    href: "/rate-changes",
    title: "Rate-change log",
    body: "Append-only record of every rate and policy baseline we track.",
  },
  {
    href: "/#liquidation",
    title: "Liquidation explainer",
    body: "How far bitcoin has to fall before a forced sale.",
  },
];

export default function HomePage() {
  const fixed = rankLenders(SCENARIO.principalUsd, SCENARIO.termMonths, SCENARIO.ltvPct, {
    group: "fixed",
  });
  const variable = rankLenders(SCENARIO.principalUsd, SCENARIO.termMonths, SCENARIO.ltvPct, {
    group: "variable-or-marketplace",
  });
  const excluded = lenders
    .filter((l) => l.scenarioGroup === "not-at-this-size")
    .map((lender) => ({
      lender,
      cost: rankLenders(SCENARIO.principalUsd, SCENARIO.termMonths, SCENARIO.ltvPct, {
        includeIneligible: true,
      }).find((r) => r.lender.id === lender.id)!.cost,
    }));
  const samplePairs = getAllComparePairs().slice(0, 9);
  const cheapest = fixed[0];
  const priciest = fixed[fixed.length - 1];

  return (
    <>
      <section className="relative overflow-hidden border-b border-zinc-800">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(245,158,11,0.12),_transparent_55%)]"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-amber-500/90">
            US Bitcoin-backed loans · All-in cost
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl">
            The true all-in cost of a Bitcoin-backed loan
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-300 sm:text-xl">
            APR plus origination and other mandatory fees, ranked on a transparent{" "}
            {SCENARIO.label} — with custody and liquidation risk in the same table.
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-500">
            Headline “from” rates often apply to a different loan size, LTV, or payment
            schedule than the one you need. We use each lender’s official published schedule,
            cite the page, and label every estimate. No affiliate links.
          </p>
          {cheapest && priciest ? (
            <p className="mt-4 max-w-2xl text-sm text-zinc-300">
              Among published fixed-rate products available at this size,{" "}
              <Link href={`/lenders/${cheapest.lender.slug}`} className="text-amber-400 hover:underline">
                {cheapest.lender.name}
              </Link>{" "}
              is ${cheapest.cost.allInUsd.toFixed(0)} for the year.{" "}
              {priciest.lender.name} is ${priciest.cost.allInUsd.toFixed(0)} — a $
              {(priciest.cost.allInUsd - cheapest.cost.allInUsd).toFixed(0)} difference on the
              same ${SCENARIO.principalUsd.toLocaleString("en-US")} loan.
            </p>
          ) : null}
          <p className="mt-6 text-xs text-zinc-600">
            Rate data last reviewed {LAST_UPDATED} (America/New_York). Not financial advice.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#ranking"
              className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-amber-400"
            >
              View ranking
            </a>
            <Link
              href="/calculator"
              className="rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-200 hover:border-zinc-500"
            >
              Calculator
            </Link>
            <Link
              href="/compare"
              className="rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-200 hover:border-zinc-500"
            >
              Head-to-head
            </Link>
            <Link
              href="/methodology"
              className="rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-200 hover:border-zinc-500"
            >
              How we calculate
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
        <h2 className="sr-only">Explore BTC Loan Rates</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {hubs.map((h) => (
            <li key={h.href}>
              <Link
                href={h.href}
                className="block h-full rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 transition hover:border-amber-500/40"
              >
                <span className="font-medium text-zinc-100">{h.title} →</span>
                <span className="mt-1 block text-sm text-zinc-500">{h.body}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-zinc-500">
          Lender pages:{" "}
          {lenders.map((l, i) => (
            <span key={l.id}>
              {i > 0 && " · "}
              <Link href={`/lenders/${l.slug}`} className="text-amber-400 hover:underline">
                {l.name}
              </Link>
            </span>
          ))}
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        <Disclaimer />
      </section>

      <section id="ranking" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-zinc-50">
              Fixed-rate ranking: {SCENARIO.label}
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-zinc-500">
              All-in is first-year interest plus mandatory origination or capital charges.
              When a lender publishes both monthly and at-maturity APRs, we rank the cheaper
              monthly option and note the other on the lender page. Lava is a revolving line
              of credit modeled as a 12-month full draw; its all-in is labeled an estimate
              because of the capital-charge assumption.
            </p>
          </div>
          <Link href="/methodology" className="text-sm text-amber-400 hover:underline">
            Full methodology →
          </Link>
        </div>
        <RankingTable rows={fixed} />
        <p className="mt-3 text-xs text-zinc-600">
          Published APR is shown as the lender discloses it and may already include
          origination — we do not add that fee a second time. Cash received is lower than
          principal when origination is deducted from disbursement (Arch).
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
        <h2 className="text-2xl font-semibold text-zinc-50">
          Variable and marketplace products
        </h2>
        <p className="mt-2 mb-6 max-w-2xl text-sm text-zinc-500">
          These can look cheaper on a “from” rate, but the figure is not a locked 12-month
          price. They are ranked separately so a floor rate is never treated as a guarantee.
        </p>
        <RankingTable rows={variable} />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
        <h2 className="text-2xl font-semibold text-zinc-50">
          Not available at $10,000 for a typical US individual
        </h2>
        <p className="mt-2 mb-6 max-w-2xl text-sm text-zinc-500">
          These lenders are active in 2026 and are covered in full on their own pages, but
          they do not offer this homepage scenario.
        </p>
        <IneligibleTable rows={excluded} />
      </section>

      <section id="liquidation" className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
        <LiquidationExplainer />
      </section>

      <section className="border-y border-zinc-800 bg-zinc-900/20">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-zinc-50">Head-to-head</h2>
              <p className="mt-1 text-sm text-zinc-500">
                {getAllComparePairs().length} pair pages with all-in cost at $10,000, $50,000
                and $100,000.
              </p>
            </div>
            <Link href="/compare" className="text-sm text-amber-400 hover:underline">
              All comparisons →
            </Link>
          </div>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {samplePairs.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/compare/${p.slug}`}
                  className="block rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-sm text-zinc-200 transition hover:border-amber-500/40 hover:text-amber-400"
                >
                  {p.a.name} vs {p.b.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
