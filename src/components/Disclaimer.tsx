export function Disclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={
        compact
          ? "rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-sm text-zinc-400"
          : "rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm leading-relaxed text-zinc-300"
      }
    >
      <p>
        <strong className="font-medium text-zinc-100">Not financial advice.</strong> BTC
        Loan Rates is for information only. It is not an offer to lend, a solicitation, or a
        recommendation to borrow, and it is not tax, legal, or investment advice. Rates,
        fees, LTV rules, custody, and state availability change without notice. A published
        rate is not a quote. Always verify current terms with the lender and read the loan
        agreement before you pledge bitcoin. Estimates are labeled as such. We have no
        affiliate links.
      </p>
    </div>
  );
}
