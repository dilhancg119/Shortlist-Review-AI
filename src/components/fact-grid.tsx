import type { Company } from "@/lib/companies";
import { CompanyIcon, CompanyLogo, CompanyMark } from "./company-mark";
import { Panel } from "./ui";

export type FactRow = {
  label: string;
  hint?: string;
  render: (company: Company) => React.ReactNode;
};

/**
 * Side-by-side facts.
 *
 * Phone: one fact at a time, with each company's answer listed under it, so
 * the companies can be compared without scrolling between them.
 * Desktop: a table with one column per company.
 *
 * `mobile="companies"` instead groups the phone layout by company, for
 * content that reads as one company's story from top to bottom.
 */
export function FactGrid({
  companies,
  rows,
  logos = false,
  mobile = "rows",
}: {
  companies: Company[];
  rows: FactRow[];
  /** Show each company's full logo above its name. */
  logos?: boolean;
  mobile?: "rows" | "companies";
}) {
  const single = companies.length === 1;
  const columns = {
    "--cols": `minmax(8.5rem, ${single ? "12rem" : "11rem"}) repeat(${companies.length}, minmax(0, 1fr))`,
  } as React.CSSProperties;
  const byRows = mobile === "rows";

  return (
    <Panel className={single ? "max-w-[46rem]" : ""}>
      {/* Column headings, desktop */}
      <div
        className={`hidden rounded-t-xl border-b border-line bg-surface px-1 md:grid md:grid-cols-(--cols) ${
          logos ? "" : "sticky top-[53px] z-10"
        }`}
        style={columns}
      >
        <div />
        {companies.map((company) => (
          <div key={company.id} className="px-4 py-3.5">
            {logos ? (
              <div className="mb-3">
                <CompanyLogo company={company} />
              </div>
            ) : null}
            <CompanyMark company={company} />
          </div>
        ))}
      </div>

      {/* Logos as a key, phone */}
      {logos && byRows && !single ? (
        <div
          className="grid grid-cols-(--cols) gap-3 border-b border-line px-4 py-4 md:hidden"
          style={{ "--cols": `repeat(${companies.length}, minmax(0, 1fr))` } as React.CSSProperties}
        >
          {companies.map((company) => (
            <div key={company.id} className="flex min-w-0 flex-col items-start gap-2">
              <CompanyLogo company={company} />
              <span className="text-[0.75rem] font-medium leading-tight text-ink">{company.short}</span>
            </div>
          ))}
        </div>
      ) : null}

      {/* Fact by fact: the desktop table, and the default phone layout */}
      <div className={`divide-y divide-line ${byRows ? "" : "hidden md:block"}`}>
        {rows.map((row) => (
          <div key={row.label} className="px-4 py-3.5 md:grid md:grid-cols-(--cols) md:px-1 md:py-0" style={columns}>
            <div className="md:py-3.5 md:pl-4 md:pr-3">
              <p className="text-[0.8125rem] font-semibold text-ink md:font-medium md:text-ink-2">{row.label}</p>
              {row.hint ? <p className="mt-0.5 text-[0.75rem] leading-snug text-ink-3">{row.hint}</p> : null}
            </div>
            {companies.map((company) => (
              <div key={company.id} className="mt-3 flex gap-2.5 md:mt-0 md:block md:px-4 md:py-3.5">
                {single ? null : (
                  <span className="pt-px md:hidden">
                    <CompanyIcon company={company} size="sm" />
                    <span className="sr-only">{company.name}</span>
                  </span>
                )}
                <div className="min-w-0 flex-1">{row.render(company)}</div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Company by company, phone only */}
      {byRows ? null : (
        <div className="divide-y divide-line md:hidden">
          {companies.map((company) => (
            <section key={company.id} aria-label={company.name} className="px-4 py-4">
              <CompanyMark company={company} />
              {rows.map((row) => (
                <div key={row.label} className="mt-3.5">
                  <p className="mb-1 text-[0.75rem] font-medium text-ink-3">{row.label}</p>
                  {row.render(company)}
                </div>
              ))}
            </section>
          ))}
        </div>
      )}
    </Panel>
  );
}
