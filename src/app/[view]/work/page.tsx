import type { Metadata } from "next";
import { MetricRows, PriceRanges } from "@/components/charts";
import { FactGrid } from "@/components/fact-grid";
import { Matrix } from "@/components/matrix";
import { Shell } from "@/components/shell";
import { BasisTag, FactText, Section } from "@/components/ui";
import { SERVICE_LINES } from "@/lib/companies";
import { selectedFrom, type ViewPageProps } from "@/lib/page";
import { staticViewParams } from "@/lib/selection";

export const metadata: Metadata = { title: "Products and reach" };
export const generateStaticParams = staticViewParams;

export default async function WorkPage({ params }: ViewPageProps) {
  const selected = await selectedFrom(params);

  return (
    <Shell
      active="work"
      selected={selected}
      title="Products and reach"
      lede="What each company sells, where, and at what price. Fixed, priced products are the ones a booking engine can sell without a conversation."
    >
      <Section title="Catalogue size" description="Counted from what each site lists today.">
        <MetricRows
          companies={selected}
          rows={[
            { label: "Multi-day itineraries", value: (c) => c.catalogue.multiDay },
            { label: "Day tours", value: (c) => c.catalogue.dayTours },
            { label: "Countries covered", value: (c) => c.catalogue.countries },
          ]}
        />
      </Section>

      <Section
        title="Published prices"
        description="Price point signals the segment, and whether a price exists at all signals how ready the catalogue is for online sale."
      >
        <PriceRanges companies={selected} />
        <ul className="mt-3 space-y-1 text-[0.8125rem] text-ink-2">
          {selected.map((c) => (
            <li key={c.id}>
              <span className="font-medium text-ink">{c.short}:</span> {c.priceNote}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Service lines">
        <Matrix
          companies={selected}
          rows={SERVICE_LINES}
          labels={{ yes: "Offered", partial: "Partly", no: "Not listed", unknown: "Unclear" }}
        />
      </Section>

      <Section title="Themes and recognition">
        <FactGrid
          companies={selected}
          rows={[
            {
              label: "Trip themes",
              render: (c) => (
                <p className="text-[0.875rem] leading-relaxed text-ink">{c.catalogue.themes.join(", ")}</p>
              ),
            },
            {
              label: "Awards and memberships",
              render: (c) => (
                <ul className="space-y-1.5">
                  {c.catalogue.recognition.map((fact) => (
                    <li
                      key={fact.text}
                      className={`text-[0.875rem] leading-snug ${fact.basis === "unpublished" ? "text-ink-2" : "text-ink"}`}
                    >
                      {fact.text} <BasisTag basis={fact.basis} />
                    </li>
                  ))}
                </ul>
              ),
            },
            { label: "Content", render: (c) => <FactText fact={c.catalogue.content} /> },
          ]}
        />
      </Section>
    </Shell>
  );
}
