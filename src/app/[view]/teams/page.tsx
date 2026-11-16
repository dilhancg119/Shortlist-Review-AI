import type { Metadata } from "next";
import { TeamShape } from "@/components/charts";
import { FactGrid } from "@/components/fact-grid";
import { Shell } from "@/components/shell";
import { TeamDirectory } from "@/components/team-directory";
import { FactText, Section } from "@/components/ui";
import { selectedFrom, type ViewPageProps } from "@/lib/page";
import { staticViewParams } from "@/lib/selection";

export const metadata: Metadata = { title: "Teams" };
export const generateStaticParams = staticViewParams;

export default async function TeamsPage({ params }: ViewPageProps) {
  const selected = await selectedFrom(params);

  return (
    <Shell
      active="teams"
      selected={selected}
      title="Teams"
      lede="Who is visible behind each company, and who would work in a booking system day to day. These are the people shown publicly, not headcount."
    >
      <Section
        title="Team shape"
        description="One dot per person the public can see, grouped by what they do."
      >
        <TeamShape companies={selected} />
      </Section>

      <Section
        title="Team members"
        description="Names, job titles and photos as published on each company's team page. Photos load from the company's own site."
      >
        <TeamDirectory companies={selected} />
      </Section>

      <Section title="How each team is organised">
        <FactGrid
          companies={selected}
          rows={[
            { label: "Team page", render: (c) => <FactText fact={c.team.page} /> },
            { label: "Leadership", render: (c) => <FactText fact={c.snapshot.leadership} /> },
            { label: "How work is split", render: (c) => <FactText fact={c.team.structure} /> },
            { label: "Offices", render: (c) => <FactText fact={c.team.offices} /> },
          ]}
        />
      </Section>
    </Shell>
  );
}
