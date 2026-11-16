import type { Company, MatrixRow, Status } from "@/lib/companies";
import { CompanyMark } from "./company-mark";
import { Panel, StatusIcon } from "./ui";

const STATUSES: Status[] = ["yes", "partial", "no", "unknown"];

/**
 * A compact compare grid: one row per item, one column per company.
 * On mobile the row label sits above its cells so three columns still fit.
 */
export function CompareGrid({
  companies,
  header,
  stack = false,
  children,
}: {
  companies: Company[];
  header?: (company: Company) => React.ReactNode;
  /** Text-heavy rows: one company per line on mobile instead of columns. */
  stack?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Panel>
      <div
        className={`${
          stack ? "hidden md:grid" : "grid"
        } sticky top-[61px] z-10 grid-cols-(--cols) rounded-t-xl border-b border-line bg-surface px-4 py-2 text-[0.75rem] sm:top-[53px] md:grid-cols-(--cols-md) md:py-3 md:text-[0.875rem]`}
        style={gridVars(companies.length)}
      >
        <div className="hidden md:block" />
        {companies.map((company) => (
          <div key={company.id} className="min-w-0 pr-2">
            <span className="md:hidden">
              <CompanyMark company={company} label="short" size="sm" wrap />
            </span>
            <span className="hidden md:inline">
              <CompanyMark company={company} label="short" wrap />
            </span>
            {header ? <div className="mt-1 text-[0.75rem] text-ink-3">{header(company)}</div> : null}
          </div>
        ))}
      </div>
      <div className="divide-y divide-line">{children}</div>
    </Panel>
  );
}

export function CompareRow({
  count,
  label,
  hint,
  stack = false,
  children,
}: {
  count: number;
  label: string;
  hint?: string;
  stack?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`grid grid-cols-(--cols) px-4 py-3 md:grid-cols-(--cols-md) md:items-start md:gap-y-0 ${
        stack ? "gap-y-3.5 py-4" : "gap-y-2"
      }`}
      style={gridVars(stack ? 1 : count, count)}
    >
      <div className="col-span-full md:col-span-1 md:pr-4">
        <p className="text-[0.8125rem] font-medium text-ink">{label}</p>
        {hint ? <p className="mt-0.5 text-[0.75rem] leading-snug text-ink-3">{hint}</p> : null}
      </div>
      {children}
    </div>
  );
}

function gridVars(count: number, desktopCount = count) {
  return {
    "--cols": `repeat(${count}, minmax(0, 1fr))`,
    "--cols-md": `minmax(11rem, 1.25fr) repeat(${desktopCount}, minmax(0, 1fr))`,
  } as React.CSSProperties;
}

/** Status matrix: present, partly, absent or can't tell, for each company. */
export function Matrix({
  companies,
  rows,
  labels,
  countStatus,
  countNoun,
}: {
  companies: Company[];
  rows: MatrixRow[];
  labels: Record<Status, string>;
  /** When set, each column header counts the rows with this status. */
  countStatus?: Status;
  countNoun?: string;
}) {
  const used = STATUSES.filter((s) => rows.some((r) => companies.some((c) => r.cells[c.id].status === s)));
  return (
    <div>
      <CompareGrid
        companies={companies}
        header={
          countStatus
            ? (company) =>
                `${rows.filter((r) => r.cells[company.id].status === countStatus).length} of ${rows.length} ${countNoun}`
            : undefined
        }
      >
        {rows.map((row) => (
          <CompareRow key={row.label} count={companies.length} label={row.label} hint={row.hint}>
            {companies.map((company) => {
              const cell = row.cells[company.id];
              return (
                <div key={company.id} className="min-w-0 pr-2">
                  <p className="flex items-center gap-1.5">
                    <StatusIcon status={cell.status} />
                    <span
                      className={`text-[0.8125rem] ${
                        cell.status === "yes" || cell.status === "partial" ? "text-ink" : "text-ink-3"
                      }`}
                    >
                      {labels[cell.status]}
                    </span>
                  </p>
                  {cell.note ? (
                    <p className="mt-1 text-[0.75rem] leading-snug text-ink-2 md:pl-[1.375rem]">{cell.note}</p>
                  ) : null}
                </div>
              );
            })}
          </CompareRow>
        ))}
      </CompareGrid>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[0.75rem] text-ink-2">
        {used.map((status) => (
          <li key={status} className="flex items-center gap-1.5">
            <StatusIcon status={status} />
            {labels[status]}
          </li>
        ))}
      </ul>
    </div>
  );
}
