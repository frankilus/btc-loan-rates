import Link from "next/link";
import { formatPct, formatPctPoints, formatUsd, type CostBreakdown } from "@/lib/calc";
import type { Lender } from "@/lib/lenders";

export function RankingTable({
  rows,
  showCashReceived = true,
}: {
  rows: { lender: Lender; cost: CostBreakdown }[];
  showCashReceived?: boolean;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800">
      <table className="w-full min-w-[980px] text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900/80 text-xs uppercase tracking-wide text-zinc-400">
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Lender</th>
            <th className="px-4 py-3">All-in / first year</th>
            <th className="px-4 py-3">Published APR</th>
            <th className="px-4 py-3">Interest + fees</th>
            {showCashReceived ? <th className="px-4 py-3">Cash received</th> : null}
            <th className="px-4 py-3">Max LTV</th>
            <th className="px-4 py-3">Liquidation LTV</th>
            <th className="px-4 py-3">Custody / risk</th>
            <th className="px-4 py-3">Details</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.lender.id} className="border-b border-zinc-800/80 last:border-0 align-top text-zinc-200">
              <td className="px-4 py-3 text-zinc-500">{r.cost.eligible ? i + 1 : "—"}</td>
              <td className="px-4 py-3">
                <Link href={`/lenders/${r.lender.slug}`} className="font-medium text-zinc-100 hover:text-amber-400">
                  {r.lender.name}
                </Link>
                <div className="mt-0.5 text-xs text-zinc-500">{r.lender.productName}</div>
              </td>
              <td className="px-4 py-3 tabular-nums">
                {r.cost.eligible ? (
                  <>
                    <div className="font-medium text-zinc-50">{formatUsd(r.cost.allInUsd)}</div>
                    <div className="text-xs text-zinc-500">{formatPct(r.cost.allInPct)}</div>
                    {r.cost.confidence === "estimate" ? (
                      <div className="mt-1 inline-block rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-amber-400">
                        Estimate
                      </div>
                    ) : null}
                  </>
                ) : (
                  <span className="text-zinc-500">Not priced</span>
                )}
              </td>
              <td className="px-4 py-3 tabular-nums">
                {r.cost.publishedAprPct != null ? (
                  <>
                    {formatPctPoints(r.cost.publishedAprPct)}
                    {r.cost.tier?.interestIsFloor ? (
                      <div className="text-xs text-zinc-500">floor; live quote required</div>
                    ) : null}
                  </>
                ) : (
                  <span className="text-zinc-500">See notes</span>
                )}
              </td>
              <td className="px-4 py-3 tabular-nums text-zinc-300">
                {r.cost.eligible ? (
                  <>
                    <div>Int. {formatUsd(r.cost.interestUsd)}</div>
                    <div className="text-xs text-zinc-500">
                      Fee {formatUsd(r.cost.feeUsd)}
                      {r.cost.otherUsd > 0 ? ` + ${formatUsd(r.cost.otherUsd)} other` : ""}
                    </div>
                  </>
                ) : (
                  "—"
                )}
              </td>
              {showCashReceived ? (
                <td className="px-4 py-3 tabular-nums">
                  {r.cost.eligible ? formatUsd(r.cost.cashReceived) : "—"}
                </td>
              ) : null}
              <td className="px-4 py-3 tabular-nums">{r.lender.maxLtvPct}%</td>
              <td className="px-4 py-3 tabular-nums">
                {r.lender.liquidationLtvPct != null ? `${r.lender.liquidationLtvPct}%` : "Not published"}
                <div className="text-xs capitalize text-zinc-500">{r.lender.liquidationType}</div>
              </td>
              <td className="px-4 py-3 text-xs leading-relaxed text-zinc-400">{r.lender.custodyShort}</td>
              <td className="px-4 py-3">
                <Link href={`/lenders/${r.lender.slug}`} className="text-amber-400 hover:underline">
                  Lender page →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function IneligibleTable({
  rows,
}: {
  rows: { lender: Lender; cost: CostBreakdown }[];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900/80 text-xs uppercase tracking-wide text-zinc-400">
            <th className="px-4 py-3">Lender</th>
            <th className="px-4 py-3">Published rate</th>
            <th className="px-4 py-3">Why it’s off this ranking</th>
            <th className="px-4 py-3">Custody / risk</th>
            <th className="px-4 py-3">Details</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.lender.id} className="border-b border-zinc-800/80 last:border-0 align-top text-zinc-200">
              <td className="px-4 py-3">
                <Link href={`/lenders/${r.lender.slug}`} className="font-medium text-zinc-100 hover:text-amber-400">
                  {r.lender.name}
                </Link>
                <div className="mt-0.5 text-xs text-zinc-500">{r.lender.productName}</div>
              </td>
              <td className="px-4 py-3">{r.lender.aprRangeLabel}</td>
              <td className="px-4 py-3 text-zinc-400">{r.lender.eligibleAt10kNote || r.cost.ineligibleReason}</td>
              <td className="px-4 py-3 text-xs leading-relaxed text-zinc-400">{r.lender.custodyShort}</td>
              <td className="px-4 py-3">
                <Link href={`/lenders/${r.lender.slug}`} className="text-amber-400 hover:underline">
                  Lender page →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
