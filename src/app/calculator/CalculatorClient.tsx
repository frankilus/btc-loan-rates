"use client";

import { useEffect, useMemo, useState } from "react";
import { computeCost, formatPct, formatPctPoints, formatUsd, rankLenders } from "@/lib/calc";
import { SCENARIO, lenders } from "@/lib/lenders";

const TERM_CHOICES = [3, 6, 12, 18, 24, 36, 60];
const LTV_CHOICES = [30, 40, 50, 60, 70, 75];
const MAX = 25_000_000;

export function CalculatorClient() {
  const [raw, setRaw] = useState(String(SCENARIO.principalUsd));
  const [term, setTerm] = useState<number>(SCENARIO.termMonths);
  const [ltv, setLtv] = useState<number>(SCENARIO.ltvPct);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const a = q.get("amount");
    const t = q.get("term");
    const l = q.get("ltv");
    if (a && Number(a) > 0) setRaw(a);
    if (t && Number(t) > 0) setTerm(Number(t));
    if (l && Number(l) > 0) setLtv(Number(l));
  }, []);

  const amount = Number(raw);
  const valid = Number.isFinite(amount) && amount > 0 && amount <= MAX;

  const ranked = useMemo(() => {
    if (!valid) return [];
    return rankLenders(amount, term, ltv);
  }, [amount, term, ltv, valid]);

  const ineligible = useMemo(() => {
    if (!valid) return [];
    return lenders
      .map((lender) => ({ lender, cost: computeCost(lender, amount, term, ltv) }))
      .filter((r) => !r.cost.eligible);
  }, [amount, term, ltv, valid]);

  const priced = ranked.filter((r) => r.cost.eligible);
  const estimates = priced.filter((r) => r.cost.confidence === "estimate");
  const verified = priced.filter((r) => r.cost.confidence === "verified");

  return (
    <section className="mt-8">
      <form
        className="flex flex-wrap items-end gap-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5"
        onSubmit={(e) => e.preventDefault()}
      >
        <label className="flex flex-col text-sm text-zinc-400">
          Loan amount (USD)
          <div className="mt-1 flex items-center rounded-lg border border-zinc-700 bg-zinc-950 px-3">
            <span className="text-zinc-500">$</span>
            <input
              type="number"
              inputMode="decimal"
              min={1}
              max={MAX}
              step="any"
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              className="w-40 bg-transparent px-2 py-2 text-lg text-zinc-50 outline-none"
              aria-label="Loan amount in US dollars"
            />
          </div>
        </label>
        <label className="flex flex-col text-sm text-zinc-400">
          Term
          <select
            value={term}
            onChange={(e) => setTerm(Number(e.target.value))}
            className="mt-1 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-50"
            aria-label="Loan term in months"
          >
            {TERM_CHOICES.map((m) => (
              <option key={m} value={m}>
                {m} months{m >= 12 ? ` (${m / 12}y)` : ""}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col text-sm text-zinc-400">
          Starting LTV
          <select
            value={ltv}
            onChange={(e) => setLtv(Number(e.target.value))}
            className="mt-1 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-50"
            aria-label="Starting loan-to-value percentage"
          >
            {LTV_CHOICES.map((n) => (
              <option key={n} value={n}>
                {n}%
              </option>
            ))}
          </select>
        </label>
        {valid ? (
          <p className="text-sm text-zinc-400">
            Collateral required at {ltv}% LTV: {formatUsd(amount / (ltv / 100), 0)}
          </p>
        ) : (
          <p className="text-sm text-red-400">Enter an amount between $1 and $25,000,000.</p>
        )}
      </form>

      {valid && verified.length > 0 && (
        <>
          <p className="mt-6 text-base text-zinc-300">
            Cheapest published fixed figure:{" "}
            <strong className="text-amber-400">{verified[0].lender.name}</strong> at{" "}
            {formatUsd(verified[0].cost.allInUsd)} ({formatPct(verified[0].cost.allInPct)}).
            {verified.length > 1 ? (
              <>
                {" "}
                Highest verified in this set: {verified[verified.length - 1].lender.name} at{" "}
                {formatUsd(verified[verified.length - 1].cost.allInUsd)}.
              </>
            ) : null}
          </p>
          <ResultTable rows={priced} />
          {estimates.length > 0 ? (
            <p className="mt-3 text-xs text-zinc-500">
              Rows marked estimate use a variable, marketplace, or assumed input and are not a
              locked quote. See each lender page.
            </p>
          ) : null}
        </>
      )}

      {valid && ineligible.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-medium text-zinc-100">Cannot price this combination</h2>
          <ul className="mt-3 divide-y divide-zinc-800 overflow-hidden rounded-xl border border-zinc-800">
            {ineligible.map((r) => (
              <li key={r.lender.id} className="px-4 py-3 text-sm">
                <a href={`/lenders/${r.lender.slug}`} className="font-medium text-zinc-100 hover:text-amber-400">
                  {r.lender.name}
                </a>
                <span className="mt-1 block text-zinc-500">
                  {r.cost.ineligibleReason ?? r.lender.eligibleAt10kNote}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function ResultTable({
  rows,
}: {
  rows: ReturnType<typeof rankLenders>;
}) {
  return (
    <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-800">
      <table className="w-full min-w-[800px] text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900/80 text-xs uppercase tracking-wide text-zinc-400">
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Lender</th>
            <th className="px-4 py-3">Interest</th>
            <th className="px-4 py-3">Fees</th>
            <th className="px-4 py-3">All-in</th>
            <th className="px-4 py-3">Cash received</th>
            <th className="px-4 py-3">APR / rate</th>
            <th className="px-4 py-3">Details</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.lender.id} className="border-b border-zinc-800/80 last:border-0 text-zinc-200">
              <td className="px-4 py-3 text-zinc-500">{i + 1}</td>
              <td className="px-4 py-3 font-medium">
                {r.lender.name}
                {r.cost.confidence === "estimate" ? (
                  <div className="text-[10px] font-medium uppercase tracking-wide text-amber-400">
                    Estimate
                  </div>
                ) : null}
              </td>
              <td className="px-4 py-3 tabular-nums">{formatUsd(r.cost.interestUsd)}</td>
              <td className="px-4 py-3 tabular-nums">
                {formatUsd(r.cost.feeUsd + r.cost.otherUsd)}
              </td>
              <td className="px-4 py-3 tabular-nums">
                {formatUsd(r.cost.allInUsd)}
                <div className="text-xs text-zinc-500">{formatPct(r.cost.allInPct)}</div>
              </td>
              <td className="px-4 py-3 tabular-nums">{formatUsd(r.cost.cashReceived)}</td>
              <td className="px-4 py-3 tabular-nums">
                {r.cost.publishedAprPct != null
                  ? `${formatPctPoints(r.cost.publishedAprPct)} APR`
                  : `${formatPctPoints(r.cost.interestPct)} interest`}
                {r.cost.tier?.label ? (
                  <div className="text-xs text-zinc-500">{r.cost.tier.label}</div>
                ) : null}
              </td>
              <td className="px-4 py-3">
                <a href={`/lenders/${r.lender.slug}`} className="text-amber-400 hover:underline">
                  Lender page →
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
