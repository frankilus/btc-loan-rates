import Link from "next/link";
import { LAST_UPDATED, lenders } from "@/lib/lenders";
import { Disclaimer } from "./Disclaimer";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <Disclaimer compact />
        <p className="mt-6 text-sm leading-relaxed text-zinc-400">
          Data last reviewed {LAST_UPDATED} (America/New_York). Every rate and term on this
          site cites an official lender page. Estimates are labeled. There are no affiliate
          links.
        </p>
        <div className="mt-6 flex flex-wrap gap-4 text-sm text-zinc-500">
          <Link href="/methodology" className="hover:text-amber-400">
            Methodology
          </Link>
          <span aria-hidden>·</span>
          <Link href="/calculator" className="hover:text-amber-400">
            Calculator
          </Link>
          <span aria-hidden>·</span>
          <Link href="/compare" className="hover:text-amber-400">
            Head-to-head
          </Link>
          <span aria-hidden>·</span>
          <Link href="/lenders" className="hover:text-amber-400">
            All lenders
          </Link>
          <span aria-hidden>·</span>
          <Link href="/rate-changes" className="hover:text-amber-400">
            Rate-change log
          </Link>
          <span aria-hidden>·</span>
          <Link href="/#ranking" className="hover:text-amber-400">
            Ranking
          </Link>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-600">
          {lenders.map((l) => (
            <Link key={l.id} href={`/lenders/${l.slug}`} className="hover:text-amber-400">
              {l.name}
            </Link>
          ))}
        </div>
        <p className="mt-4 text-xs text-zinc-600">
          © {new Date().getFullYear()} BTC Loan Rates · A{" "}
          <a href="https://pymtw.com" className="hover:text-amber-400">
            PYMTW
          </a>{" "}
          project · Sibling of{" "}
          <a href="https://stackcost-pink.vercel.app" className="hover:text-amber-400">
            StackCost
          </a>
        </p>
      </div>
    </footer>
  );
}
