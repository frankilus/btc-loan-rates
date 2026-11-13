import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Disclaimer } from "@/components/Disclaimer";
import {
  btcDropToLiquidation,
  computeCost,
  formatPct,
  formatPctPoints,
  formatUsd,
} from "@/lib/calc";
import { SITE_URL, getPairsForLender } from "@/lib/compares";
import { LAST_UPDATED, SCENARIO, getLenderBySlug, lenders } from "@/lib/lenders";

export function generateStaticParams() {
  return lenders.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lender = getLenderBySlug(slug);
  if (!lender) return {};
  return {
    title: `${lender.name} Bitcoin-backed loan rates, LTV, and custody — BTC Loan Rates`,
    description: `${lender.name}: ${lender.aprRangeLabel}. ${lender.summary}`,
    alternates: { canonical: `${SITE_URL}/lenders/${lender.slug}` },
  };
}

export default async function LenderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lender = getLenderBySlug(slug);
  if (!lender) notFound();

  const cost = computeCost(lender);
  const alt =
    lender.id === "strike" || lender.id === "arch"
      ? computeCost(lender, SCENARIO.principalUsd, SCENARIO.termMonths, SCENARIO.ltvPct, "maturity")
      : null;
  const drop = btcDropToLiquidation(SCENARIO.ltvPct, lender.liquidationLtvPct);
  const pairs = getPairsForLender(lender.id);

  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <Link href="/lenders" className="text-sm text-amber-400 hover:underline">
        ← All lenders
      </Link>
      <p className="mt-4 text-xs font-medium uppercase tracking-widest text-amber-500/90">
        {lender.rateType} · reviewed {LAST_UPDATED}
      </p>
      <h1 className="mt-2 text-3xl font-semibold text-zinc-50">
        {lender.name} Bitcoin-backed loan
      </h1>
      <p className="mt-3 text-lg text-zinc-300">{lender.aprRangeLabel}</p>
      <p className="mt-3 text-sm leading-relaxed text-zinc-400">{lender.summary}</p>

      <div className="mt-6">
        <Disclaimer compact />
      </div>

      {cost.eligible ? (
        <section className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
          <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            All-in at {SCENARIO.label}
          </h2>
          <p className="mt-2 text-3xl font-semibold tabular-nums text-zinc-50">
            {formatUsd(cost.allInUsd)}
            <span className="ml-2 text-lg font-normal text-zinc-400">
              {formatPct(cost.allInPct)}
            </span>
            {cost.confidence === "estimate" ? (
              <span className="ml-3 align-middle text-xs font-medium uppercase tracking-wide text-amber-400">
                Estimate
              </span>
            ) : null}
          </p>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <div>
              <dt className="text-zinc-500">Interest</dt>
              <dd className="tabular-nums text-zinc-100">{formatUsd(cost.interestUsd)}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Fees</dt>
              <dd className="tabular-nums text-zinc-100">
                {formatUsd(cost.feeUsd + cost.otherUsd)}
              </dd>
            </div>
            <div>
              <dt className="text-zinc-500">Cash received</dt>
              <dd className="tabular-nums text-zinc-100">{formatUsd(cost.cashReceived)}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Published APR</dt>
              <dd className="tabular-nums text-zinc-100">
                {cost.publishedAprPct != null ? formatPctPoints(cost.publishedAprPct) : "—"}
              </dd>
            </div>
          </dl>
          {cost.confidenceNote ? (
            <p className="mt-3 text-xs text-amber-400/90">{cost.confidenceNote}</p>
          ) : null}
          {cost.notes.map((n) => (
            <p key={n} className="mt-2 text-xs text-zinc-500">
              {n}
            </p>
          ))}
          {alt && alt.eligible && Math.abs(alt.allInUsd - cost.allInUsd) > 0.5 ? (
            <p className="mt-3 text-sm text-zinc-400">
              Payment at maturity: {formatUsd(alt.allInUsd)} (
              {alt.publishedAprPct != null ? formatPctPoints(alt.publishedAprPct) : formatPct(alt.allInPct)}{" "}
              APR) — higher because interest is deferred.
            </p>
          ) : null}
        </section>
      ) : (
        <section className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 text-sm text-zinc-300">
          <p>{cost.ineligibleReason ?? lender.eligibleAt10kNote}</p>
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-lg font-medium text-zinc-100">Published rate tiers</h2>
        {lender.tiers.length ? (
          <div className="mt-3 overflow-x-auto rounded-xl border border-zinc-800">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/80 text-xs uppercase tracking-wide text-zinc-400">
                  <th className="px-3 py-2">Tier</th>
                  <th className="px-3 py-2">Interest</th>
                  <th className="px-3 py-2">APR</th>
                  <th className="px-3 py-2">Origination</th>
                  <th className="px-3 py-2">Timing</th>
                </tr>
              </thead>
              <tbody>
                {lender.tiers.map((t, i) => (
                  <tr key={i} className="border-b border-zinc-800/70 last:border-0 text-zinc-300">
                    <td className="px-3 py-2">
                      {t.label ??
                        `${formatUsd(t.minAmountUsd, 0)}${t.maxAmountUsd != null ? `–${formatUsd(t.maxAmountUsd, 0)}` : "+"}`}
                    </td>
                    <td className="px-3 py-2 tabular-nums">
                      {formatPctPoints(t.interestPct)}
                      {t.interestIsFloor ? " floor" : ""}
                      {t.dailyCompound ? " (daily compound)" : ""}
                    </td>
                    <td className="px-3 py-2 tabular-nums">
                      {t.publishedAprPct != null ? formatPctPoints(t.publishedAprPct) : "—"}
                    </td>
                    <td className="px-3 py-2 tabular-nums">
                      {t.originationPct === 0 ? "None" : formatPctPoints(t.originationPct)}
                      {t.capitalChargePct ? ` + ${t.capitalChargePct}% capital charge` : ""}
                    </td>
                    <td className="px-3 py-2 capitalize">{t.paymentTiming}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-3 text-sm text-zinc-400">
            No published rate card. {lender.aprRangeLabel}
          </p>
        )}
      </section>

      <section className="mt-10 grid gap-6 text-sm leading-relaxed text-zinc-300 sm:grid-cols-2">
        <div>
          <h2 className="text-lg font-medium text-zinc-100">LTV and liquidation</h2>
          <dl className="mt-3 space-y-2">
            <Row k="Typical / max starting LTV" v={`${lender.typicalLtvPct}% typical, ${lender.maxLtvPct}% max`} />
            <Row k="Warning" v={lender.warningLtvPct != null ? `${lender.warningLtvPct}% LTV` : "Not separately published"} />
            <Row k="Margin call" v={lender.marginCallLtvPct != null ? `${lender.marginCallLtvPct}% LTV` : "Not separately published"} />
            <Row k="Cure window" v={lender.marginCallWindow ?? "—"} />
            <Row
              k="Liquidation"
              v={
                lender.liquidationLtvPct != null
                  ? `${lender.liquidationLtvPct}% LTV (${lender.liquidationType})`
                  : `Not published (${lender.liquidationType})`
              }
            />
            <Row
              k="BTC drop to liquidation from 50% LTV"
              v={drop != null ? formatPct(drop, 1) : "Cannot compute without a published threshold"}
            />
            <Row k="Liquidation fee" v={lender.liquidationFee} />
          </dl>
        </div>
        <div>
          <h2 className="text-lg font-medium text-zinc-100">Terms and eligibility</h2>
          <dl className="mt-3 space-y-2">
            <Row k="Loan size" v={lender.minLoanNote} />
            <Row k="Term" v={lender.termsLabel} />
            <Row k="Origination" v={lender.originationFeeLabel} />
            <Row k="Other fees" v={lender.otherFees} />
            <Row k="US availability" v={lender.usAvailability} />
            <Row k="KYC" v={lender.kyc} />
          </dl>
        </div>
      </section>

      <section className="mt-10 text-sm leading-relaxed text-zinc-300">
        <h2 className="text-lg font-medium text-zinc-100">Custody and rehypothecation</h2>
        <p className="mt-3">{lender.custodyDetail}</p>
        <p className="mt-3">{lender.rehypothecationDetail}</p>
      </section>

      {lender.unverified.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-lg font-medium text-zinc-100">Unverified on this check</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-400">
            {lender.unverified.map((u) => (
              <li key={u}>{u}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-10">
        <h2 className="text-lg font-medium text-zinc-100">Official sources</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {lender.sources.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                className="text-amber-400 hover:underline"
                rel="noopener noreferrer"
                target="_blank"
              >
                {s.label}
              </a>
              <span className="text-zinc-500"> — accessed {s.accessed} (ET)</span>
            </li>
          ))}
        </ul>
      </section>

      {pairs.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-lg font-medium text-zinc-100">Compare {lender.name}</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {pairs.map((p) => {
              const other = p.a.id === lender.id ? p.b : p.a;
              return (
                <li key={p.slug}>
                  <Link
                    href={`/compare/${p.slug}`}
                    className="block rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-sm text-zinc-200 hover:border-amber-500/40 hover:text-amber-400"
                  >
                    {lender.name} vs {other.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <p className="mt-10 text-sm">
        <Link href="/calculator" className="text-amber-400 hover:underline">
          Run this lender in the calculator →
        </Link>
      </p>
    </article>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-zinc-500">{k}</dt>
      <dd className="text-zinc-200">{v}</dd>
    </div>
  );
}
