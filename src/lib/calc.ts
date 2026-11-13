import {
  lenders,
  SCENARIO,
  type Lender,
  type RateConfidence,
  type RateTier,
  type PaymentTiming,
} from "./lenders";

export interface CostBreakdown {
  lenderId: string;
  principalUsd: number;
  termMonths: number;
  ltvPct: number;
  eligible: boolean;
  ineligibleReason?: string;
  tier: RateTier | null;
  interestUsd: number;
  feeUsd: number;
  otherUsd: number;
  allInUsd: number;
  allInPct: number;
  cashReceived: number;
  publishedAprPct: number | null;
  interestPct: number;
  confidence: RateConfidence;
  confidenceNote?: string;
  paymentTiming: PaymentTiming | null;
  notes: string[];
}

export const COMPARE_AMOUNTS = [10_000, 50_000, 100_000] as const;
export type CompareAmount = (typeof COMPARE_AMOUNTS)[number];

function daysInTerm(termMonths: number): number {
  return Math.round((termMonths * 365) / 12);
}

export function selectTier(
  lender: Lender,
  amount: number,
  termMonths: number,
  ltvPct: number,
  preferTiming?: PaymentTiming,
): RateTier | null {
  const timing = preferTiming ?? lender.preferredTiming;
  const matches = lender.tiers.filter((t) => {
    if (amount < t.minAmountUsd) return false;
    if (t.maxAmountUsd != null && amount > t.maxAmountUsd + 1e-9) return false;
    if (ltvPct < t.minLtvPct - 1e-9) return false;
    if (ltvPct > t.maxLtvPct + 1e-9) return false;
    if (termMonths < t.minTermMonths || termMonths > t.maxTermMonths) return false;
    return true;
  });
  if (!matches.length) return null;
  const preferred = matches.filter((t) => t.paymentTiming === timing);
  return (preferred[0] ?? matches[0]) ?? null;
}

export function eligibilityIssue(
  lender: Lender,
  amount: number,
  termMonths: number,
  ltvPct: number,
): string | null {
  if (lender.id === "debifi") {
    if (amount < 20_000) {
      return "Standard Debifi stablecoin and fiat loans start at $20,000. US card loans start at $500 but have no published rate, so they cannot be priced.";
    }
    return "Debifi has no published rate card — APR is set by each lender offer, so all-in interest cannot be calculated.";
  }
  if (lender.minLoanUsd != null && amount < lender.minLoanUsd) {
    return `Minimum loan is ${formatUsd(lender.minLoanUsd)}${lender.minLoanNote ? ` (${lender.minLoanNote})` : "."}`;
  }
  if (lender.maxLoanUsd != null && amount > lender.maxLoanUsd) {
    return `Published maximum is ${formatUsd(lender.maxLoanUsd)}.`;
  }
  if (ltvPct > lender.maxLtvPct + 1e-9) {
    return `Maximum initial LTV is ${lender.maxLtvPct}%.`;
  }
  if (lender.id === "apx") {
    // US product is businesses only; still allow pricing at/above $25k with a note.
  }
  if (lender.termMonthsAvailable.length && !lender.tiers.some((t) => termMonths >= t.minTermMonths && termMonths <= t.maxTermMonths)) {
    const terms = lender.termMonthsAvailable.join(", ");
    return `Published terms are ${lender.termsLabel} (available months: ${terms}).`;
  }
  if (!selectTier(lender, amount, termMonths, ltvPct) && lender.tiers.length) {
    return `No published rate tier matches this amount, term, and LTV. ${lender.termsLabel}`;
  }
  return null;
}

export function computeCost(
  lender: Lender,
  principalUsd: number = SCENARIO.principalUsd,
  termMonths: number = SCENARIO.termMonths,
  ltvPct: number = SCENARIO.ltvPct,
  preferTiming?: PaymentTiming,
): CostBreakdown {
  const base: CostBreakdown = {
    lenderId: lender.id,
    principalUsd,
    termMonths,
    ltvPct,
    eligible: false,
    tier: null,
    interestUsd: 0,
    feeUsd: 0,
    otherUsd: 0,
    allInUsd: 0,
    allInPct: 0,
    cashReceived: principalUsd,
    publishedAprPct: null,
    interestPct: 0,
    confidence: "verified",
    paymentTiming: null,
    notes: [],
  };

  const issue = eligibilityIssue(lender, principalUsd, termMonths, ltvPct);
  const tier = selectTier(lender, principalUsd, termMonths, ltvPct, preferTiming);
  if (issue || !tier) {
    return { ...base, ineligibleReason: issue ?? "No matching published rate tier.", notes: [issue ?? "No matching published rate tier."] };
  }

  const yearFrac = termMonths / 12;
  const days = daysInTerm(termMonths);
  let interestUsd = 0;
  let feeUsd = 0;
  let otherUsd = 0;
  let cashReceived = principalUsd;
  const notes: string[] = [];
  let confidence: RateConfidence = tier.interestIsFloor || lender.rateType !== "fixed" ? "estimate" : "verified";
  let confidenceNote: string | undefined;

  if (tier.dailyCompound) {
    const daily = tier.interestPct / 100 / 365;
    const fv = principalUsd * Math.pow(1 + daily, days);
    interestUsd = fv - principalUsd;
    if (tier.capitalChargePct) {
      // Assumption: 2% annual charge on year-end compounded outstanding, pro-rated by year fraction.
      otherUsd = (tier.capitalChargePct / 100) * fv * yearFrac;
      notes.push(
        `Interest compounds daily at ${tier.interestPct}% for ${days} days. The ${tier.capitalChargePct}% capital charge is applied to the ending compounded balance and pro-rated for ${termMonths} months — confirm the exact charge base with ${lender.name}.`,
      );
      confidence = "estimate";
      confidenceNote = "All-in includes calculated daily compounding and an assumed capital-charge base.";
    }
  } else {
    interestUsd = principalUsd * (tier.interestPct / 100) * yearFrac;
  }

  const rawFee = principalUsd * (tier.originationPct / 100);
  switch (tier.originationTreatment) {
    case "none":
      feeUsd = 0;
      cashReceived = principalUsd;
      break;
    case "deducted":
      feeUsd = rawFee * (tier.originationTreatment === "deducted" && lender.id === "firefish" ? yearFrac : 1);
      // Arch / Unchained: one-time fee deducted from disbursement (not pro-rated).
      feeUsd = rawFee;
      cashReceived = principalUsd - feeUsd;
      notes.push(
        `${tier.originationPct}% origination is deducted from disbursement, so cash received is ${formatUsd(cashReceived)}.`,
      );
      break;
    case "added-to-principal": {
      // Coinbase: tiered 2% first $250k, 1% above, then interest on starting principal + fee.
      let processing = 0;
      if (lender.id === "coinbase") {
        const first = Math.min(principalUsd, 250_000);
        const rest = Math.max(0, principalUsd - 250_000);
        processing = first * 0.02 + rest * 0.01;
      } else {
        processing = rawFee;
      }
      feeUsd = processing;
      const starting = principalUsd + feeUsd;
      interestUsd = starting * (tier.interestPct / 100) * yearFrac;
      cashReceived = principalUsd;
      notes.push(
        `Processing fee of ${formatUsd(feeUsd)} is added to principal. Interest is calculated on ${formatUsd(starting)}.`,
      );
      break;
    }
    case "paid-separately":
      feeUsd = rawFee;
      cashReceived = principalUsd;
      notes.push(
        `${tier.originationPct}% origination (${formatUsd(feeUsd)}) is paid in addition to interest; official Figure example on $10,000 receives $10,000.`,
      );
      break;
    case "from-collateral":
      feeUsd = principalUsd * (tier.originationPct / 100) * (days / 365);
      cashReceived = principalUsd;
      notes.push(
        `${tier.originationPct}% p.a. origination is taken from Bitcoin collateral (${formatUsd(feeUsd)} at this tenor), not deducted from cash disbursed.`,
      );
      break;
  }

  if (tier.interestIsFloor) {
    confidence = "estimate";
    confidenceNote =
      lender.rateType === "variable"
        ? `${tier.interestPct}% is the advertised floor, not a locked rate. A live quote is required. Any unpublished platform fee is excluded.`
        : `${tier.interestPct}% is an advertised floor on a marketplace, not a guaranteed quote.`;
  }

  if (lender.id === "apx") {
    notes.push("US APX loans are available to eligible businesses only, in USDC, with a $25,000 minimum.");
  }
  if (lender.id === "lava") {
    notes.push("Lava is a revolving line of credit. This figure assumes a single full draw held for the full term, with no regular payments.");
  }
  if (lender.id === "coinbase") {
    notes.push("Coinbase variable-rate loans have no term. This figure assumes the advertised 5.1% floor holds for the whole period. A Coinbase platform fee may also apply and is not included.");
  }
  if (lender.id === "unchained") {
    notes.push("14.18% APR and 12% interest are Unchained’s published example and are subject to application and approval.");
    if (principalUsd < 500_000) {
      notes.push("Individuals, trusts, and sole proprietors typically have a $500,000 minimum; $150,000 is the typical entity minimum.");
    }
  }

  const allInUsd = interestUsd + feeUsd + otherUsd;
  const allInPct = principalUsd > 0 ? allInUsd / principalUsd : 0;

  return {
    lenderId: lender.id,
    principalUsd,
    termMonths,
    ltvPct,
    eligible: true,
    tier,
    interestUsd,
    feeUsd,
    otherUsd,
    allInUsd,
    allInPct,
    cashReceived,
    publishedAprPct: tier.publishedAprPct,
    interestPct: tier.interestPct,
    confidence,
    confidenceNote,
    paymentTiming: tier.paymentTiming,
    notes,
  };
}

export function rankLenders(
  principalUsd: number = SCENARIO.principalUsd,
  termMonths: number = SCENARIO.termMonths,
  ltvPct: number = SCENARIO.ltvPct,
  opts?: { group?: Lender["scenarioGroup"]; includeIneligible?: boolean; preferTiming?: PaymentTiming },
): { lender: Lender; cost: CostBreakdown }[] {
  return lenders
    .map((lender) => ({ lender, cost: computeCost(lender, principalUsd, termMonths, ltvPct, opts?.preferTiming) }))
    .filter((r) => (opts?.includeIneligible ? true : r.cost.eligible))
    .filter((r) => (opts?.group ? r.lender.scenarioGroup === opts.group : true))
    .sort((a, b) => {
      if (a.cost.eligible && !b.cost.eligible) return -1;
      if (!a.cost.eligible && b.cost.eligible) return 1;
      return a.cost.allInUsd - b.cost.allInUsd;
    });
}

export function btcDropToLiquidation(
  startLtvPct: number,
  liquidationLtvPct: number | null,
): number | null {
  if (liquidationLtvPct == null || liquidationLtvPct <= 0 || startLtvPct <= 0) return null;
  if (liquidationLtvPct <= startLtvPct) return 0;
  // collateral_end / collateral_start = startLtv / liqLtv; drop = 1 - that
  return 1 - startLtvPct / liquidationLtvPct;
}

export function formatUsd(n: number, digits = 2): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function formatPct(n: number, digits = 2): string {
  // n is a fraction (0.0875 -> 8.75%)
  return `${(n * 100).toFixed(digits)}%`;
}

export function formatPctPoints(n: number, digits = 2): string {
  // n is already in percent points (8.75 -> 8.75%)
  return `${n.toFixed(digits)}%`;
}
