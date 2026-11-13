import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/compares";
import { lenderName, rateChanges } from "@/lib/rateChanges";
import { getLender } from "@/lib/lenders";

export const metadata: Metadata = {
  title: "Bitcoin-backed loan rate-change log — BTC Loan Rates",
  description:
    "Append-only log of Bitcoin-backed loan rate, fee, and policy changes, dated and sourced from official lender pages.",
  alternates: { canonical: `${SITE_URL}/rate-changes` },
};

export default function RateChangesPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <Link href="/" className="text-sm text-amber-400 hover:underline">
        ← Back to ranking
      </Link>
      <h1 className="mt-4 text-3xl font-semibold text-zinc-50">Rate-change log</h1>
      <p className="mt-3 text-sm leading-relaxed text-zinc-400">
        An append-only record. Entries are never rewritten; corrections are added as new
        rows. The first entries are baselines from the {rateChanges[rateChanges.length - 1]?.date}{" "}
        launch review. Dates are America/New_York.
      </p>
      <ol className="mt-8 space-y-4">
        {rateChanges.map((e, i) => {
          const lender = getLender(e.lenderId);
          return (
            <li
              key={`${e.date}-${e.lenderId}-${i}`}
              className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4"
            >
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <time dateTime={e.date} className="text-sm tabular-nums text-zinc-400">
                  {e.date}
                </time>
                <span className="text-xs uppercase tracking-wide text-amber-500/90">
                  {e.type}
                </span>
                {lender ? (
                  <Link href={`/lenders/${lender.slug}`} className="text-sm font-medium text-zinc-100 hover:text-amber-400">
                    {lender.name}
                  </Link>
                ) : (
                  <span className="text-sm font-medium text-zinc-100">{lenderName(e.lenderId)}</span>
                )}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">{e.summary}</p>
              <a
                href={e.source}
                className="mt-2 inline-block text-xs text-amber-400 hover:underline"
                rel="noopener noreferrer"
                target="_blank"
              >
                Official source →
              </a>
            </li>
          );
        })}
      </ol>
    </article>
  );
}
