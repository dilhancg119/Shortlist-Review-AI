import {
  CAPABILITIES,
  JOURNEY_STAGES,
  TEAM_FUNCTIONS,
  type Company,
  type Status,
} from "@/lib/companies";
import { CRITERIA } from "@/lib/fit";
import { TextLink } from "./charts";
import { CompanyMark } from "./company-mark";
import { Panel, Tip, number } from "./ui";

/* -------------------------------------------------------------------------- */
/* Shared pieces                                                               */
/* -------------------------------------------------------------------------- */

/** A chart with its title, the one thing to take from it, and a way to dig in. */
export function ChartCard({
  title,
  takeaway,
  href,
  linkLabel,
  children,
}: {
  title: string;
  takeaway: string;
  href?: string;
  linkLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <Panel className="flex flex-col px-4 py-4 sm:px-5">
      <h3 className="text-[0.9375rem] font-semibold tracking-[-0.005em] text-ink">{title}</h3>
      <p className="mt-1 text-[0.8125rem] leading-relaxed text-ink-2">{takeaway}</p>
      <div className="mt-4 flex-1">{children}</div>
      {href && linkLabel ? (
        <p className="mt-3 border-t border-line pt-0.5 lg:mt-4 lg:pt-3">
          <TextLink href={href}>{linkLabel}</TextLink>
        </p>
      ) : null}
    </Panel>
  );
}

/** Colour key for charts that plot several companies together. */
function CompanyLegend({ companies }: { companies: Company[] }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-[0.75rem] text-ink-2">
      {companies.map((company) => (
        <li key={company.id} className={`co-${company.id} flex items-center gap-1.5`}>
          <span aria-hidden className="size-2.5 rounded-full bg-co" />
          {company.short}
        </li>
      ))}
    </ul>
  );
}

function SwatchLegend({ items }: { items: { label: string; className: string }[] }) {
  return (
    <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[0.75rem] text-ink-2">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-1.5">
          <span aria-hidden className={`size-2.5 rounded-[3px] ${item.className}`} />
          {item.label}
        </li>
      ))}
    </ul>
  );
}

/* -------------------------------------------------------------------------- */
/* Score profile                                                               */
/* -------------------------------------------------------------------------- */

const SCORES = [1, 2, 3, 4, 5];
const scorePosition = (score: number) => ((score - 1) / 4) * 100;

/**
 * Dot plot of the five fit criteria. Each row shows where the companies sit
 * from 1 to 5, and the line between them shows how far apart they are.
 */
export function ScoreProfile({ companies }: { companies: Company[] }) {
  return (
    <div>
      <CompanyLegend companies={companies} />
      <div className="mt-3">
        {CRITERIA.map((criterion) => {
          const scores = companies.map((c) => criterion.scores[c.id].score);
          const low = Math.min(...scores);
          const high = Math.max(...scores);
          return (
            <div
              key={criterion.id}
              className="grid gap-x-3 border-t border-line py-1.5 sm:grid-cols-[9.5rem_minmax(0,1fr)] sm:items-center"
            >
              <p className="pt-1 text-[0.8125rem] font-medium text-ink sm:pt-0">{criterion.label}</p>
              <div className="relative mx-3 h-10">
                {SCORES.map((score) => (
                  <span
                    key={score}
                    aria-hidden
                    className="absolute inset-y-0 w-px bg-line"
                    style={{ left: `${scorePosition(score)}%` }}
                  />
                ))}
                {high > low ? (
                  <span
                    aria-hidden
                    className="absolute top-1/2 h-0.5 -translate-y-1/2 bg-line-strong"
                    style={{ left: `${scorePosition(low)}%`, width: `${scorePosition(high) - scorePosition(low)}%` }}
                  />
                ) : null}
                {companies.map((company) => {
                  const { score, evidence } = criterion.scores[company.id];
                  // Companies on the same score sit one above the other.
                  const tied = companies.filter((c) => criterion.scores[c.id].score === score);
                  const offset = (tied.indexOf(company) - (tied.length - 1) / 2) * 12;
                  return (
                    <Tip
                      key={company.id}
                      positioned
                      align={score <= 2 ? "start" : score >= 4 ? "end" : "center"}
                      style={{ left: `${scorePosition(score)}%`, top: `calc(50% + ${offset}px)` }}
                      className={`co-${company.id} absolute size-6 -translate-x-1/2 -translate-y-1/2 rounded-full`}
                      content={
                        <>
                          <span className="block font-semibold">
                            {company.short}: {score} of 5
                          </span>
                          <span className="block text-surface/75">{evidence}</span>
                        </>
                      }
                    >
                      <span className="sr-only">
                        {company.name}, {criterion.label}: {score} of 5. {evidence}
                      </span>
                      <span aria-hidden className="m-auto block size-3 rounded-full bg-co ring-2 ring-surface" />
                    </Tip>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* axis */}
        <div className="grid gap-x-3 border-t border-line-strong sm:grid-cols-[9.5rem_minmax(0,1fr)]">
          <span className="hidden sm:block" />
          <div className="relative mx-3 h-6">
            {SCORES.map((score) => (
              <span
                key={score}
                className="absolute top-1.5 -translate-x-1/2 text-[0.75rem] tabular-nums text-ink-3"
                style={{ left: `${scorePosition(score)}%` }}
              >
                {score}
              </span>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-1 text-[0.75rem] text-ink-3">1 is a weak fit, 5 a strong fit.</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Online journey diagram                                                      */
/* -------------------------------------------------------------------------- */

const ONLINE_LABEL: Record<Status, string> = {
  yes: "Online",
  partial: "Partly",
  no: "Manual",
  unknown: "Not shown",
};

function JourneyNode({ status }: { status: Status }) {
  const look =
    status === "yes"
      ? "bg-co"
      : status === "partial"
        ? "border-2 border-co bg-[linear-gradient(90deg,var(--co)_50%,var(--surface)_50%)]"
        : status === "no"
          ? "border-2 border-co bg-surface"
          : "border-2 border-dashed border-line-strong bg-surface";
  return <span aria-hidden className={`block size-5 rounded-full ${look}`} />;
}

/**
 * The guest journey as a line of five stages per company. A stage is filled
 * when it can be done on the website; the line is coloured only while the
 * journey stays online, so the break shows where a person has to step in.
 */
export function JourneyDiagram({ companies }: { companies: Company[] }) {
  const step = 100 / JOURNEY_STAGES.length;
  return (
    <div>
      {/* stage headings */}
      <div className="grid sm:grid-cols-[8.5rem_minmax(0,1fr)]">
        <span className="hidden sm:block" />
        <ol className="grid grid-cols-5">
          {JOURNEY_STAGES.map((stage, i) => (
            <li key={stage.id} className="text-center text-[0.75rem] font-medium text-ink-2">
              <span className="hidden text-ink-3 sm:inline">{i + 1} </span>
              {stage.label}
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-1">
        {companies.map((company) => (
          <div
            key={company.id}
            className={`co-${company.id} grid border-t border-line py-3 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:items-center`}
          >
            <div className="pb-2.5 sm:pb-0">
              <CompanyMark company={company} label="short" size="sm" />
            </div>
            <div className="relative grid grid-cols-5">
              {/* connectors between stage centres */}
              {JOURNEY_STAGES.slice(0, -1).map((stage, i) => {
                const next = JOURNEY_STAGES[i + 1];
                const online = (id: (typeof JOURNEY_STAGES)[number]["id"]) =>
                  company.journeyOnline[id] === "yes" || company.journeyOnline[id] === "partial";
                return (
                  <span
                    key={stage.id}
                    aria-hidden
                    className={`absolute top-2.5 h-0.5 -translate-y-1/2 ${
                      online(stage.id) && online(next.id) ? "bg-co" : "bg-line-strong"
                    }`}
                    style={{ left: `${step * i + step / 2}%`, width: `${step}%` }}
                  />
                );
              })}
              {JOURNEY_STAGES.map((stage, i) => {
                const status = company.journeyOnline[stage.id];
                const fact = company.journey[stage.id];
                return (
                  <div key={stage.id} className="relative flex flex-col items-center">
                    <Tip
                      align={i === 0 ? "start" : i === JOURNEY_STAGES.length - 1 ? "end" : "center"}
                      className="rounded-full"
                      content={
                        <>
                          <span className="block font-semibold">
                            {stage.label}: {ONLINE_LABEL[status].toLowerCase()}
                          </span>
                          <span className="block text-surface/75">{fact.text}</span>
                        </>
                      }
                    >
                      <span className="sr-only">
                        {stage.label}: {ONLINE_LABEL[status]}. {fact.text}
                      </span>
                      <JourneyNode status={status} />
                    </Tip>
                    <span
                      aria-hidden
                      className={`mt-1.5 text-[0.75rem] leading-none ${
                        status === "yes" || status === "partial" ? "text-ink" : "text-ink-3"
                      }`}
                    >
                      {ONLINE_LABEL[status]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Capability coverage                                                         */
/* -------------------------------------------------------------------------- */

const COVERAGE: { status: Status; label: string; cell: string; swatch: string }[] = [
  { status: "yes", label: "In place", cell: "bg-co", swatch: "bg-ink" },
  { status: "partial", label: "Partial", cell: "co-half", swatch: "bg-ink-3" },
  { status: "no", label: "Missing", cell: "bg-line", swatch: "bg-line" },
  {
    status: "unknown",
    label: "Not visible",
    cell: "border border-dashed border-line-strong",
    swatch: "border border-dashed border-line-strong",
  },
];

/** One cell per booking-system capability, grouped by what the website shows today. */
export function CapabilityCoverage({ companies }: { companies: Company[] }) {
  return (
    <div>
      <div className="space-y-4">
        {companies.map((company) => {
          const inPlace = CAPABILITIES.filter((r) => r.cells[company.id].status === "yes").length;
          return (
            <div key={company.id} className={`co-${company.id}`}>
              <div className="flex items-baseline justify-between gap-3">
                <CompanyMark company={company} label="short" size="sm" />
                <p className="shrink-0 text-[0.8125rem] text-ink-2">
                  <span className="font-semibold text-ink">{inPlace}</span> of {CAPABILITIES.length} in place
                </p>
              </div>
              <div className="mt-2 flex gap-[3px]">
                {COVERAGE.map((group, g) => {
                  const rows = CAPABILITIES.filter((r) => r.cells[company.id].status === group.status);
                  if (rows.length === 0) return null;
                  return (
                    <Tip
                      key={group.status}
                      align={g === 0 ? "start" : "center"}
                      style={{ flexGrow: rows.length, flexBasis: 0 }}
                      className="gap-[3px] rounded-[3px]"
                      content={
                        <>
                          <span className="block font-semibold">
                            {group.label}: {rows.length}
                          </span>
                          {rows.map((row) => (
                            <span key={row.label} className="block text-surface/75">
                              {row.label}
                            </span>
                          ))}
                        </>
                      }
                    >
                      <span className="sr-only">
                        {group.label}: {rows.map((r) => r.label).join(", ")}.
                      </span>
                      {rows.map((row) => (
                        <span key={row.label} aria-hidden className={`h-4 flex-1 rounded-[3px] ${group.cell}`} />
                      ))}
                    </Tip>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <SwatchLegend items={COVERAGE.map((c) => ({ label: c.label, className: c.swatch }))} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Visible team                                                                */
/* -------------------------------------------------------------------------- */

function teamSplit(company: Company) {
  const count = (field: boolean) =>
    TEAM_FUNCTIONS.filter((f) => (f.id === "guides" || f.id === "hosts") === field).reduce(
      (sum, f) => sum + company.team.counts[f.id].profiled + company.team.counts[f.id].other,
      0,
    );
  return { office: count(false), field: count(true) };
}

/** People the public can see, split into the office team and staff in the field. */
export function TeamBars({ companies }: { companies: Company[] }) {
  const splits = companies.map(teamSplit);
  const max = Math.max(...splits.map((s) => s.office + s.field), 1);
  return (
    <div>
      <div className="space-y-4">
        {companies.map((company, i) => {
          const { office, field } = splits[i];
          return (
            <div key={company.id} className={`co-${company.id}`}>
              <CompanyMark company={company} label="short" size="sm" />
              <div className="mt-2 flex h-4 items-center gap-2 pr-10">
                <Tip
                  align="start"
                  style={{ width: `${((office + field) / max) * 100}%` }}
                  className="h-4 shrink-0 gap-[2px]"
                  content={
                    <>
                      <span className="block font-semibold">{office + field} people visible</span>
                      <span className="block text-surface/75">{office} in the office team</span>
                      <span className="block text-surface/75">{field} guides, drivers and hosts</span>
                    </>
                  }
                >
                  {office > 0 ? (
                    <span
                      aria-hidden
                      className={`h-full bg-co ${field === 0 ? "rounded-r-[4px]" : ""}`}
                      style={{ flexGrow: office }}
                    />
                  ) : null}
                  {field > 0 ? (
                    <span aria-hidden className="co-half h-full rounded-r-[4px]" style={{ flexGrow: field }} />
                  ) : null}
                </Tip>
                <span className="text-[0.875rem] font-semibold tabular-nums text-ink">{office + field}</span>
              </div>
              <p className="mt-1.5 text-[0.75rem] text-ink-2">
                {office} office, {field} in the field
              </p>
            </div>
          );
        })}
      </div>
      <SwatchLegend
        items={[
          { label: "Office team", className: "bg-ink" },
          { label: "Guides, drivers and hosts", className: "bg-ink-3" },
        ]}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Public reviews                                                              */
/* -------------------------------------------------------------------------- */

/** Total public reviews per company on one shared scale. */
export function ReviewBars({ companies }: { companies: Company[] }) {
  const totals = companies.map((c) => {
    const counted = c.reviews.filter((r) => r.count !== null);
    return counted.length ? counted.reduce((sum, r) => sum + (r.count ?? 0), 0) : null;
  });
  const max = Math.max(...totals.map((t) => t ?? 0), 1);
  return (
    <div className="space-y-4">
      {companies.map((company, i) => {
        const total = totals[i];
        return (
          <div key={company.id} className={`co-${company.id}`}>
            <CompanyMark company={company} label="short" size="sm" />
            {total === null ? (
              <p className="mt-2 flex h-4 items-center text-[0.8125rem] text-ink-3">Counts not published</p>
            ) : (
              <div className="mt-2 flex h-4 items-center gap-2 pr-14">
                <Tip
                  align="start"
                  style={{ width: `max(3px, ${(total / max) * 100}%)` }}
                  className="h-4 shrink-0"
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
                >
                  <span aria-hidden className="block h-full w-full rounded-r-[4px] bg-co" />
                </Tip>
                <span className="text-[0.875rem] font-semibold tabular-nums text-ink">{number.format(total)}</span>
              </div>
            )}
            <p className="mt-1.5 text-[0.75rem] text-ink-2">
              {company.reviews.map((r) => `${r.platform} ${r.rating}`).join(", ")}
            </p>
          </div>
        );
      })}
    </div>
  );
}
