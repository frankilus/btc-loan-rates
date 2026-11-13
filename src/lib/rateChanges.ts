import data from "@/data/rate-changes.json";
import { lenders } from "./lenders";

export type RateChangeType =
  | "baseline"
  | "rate-change"
  | "fee-change"
  | "policy-change"
  | "no-change";

export interface RateChange {
  date: string;
  lenderId: string;
  type: RateChangeType;
  summary: string;
  source: string;
}

export const rateChanges: RateChange[] = (data.entries as RateChange[])
  .slice()
  .sort((a, b) => b.date.localeCompare(a.date));

export const lenderName = (id: string) => lenders.find((l) => l.id === id)?.name ?? id;
export const latestRateChangeDate = rateChanges[0]?.date;
