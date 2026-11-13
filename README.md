# BTC Loan Rates

Living comparison of the **true all-in cost** of a US Bitcoin-backed loan (APR + mandatory fees), plus a custody and liquidation-risk view. A PYMTW project, sibling of [StackCost](https://stackcost-pink.vercel.app).

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- Deploy: Vercel (free `vercel.app` URL)

## Local

```bash
npm install
npm run dev
```

## Pages

- `/` — lender ranking for a $10,000 / 12-month / 50% LTV loan
- `/calculator` — any loan amount, term, and LTV
- `/lenders/{slug}` — one page per lender, with official sources
- `/compare` and `/compare/{a}-vs-{b}` — head-to-head pairs
- `/methodology` — formula, assumptions, and estimate policy
- `/rate-changes` — append-only rate-change log
- `/sitemap.xml`, `/robots.txt`

Rate seeds: `src/lib/lenders.ts`. Calc: `src/lib/calc.ts`. Pairs: `src/lib/compares.ts`.

## Disclaimer

Not financial advice. Rates, fees, and availability change. Verify with each lender. Every estimate is labeled. Every rate and term cites an official source. No affiliate links.

