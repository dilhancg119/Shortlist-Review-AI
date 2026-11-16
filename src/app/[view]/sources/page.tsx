import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { CompanyMark } from "@/components/company-mark";
import { Shell } from "@/components/shell";
import { BasisTag, Panel, Section } from "@/components/ui";
import { BASIS_LABEL, CAPTURED_ON, SOURCES, type Basis } from "@/lib/companies";
import { selectedFrom, type ViewPageProps } from "@/lib/page";
import { staticViewParams } from "@/lib/selection";

export const metadata: Metadata = { title: "Sources and method" };
export const generateStaticParams = staticViewParams;

const BASIS_MEANING: Record<Exclude<Basis, "site">, string> = {
  platform: "Taken from a public review or listing platform, not the company's own site.",
  reviews: "Mentioned by guests in reviews. The company does not state it itself.",
  inferred: "Our interpretation of what the site shows.",
  unpublished: "We looked for it and did not find it. It may still exist.",
};

const LIMITS = [
  "Everything here is public website evidence. None of it has been confirmed with the companies.",
  "Review counts are snapshots and are used only as a rough proxy for booking volume.",
  "Team counts are people shown publicly, not headcount.",
  "A capability marked missing is missing from the website. A back-office system may exist that the public cannot see.",
  "Fit scores are a judgement. Change the weights on the fit page, or the scores in src/lib/fit.ts, as better information arrives.",
];

export default async function SourcesPage({ params }: ViewPageProps) {
  const selected = await selectedFrom(params);

  return (
    <Shell
      active="sources"
      selected={selected}
      title="Sources and method"
      lede={`Where the facts in this dashboard come from, and how far to trust them. All pages were read on ${CAPTURED_ON}.`}
    >
      <Section
        title="Reading the tags"
        description="A fact with no tag was published on the company's own website. The exceptions are tagged."
      >
        <dl className="max-w-[46rem] border-t border-line">
          {(Object.keys(BASIS_MEANING) as (keyof typeof BASIS_MEANING)[]).map((basis) => (
            <div key={basis} className="grid gap-x-4 gap-y-1 border-b border-line py-3 sm:grid-cols-[9rem_minmax(0,1fr)]">
              <dt>
                <BasisTag basis={basis} />
                <span className="sr-only">{BASIS_LABEL[basis]}</span>
              </dt>
              <dd className="text-[0.8125rem] leading-relaxed text-ink-2">{BASIS_MEANING[basis]}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title="Limits">
        <ul className="max-w-[46rem] space-y-2 text-[0.875rem] leading-relaxed text-ink">
          {LIMITS.map((limit) => (
            <li key={limit} className="flex gap-2.5">
              <span aria-hidden className="mt-[0.55rem] size-1 shrink-0 rounded-full bg-ink-3" />
              {limit}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Pages reviewed">
        <div className="grid items-start gap-5 xl:grid-cols-(--cols)" style={{ "--cols": `repeat(${selected.length}, minmax(0, 1fr))` } as React.CSSProperties}>
          {selected.map((company) => (
            <Panel key={company.id}>
              <div className="border-b border-line px-4 py-3">
                <CompanyMark company={company} />
              </div>
              <ul className="divide-y divide-line">
                {SOURCES.filter((s) => s.company === company.id).map((source) => (
                  <li key={source.url}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-start justify-between gap-3 px-4 py-3 transition-colors duration-150 hover:bg-wash/50"
                    >
                      <span className="min-w-0">
                        <span className="block text-[0.875rem] font-medium text-ink">{source.label}</span>
                        <span className="mt-0.5 block text-[0.8125rem] leading-snug text-ink-2">{source.used}</span>
                      </span>
                      <ArrowUpRight
                        aria-hidden
                        className="mt-0.5 size-4 shrink-0 text-ink-3 transition-colors duration-150 group-hover:text-ink"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </Panel>
          ))}
        </div>
      </Section>
    </Shell>
  );
}
