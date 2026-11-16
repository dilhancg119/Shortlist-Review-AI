import type { Metadata } from "next";
import { ReviewVolume } from "@/components/charts";
import { FactGrid } from "@/components/fact-grid";
import { Matrix } from "@/components/matrix";
import { Shell } from "@/components/shell";
import { FactText, Section } from "@/components/ui";
import { CHANNELS, JOURNEY_STAGES } from "@/lib/companies";
import { selectedFrom, type ViewPageProps } from "@/lib/page";
import { staticViewParams } from "@/lib/selection";

export const metadata: Metadata = { title: "Client handling" };
export const generateStaticParams = staticViewParams;

export default async function ClientsPage({ params }: ViewPageProps) {
  const selected = await selectedFrom(params);

  return (
    <Shell
      active="clients"
      selected={selected}
      title="Client handling"
      lede="How a lead becomes a guest at each company: the enquiry journey, the channels on offer, and what guests say afterwards."
    >
      <Section
        title="Enquiry journey"
        description="Each stage as a visitor would meet it. The manual stages are where a booking system does its work."
      >
        <FactGrid
          companies={selected}
          rows={[
            ...JOURNEY_STAGES.map((stage) => ({
              label: stage.label,
              hint: stage.question,
              render: (c: (typeof selected)[number]) => <FactText fact={c.journey[stage.id]} />,
            })),
            {
              label: "Response time promise",
              hint: "How fast will a lead hear back?",
              render: (c) => <FactText fact={c.responsePromise} />,
            },
          ]}
        />
      </Section>

      <Section title="Contact channels">
        <Matrix
          companies={selected}
          rows={CHANNELS}
          labels={{ yes: "Available", partial: "Partly", no: "Not offered", unknown: "Unclear" }}
        />
      </Section>

      <Section
        title="Reputation"
        description="Public review counts, added across platforms. Bars share one scale, so the lengths compare directly."
      >
        <ReviewVolume companies={selected} />
      </Section>
    </Shell>
  );
}
