import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/Disclaimer";
import { computeCost, formatPct, formatUsd, rankLenders } from "@/lib/calc";
import { SITE_URL } from "@/lib/compares";
import { LAST_UPDATED, SCENARIO, getLender } from "@/lib/lenders";

export const metadata: Metadata = {
  title: "Methodology — BTC Loan Rates",
  description:
    "How BTC Loan Rates computes the true all-in first-year cost of a US Bitcoin-backed loan. Official sources, labeled estimates, transparent formula.",
  alternates: { canonical: `${SITE_URL}/methodology` },
};

export default function MethodologyPage() {
  const salt = getLender("salt")!;
  const example = computeCost(salt);

  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <Link href="/" className="text-sm text-amber-400 hover:underline">
        ← Back to ranking
      </Link>
      <h1 className="mt-4 text-3xl font-semibold text-zinc-50">Methodology</h1>

      <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-zinc-300">
        <p>
          <strong className="font-medium text-amber-400">Verified:</strong> Rate inputs last
          reviewed <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time> (America/New_York).
          Every lender page and table row links to the official source and its access date.
        </p>
      </div>

      <p className="mt-4 text-sm text-zinc-500">
        Default homepage scenario: {SCENARIO.label}. Compare pages also show $10,000, $50,000
        and $100,000 at the same term and LTV. The calculator accepts any amount, term, and
        LTV.
      </p>

      <div className="mt-6">
        <Disclaimer />
      </div>

      <section className="mt-10 space-y-4 text-sm leading-relaxed text-zinc-300">
        <h2 className="text-lg font-medium text-zinc-100">What “all-in” means</h2>
        <p>
          All-in first-year cost is the dollars you pay in interest, plus mandatory
          origination, administration, or processing fees, plus any other mandatory annual
          charge (for example Lava’s 2% capital charge), over a 12-month hold of a $
          {SCENARIO.principalUsd.toLocaleString("en-US")} principal at{" "}
          {SCENARIO.ltvPct}% initial LTV.
        </p>
        <p>
          We do <em>not</em> include optional products (SALT Shield, Figure Liquidation
          Protection, Strike volatility-proof), liquidation or margin-call fees (they are
          contingent), bank wire fees, bitcoin network fees, taxes, or the opportunity cost
          of locked collateral. A published APR that already includes origination is not
          increased by adding that fee again.
        </p>

        <h2 className="text-lg font-medium text-zinc-100">Formula</h2>
        <pre className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-xs text-zinc-300">{`# Default: simple interest for the term
interest = principal × interestPct × (termMonths / 12)

# Origination
#   none:            fee = 0, cashReceived = principal
#   deducted:        fee = principal × originationPct
#                    cashReceived = principal − fee   (Arch, Unchained)
#   paid-separately: fee = principal × originationPct
#                    cashReceived = principal         (Figure official $10k example)
#   added-to-principal (Coinbase variable):
#                    fee = 2% on the first $250,000 + 1% above
#                    interest is charged on (principal + fee)
#   from-collateral (Firefish):
#                    fee = principal × 1.5% × (days / 365), taken from BTC

allInUsd = interest + fee + otherMandatory
allInPct = allInUsd / principal

# Lava (official: daily compound + 2% capital charge)
interest = principal × ((1 + rate/365) ^ days − 1)
other    = 2% × endingBalance × (termMonths / 12)   # assumed charge base; labeled estimate`}</pre>

        <p>
          For SALT at the default scenario this is {formatUsd(example.interestUsd)} of
          interest, {formatUsd(example.feeUsd)} of fees, and {formatUsd(example.allInUsd)}{" "}
          all-in ({formatPct(example.allInPct)}).
        </p>

        <h2 className="text-lg font-medium text-zinc-100">How we pick a rate tier</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Loan size, term, and LTV select the matching row on the lender’s official
            schedule.
          </li>
          <li>
            If a lender offers monthly and payment-at-maturity APRs, the homepage ranks the
            cheaper monthly option (Strike 10.50% vs 11.25%; Arch 10.49% vs 10.99%). The
            other option is on the lender page.
          </li>
          <li>
            For SALT and Figure, LTV changes the rate. The homepage uses 50% LTV. At 30% LTV,
            SALT’s 1-year APR is 7.49%; at 70% it is 10.50% (and that tier is labeled “SALT
            Only” on SALT’s table).
          </li>
          <li>
            US clients of Ledn do not pay the 2% administration fee, so we use 0% for the
            US ranking. Adding that fee again would overstate the cost.
          </li>
        </ul>

        <h2 className="text-lg font-medium text-zinc-100">Estimates, and what is unverified</h2>
        <p>
          A figure is labeled <strong className="text-zinc-100">estimate</strong> when any of
          these is true: the rate is variable or a marketplace floor (Coinbase, Firefish); a
          mandatory charge has to be calculated from an assumption (Lava’s capital-charge
          base); or a live quote is required. Unverified items — missing state lists,
          unpublished initial LTVs, unpublished platform fees — are listed on each lender
          page and are never filled in from a third-party blog.
        </p>

        <h2 className="text-lg font-medium text-zinc-100">Who is in which table</h2>
        <p>
          <strong className="text-zinc-100">Fixed-rate ranking:</strong> SALT, Figure, Arch,
          Strike, Ledn, and Lava (Lava is a one-year fixed-rate line of credit, with the
          all-in labeled an estimate).
        </p>
        <p>
          <strong className="text-zinc-100">Variable or marketplace:</strong> Coinbase (Morpho,
          advertised from 5.1%) and Firefish (advertised from 5%). They are not mixed into
          the fixed ranking so a floor is not treated as a locked price.
        </p>
        <p>
          <strong className="text-zinc-100">Not at this size:</strong> Unchained ($150,000
          entity / $500,000 individual minimums), APX (US businesses only, $25,000 USDC
          minimum), and Debifi (standard minimum $20,000, and no published rate card).
        </p>
        <p>
          <strong className="text-zinc-100">Not included this check:</strong> Milo’s official
          product page returned an HTTP 403, so current rates could not be verified from the
          primary source. Nexo’s “from 1.9%” credit line is loyalty-tiered and US
          availability was not independently confirmed from a current official US product
          page, so it is omitted rather than guessed. Third-party comparison sites were used
          only as pointers to official URLs, never as rate sources.
        </p>

        <h2 className="text-lg font-medium text-zinc-100">Custody and liquidation</h2>
        <p>
          Custody and rehypothecation are described in each lender’s own words, with the
          source linked. “No rehypothecation” is only used when the lender says so. Ledn’s
          restricted re-posting to a USD funding partner, Strike’s “never rehypothecated
          further” (held by Strike Lending or a capital provider), and Coinbase’s cbBTC on
          Morpho are each described as they are, not flattened into a yes/no.
        </p>
        <p>
          Liquidation LTV, margin-call LTV, and cure windows come from official help or
          product pages. The drop-in-bitcoin-price illustrations on the homepage assume a
          flat loan balance; capitalized interest shrinks that buffer.
        </p>

        <h2 className="text-lg font-medium text-zinc-100">Worked default ranking</h2>
        <div className="overflow-x-auto rounded-lg border border-zinc-800">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/80 text-xs uppercase tracking-wide text-zinc-400">
                <th className="px-3 py-2">Lender</th>
                <th className="px-3 py-2">All-in</th>
                <th className="px-3 py-2">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {rankLenders(SCENARIO.principalUsd, SCENARIO.termMonths, SCENARIO.ltvPct, {
                group: "fixed",
              }).map((r) => (
                <tr key={r.lender.id} className="border-b border-zinc-800/70 last:border-0">
                  <td className="px-3 py-2">
                    <Link href={`/lenders/${r.lender.slug}`} className="text-amber-400 hover:underline">
                      {r.lender.name}
                    </Link>
                  </td>
                  <td className="px-3 py-2 tabular-nums">
                    {formatUsd(r.cost.allInUsd)} ({formatPct(r.cost.allInPct)})
                  </td>
                  <td className="px-3 py-2 capitalize text-zinc-400">{r.cost.confidence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </article>
  );
}
