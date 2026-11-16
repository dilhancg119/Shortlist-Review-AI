import type { Company } from "@/lib/companies";
import { CompanyMark } from "./company-mark";
import { MobileCollapse } from "./mobile-collapse";
import { MemberProfile } from "./member-profile";
import { Panel } from "./ui";

/**
 * Named team members with photo and job title, grouped as the company groups
 * them. Tapping a photo opens it larger, with a link to LinkedIn. On a phone only the first group starts open; the rest unfold on tap.
 */
export function TeamDirectory({ companies }: { companies: Company[] }) {
  const withDirectory = companies.filter((c) => c.team.directory);
  const without = companies.filter((c) => !c.team.directory);

  return (
    <div className="space-y-5">
      {withDirectory.map((company) => {
        const directory = company.team.directory!;
        const total = directory.groups.reduce((sum, group) => sum + group.members.length, 0);
        return (
          <Panel key={company.id}>
            <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
              <CompanyMark company={company} />
              <span className="shrink-0 text-[0.8125rem] text-ink-2">{total} people</span>
            </div>

            <div className="divide-y divide-line">
              {directory.groups.map((group, i) => (
                <MobileCollapse
                  key={group.label}
                  defaultOpen={i === 0}
                  className="px-4 py-1.5 sm:px-5 lg:py-5"
                  summary={
                    <h3 className="flex flex-wrap items-baseline gap-x-2 text-[0.8125rem]">
                      <span className="font-semibold text-ink">{group.label}</span>
                      <span className="text-ink-3">
                        {group.blurb ? `${group.blurb}, ` : ""}
                        {group.members.length} {group.members.length === 1 ? "person" : "people"}
                      </span>
                    </h3>
                  }
                >
                  <ul className="grid gap-x-6 gap-y-4 pb-3.5 pt-2 sm:grid-cols-2 lg:pb-0 lg:pt-3.5 xl:grid-cols-3">
                    {group.members.map((member) => (
                      <li key={member.name} className="min-w-0">
                        <MemberProfile member={member} companyName={company.name} />
                      </li>
                    ))}
                  </ul>
                </MobileCollapse>
              ))}
            </div>
          </Panel>
        );
      })}

      {without.length ? (
        <p className="max-w-[42rem] text-[0.8125rem] leading-relaxed text-ink-2">
          Individual profiles have not been captured for {without.map((c) => c.short).join(" or ")} yet.
        </p>
      ) : null}
    </div>
  );
}
