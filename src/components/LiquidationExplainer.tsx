import { btcDropToLiquidation, formatPct } from "@/lib/calc";
import { SCENARIO } from "@/lib/lenders";

const EXAMPLES: { name: string; start: number; liq: number }[] = [
  { name: "Ledn or Arch (80%)", start: 50, liq: 80 },
  { name: "Strike (85%)", start: 50, liq: 85 },
  { name: "Coinbase (86%)", start: 50, liq: 86 },
  { name: "Figure (90%)", start: 50, liq: 90 },
  { name: "SALT (90.91%)", start: 50, liq: 90.91 },
  { name: "Firefish (95%)", start: 50, liq: 95 },
];

export function LiquidationExplainer() {
  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6">
      <h2 className="text-xl font-semibold text-zinc-50">Liquidation risk, in plain terms</h2>
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-zinc-300">
        <p>
          <strong className="text-zinc-100">Loan-to-value (LTV)</strong> is what you owe
          divided by the current dollar value of the bitcoin you pledged. At a{" "}
          {SCENARIO.ltvPct}% starting LTV, a {SCENARIO.principalUsd.toLocaleString("en-US")}{" "}
          loan requires ${((SCENARIO.principalUsd / SCENARIO.ltvPct) * 100).toLocaleString("en-US")}{" "}
          of bitcoin. If bitcoin’s price falls, LTV rises. If it rises far enough, the lender
          can sell your collateral.
        </p>
        <p>
          Three different numbers matter, and they are not the same: the{" "}
          <strong className="text-zinc-100">maximum starting LTV</strong> (how much you can
          borrow at the open), the <strong className="text-zinc-100">margin-call LTV</strong>{" "}
          (when you are told to add collateral or repay), and the{" "}
          <strong className="text-zinc-100">liquidation LTV</strong> (when a sale can happen).
          A generous starting LTV with a tight liquidation line is more rope and a shorter
          drop.
        </p>
        <p>
          Interest that is added to the balance, rather than paid monthly, quietly raises LTV
          even if bitcoin’s price does not move. A 12-month payment-at-maturity loan starts
          with less buffer than the same loan with monthly interest. This table assumes a
          flat balance, so it slightly overstates the buffer on loans that capitalize interest.
        </p>
      </div>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-xs uppercase tracking-wide text-zinc-500">
              <th className="py-2 pr-3 font-medium">At 50% starting LTV</th>
              <th className="py-2 pr-3 font-medium">Liquidation LTV</th>
              <th className="py-2 font-medium">BTC drop that reaches it</th>
            </tr>
          </thead>
          <tbody>
            {EXAMPLES.map((ex) => {
              const drop = btcDropToLiquidation(ex.start, ex.liq);
              return (
                <tr key={ex.name} className="border-b border-zinc-800/80 last:border-0 text-zinc-300">
                  <td className="py-2 pr-3">{ex.name}</td>
                  <td className="py-2 pr-3 tabular-nums">{ex.liq}%</td>
                  <td className="py-2 tabular-nums text-zinc-100">
                    {drop != null ? formatPct(drop, 1) : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-zinc-500">
        A forced sale of bitcoin is usually a taxable event, even though you did not choose
        to sell. This is not tax advice. Some lenders liquidate only enough collateral to
        restore a safer LTV; others close the whole position. Some liquidate automatically
        the moment the line is crossed. Read the lender page and the loan agreement.
      </p>
    </section>
  );
}
