import type { Metadata } from "next";
import { FactGrid } from "@/components/fact-grid";
import { FitExplorer } from "@/components/fit-explorer";
import { Matrix } from "@/components/matrix";
import { Shell } from "@/components/shell";
import { BulletList, Section } from "@/components/ui";
import { CAPABILITIES, DISCOVERY_QUESTIONS } from "@/lib/companies";
import { selectedFrom, type ViewPageProps } from "@/lib/page";
import { staticViewParams } from "@/lib/selection";

export const metadata: Metadata = { title: "Booking system fit" };
export const generateStaticParams = staticViewParams;

export default async function OpportunityPage({ params }: ViewPageProps) {
  const selected = await selectedFrom(params);

  return (
    <Shell
      active="opportunity"
      selected={selected}
      title="Booking system fit"
      lede="Where a booking system would change the most, and how to approach each company. Scores are our reading of website evidence and should be revised after first calls."
    >
      <Section
        title="Fit score"
        description="Five criteria, each scored 1 to 5, combined by weight into a score out of 100. Ranks are always out of all three companies."
      >
        <FitExplorer selected={selected.map((c) => c.id)} />
      </Section>

      <Section
        title="What is in place today"
        description="The pieces a booking system provides, against what each website shows. Every missing piece is something we could supply."
      >
        <Matrix
          companies={selected}
          rows={CAPABILITIES}
          labels={{ yes: "In place", partial: "Partial", no: "Missing", unknown: "Not visible from the site" }}
          countStatus="no"
          countNoun="missing"
        />
      </Section>

      <Section title="How to approach each">
        <FactGrid
          companies={selected}
          mobile="companies"
          rows={[
            {
              label: "Our read",
              render: (c) => <p className="text-[0.875rem] leading-relaxed text-ink">{c.pitch.verdict}</p>,
            },
            {
              label: "Lead with",
              render: (c) => <p className="text-[0.875rem] leading-relaxed text-ink">{c.pitch.leadWith}</p>,
            },
            { label: "Modules to show", render: (c) => <BulletList items={c.pitch.modules} /> },
            { label: "Watch-outs", render: (c) => <BulletList items={c.pitch.watchOuts} /> },
          ]}
        />
      </Section>

      <Section
        title="Ask in discovery"
        description="What the websites cannot tell us. The answers replace the weakest parts of the score."
      >
        <ol className="grid gap-x-12 border-t border-line md:grid-cols-2">
          {DISCOVERY_QUESTIONS.map((item, i) => (
            <li key={item.question} className="grid grid-cols-[1.75rem_minmax(0,1fr)] border-b border-line py-3.5">
              <span className="pt-px text-[0.8125rem] tabular-nums text-ink-3">{i + 1}</span>
              <div>
                <p className="text-[0.875rem] font-medium leading-snug text-ink">{item.question}</p>
                <p className="mt-1 text-[0.8125rem] text-ink-2">{item.why}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>
    </Shell>
  );
}
