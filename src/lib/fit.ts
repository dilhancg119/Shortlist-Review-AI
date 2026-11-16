import { COMPANIES, type CompanyId } from "./companies";

/**
 * Booking-system fit: our assessment, not a measurement.
 *
 * Each company is scored 1 to 5 on five criteria from website evidence. The
 * weighted average becomes a score out of 100. Weights can be changed on the
 * Opportunity page; edit the scores here as discovery calls bring better data.
 */

export type CriterionId = "demand" | "gap" | "product" | "team" | "headroom";

export type Criterion = {
  id: CriterionId;
  label: string;
  question: string;
  weight: number;
  scores: Record<CompanyId, { score: number; evidence: string }>;
};

export const CRITERIA: Criterion[] = [
  {
    id: "demand",
    label: "Demand signal",
    question: "Is there enough booking volume to justify a system?",
    weight: 25,
    scores: {
      green: { score: 2, evidence: "156 public reviews across Google and Tripadvisor." },
      reddot: { score: 3, evidence: "Counts unpublished; two offices and six destinations suggest steady volume." },
      blue: { score: 5, evidence: "About 3,430 public reviews across Tripadvisor and Trustpilot." },
    },
  },
  {
    id: "gap",
    label: "Process gap",
    question: "How much of the booking flow is still manual?",
    weight: 25,
    scores: {
      green: { score: 5, evidence: "No checkout, payment or portal. Priced tours are sold over WhatsApp." },
      reddot: { score: 2, evidence: "Payment Centre, guest portal and live chat are already in place." },
      blue: { score: 4, evidence: "Quote by form and email; no prices, checkout or visible payment." },
    },
  },
  {
    id: "product",
    label: "Product fit",
    question: "Can the catalogue be sold as fixed, priced inventory?",
    weight: 20,
    scores: {
      green: { score: 5, evidence: "10 priced day tours, priced packages, vehicle hire and event seats." },
      reddot: { score: 1, evidence: "Every trip is built from scratch; nothing is sold off the shelf." },
      blue: { score: 4, evidence: "19 day tours, transfers, train tickets and 1,000+ properties, none priced yet." },
    },
  },
  {
    id: "team",
    label: "Team readiness",
    question: "Are there people whose daily work the system would run?",
    weight: 15,
    scores: {
      green: { score: 5, evidence: "28 profiled staff, including tour executives, finance and a head of operations." },
      reddot: { score: 4, evidence: "Seven profiled consultants across Colombo and the UK." },
      blue: { score: 5, evidence: "Eleven profiled office staff with reservations and revenue roles." },
    },
  },
  {
    id: "headroom",
    label: "Commercial headroom",
    question: "Is there budget and room for us, without an incumbent?",
    weight: 15,
    scores: {
      green: { score: 3, evidence: "No incumbent tooling and a technology-minded director, but low price points." },
      reddot: { score: 2, evidence: "High ticket sizes, but existing tooling would need displacing." },
      blue: { score: 4, evidence: "Award-winning, mid to luxury, and no visible booking tooling." },
    },
  },
];

export type Weights = Record<CriterionId, number>;

export const DEFAULT_WEIGHTS = Object.fromEntries(CRITERIA.map((c) => [c.id, c.weight])) as Weights;

/** Weighted fit score, 0 to 100. Returns 0 when every weight is 0. */
export function fitScore(id: CompanyId, weights: Weights = DEFAULT_WEIGHTS): number {
  const total = CRITERIA.reduce((sum, c) => sum + weights[c.id], 0);
  if (total === 0) return 0;
  const weighted = CRITERIA.reduce((sum, c) => sum + c.scores[id].score * weights[c.id], 0);
  return Math.round((weighted / total / 5) * 100);
}

export type Ranked = { id: CompanyId; score: number; rank: number };

/** Ranks all three companies, so a filtered view still shows true positions. */
export function ranking(weights: Weights = DEFAULT_WEIGHTS): Ranked[] {
  const sorted = COMPANIES.map((c) => ({ id: c.id, score: fitScore(c.id, weights) })).sort(
    (a, b) => b.score - a.score,
  );
  return sorted.map((entry, i) => ({
    ...entry,
    // Ties share the better rank.
    rank: sorted.findIndex((s) => s.score === entry.score) + 1 || i + 1,
  }));
}
