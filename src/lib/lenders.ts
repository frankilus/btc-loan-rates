export const LAST_UPDATED = "2026-11-13";
export const SITE_NAME = "BTC Loan Rates";

export const SCENARIO = {
  principalUsd: 10_000,
  termMonths: 12,
  ltvPct: 50,
  label: "$10,000 loan for 12 months at 50% initial LTV",
} as const;

export type RateConfidence = "verified" | "estimate";
export type RateType = "fixed" | "variable" | "marketplace";
export type PaymentTiming = "monthly" | "maturity" | "revolving";
export type OriginationTreatment =
  | "none"
  | "deducted"
  | "added-to-principal"
  | "paid-separately"
  | "from-collateral";
export type Rehypothecation = "no" | "restricted" | "defi-collateral" | "unknown";
export type LiquidationType = "partial" | "full" | "varies" | "unknown";
export type ScenarioGroup = "fixed" | "variable-or-marketplace" | "not-at-this-size";

export interface Source {
  label: string;
  url: string;
  accessed: string;
}

export interface RateTier {
  minAmountUsd: number;
  maxAmountUsd: number | null;
  minLtvPct: number;
  maxLtvPct: number;
  minTermMonths: number;
  maxTermMonths: number;
  paymentTiming: PaymentTiming;
  interestPct: number;
  publishedAprPct: number | null;
  originationPct: number;
  originationInApr: boolean;
  originationTreatment: OriginationTreatment;
  /** If true, interest compounds daily into principal. */
  dailyCompound?: boolean;
  /** Annual capital charge on max outstanding (Lava). */
  capitalChargePct?: number;
  interestIsFloor?: boolean;
  label?: string;
}

export interface Lender {
  id: string;
  name: string;
  slug: string;
  productName: string;
  rateType: RateType;
  aprRangeLabel: string;
  /** Default payment timing used on the $10k ranking when both exist. */
  preferredTiming: PaymentTiming;
  tiers: RateTier[];
  maxLtvPct: number;
  typicalLtvPct: number;
  warningLtvPct: number | null;
  marginCallLtvPct: number | null;
  liquidationLtvPct: number | null;
  marginCallWindow: string | null;
  liquidationType: LiquidationType;
  liquidationFee: string;
  minLoanUsd: number | null;
  maxLoanUsd: number | null;
  minLoanNote: string;
  termsLabel: string;
  termMonthsAvailable: number[];
  originationFeeLabel: string;
  otherFees: string;
  custodyShort: string;
  custodyDetail: string;
  rehypothecation: Rehypothecation;
  rehypothecationDetail: string;
  usAvailability: string;
  kyc: string;
  /** Can a typical US individual get a $10k / 12-mo / 50% LTV loan? */
  eligibleAt10k: boolean;
  scenarioGroup: ScenarioGroup;
  eligibleAt10kNote: string;
  sources: Source[];
  unverified: string[];
  summary: string;
}

const A = "2026-11-13";

export const lenders: Lender[] = [
  {
    id: "salt",
    name: "SALT",
    slug: "salt",
    productName: "Bitcoin-backed loan",
    rateType: "fixed",
    aprRangeLabel: "7.49%–10.50% APR",
    preferredTiming: "monthly",
    tiers: [
      { minAmountUsd: 5_000, maxAmountUsd: null, minLtvPct: 0, maxLtvPct: 30, minTermMonths: 12, maxTermMonths: 12, paymentTiming: "monthly", interestPct: 7.49, publishedAprPct: 7.49, originationPct: 0, originationInApr: true, originationTreatment: "none", label: "30% LTV, 1 year" },
      { minAmountUsd: 5_000, maxAmountUsd: null, minLtvPct: 0, maxLtvPct: 30, minTermMonths: 36, maxTermMonths: 36, paymentTiming: "monthly", interestPct: 8.24, publishedAprPct: 8.24, originationPct: 0, originationInApr: true, originationTreatment: "none", label: "30% LTV, 3 years" },
      { minAmountUsd: 5_000, maxAmountUsd: null, minLtvPct: 0, maxLtvPct: 30, minTermMonths: 60, maxTermMonths: 60, paymentTiming: "monthly", interestPct: 8.49, publishedAprPct: 8.49, originationPct: 0, originationInApr: true, originationTreatment: "none", label: "30% LTV, 5 years" },
      { minAmountUsd: 5_000, maxAmountUsd: null, minLtvPct: 30.01, maxLtvPct: 50, minTermMonths: 12, maxTermMonths: 12, paymentTiming: "monthly", interestPct: 8.75, publishedAprPct: 8.75, originationPct: 0, originationInApr: true, originationTreatment: "none", label: "50% LTV, 1 year" },
      { minAmountUsd: 5_000, maxAmountUsd: null, minLtvPct: 30.01, maxLtvPct: 50, minTermMonths: 36, maxTermMonths: 36, paymentTiming: "monthly", interestPct: 9.5, publishedAprPct: 9.5, originationPct: 0, originationInApr: true, originationTreatment: "none", label: "50% LTV, 3 years" },
      { minAmountUsd: 5_000, maxAmountUsd: null, minLtvPct: 30.01, maxLtvPct: 50, minTermMonths: 60, maxTermMonths: 60, paymentTiming: "monthly", interestPct: 9.75, publishedAprPct: 9.75, originationPct: 0, originationInApr: true, originationTreatment: "none", label: "50% LTV, 5 years" },
      { minAmountUsd: 5_000, maxAmountUsd: null, minLtvPct: 50.01, maxLtvPct: 70, minTermMonths: 12, maxTermMonths: 12, paymentTiming: "monthly", interestPct: 10.5, publishedAprPct: 10.5, originationPct: 0, originationInApr: true, originationTreatment: "none", label: "70% LTV, 1 year (listed as “SALT Only”)" },
    ],
    maxLtvPct: 70,
    typicalLtvPct: 50,
    warningLtvPct: 75,
    marginCallLtvPct: 83.33,
    liquidationLtvPct: 90.91,
    marginCallWindow: "Distance in LTV (margin call at 83.33%, margin event at 90.91%) rather than a fixed clock",
    liquidationType: "varies",
    liquidationFee: "5% liquidation fee if selected; optional Stabilization (3%) and conversion (2%) fees; SALT Shield is a separate optional fee",
    minLoanUsd: 5_000,
    maxLoanUsd: null,
    minLoanNote: "$5,000 minimum; availability based on jurisdiction.",
    termsLabel: "1, 3, or 5 years",
    termMonthsAvailable: [12, 36, 60],
    originationFeeLabel: "0% on new loans (origination may apply on refinances in some jurisdictions)",
    otherFees: "1.5% processing fee for crypto payments if not on Auto-Pay, and for paying off with collateral. Prepayment: none.",
    custodyShort: "Institutional custody, no rehypothecation",
    custodyDetail: "SALT states borrower collateral is held in institutional-grade custody, kept separate from SALT’s own treasury and operating funds, and is never re-lent, traded, or reused. The named custodian is not stated on the pages reviewed this check.",
    rehypothecation: "no",
    rehypothecationDetail: "Official policy: no rehypothecation. Collateral is used only to manage the borrower’s loan.",
    usAvailability: "Subject to jurisdictional limitations; SALT’s rates page does not publish a complete state list. Loans originated by Salt Lending LLC, NMLS #1711910.",
    kyc: "KYC/AML required. Eligibility is determined case by case. SALT says it does not run a credit check; approval is based on collateral.",
    eligibleAt10k: true,
    scenarioGroup: "fixed",
    eligibleAt10kNote: "",
    sources: [
      { label: "Rates & Fees", url: "https://saltlending.com/rates-and-fees/", accessed: A },
      { label: "Liquidation thresholds compared (SALT’s published 75% / 83.33% / 90.91%)", url: "https://saltlending.com/crypto-loan-liquidation-thresholds-compared/", accessed: A },
      { label: "Custody and rehypothecation policy", url: "https://saltlending.com/are-bitcoin-backed-loans-safe/", accessed: A },
      { label: "Bitcoin-backed loans product page", url: "https://saltlending.com/bitcoin-loans/", accessed: A },
    ],
    unverified: [
      "Complete US state availability list is not published on the rates page (only “jurisdictional limitations”).",
      "Named custodian (for example BitGo) was not stated on the official pages reviewed this check.",
      "The 70% LTV, 1-year tier is labeled “SALT Only” — confirm what that eligibility means with SALT.",
    ],
    summary: "Fixed APRs that vary by LTV and term, not by loan size. At 50% LTV for one year the published APR is 8.75%, with no origination fee. Liquidation threshold is the highest published among the lenders we could verify (90.91% LTV).",
  },
  {
    id: "figure",
    name: "Figure",
    slug: "figure",
    productName: "Crypto-backed loan",
    rateType: "fixed",
    aprRangeLabel: "9.999%–12.62% APR",
    preferredTiming: "monthly",
    tiers: [
      { minAmountUsd: 1, maxAmountUsd: null, minLtvPct: 0, maxLtvPct: 50, minTermMonths: 12, maxTermMonths: 12, paymentTiming: "monthly", interestPct: 8.91, publishedAprPct: 9.999, originationPct: 1, originationInApr: true, originationTreatment: "paid-separately", label: "Up to 50% LTV, 12 months" },
      { minAmountUsd: 1, maxAmountUsd: null, minLtvPct: 50.01, maxLtvPct: 75, minTermMonths: 12, maxTermMonths: 12, paymentTiming: "monthly", interestPct: 11.5, publishedAprPct: 12.62, originationPct: 1, originationInApr: true, originationTreatment: "paid-separately", label: "50.01%–75% LTV, 12 months" },
    ],
    maxLtvPct: 75,
    typicalLtvPct: 50,
    warningLtvPct: 75,
    marginCallLtvPct: 80,
    liquidationLtvPct: 90,
    marginCallWindow: "48 hours to cure; voided if 90% LTV is reached",
    liquidationType: "varies",
    liquidationFee: "2% fee on liquidation, per the product FAQ. At 90% LTV, automatic (full) liquidation. If a margin call is not cured in 48 hours, a partial liquidation may occur.",
    minLoanUsd: null,
    maxLoanUsd: null,
    minLoanNote: "Exact US minimum is not published on the product page; amounts “may vary subject to state-specific legal limitations.” International loans start at $2,500.",
    termsLabel: "12 months",
    termMonthsAvailable: [12],
    originationFeeLabel: "1% (included in the published APR). Official $10,000 example: $100 fee, borrower receives $10,000.",
    otherFees: "Optional Liquidation Protection for an additional fee, only in certain states. Interest can be paid monthly or deferred. Soft credit pull to check standing with other lenders; no credit score requirement for eligibility.",
    custodyShort: "Decentralized MPC custody, no rehypothecation",
    custodyDetail: "Figure says new loans go into a decentralized, segregated MPC custody wallet, collateral is held by a qualified custodian, and it will never be rehypothecated. Web-originated loans may use Anchorage custody, per Figure Markets support.",
    rehypothecation: "no",
    rehypothecationDetail: "Official product FAQ: collateral “will never be rehypothecated.”",
    usAvailability: "Available to residents of every US state except Idaho, Illinois, Kentucky, Maryland, Mississippi, South Dakota, Texas, Vermont, Virginia, and the District of Columbia.",
    kyc: "Account registration required. Figure conducts a soft credit pull to determine whether the applicant is in good standing with other lenders; eligibility is based on crypto collateral, not a credit score.",
    eligibleAt10k: true,
    scenarioGroup: "fixed",
    eligibleAt10kNote: "Official representative example is a $10,000, 12-month, 50% LTV loan.",
    sources: [
      { label: "Crypto-backed loan product page", url: "https://www.figure.com/crypto-backed-loan/", accessed: A },
      { label: "Margin call and liquidation process (US threshold schedules)", url: "https://support.figuremarkets.com/hc/en-us/articles/49222810976531-CBL-Understanding-the-Margin-Call-Liquidation-Process", accessed: A },
    ],
    unverified: [
      "Exact US minimum loan amount is not published; state-specific legal limitations apply.",
      "Optional Liquidation Protection pricing is not modeled here.",
    ],
    summary: "Fixed 12-month USD loan against BTC, ETH, or SOL. At 50% LTV the published figures are 8.91% interest and 9.999% APR, including a 1% origination fee. You can borrow up to 75% LTV at a higher rate (11.50% interest, 12.62% APR).",
  },
  {
    id: "arch",
    name: "Arch",
    slug: "arch",
    productName: "BTC-backed loan",
    rateType: "fixed",
    aprRangeLabel: "From 7.25% APR (large loans) to 10.49% APR",
    preferredTiming: "monthly",
    tiers: [
      { minAmountUsd: 5_000, maxAmountUsd: 249_999.99, minLtvPct: 0, maxLtvPct: 60, minTermMonths: 1, maxTermMonths: 12, paymentTiming: "monthly", interestPct: 9, publishedAprPct: 10.49, originationPct: 1.49, originationInApr: true, originationTreatment: "deducted", label: "Under $250K, monthly" },
      { minAmountUsd: 5_000, maxAmountUsd: 249_999.99, minLtvPct: 0, maxLtvPct: 60, minTermMonths: 1, maxTermMonths: 12, paymentTiming: "maturity", interestPct: 9.5, publishedAprPct: 10.99, originationPct: 1.49, originationInApr: true, originationTreatment: "deducted", label: "Under $250K, at maturity" },
      { minAmountUsd: 250_000, maxAmountUsd: 749_999.99, minLtvPct: 0, maxLtvPct: 60, minTermMonths: 1, maxTermMonths: 12, paymentTiming: "monthly", interestPct: 8.5, publishedAprPct: 9.99, originationPct: 1.49, originationInApr: true, originationTreatment: "deducted", label: "$250K–$750K, monthly" },
      { minAmountUsd: 250_000, maxAmountUsd: 749_999.99, minLtvPct: 0, maxLtvPct: 60, minTermMonths: 1, maxTermMonths: 12, paymentTiming: "maturity", interestPct: 9, publishedAprPct: 10.49, originationPct: 1.49, originationInApr: true, originationTreatment: "deducted", label: "$250K–$750K, at maturity" },
      { minAmountUsd: 750_000, maxAmountUsd: 1_999_999.99, minLtvPct: 0, maxLtvPct: 60, minTermMonths: 1, maxTermMonths: 12, paymentTiming: "monthly", interestPct: 8, publishedAprPct: 8.99, originationPct: 0.99, originationInApr: true, originationTreatment: "deducted", label: "$750K–$2M, monthly" },
      { minAmountUsd: 750_000, maxAmountUsd: 1_999_999.99, minLtvPct: 0, maxLtvPct: 60, minTermMonths: 1, maxTermMonths: 12, paymentTiming: "maturity", interestPct: 8.5, publishedAprPct: 9.49, originationPct: 0.99, originationInApr: true, originationTreatment: "deducted", label: "$750K–$2M, at maturity" },
      { minAmountUsd: 2_000_000, maxAmountUsd: 4_999_999.99, minLtvPct: 0, maxLtvPct: 60, minTermMonths: 1, maxTermMonths: 12, paymentTiming: "monthly", interestPct: 7.75, publishedAprPct: 8.24, originationPct: 0.49, originationInApr: true, originationTreatment: "deducted", label: "$2M–$5M, monthly" },
      { minAmountUsd: 2_000_000, maxAmountUsd: 4_999_999.99, minLtvPct: 0, maxLtvPct: 60, minTermMonths: 1, maxTermMonths: 12, paymentTiming: "maturity", interestPct: 8.25, publishedAprPct: 8.74, originationPct: 0.49, originationInApr: true, originationTreatment: "deducted", label: "$2M–$5M, at maturity" },
      { minAmountUsd: 5_000_000, maxAmountUsd: 9_999_999.99, minLtvPct: 0, maxLtvPct: 60, minTermMonths: 1, maxTermMonths: 12, paymentTiming: "monthly", interestPct: 7.25, publishedAprPct: 7.74, originationPct: 0.49, originationInApr: true, originationTreatment: "deducted", label: "$5M–$10M, monthly" },
      { minAmountUsd: 5_000_000, maxAmountUsd: 9_999_999.99, minLtvPct: 0, maxLtvPct: 60, minTermMonths: 1, maxTermMonths: 12, paymentTiming: "maturity", interestPct: 7.75, publishedAprPct: 8.24, originationPct: 0.49, originationInApr: true, originationTreatment: "deducted", label: "$5M–$10M, at maturity" },
    ],
    maxLtvPct: 60,
    typicalLtvPct: 50,
    warningLtvPct: 65,
    marginCallLtvPct: 70,
    liquidationLtvPct: 80,
    marginCallWindow: "24-hour cure window at 70% LTV",
    liquidationType: "partial",
    liquidationFee: "Typically 2% of the amount liquidated, to the extent not prohibited by state law. Partial sale to restore a healthy LTV.",
    minLoanUsd: 5_000,
    maxLoanUsd: null,
    minLoanNote: "$5,000 minimum. Loans above $10M are custom-quoted (“from 7.25% APR”) and are not auto-priced here.",
    termsLabel: "Up to 12 months; borrowers may roll over at maturity without repaying principal",
    termMonthsAvailable: [1, 3, 6, 12],
    originationFeeLabel: "1.49% under $750K, stepping down to 0.25% above $10M; deducted from disbursement; included in published APR",
    otherFees: "No prepayment penalty, no monthly maintenance, no separate custody fee. Standard bank wire/ACH fees may apply.",
    custodyShort: "Anchorage Digital (OCC bank), no rehypothecation",
    custodyDetail: "Collateral is held by Anchorage Digital, a federally chartered national trust bank regulated by the OCC, under segregated custody. Arch says it does not hold private keys. Anchorage maintains $100 million Lloyd’s of London coverage, subject to policy terms. Segregated wallets with on-chain verification are offered for loans over $100K.",
    rehypothecation: "no",
    rehypothecationDetail: "Official policy: zero rehypothecation. Collateral is never lent, staked, traded, or used by Arch.",
    usAvailability: "A June 15, 2026 Arch Help article lists individual loans in 45 US states and territories: AL, AK, AZ, AR, CO, CT, DC, FL, GA, HI, ID, IL, IN, IA, KS, KY, LA, ME, MA, MI, MN, MO, MT, NM, NE, NH, NJ, NY, NC, ND, OH, OK, OR, PA, SC, SD, TN, TX, UT, VA, WA, WV, WI, WY, and PR. That list excludes CA, DE, MD, MS, NV, RI, and VT. Arch’s security-page footer also lists exclusions, including MT and ND and omitting MD — a conflicting official source. Confirm current eligibility with Arch.",
    kyc: "Short identity verification (KYC). No credit score, no hard credit pull, no income verification.",
    eligibleAt10k: true,
    scenarioGroup: "fixed",
    eligibleAt10kNote: "Ranked on the monthly-payment APR (10.49%), which is lower than payment-at-maturity (10.99%). Origination of 1.49% is deducted from disbursement, so cash received on a $10,000 loan is $9,851.",
    sources: [
      { label: "Bitcoin-backed loan page (rates, LTV, $5,000 minimum)", url: "https://archlending.com/bitcoin-backed-loan/", accessed: A },
      { label: "Crypto loan fees and sample APR by loan size", url: "https://archlending.com/learn/crypto-loan-fees/", accessed: A },
      { label: "Interest rates and APRs (monthly vs maturity)", url: "https://help.archlending.com/en/articles/13456506-what-are-the-interest-rates-and-aprs-for-arch-loans", accessed: A },
      { label: "Eligible borrower jurisdictions (June 15, 2026)", url: "https://help.archlending.com/en/articles/9945241-am-i-an-eligible-borrower", accessed: A },
      { label: "Custody, security, and Bitcoin LTV thresholds", url: "https://archlending.com/security/", accessed: A },
    ],
    unverified: [
      "Two official Arch pages disagree on some excluded US states (MT, ND, MD). The dated June 15, 2026 help article is used in the summary above.",
      "$10M+ pricing is a custom quote (“from 7.25% APR”) and is not auto-ranked.",
    ],
    summary: "Fixed-rate BTC, ETH, and SOL loans with size-tiered pricing. Under $250,000, the monthly-payment APR is 10.49% (9.00% interest plus 1.49% origination deducted from what you receive). Max initial LTV is 60%. Custody is with Anchorage Digital, with a stated no-rehypothecation policy.",
  },
  {
    id: "strike",
    name: "Strike",
    slug: "strike",
    productName: "US standard fixed-term bitcoin-backed loan",
    rateType: "fixed",
    aprRangeLabel: "7.49%–11.25% APR (standard term loan)",
    preferredTiming: "monthly",
    tiers: [
      { minAmountUsd: 5_000, maxAmountUsd: 249_999.99, minLtvPct: 0, maxLtvPct: 50, minTermMonths: 12, maxTermMonths: 12, paymentTiming: "monthly", interestPct: 10.5, publishedAprPct: 10.5, originationPct: 0, originationInApr: true, originationTreatment: "none", label: "Under $250K, monthly" },
      { minAmountUsd: 5_000, maxAmountUsd: 249_999.99, minLtvPct: 0, maxLtvPct: 50, minTermMonths: 12, maxTermMonths: 12, paymentTiming: "maturity", interestPct: 11.25, publishedAprPct: 11.25, originationPct: 0, originationInApr: true, originationTreatment: "none", label: "Under $250K, at maturity" },
      { minAmountUsd: 250_000, maxAmountUsd: 750_000, minLtvPct: 0, maxLtvPct: 50, minTermMonths: 12, maxTermMonths: 12, paymentTiming: "monthly", interestPct: 10, publishedAprPct: 10, originationPct: 0, originationInApr: true, originationTreatment: "none" },
      { minAmountUsd: 250_000, maxAmountUsd: 750_000, minLtvPct: 0, maxLtvPct: 50, minTermMonths: 12, maxTermMonths: 12, paymentTiming: "maturity", interestPct: 10.75, publishedAprPct: 10.75, originationPct: 0, originationInApr: true, originationTreatment: "none" },
      { minAmountUsd: 750_000, maxAmountUsd: 2_000_000, minLtvPct: 0, maxLtvPct: 50, minTermMonths: 12, maxTermMonths: 12, paymentTiming: "monthly", interestPct: 9, publishedAprPct: 9, originationPct: 0, originationInApr: true, originationTreatment: "none" },
      { minAmountUsd: 750_000, maxAmountUsd: 2_000_000, minLtvPct: 0, maxLtvPct: 50, minTermMonths: 12, maxTermMonths: 12, paymentTiming: "maturity", interestPct: 9.5, publishedAprPct: 9.5, originationPct: 0, originationInApr: true, originationTreatment: "none" },
      { minAmountUsd: 2_000_000, maxAmountUsd: 5_000_000, minLtvPct: 0, maxLtvPct: 50, minTermMonths: 12, maxTermMonths: 12, paymentTiming: "monthly", interestPct: 8, publishedAprPct: 8, originationPct: 0, originationInApr: true, originationTreatment: "none" },
      { minAmountUsd: 2_000_000, maxAmountUsd: 5_000_000, minLtvPct: 0, maxLtvPct: 50, minTermMonths: 12, maxTermMonths: 12, paymentTiming: "maturity", interestPct: 8.75, publishedAprPct: 8.75, originationPct: 0, originationInApr: true, originationTreatment: "none" },
      { minAmountUsd: 5_000_000, maxAmountUsd: 10_000_000, minLtvPct: 0, maxLtvPct: 50, minTermMonths: 12, maxTermMonths: 12, paymentTiming: "monthly", interestPct: 7.49, publishedAprPct: 7.49, originationPct: 0, originationInApr: true, originationTreatment: "none" },
    ],
    maxLtvPct: 50,
    typicalLtvPct: 50,
    warningLtvPct: 65,
    marginCallLtvPct: 70,
    liquidationLtvPct: 85,
    marginCallWindow: "72 hours to bring LTV to 65% or below",
    liquidationType: "partial",
    liquidationFee: "Strike states there are no origination, early repayment, late payment, or liquidation fees. At 85% LTV, immediate partial liquidation back to 65%. Unresolved 70% margin calls are also partially liquidated back to 65%.",
    minLoanUsd: 10_000,
    maxLoanUsd: null,
    minLoanNote: "Personal term loans start at $10,000 in most states; several states have higher minimums (for example Alaska and D.C. $26,000, Kentucky $16,000). Hawaii has no offering. Maryland personal loans are not available. Business minimums are often $5,000. Only payment-at-maturity loans are available in Idaho. Monthly-payment loans have much higher minimums in Iowa, Oklahoma, and South Carolina.",
    termsLabel: "12-month term loan; a separate revolving line of credit is also offered (variable 11.25% APR as of this check)",
    termMonthsAvailable: [12],
    originationFeeLabel: "0%",
    otherFees: "None of origination, early repayment, late payment, or liquidation fees, per Strike’s rate page. Volatility-proof term loans add a flat 2.95% to standard APRs and cap initial LTV at 40%; they are not used in the default ranking.",
    custodyShort: "Segregated, held by Strike Lending or a capital provider; no further rehypothecation",
    custodyDetail: "Strike says credit collateral is segregated from company funds and held in wallets or accounts by Strike Lending or one of its capital providers, and is never rehypothecated further, lent out, shorted, or transferred to any other third party. Quarterly agreed-upon procedures by FGMK LLC are published.",
    rehypothecation: "restricted",
    rehypothecationDetail: "Official wording: collateral is “never rehypothecated further” and is held by Strike Lending or a capital provider. That is a no-further-reuse policy, not a claim that a capital provider never holds the coins.",
    usAvailability: "Personal term loans in every US state plus D.C. and Puerto Rico except Hawaii (none) and Maryland (personal term loans not available). Minimums vary by state and account type. See Strike’s official availability table.",
    kyc: "Strike account required (identity verification). No credit checks, per the borrow product page.",
    eligibleAt10k: true,
    scenarioGroup: "fixed",
    eligibleAt10kNote: "Ranked on the monthly-payment 10.50% APR. Payment at maturity is 11.25%. A $10,000 personal loan is at or below the minimum in some states.",
    sources: [
      { label: "US interest-rate schedule", url: "https://strike.me/support/what-are-the-interest-rates-for-borrowing-against-bitcoin/", accessed: A },
      { label: "Margin calls and liquidations", url: "https://strike.me/support/how-do-margin-calls-and-liquidations-happen/", accessed: A },
      { label: "How assets and credit collateral are held", url: "https://strike.me/us/en/support/how-are-my-assets-held/", accessed: A },
      { label: "Where bitcoin-backed borrowing is available", url: "https://strike.me/us/en/support/where-is-bitcoin-backed-borrowing-available/", accessed: A },
      { label: "Borrow product page", url: "https://strike.me/borrow/", accessed: A },
    ],
    unverified: [
      "Exact custody vendor names (beyond “Strike Lending or one of its capital providers”) are not listed on the assets-held page.",
    ],
    summary: "US standard 12-month term loans are tiered by size. Under $250,000, monthly interest is 10.50% APR and payment-at-maturity is 11.25% APR, with no origination fee. Max initial LTV is 50%. Margin call at 70% (72 hours) and partial liquidation at 85%, both restoring LTV to 65%.",
  },
  {
    id: "ledn",
    name: "Ledn",
    slug: "ledn",
    productName: "Bitcoin-backed dollar loan",
    rateType: "fixed",
    aprRangeLabel: "9.25%–10.99% APR",
    preferredTiming: "maturity",
    tiers: [
      { minAmountUsd: 500, maxAmountUsd: 249_999.99, minLtvPct: 0, maxLtvPct: 50, minTermMonths: 12, maxTermMonths: 12, paymentTiming: "maturity", interestPct: 10.99, publishedAprPct: 10.99, originationPct: 0, originationInApr: true, originationTreatment: "none", label: "Under $250,000 (US/Canada: 2% admin fee waived)" },
      { minAmountUsd: 250_000, maxAmountUsd: 499_999.99, minLtvPct: 0, maxLtvPct: 50, minTermMonths: 12, maxTermMonths: 12, paymentTiming: "maturity", interestPct: 10.49, publishedAprPct: 10.49, originationPct: 0, originationInApr: true, originationTreatment: "none" },
      { minAmountUsd: 500_000, maxAmountUsd: 999_999.99, minLtvPct: 0, maxLtvPct: 50, minTermMonths: 12, maxTermMonths: 12, paymentTiming: "maturity", interestPct: 9.99, publishedAprPct: 9.99, originationPct: 0, originationInApr: true, originationTreatment: "none" },
      { minAmountUsd: 1_000_000, maxAmountUsd: 1_999_999.99, minLtvPct: 0, maxLtvPct: 50, minTermMonths: 12, maxTermMonths: 12, paymentTiming: "maturity", interestPct: 9.75, publishedAprPct: 9.75, originationPct: 0, originationInApr: true, originationTreatment: "none" },
      { minAmountUsd: 2_000_000, maxAmountUsd: null, minLtvPct: 0, maxLtvPct: 50, minTermMonths: 12, maxTermMonths: 12, paymentTiming: "maturity", interestPct: 9.25, publishedAprPct: 9.25, originationPct: 0, originationInApr: true, originationTreatment: "none" },
    ],
    maxLtvPct: 50,
    typicalLtvPct: 50,
    warningLtvPct: 70,
    marginCallLtvPct: null,
    liquidationLtvPct: 80,
    marginCallWindow: "Notifications at 70% and 75% LTV; no separately published margin-call LTV",
    liquidationType: "full",
    liquidationFee: "Automatic and irreversible at or above 80% LTV. Ledn applies a 0.50% trade spread and returns any remainder.",
    minLoanUsd: 500,
    maxLoanUsd: 5_000_000,
    minLoanNote: "Minimum $500 (and at least $1,000 USD equivalent in BTC to apply). A $5M ceiling appears on Ledn’s own comparison writing; confirm the current maximum with Ledn. Some eligible locations require a higher minimum or a commercial purpose.",
    termsLabel: "12 months; renewable if eligible (LTV below 65%). From 1 January 2027, accrued interest and fees must be paid in full to renew or refinance.",
    termMonthsAvailable: [12],
    originationFeeLabel: "2% administration fee at origination, not applicable to clients in the United States and Canada. For US ranking we use 0%.",
    otherFees: "No early-repayment penalty. No required monthly payments; interest accrues daily and is due at close, refinance, or renewal. 0.50% trade spread on liquidation.",
    custodyShort: "Custodied; may be re-posted to a funding partner, not lent out for interest",
    custodyDetail: "For Custodied Loans, Ledn says collateral remains in verifiable custody. It may only be re-posted to an institutional USD funding partner or a Ledn-sponsored financing vehicle, where it is legally ring-fenced or held in a bankruptcy-remote structure. Ledn and those partners do not have the right to lend it out to generate interest.",
    rehypothecation: "restricted",
    rehypothecationDetail: "Restricted re-posting to secure USD funding is permitted. This is not the same as a blanket “never re-posted” claim, and it is not the same as lending BTC out to earn interest — Ledn says that is not allowed.",
    usAvailability: "Ledn’s Help Center (updated September 2, 2026) says Dollar Loans are not supported in California, Connecticut, Hawaii, Nevada, North Dakota, South Dakota, Tennessee, Washington, and Washington, D.C. Elsewhere in the US, minimum principal or commercial-purpose requirements may apply. Check Ledn’s eligibility page before applying.",
    kyc: "Identity verification required. Ledn’s own comparison states no credit check.",
    eligibleAt10k: true,
    scenarioGroup: "fixed",
    eligibleAt10kNote: "US clients do not pay the 2% administration fee. Interest is due at maturity (no required monthly payments).",
    sources: [
      { label: "Bitcoin-backed loans (current APR tiers, LTV, liquidation)", url: "https://www.ledn.io/bitcoin-backed-loans", accessed: A },
      { label: "What is a Dollar Loan? (fees, $500 minimum, 12-month term)", url: "https://help.ledn.io/hc/en-us/articles/28282750963607-What-is-a-Dollar-Loan", accessed: A },
      { label: "US and country availability", url: "https://help.ledn.io/hc/en-us/articles/28282882876567-Are-Dollar-Loans-Available-in-My-Country", accessed: A },
    ],
    unverified: [
      "A precise published maximum loan size for every jurisdiction was not independently confirmed beyond marketing figures; some locations add a higher minimum or a commercial-purpose requirement.",
      "Named custody vendors for every structure are not fully listed on the product page.",
    ],
    summary: "12-month dollar loans typically starting at 50% LTV, with APR tiered by loan size. Under $250,000 the current published APR is 10.99%. The 2% administration fee is waived for US and Canadian clients. Liquidation is automatic at 80% LTV, with a 0.50% trade spread — the tightest published liquidation line among the fixed-rate lenders in this set.",
  },
  {
    id: "lava",
    name: "Lava",
    slug: "lava",
    productName: "Bitcoin line of credit (BLOC)",
    rateType: "fixed",
    aprRangeLabel: "6.50%–8.50% interest plus a 2% annual capital charge",
    preferredTiming: "revolving",
    tiers: [
      { minAmountUsd: 1, maxAmountUsd: 249_999.99, minLtvPct: 0, maxLtvPct: 60, minTermMonths: 1, maxTermMonths: 12, paymentTiming: "revolving", interestPct: 8.5, publishedAprPct: null, originationPct: 0, originationInApr: false, originationTreatment: "none", dailyCompound: true, capitalChargePct: 2, label: "Under $250,000" },
      { minAmountUsd: 250_000, maxAmountUsd: 499_999.99, minLtvPct: 0, maxLtvPct: 60, minTermMonths: 1, maxTermMonths: 12, paymentTiming: "revolving", interestPct: 8, publishedAprPct: null, originationPct: 0, originationInApr: false, originationTreatment: "none", dailyCompound: true, capitalChargePct: 2 },
      { minAmountUsd: 500_000, maxAmountUsd: 999_999.99, minLtvPct: 0, maxLtvPct: 60, minTermMonths: 1, maxTermMonths: 12, paymentTiming: "revolving", interestPct: 7.5, publishedAprPct: null, originationPct: 0, originationInApr: false, originationTreatment: "none", dailyCompound: true, capitalChargePct: 2 },
      { minAmountUsd: 1_000_000, maxAmountUsd: 1_999_999.99, minLtvPct: 0, maxLtvPct: 60, minTermMonths: 1, maxTermMonths: 12, paymentTiming: "revolving", interestPct: 7, publishedAprPct: null, originationPct: 0, originationInApr: false, originationTreatment: "none", dailyCompound: true, capitalChargePct: 2 },
      { minAmountUsd: 2_000_000, maxAmountUsd: null, minLtvPct: 0, maxLtvPct: 60, minTermMonths: 1, maxTermMonths: 12, paymentTiming: "revolving", interestPct: 6.5, publishedAprPct: null, originationPct: 0, originationInApr: false, originationTreatment: "none", dailyCompound: true, capitalChargePct: 2, label: "$2M+; $25M+ is bespoke" },
    ],
    maxLtvPct: 60,
    typicalLtvPct: 50,
    warningLtvPct: null,
    marginCallLtvPct: null,
    liquidationLtvPct: null,
    marginCallWindow: "Lava sends multiple notifications as LTV rises. The exact liquidation LTV is not published; the app shows a liquidation price for each draw.",
    liquidationType: "full",
    liquidationFee: "If the liquidation price is reached, the entire line is liquidated and Lava does not return any collateral. Associated fees are mentioned but not itemized on the FAQ page reviewed.",
    minLoanUsd: null,
    maxLoanUsd: null,
    minLoanNote: "No public minimum was found on the interest-rate FAQ. Bespoke terms are offered above $25M.",
    termsLabel: "Revolving line of credit. The published interest rate is fixed for one year after you open the line. No regular payments required.",
    termMonthsAvailable: [12],
    originationFeeLabel: "No origination fee disclosed. A 2% capital charge is assessed each year on your maximum annual outstanding balance. Interest does not accrue on that charge during the year.",
    otherFees: "Interest is added to principal and compounded daily. Optional Liquidation Protection automatically adds collateral from your available bitcoin if LTV exceeds a threshold.",
    custodyShort: "Segregated cold storage, 1:1, no rehypothecation",
    custodyDetail: "Lava says it uses a distributed-key protocol with institutional-grade custodians, keys held across geographically distributed entities, and that funds are backed 1:1 in segregated cold-storage addresses and are never lent out, traded, or otherwise rehypothecated.",
    rehypothecation: "no",
    rehypothecationDetail: "Official FAQ: funds “are never lent out, traded, or otherwise rehypothecated. There are no exceptions to this rule.”",
    usAvailability: "Lava’s FAQ says it is “available globally” and that you can sign up online. No US state-level eligibility list was published on that page.",
    kyc: "Sign-up is required. A specific KYC statement was not found on the pages reviewed this check.",
    eligibleAt10k: true,
    scenarioGroup: "fixed",
    eligibleAt10kNote: "This is a revolving line of credit, not a 12-month installment loan. The homepage ranks a 12-month full-draw hold. All-in dollars are calculated from official 8.50% daily-compound interest plus a 2% capital charge on the year-end compounded balance — that charge base is an assumption, so the all-in figure is labeled an estimate.",
    sources: [
      { label: "Interest rates and capital charge", url: "https://www.lava.xyz/faq/what-are-the-interest-rates-on-lava", accessed: A },
      { label: "How liquidations work", url: "https://www.lava.xyz/faq/how-do-liquidations-work", accessed: A },
      { label: "How funds are secured", url: "https://www.lava.xyz/faq/how-are-my-funds-secured-in-lava", accessed: A },
      { label: "Where Lava is available", url: "https://www.lava.xyz/faq/where-is-lava-available", accessed: A },
    ],
    unverified: [
      "No published US state-level eligibility list.",
      "No published numeric liquidation LTV (only an in-app liquidation price).",
      "Minimum draw / line size was not found.",
      "KYC details were not found on the pages reviewed.",
      "All-in dollars assume the 2% capital charge applies to the year-end compounded outstanding balance. Confirm the exact charge base with Lava.",
    ],
    summary: "A revolving bitcoin line of credit with a size-tiered interest rate that is fixed for one year (8.50% under $250,000), compounded daily, plus a 2% annual capital charge on maximum outstanding. Draws start at up to 60% LTV. Full liquidation, with no collateral returned, if the in-app liquidation price is reached.",
  },
  {
    id: "coinbase",
    name: "Coinbase",
    slug: "coinbase",
    productName: "Crypto-backed USDC loan (via Morpho)",
    rateType: "variable",
    aprRangeLabel: "From 5.1% variable (live quote required)",
    preferredTiming: "revolving",
    tiers: [
      { minAmountUsd: 1, maxAmountUsd: 5_000_000, minLtvPct: 0, maxLtvPct: 86, minTermMonths: 1, maxTermMonths: 12, paymentTiming: "revolving", interestPct: 5.1, publishedAprPct: 5.1, originationPct: 2, originationInApr: false, originationTreatment: "added-to-principal", interestIsFloor: true, label: "Variable-rate, 2% processing fee on the first $250,000" },
    ],
    maxLtvPct: 86,
    typicalLtvPct: 50,
    warningLtvPct: null,
    marginCallLtvPct: null,
    liquidationLtvPct: 86,
    marginCallWindow: "Automatic on-chain liquidation at 86% LTV. App warnings are mentioned; no separately published margin-call LTV.",
    liquidationType: "full",
    liquidationFee: "4.38% penalty included when collateral is liquidated, per Coinbase Help. Remaining BTC is returned to the Coinbase account after the required amount is sold.",
    minLoanUsd: null,
    maxLoanUsd: 5_000_000,
    minLoanNote: "No stated minimum. You can borrow up to $5,000,000 USDC against Bitcoin. Transfer limits on Coinbase accounts still apply.",
    termsLabel: "Variable-rate loans have no set term, due date, or minimum payment. A separate fixed-rate Morpho product exists, with a 1% processing fee and a maturity date; early repayment does not reduce interest owed.",
    termMonthsAvailable: [12],
    originationFeeLabel: "Variable-rate processing fee: 2% on the first $250,000 and 1% on the amount above that, added to principal, accruing interest. Fixed-rate: 1% on the total. A separate Coinbase platform fee “may” apply (monthly on variable loans); the amount is only shown on the in-app review screen.",
    otherFees: "Gas fees are sponsored by Coinbase. Interest is set by the Morpho market and may include a Coinbase platform fee.",
    custodyShort: "cbBTC posted to Morpho on Base",
    custodyDetail: "BTC is converted to Coinbase Wrapped BTC (cbBTC) and transferred on-chain into a Morpho smart contract on Base as collateral. Coinbase provides the interface; loans are sourced on the Morpho protocol. This introduces wrapping, smart-contract, and oracle risk that custodial loans do not have.",
    rehypothecation: "defi-collateral",
    rehypothecationDetail: "Collateral sits in a Morpho market smart contract rather than with a named qualified custodian. Morpho’s general design does not lend collateral to other borrowers by default, but this is a protocol mechanism, not a Coinbase custody promise, and was not independently re-verified against Morpho docs in every market Coinbase uses.",
    usAvailability: "Available in the United States excluding New York, with limited access in the UK or Canada per Coinbase Help. Moving to an ineligible location may affect an existing loan.",
    kyc: "Verified Coinbase customer required.",
    eligibleAt10k: true,
    scenarioGroup: "variable-or-marketplace",
    eligibleAt10kNote: "The 5.1% figure is Coinbase’s advertised floor, not a locked 12-month rate. All-in for a 12-month hold is an estimate: 2% processing fee added to principal, plus 5.1% interest on the financed total. Any platform fee is excluded because the amount is not published.",
    sources: [
      { label: "Crypto-backed loans product page", url: "https://www.coinbase.com/borrow", accessed: A },
      { label: "Loan introduction (terms, eligibility, fees)", url: "https://help.coinbase.com/en/coinbase/trading-and-funding/loan/loan-intro", accessed: A },
      { label: "Processing fee schedule", url: "https://help.coinbase.com/en/coinbase/trading-and-funding/loan/fee", accessed: A },
      { label: "Collateral and 86% liquidation / 4.38% penalty", url: "https://help.coinbase.com/en/coinbase/trading-and-funding/loan/collateral", accessed: A },
    ],
    unverified: [
      "The live Morpho borrow rate changes continuously; 5.1% is the advertised floor, not today’s executable quote.",
      "Coinbase platform fee amount is not published (only shown on the loan review screen).",
      "Maximum initial LTV (as opposed to the 86% liquidation LTV) was not found on the official pages reviewed.",
      "Which exact Morpho markets Coinbase routes to is not fully disclosed.",
    ],
    summary: "A USDC loan against wrapped bitcoin (cbBTC) on Morpho, with a variable market rate advertised from 5.1%, a 2% processing fee on the first $250,000 added to your debt, and automatic liquidation at 86% LTV plus a 4.38% penalty. Available in the US except New York. Because the rate floats and a platform fee may apply, 12-month all-in is an estimate only.",
  },
  {
    id: "firefish",
    name: "Firefish",
    slug: "firefish",
    productName: "Bitcoin-backed marketplace / Instant loan",
    rateType: "marketplace",
    aprRangeLabel: "From 5% (market-driven, not a quote)",
    preferredTiming: "maturity",
    tiers: [
      { minAmountUsd: 800, maxAmountUsd: null, minLtvPct: 0, maxLtvPct: 50, minTermMonths: 3, maxTermMonths: 24, paymentTiming: "maturity", interestPct: 5, publishedAprPct: 5, originationPct: 1.5, originationInApr: false, originationTreatment: "from-collateral", interestIsFloor: true, label: "Advertised floor; actual rate is set by supply and demand or by an Instant Loan offer" },
    ],
    maxLtvPct: 50,
    typicalLtvPct: 50,
    warningLtvPct: 73,
    marginCallLtvPct: 73,
    liquidationLtvPct: 95,
    marginCallWindow: "Margin-call notifications at 73%, 79%, and 86% LTV. There is no published cure clock; top up collateral (partial repayment alone does not improve LTV).",
    liquidationType: "full",
    liquidationFee: "Price liquidation at 95% LTV liquidates the entire collateral (self-liquidation to the investor, or Firefish liquidation). Default at maturity uses a ~5% liquidation premium plus 15% p.a. default interest for the extra period.",
    minLoanUsd: 800,
    maxLoanUsd: null,
    minLoanNote: "Product page says from $800 to institutional-sized facilities. Account-tier limits apply (for example BASIC: EUR 15,000 per transaction). Exact USD minimum is shown in the app.",
    termsLabel: "3, 6, 12, 18, or 24 months. Bullet repayment at maturity.",
    termMonthsAvailable: [3, 6, 12, 18, 24],
    originationFeeLabel: "1.5% per 12 months of tenor, deducted from Bitcoin collateral: fee = 0.015 × loan amount × (tenor in days / 365).",
    otherFees: "Bitcoin network fees. Partial repayment does not improve LTV or release collateral — only a full repayment or a collateral top-up does.",
    custodyShort: "Non-custodial Bitcoin-mainnet multisig escrow",
    custodyDetail: "Collateral is held in a dedicated multisig escrow on Bitcoin mainnet, one on-chain address per loan. Firefish says there are no sidechains, wrapped tokens, or smart-contract risk, and that rehypothecation is impossible.",
    rehypothecation: "no",
    rehypothecationDetail: "Official product page: “Rehypothecation impossible. Collateral cannot be lent out, reused or pledged elsewhere.”",
    usAvailability: "Fiat payouts are EUR, CZK, CHF, or PLN. Stablecoin loans (USDC or USDT on Ethereum) are supported. Confirm current US eligibility and payout rails on the platform; this check did not find a published US-state list.",
    kyc: "Account verification tiers (ZERO, BASIC, INTERMEDIATE, PRO) set limits. Unverified (ZERO) accounts cannot borrow.",
    eligibleAt10k: true,
    scenarioGroup: "variable-or-marketplace",
    eligibleAt10kNote: "The 5% figure is an advertised floor, not a guaranteed quote. All-in adds the official 1.5% annual origination fee and is labeled an estimate.",
    sources: [
      { label: "Borrow product page", url: "https://firefish.io/borrow", accessed: A },
      { label: "General borrowing FAQ (fees, LTV, terms)", url: "https://docs.firefish.io/faq/borrowing/general", accessed: A },
      { label: "Collateral, margin calls, and 95% liquidation", url: "https://docs.firefish.io/faq/borrowing/collateral", accessed: A },
      { label: "Fee schedule (effective 2 January 2026)", url: "https://app.firefish.io/pdf/2026-01-02/fee-schedule.pdf", accessed: A },
    ],
    unverified: [
      "The rate you actually get is market-driven or set on an Instant Loan offer; 5% is a floor, not a quote.",
      "US state-level eligibility is not published on the pages reviewed.",
      "Exact USD minimum can differ from the “from $800” marketing figure; it is shown in the app.",
    ],
    summary: "A non-custodial Bitcoin-mainnet marketplace (and Instant Loan option) with rates advertised from 5%, a 1.5% per-year origination fee taken from collateral, a 50% starting LTV on amount due, and liquidation at 95% LTV. US borrowers would use USDC or USDT rather than a USD bank wire.",
  },
  {
    id: "unchained",
    name: "Unchained",
    slug: "unchained",
    productName: "Commercial bitcoin-backed loan",
    rateType: "fixed",
    aprRangeLabel: "14.18% APR published example (12% interest + 2% origination)",
    preferredTiming: "monthly",
    tiers: [
      { minAmountUsd: 150_000, maxAmountUsd: null, minLtvPct: 0, maxLtvPct: 50, minTermMonths: 12, maxTermMonths: 12, paymentTiming: "monthly", interestPct: 12, publishedAprPct: 14.18, originationPct: 2, originationInApr: true, originationTreatment: "deducted", label: "Published pricing-page example; subject to application and approval" },
    ],
    maxLtvPct: 50,
    typicalLtvPct: 50,
    warningLtvPct: null,
    marginCallLtvPct: 66.67,
    liquidationLtvPct: 83.33,
    marginCallWindow: "CTP violation below 150% CTP (about 66.67% LTV): 24 hours to restore. At 120% CTP (about 83.33% LTV): immediate foreclosure notice, then liquidation. Once the foreclosure notice is sent it cannot be reversed.",
    liquidationType: "full",
    liquidationFee: "A forced liquidation incurs a 2% selling fee. Unchained Trading, LLC also charges a selling fee on collateral sales, deducted from proceeds. Late payment $10; returned ACH $15.",
    minLoanUsd: 150_000,
    maxLoanUsd: null,
    minLoanNote: "In most eligible states: $150,000 minimum for business entities (LLC, Inc., LP) and $500,000 for individuals, trusts, and sole proprietors. Vermont is $1,000,000 for all types. Michigan, Mississippi, and Ohio: entities only at $150,000; individuals ineligible.",
    termsLabel: "360-day term, interest-only payments every 30 days, principal due at maturity (12-payment term).",
    termMonthsAvailable: [12],
    originationFeeLabel: "2.00%, included in the 14.18% APR example. Included in the total amount borrowed but not in the amount disbursed.",
    otherFees: "No prepayment penalties. No credit check required, per the loans page. Application and approval required. Pricing-page figures are examples.",
    custodyShort: "2-of-3 collaborative multisig (you hold a key), no rehypothecation",
    custodyDetail: "Collateral is in a collaborative multisig. Unchained, Fortis Bank, and the borrower (or borrower’s company) each hold a key; no single party can move the bitcoin. The borrower can verify collateral on-chain with a key they control.",
    rehypothecation: "no",
    rehypothecationDetail: "Official product: “Bitcoin-backed loans with zero rehypothecation.” Bitcoin cannot be moved or rehypothecated by Unchained, Fortis Bank, or the borrower acting alone.",
    usAvailability: "Commercial loans in most US states. Ineligible in Louisiana, Montana, Nevada, New Mexico, New York, North Dakota, South Dakota, and Puerto Rico. See Unchained’s official eligibility table for per-state minimums.",
    kyc: "Commercial loan application and approval required. No credit check, per the loans page.",
    eligibleAt10k: false,
    scenarioGroup: "not-at-this-size",
    eligibleAt10kNote: "Minimum is $150,000 for most business entities and $500,000 for individuals. A $10,000 loan is not offered.",
    sources: [
      { label: "Pricing (12% interest, 2% origination, 14.18% APR example)", url: "https://www.unchained.com/pricing?tab=loans-pricing", accessed: A },
      { label: "Loans product page", url: "https://www.unchained.com/loans", accessed: A },
      { label: "Commercial loan terms", url: "https://help.unchained.com/what-are-unchained-loan-terms", accessed: A },
      { label: "State eligibility", url: "https://help.unchained.com/is-my-state-eligible-for-a-loan", accessed: A },
      { label: "CTP violation and liquidation thresholds", url: "https://help.unchained.com/what-is-a-ctp-violation", accessed: A },
    ],
    unverified: [
      "The 14.18% APR is a published example; Unchained says actual terms are subject to a complete application and approval. A help-page calculator disclaimer is still dated 11/10/2025 and points readers to the pricing page.",
      "Exact CTP covenants can be loan-agreement specific; the 150% / 120% figures are from Unchained’s help article.",
    ],
    summary: "A 360-day commercial loan at a published example of 12% interest and 14.18% APR, including a 2% origination fee, with 200% collateral-to-principal (50% LTV) and collaborative 2-of-3 multisig custody. Minimums start at $150,000 for entities and $500,000 for individuals, so it is outside the $10,000 ranking.",
  },
  {
    id: "apx",
    name: "APX",
    slug: "apx",
    productName: "Fixed-rate bitcoin-backed loan",
    rateType: "fixed",
    aprRangeLabel: "9.99%–11.49% annual interest",
    preferredTiming: "monthly",
    tiers: [
      { minAmountUsd: 25_000, maxAmountUsd: 99_999.99, minLtvPct: 20, maxLtvPct: 60, minTermMonths: 12, maxTermMonths: 60, paymentTiming: "monthly", interestPct: 11.49, publishedAprPct: 11.49, originationPct: 0, originationInApr: true, originationTreatment: "none", label: "Below $100,000" },
      { minAmountUsd: 100_000, maxAmountUsd: 1_000_000, minLtvPct: 20, maxLtvPct: 60, minTermMonths: 12, maxTermMonths: 60, paymentTiming: "monthly", interestPct: 10.99, publishedAprPct: 10.99, originationPct: 0, originationInApr: true, originationTreatment: "none" },
      { minAmountUsd: 1_000_000.01, maxAmountUsd: null, minLtvPct: 20, maxLtvPct: 60, minTermMonths: 12, maxTermMonths: 60, paymentTiming: "monthly", interestPct: 9.99, publishedAprPct: 9.99, originationPct: 0, originationInApr: true, originationTreatment: "none" },
    ],
    maxLtvPct: 60,
    typicalLtvPct: 50,
    warningLtvPct: 80,
    marginCallLtvPct: null,
    liquidationLtvPct: 90,
    marginCallWindow: "Automated warnings every six hours above 80% LTV. You are not required to add collateral at the warning level.",
    liquidationType: "partial",
    liquidationFee: "None. At 90% LTV the “90/85 Standard” triggers a partial sale targeting about 85% LTV, with no liquidation fee.",
    minLoanUsd: 25_000,
    maxLoanUsd: null,
    minLoanNote: "United States: $25,000 USDC, businesses only. Canada: $10,000 CAD or USDC for individuals and businesses.",
    termsLabel: "1, 2, 3, 4, or 5 years. Rate is fixed for the full term. Interest accrues daily and is billed monthly.",
    termMonthsAvailable: [12, 24, 36, 48, 60],
    originationFeeLabel: "No origination, admin, or liquidation fees.",
    otherFees: "Early repayment (full or partial) is charged a fee of 3 months’ interest on the amount repaid.",
    custodyShort: "Segregated BitGo Trust cold storage, no rehypothecation",
    custodyDetail: "APX says collateral is held in dedicated, segregated BitGo Trust cold-storage wallets, is never pooled, rehypothecated, or used to earn yield, and that the borrower keeps legal title (APX holds a security interest). BitGo custody insurance is described as up to $250M in aggregate, subject to policy terms, and is not per-borrower.",
    rehypothecation: "no",
    rehypothecationDetail: "Official: collateral is never pooled, rehypothecated, or used to earn yield.",
    usAvailability: "US lending is to eligible businesses only (not individuals), funded in USDC, $25,000 minimum. APX says it is registered with FinCEN in the US and CSA-approved and FINTRAC-registered in Canada. No US state-level list was published on the bitcoin-loans page.",
    kyc: "Identity verification and an eligibility review. No credit check.",
    eligibleAt10k: false,
    scenarioGroup: "not-at-this-size",
    eligibleAt10kNote: "US product is businesses only with a $25,000 USDC minimum. A $10,000 loan is not offered to US borrowers.",
    sources: [
      { label: "Bitcoin-backed loans (rates, LTV, custody, US business terms)", url: "https://apxlending.com/bitcoin-loans", accessed: A },
    ],
    unverified: [
      "No US state-level eligibility list was published on the product page.",
      "Whether 11.49% is a formal APR disclosure or a simple annual interest rate is labeled as “annual rate” / “fixed annual interest” on the product page.",
    ],
    summary: "Fixed annual interest of 11.49% below $100,000, with no origination or liquidation fees, 20–60% origination LTV, and partial liquidation at 90% LTV with no fee. In the US this is a business-only product starting at $25,000 USDC, so it is outside the $10,000 individual ranking.",
  },
  {
    id: "debifi",
    name: "Debifi",
    slug: "debifi",
    productName: "Bitcoin-backed marketplace loan",
    rateType: "marketplace",
    aprRangeLabel: "Lender-set; no published rate card (FAQ walkthrough uses 12% and 10% as examples only)",
    preferredTiming: "monthly",
    tiers: [],
    maxLtvPct: 70,
    typicalLtvPct: 50,
    warningLtvPct: 75,
    marginCallLtvPct: 75,
    liquidationLtvPct: 90,
    marginCallWindow: "Alerts at 75%, 80%, and 85% LTV; forced liquidation at 90% LTV, or at a stricter threshold the lender sets. Optional delayed liquidation (12–48 hours) if the lender enables it.",
    liquidationType: "full",
    liquidationFee: "5% of outstanding debt (remaining loan + accrued interest) at LTV liquidation, or 5% of the missed payment if liquidation is for non-payment.",
    minLoanUsd: 20_000,
    maxLoanUsd: null,
    minLoanNote: "$20,000 minimum for stablecoin and fiat loans; $500 minimum for US-only prepaid Visa card loans (no origination fee on card loans). No stated maximum.",
    termsLabel: "1 to 24 months, with monthly, quarterly, semi-annual, or annual payment schedules set by the offer.",
    termMonthsAvailable: [1, 3, 6, 12, 18, 24],
    originationFeeLabel: "1.5% up to $300,000; 1.2% from $300,001 to $1,000,000; 1.0% above $1,000,000. Plus 0.3% in year two and 0.6% in year three. Paid in bitcoin from escrow. Card loans: no origination fee.",
    otherFees: "No early-repayment fee. Extension fees are 0.75% or 1.5% (under $300,000) depending on extension length. Borrower pays Bitcoin network fees.",
    custodyShort: "Non-custodial 3-of-4 multisig (2-of-3 for card loans)",
    custodyDetail: "Each contract has a unique Bitcoin multisig escrow. Stablecoin and fiat loans use 3-of-4 keys (borrower, lender, Debifi, and an Authorized Key Holder — AnchorWatch Inc. or Hodling SA). Card loans use 2-of-3 (borrower, lender, Debifi). Debifi cannot move funds alone. An escrow extractor tool is available on request.",
    rehypothecation: "no",
    rehypothecationDetail: "Bitcoin is locked in a per-contract on-chain multisig escrow. Debifi states it does not hold the funds and holds only one key for arbitration.",
    usAvailability: "Stablecoin and fiat loans are available globally. Prepaid Visa card loans are currently available in the USA only.",
    kyc: "All loan offers require KYC/KYB, conducted by a third-party provider such as Didit, or by a provider the lender uses.",
    eligibleAt10k: false,
    scenarioGroup: "not-at-this-size",
    eligibleAt10kNote: "Standard stablecoin and fiat loans start at $20,000. A $10,000 standard loan is not offered. US card loans start at $500 but have no published rate card, so they cannot be ranked.",
    sources: [
      { label: "Debifi FAQ (fees, LTV, liquidation, KYC, US card loans)", url: "https://debifi.com/faq", accessed: A },
      { label: "Debifi home", url: "https://debifi.com/", accessed: A },
    ],
    unverified: [
      "No published APR schedule — rates are set by each lender offer. FAQ figures of 10% and 12% are worked examples, not quotes.",
      "The liquidation threshold may be stricter than 90% if a lender sets a custom ratio.",
    ],
    summary: "A non-custodial marketplace with 3-of-4 (or 2-of-3 for US card loans) Bitcoin multisig escrow, lender-set rates and LTVs (30–70%), a 1.5% origination fee on typical first-year loans under $300,000, and a standard 90% liquidation threshold with a 5% fee. Standard loans start at $20,000, so they sit outside the $10,000 ranking.",
  },
];

export function getLender(idOrSlug: string): Lender | undefined {
  return lenders.find((l) => l.id === idOrSlug || l.slug === idOrSlug);
}

export function getLenderBySlug(slug: string): Lender | undefined {
  return lenders.find((l) => l.slug === slug);
}
