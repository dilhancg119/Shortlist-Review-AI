import Link from "next/link";
import { TEAM_FUNCTIONS, type Company, type CompanyId, type PriceBand } from "@/lib/companies";
import type { Ranked } from "@/lib/fit";
import { CompanyMark } from "./company-mark";
import { CompareGrid, CompareRow } from "./matrix";
import { Panel, Tip, number } from "./ui";

/* -------------------------------------------------------------------------- */
/* Catalogue counts                                                            */
/* -------------------------------------------------------------------------- */

export type MetricRow = {
  label: string;
  hint?: string;
  value: (company: Company) => { count: number; note: string };
};

/** Counts per company with a thin bar scaled to the largest value in the row. */
export function MetricRows({ companies, rows }: { companies: Company[]; rows: MetricRow[] }) {
  return (
    <CompareGrid companies={companies}>
      {rows.map((row) => {
        const values = companies.map((c) => row.value(c));
        const max = Math.max(...values.map((v) => v.count), 1);
        return (
          <CompareRow key={row.label} count={companies.length} label={row.label} hint={row.hint}>
            {companies.map((company, i) => (
              <div key={company.id} className={`co-${company.id} min-w-0 pr-3`}>
                <p className="text-[1.25rem] font-semibold leading-none text-ink">
                  {number.format(values[i].count)}
                </p>
                <div className="mt-2 h-1.5 max-w-40">
                  <div
                    className="h-full rounded-r-[3px] bg-co"
                    style={{ width: values[i].count === 0 ? 0 : `max(3px, ${(values[i].count / max) * 100}%)` }}
                  />
                </div>
                <p className="mt-2 text-[0.75rem] leading-snug text-ink-2">{values[i].note}</p>
              </div>
            ))}
          </CompareRow>
        );
      })}
    </CompareGrid>
  );
}

/* -------------------------------------------------------------------------- */
/* Published prices                                                            */
/* -------------------------------------------------------------------------- */

const PRICE_MIN = 50;
const PRICE_MAX = 10000;
const PRICE_TICKS = [
  { value: 50, label: "$50", minor: true },
  { value: 100, label: "$100", minor: false },
  { value: 500, label: "$500", minor: true },
  { value: 1000, label: "$1,000", minor: false },
  { value: 5000, label: "$5,000", minor: true },
  { value: 10000, label: "$10,000", minor: false },
];

/** Position on a log scale, as a fraction of the plot width. */
function pricePosition(value: number) {
  return (Math.log(value) - Math.log(PRICE_MIN)) / (Math.log(PRICE_MAX) - Math.log(PRICE_MIN));
}

/**
 * Published price ranges on one shared log axis. Prices span two orders of
 * magnitude, so a linear axis would flatten the lower ranges to nothing.
 */
export function PriceRanges({ companies }: { companies: Company[] }) {
  type Row = { company: Company; band: PriceBand | null; first: boolean };
  const rows = companies.flatMap<Row>((company) =>
    company.prices.length
      ? company.prices.map((band, i) => ({ company, band, first: i === 0 }))
      : [{ company, band: null, first: true }],
  );

  return (
    <Panel className="px-4 py-4 sm:px-5">
      <div className="md:grid md:grid-cols-[12rem_minmax(0,1fr)] md:gap-x-4">
        {rows.map(({ company, band, first }) => (
          <div key={`${company.id}-${band?.label ?? "none"}`} className={`co-${company.id} contents`}>
            <div className={`flex items-center gap-x-2 md:block md:py-1.5 ${first ? "pt-3 md:pt-1.5" : "pt-1"}`}>
              {first ? <CompanyMark company={company} label="short" size="sm" /> : null}
              {band ? <p className="text-[0.75rem] text-ink-2 md:mt-0.5">{band.label}</p> : null}
            </div>
            <div className="relative h-9 md:self-center">
              {/* gridlines */}
              {PRICE_TICKS.map((tick) => (
                <span
                  key={tick.value}
                  aria-hidden
                  className={`absolute inset-y-0 w-px bg-line ${tick.minor ? "hidden sm:block" : ""}`}
                  style={{ left: `${pricePosition(tick.value) * 100}%` }}
                />
              ))}
              {band ? (
                <PriceMark min={band.min} max={band.max} note={band.note} />
              ) : (
                <p className="absolute inset-y-0 left-3 flex items-center bg-surface px-2 text-[0.8125rem] text-ink-3">
                  No prices published
                </p>
              )}
            </div>
          </div>
        ))}

        {/* axis */}
        <div className="hidden md:block" />
        <div className="relative mt-1 h-6 border-t border-line-strong">
          {PRICE_TICKS.map((tick, i) => (
            <span
              key={tick.value}
              className={`absolute top-1.5 text-[0.75rem] tabular-nums text-ink-3 ${tick.minor ? "hidden sm:block" : ""} ${
                i === 0 ? "" : i === PRICE_TICKS.length - 1 ? "-translate-x-full" : "-translate-x-1/2"
              }`}
              style={{ left: `${pricePosition(tick.value) * 100}%` }}
            >
              {tick.label}
            </span>
          ))}
        </div>
      </div>
      <p className="mt-3 text-[0.75rem] text-ink-3">
        USD per person, as published on each site. Log scale: each gridline step is a multiple, not a fixed amount.
      </p>
    </Panel>
  );
}

function PriceMark({ min, max, note }: { min: number; max: number; note: string }) {
  const start = pricePosition(min) * 100;
  const end = pricePosition(max) * 100;
  const labelLeft = end > 60;
  const label = `$${number.format(min)} to $${number.format(max)}`;
  return (
    <>
      <Tip
        content={
          <>
            <span className="block font-semibold">{label}</span>
            <span className="block text-surface/75">{note}</span>
          </>
        }
        align={labelLeft ? "end" : "start"}
        positioned
        style={{ left: `${start}%`, width: `max(10px, ${end - start}%)` }}
        className="absolute top-1/2 h-6 -translate-y-1/2 items-center"
      >
        <span className="sr-only">
          {label}. {note}
        </span>
        <span aria-hidden className="block h-2 w-full rounded-full bg-co" />
      </Tip>
      <span
        aria-hidden
        className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap text-[0.75rem] font-medium tabular-nums text-ink"
        style={
          labelLeft
            ? { right: `calc(${100 - start}% + 8px)` }
            : { left: `calc(${end}% + 8px)` }
        }
      >
        {label}
      </span>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Review volume                                                               */
/* -------------------------------------------------------------------------- */

/** Total public reviews per company, with the platforms that make up each total. */
export function ReviewVolume({ companies }: { companies: Company[] }) {
  const totals = companies.map((c) => {
    const counted = c.reviews.filter((r) => r.count !== null);
    return counted.length ? counted.reduce((sum, r) => sum + (r.count ?? 0), 0) : null;
  });
  const max = Math.max(...totals.map((t) => t ?? 0), 1);

  return (
    <Panel className="divide-y divide-line">
      {companies.map((company, i) => {
        const total = totals[i];
        return (
          <div
            key={company.id}
            className={`co-${company.id} grid gap-x-4 gap-y-2 px-4 py-4 sm:px-5 md:grid-cols-[12rem_minmax(0,1fr)]`}
          >
            <div>
              <CompanyMark company={company} label="short" />
            </div>
            <div className="min-w-0">
              {total === null ? (
                <p className="flex h-5 items-center text-[0.8125rem] text-ink-3">Review counts not published</p>
              ) : (
                <div className="flex h-5 items-center gap-2 pr-16">
                  <Tip
                    align="start"
                    content={
                      <>
                        <span className="block font-semibold">{number.format(total)} public reviews</span>
                        {company.reviews.map((r) => (
                          <span key={r.platform} className="block text-surface/75">
                            {r.platform}: {r.count === null ? "not published" : number.format(r.count)}
                          </span>
                        ))}
                      </>
                    }
                    style={{ width: `max(3px, ${(total / max) * 100}%)` }}
                    className="h-5 shrink-0 items-center"
                  >
                    <span aria-hidden className="block h-4 w-full rounded-r-[4px] bg-co" />
                  </Tip>
                  <span className="text-[0.875rem] font-semibold tabular-nums text-ink">
                    {number.format(total)}
                  </span>
                </div>
              )}
              <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                {company.reviews.map((r) => (
                  <div key={r.platform} className="min-w-[8.5rem]">
                    <dt className="text-[0.75rem] text-ink-3">{r.platform}</dt>
                    <dd className="text-[0.8125rem] text-ink">
                      <span className="font-semibold">{r.rating ?? "No rating"}</span>
                      <span className="text-ink-2">
                        {" "}
                        {r.count === null ? "rating, count not shown" : `from ${number.format(r.count)} reviews`}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-2 text-[0.75rem] text-ink-3">{company.reviewNote}</p>
            </div>
          </div>
        );
      })}
    </Panel>
  );
}

/* -------------------------------------------------------------------------- */
/* Team shape                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * One dot per visible person, by function. Filled dots have a named profile
 * on the company's team page; ringed dots are evidenced another way.
 */
export function TeamShape({ companies }: { companies: Company[] }) {
  const functions = TEAM_FUNCTIONS.filter((f) =>
    companies.some((c) => c.team.counts[f.id].profiled + c.team.counts[f.id].other > 0),
  );

  return (
    <div>
      <CompareGrid companies={companies} header={(c) => c.team.countsBasis}>
        {functions.map((fn) => (
          <CompareRow key={fn.id} count={companies.length} label={fn.label}>
            {companies.map((company, i) => {
              const count = company.team.counts[fn.id];
              const total = count.profiled + count.other;
              const align = i === 0 ? "start" : i === companies.length - 1 ? "end" : "center";
              return (
                <div key={company.id} className={`co-${company.id} min-w-0 pr-3`}>
                  {total === 0 ? (
                    <p className="text-[0.8125rem] text-ink-3">{count.note ?? "None shown"}</p>
                  ) : (
                    <>
                      <Tip
                        align={align}
                        content={
                          <>
                            <span className="block font-semibold">
                              {total} in {fn.label.toLowerCase()}
                            </span>
                            {count.note ? <span className="block text-surface/75">{count.note}</span> : null}
                          </>
                        }
                        className="items-start gap-2 rounded-sm py-0.5"
                      >
                        <span className="w-5 shrink-0 text-[0.875rem] font-semibold tabular-nums leading-[0.875rem] text-ink">
                          {total}
                        </span>
                        <span aria-hidden className="flex flex-wrap gap-[3px] pt-[1px]">
                          {Array.from({ length: count.profiled }, (_, k) => (
                            <span key={`p${k}`} className="size-2.5 rounded-full bg-co" />
                          ))}
                          {Array.from({ length: count.other }, (_, k) => (
                            <span key={`o${k}`} className="size-2.5 rounded-full border-[1.5px] border-co" />
                          ))}
                        </span>
                      </Tip>
                      {count.note ? (
                        <p className="mt-1 hidden text-[0.75rem] leading-snug text-ink-2 md:block">{count.note}</p>
                      ) : null}
                    </>
                  )}
                </div>
              );
            })}
          </CompareRow>
        ))}
        <CompareRow
          count={companies.length}
          label="Back-office roles visible"
          hint="Everyone on the team page except leadership: the likely system users"
        >
          {companies.map((company) => (
            <p key={company.id} className="text-[1.25rem] font-semibold leading-none text-ink">
              {backOfficeCount(company)}
            </p>
          ))}
        </CompareRow>
      </CompareGrid>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[0.75rem] text-ink-2">
        <li className="flex items-center gap-1.5">
          <span aria-hidden className="size-2.5 rounded-full bg-ink-2" />
          Named profile on the team page
        </li>
        <li className="flex items-center gap-1.5">
          <span aria-hidden className="size-2.5 rounded-full border-[1.5px] border-ink-2" />
          Named in guest reviews, or pictured without a name
        </li>
      </ul>
    </div>
  );
}

export function backOfficeCount(company: Company) {
  return TEAM_FUNCTIONS.filter((f) => f.backOffice).reduce(
    (sum, f) => sum + company.team.counts[f.id].profiled + company.team.counts[f.id].other,
    0,
  );
}

/* -------------------------------------------------------------------------- */
/* Fit ranking                                                                 */
/* -------------------------------------------------------------------------- */

/** Ranked fit scores as meters out of 100. Ranks are always out of all three. */
export function FitRanking({
  ranked,
  companies,
  total,
  reasons,
}: {
  ranked: Ranked[];
  companies: Record<CompanyId, Company>;
  total: number;
  /** "headline" shows a few words beside the name; "verdict" adds the full sentence. */
  reasons?: "headline" | "verdict";
}) {
  return (
    <ol className="divide-y divide-line">
      {ranked.map((entry) => {
        const company = companies[entry.id];
        return (
          <li
            key={entry.id}
            className={`co-${entry.id} grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-2 px-4 py-4 sm:px-5`}
          >
            <span className="pt-0.5 text-[0.8125rem] font-medium tabular-nums text-ink-3">
              <span className="sr-only">Rank </span>
              {entry.rank}
              <span className="sr-only"> of {total}</span>
            </span>
            <div className="min-w-0">
              <div className="flex items-start justify-between gap-x-4 sm:items-center">
                <p className="flex min-w-0 flex-col gap-x-3 gap-y-1 sm:flex-row sm:items-center">
                  <CompanyMark company={company} />
                  {reasons === "headline" ? (
                    <span className="text-[0.8125rem] text-ink-2">{company.pitch.headline}</span>
                  ) : null}
                </p>
                <p className="shrink-0 text-[0.8125rem] text-ink-2">
                  <span className="text-[1.125rem] font-semibold text-ink">{entry.score}</span> / 100
                </p>
              </div>
              <div
                role="meter"
                aria-label={`${company.name} fit score`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={entry.score}
                className="co-track mt-2.5 h-2 overflow-hidden rounded-full"
              >
                <div
                  className="h-full rounded-full bg-co"
                  style={{ width: `${entry.score}%` }}
                />
              </div>
              {reasons === "verdict" ? (
                <p className="mt-2.5 max-w-[40rem] text-[0.8125rem] leading-relaxed text-ink-2">
                  {company.pitch.verdict}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center text-[0.8125rem] font-medium text-ink underline decoration-line-strong underline-offset-4 transition-colors duration-150 hover:decoration-ink lg:min-h-0"
    >
      {children}
    </Link>
  );
}
