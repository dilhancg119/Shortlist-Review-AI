import { ChevronDown } from "lucide-react";
import { FitRanking, TextLink } from "@/components/charts";
import { CompanyMark } from "@/components/company-mark";
import { FactGrid } from "@/components/fact-grid";
import {
  CapabilityCoverage,
  ChartCard,
  JourneyDiagram,
  ReviewBars,
  ScoreProfile,
  TeamBars,
} from "@/components/overview-charts";
import { Shell } from "@/components/shell";
import { FactText, Panel, Section, number } from "@/components/ui";
import { COMPANIES, COMPANY_BY_ID, FINDINGS, type Company } from "@/lib/companies";
import { ranking } from "@/lib/fit";
import { selectedFrom, type ViewPageProps } from "@/lib/page";
import { hrefFor, staticViewParams, viewFor } from "@/lib/selection";

export const generateStaticParams = staticViewParams;

export default async function OverviewPage({ params }: ViewPageProps) {
  const selected = await selectedFrom(params);
  const ids = selected.map((c) => c.id);
  const view = viewFor(ids);
  const ranked = ranking().filter((r) => ids.includes(r.id));
  const findings = FINDINGS.filter((f) => f.companies.some((id) => ids.includes(id)));

  return (
    <Shell
      active="overview"
      selected={selected}
      title="Shortlist overview"
      lede="Which of three Sri Lankan tour operators to approach first with a booking system."
    >
      <Section
        title="Where to start"
        description="Fit score out of 100. Our assessment from website evidence."
        aside={<TextLink href={hrefFor(view, "opportunity")}>See how it is scored</TextLink>}
      >
        <Panel className="max-w-[52rem]">
          <FitRanking ranked={ranked} companies={COMPANY_BY_ID} total={COMPANIES.length} reasons="headline" />
        </Panel>
      </Section>

      <Section title="Compare at a glance">
        <div className="grid items-start gap-5 xl:grid-cols-2">
          <ChartCard
            title="Score profile"
            takeaway="The five criteria behind each fit score."
            href={hrefFor(view, "opportunity")}
            linkLabel="Scores and evidence"
          >
            <ScoreProfile companies={selected} />
          </ChartCard>
          <ChartCard
            title="How far the online journey goes"
            takeaway="Filled stages work on the website. Hollow ones need a person."
            href={hrefFor(view, "clients")}
            linkLabel="Full enquiry journey"
          >
            <JourneyDiagram companies={selected} />
          </ChartCard>
        </div>
        <div className="mt-5 grid items-start gap-5 md:grid-cols-2 xl:grid-cols-3">
          <ChartCard
            title="Booking capabilities"
            takeaway="Unfilled cells are what we could supply."
            href={hrefFor(view, "opportunity")}
            linkLabel="Capability by capability"
          >
            <CapabilityCoverage companies={selected} />
          </ChartCard>
          <ChartCard
            title="Visible team"
            takeaway="People shown publicly, not headcount."
            href={hrefFor(view, "teams")}
            linkLabel="Team detail"
          >
            <TeamBars companies={selected} />
          </ChartCard>
          <ChartCard
            title="Public reviews"
            takeaway="A public proxy for booking volume."
            href={hrefFor(view, "clients")}
            linkLabel="Ratings by platform"
          >
            <ReviewBars companies={selected} />
          </ChartCard>
        </div>
      </Section>

      <Section title="What stands out">
        <ol className="grid gap-x-12 border-t border-line md:grid-cols-2">
          {findings.map((finding, i) => (
            <li key={finding.title} className="border-b border-line">
              <details className="group/finding">
                <summary className="grid min-h-11 cursor-pointer list-none grid-cols-[1.75rem_minmax(0,1fr)_auto_auto] items-center gap-x-2 py-2.5 [&::-webkit-details-marker]:hidden">
                  <span className="text-[0.8125rem] tabular-nums text-ink-3">{i + 1}</span>
                  <h3 className="text-[0.875rem] font-medium leading-snug text-ink">{finding.title}</h3>
                  <span className="flex gap-1">
                    {finding.companies.map((id) => (
                      <CompanyMark key={id} company={COMPANY_BY_ID[id]} label="none" size="sm" />
                    ))}
                  </span>
                  <ChevronDown
                    aria-hidden
                    className="size-4 text-ink-3 transition-transform duration-200 ease-out group-open/finding:rotate-180"
                  />
                </summary>
                <p className="pb-3.5 pl-[2.25rem] pr-2 text-[0.8125rem] leading-relaxed text-ink-2">
                  {finding.body}
                </p>
              </details>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Company snapshot">
        <FactGrid
          companies={selected}
          logos
          rows={[
            {
              label: "Positioning",
              render: (c) => (
                <FactText fact={{ text: c.segment, detail: c.positioning, basis: "site" }} compact />
              ),
            },
            { label: "Based in", render: (c) => <FactText fact={c.snapshot.based} compact /> },
            { label: "Founded", render: (c) => <FactText fact={c.snapshot.founded} compact /> },
            { label: "Leadership", render: (c) => <FactText fact={c.snapshot.leadership} compact /> },
            { label: "Destinations", render: (c) => <FactText fact={c.snapshot.destinations} compact /> },
            { label: "Published prices", render: (c) => <FactText fact={c.snapshot.pricePoint} compact /> },
            { label: "Public reviews", render: (c) => <ReviewSummary company={c} /> },
            { label: "Registration and protection", render: (c) => <FactText fact={c.snapshot.protection} compact /> },
            { label: "Website", render: (c) => <WebsiteFact company={c} /> },
          ]}
        />
      </Section>
    </Shell>
  );
}

function ReviewSummary({ company }: { company: Company }) {
  return (
    <ul className="space-y-1 text-[0.875rem] leading-snug text-ink">
      {company.reviews.map((r) => (
        <li key={r.platform}>
          {r.platform} {r.rating}
          <span className="text-ink-2">
            {r.count === null ? ", count not shown" : `, ${number.format(r.count)} reviews`}
          </span>
        </li>
      ))}
    </ul>
  );
}

function WebsiteFact({ company }: { company: Company }) {
  return (
    <div>
      <FactText fact={company.snapshot.website} compact />
      <a
        href={company.url}
        target="_blank"
        rel="noreferrer"
        className="mt-1.5 inline-block text-[0.8125rem] font-medium text-ink underline decoration-line-strong underline-offset-4 transition-colors duration-150 hover:decoration-ink"
      >
        {company.domain}
      </a>
    </div>
  );
}
