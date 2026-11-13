import { lenders, type Lender } from "./lenders";

export const SITE_URL = "https://btc-loan-rates.vercel.app";

export interface ComparePair {
  slug: string;
  a: Lender;
  b: Lender;
}

/** Every unique pair among the lenders that can be priced at $10k. */
export const CORE_IDS = [
  "salt",
  "figure",
  "arch",
  "strike",
  "ledn",
  "lava",
  "coinbase",
  "firefish",
] as const;

/** High-intent pairs that include lenders with higher minimums. */
export const EXTRA_PAIRS: [string, string][] = [
  ["unchained", "salt"],
  ["unchained", "arch"],
  ["unchained", "strike"],
  ["apx", "salt"],
  ["apx", "ledn"],
  ["debifi", "firefish"],
  ["debifi", "unchained"],
  ["debifi", "salt"],
];

export function getAllComparePairs(): ComparePair[] {
  const pairs: ComparePair[] = [];
  const core = lenders.filter((l) => (CORE_IDS as readonly string[]).includes(l.id));
  for (let i = 0; i < core.length; i++) {
    for (let j = i + 1; j < core.length; j++) {
      const a = core[i];
      const b = core[j];
      pairs.push({ slug: `${a.id}-vs-${b.id}`, a, b });
    }
  }
  for (const [aId, bId] of EXTRA_PAIRS) {
    const a = lenders.find((l) => l.id === aId);
    const b = lenders.find((l) => l.id === bId);
    if (a && b) pairs.push({ slug: `${a.id}-vs-${b.id}`, a, b });
  }
  return pairs;
}

export function getPairsForLender(id: string): ComparePair[] {
  return getAllComparePairs().filter((p) => p.a.id === id || p.b.id === id);
}

export function getComparePair(slug: string): ComparePair | undefined {
  return getAllComparePairs().find((p) => p.slug === slug);
}

export function parseCompareSlug(slug: string): { aId: string; bId: string } | null {
  const m = /^([a-z0-9]+)-vs-([a-z0-9]+)$/.exec(slug);
  if (!m) return null;
  return { aId: m[1], bId: m[2] };
}

export function getLenderById(id: string): Lender | undefined {
  return lenders.find((l) => l.id === id);
}

export function resolveComparePair(slug: string): ComparePair | undefined {
  const direct = getComparePair(slug);
  if (direct) return direct;
  const parsed = parseCompareSlug(slug);
  if (!parsed) return undefined;
  const a = getLenderById(parsed.aId);
  const b = getLenderById(parsed.bId);
  if (!a || !b || a.id === b.id) return undefined;
  return getComparePair(`${b.id}-vs-${a.id}`);
}
