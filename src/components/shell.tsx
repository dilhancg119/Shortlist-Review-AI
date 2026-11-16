import Link from "next/link";
import {
  Check,
  Compass,
  FileText,
  LayoutDashboard,
  LogOut,
  MessagesSquare,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react";
import { logout } from "@/app/login/actions";
import { CAPTURED_ON, COMPANIES, type Company } from "@/lib/companies";
import { CompanyIcon } from "./company-mark";
import { ALL_VIEW, hrefFor, toggleView, viewFor, type SectionId } from "@/lib/selection";

const NAV: { id: SectionId; label: string; mobile: string; icon: LucideIcon }[] = [
  { id: "overview", label: "Overview", mobile: "Overview", icon: LayoutDashboard },
  { id: "work", label: "Products and reach", mobile: "Work", icon: Compass },
  { id: "teams", label: "Teams", mobile: "Teams", icon: Users },
  { id: "clients", label: "Client handling", mobile: "Clients", icon: MessagesSquare },
  { id: "opportunity", label: "Booking system fit", mobile: "Fit", icon: Target },
];

/**
 * Page frame: side navigation on desktop, bottom tabs on mobile, and the
 * company filter pinned above the content it scopes.
 */
export function Shell({
  active,
  selected,
  title,
  lede,
  children,
}: {
  active: SectionId;
  selected: Company[];
  title: string;
  lede: string;
  children: React.ReactNode;
}) {
  const view = viewFor(selected.map((c) => c.id));

  return (
    <div className="lg:grid lg:grid-cols-[15rem_minmax(0,1fr)]">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-ink focus:px-3 focus:py-2 focus:text-surface"
      >
        Skip to content
      </a>

      {/* Desktop side navigation */}
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-line bg-panel px-3 py-5 lg:flex">
        <Brand view={view} className="px-2" />
        <nav aria-label="Sections" className="mt-7 flex flex-col gap-0.5">
          {NAV.map((item) => (
            <SideLink key={item.id} item={item} view={view} active={active === item.id} />
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-0.5">
          <SideLink
            item={{ id: "sources", label: "Sources and method", mobile: "Sources", icon: FileText }}
            view={view}
            active={active === "sources"}
          />
          <form action={logout}>
            <button
              type="submit"
              className="flex h-9 w-full items-center gap-2.5 rounded-md px-2 text-[0.8125rem] font-medium text-ink-2 transition-colors duration-150 hover:bg-wash/60 hover:text-ink"
            >
              <LogOut aria-hidden className="size-4 shrink-0" strokeWidth={1.75} />
              Sign out
            </button>
          </form>
          <p className="px-2 pt-3 text-xs leading-relaxed text-ink-3">
            Public website research, captured {CAPTURED_ON}.
          </p>
        </div>
      </aside>

      <div className="min-w-0">
        {/* Mobile top bar */}
        <header className="flex h-14 items-center justify-between border-b border-line bg-panel px-4 lg:hidden">
          <Brand view={view} />
          <div className="-mr-2 flex items-center">
            <Link
              href={hrefFor(view, "sources")}
              aria-current={active === "sources" ? "page" : undefined}
              className="inline-flex h-11 items-center gap-1.5 rounded-md px-2 text-[0.8125rem] font-medium text-ink-2 aria-[current=page]:text-ink"
            >
              <FileText aria-hidden className="size-4" />
              Sources
            </Link>
            <form action={logout}>
              <button
                type="submit"
                aria-label="Sign out"
                className="grid size-11 place-items-center rounded-md text-ink-2 transition-colors duration-150 hover:text-ink"
              >
                <LogOut aria-hidden className="size-[1.125rem]" strokeWidth={1.75} />
              </button>
            </form>
          </div>
        </header>

        <CompanyFilter selected={selected} active={active} />

        <main
          id="content"
          className="mx-auto w-full max-w-[76rem] overflow-x-clip px-4 pb-28 pt-6 sm:px-6 lg:px-10 lg:pb-16 lg:pt-9"
        >
          <header className="max-w-[44rem]">
            <h1 className="text-[1.5rem] font-semibold leading-tight tracking-[-0.015em] text-ink">
              {title}
            </h1>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-2">{lede}</p>
          </header>
          {children}
        </main>
      </div>

      {/* Mobile bottom tabs */}
      <nav
        aria-label="Sections"
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        {NAV.map((item) => {
          const Icon = item.icon;
          const current = active === item.id;
          return (
            <Link
              key={item.id}
              href={hrefFor(view, item.id)}
              aria-current={current ? "page" : undefined}
              className={`flex h-14 flex-col items-center justify-center gap-1 text-[0.6875rem] font-medium transition-colors duration-150 ${
                current ? "text-ink" : "text-ink-3"
              }`}
            >
              <span
                className={`grid h-6 w-11 place-items-center rounded-full transition-colors duration-150 ${
                  current ? "bg-wash" : ""
                }`}
              >
                <Icon aria-hidden className="size-[1.125rem]" strokeWidth={current ? 2.25 : 1.75} />
              </span>
              {item.mobile}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function Brand({ view, className = "" }: { view: string; className?: string }) {
  return (
    <Link href={hrefFor(view, "overview")} className={`flex min-h-11 items-center gap-2.5 ${className}`}>
      <span aria-hidden className="grid size-7 grid-cols-3 items-end gap-[2px] rounded-md bg-ink p-[6px]">
        <span className="h-[55%] rounded-[1px] bg-surface/55" />
        <span className="h-[75%] rounded-[1px] bg-surface/75" />
        <span className="h-full rounded-[1px] bg-surface" />
      </span>
      <span className="leading-tight">
        <span className="block text-[0.875rem] font-semibold text-ink">Shortlist Review</span>
        <span className="block text-[0.6875rem] text-ink-3">Booking system prospects</span>
      </span>
    </Link>
  );
}

function SideLink({
  item,
  view,
  active,
}: {
  item: (typeof NAV)[number];
  view: string;
  active: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={hrefFor(view, item.id)}
      aria-current={active ? "page" : undefined}
      className={`flex h-9 items-center gap-2.5 rounded-md px-2 text-[0.8125rem] font-medium transition-colors duration-150 ${
        active ? "bg-wash text-ink" : "text-ink-2 hover:bg-wash/60 hover:text-ink"
      }`}
    >
      <Icon aria-hidden className="size-4 shrink-0" strokeWidth={active ? 2.25 : 1.75} />
      {item.label}
    </Link>
  );
}

/**
 * One filter for the whole dashboard. Each chip is a link to the same section
 * with that company toggled, so a filtered view is always a shareable URL.
 */
function CompanyFilter({ selected, active }: { selected: Company[]; active: SectionId }) {
  const ids = selected.map((c) => c.id);
  const all = selected.length === COMPANIES.length;

  return (
    <div className="sticky top-0 z-20 border-b border-line bg-bg">
      <div
        role="group"
        aria-label="Filter by company"
        className="mx-auto flex w-full max-w-[76rem] items-center gap-2 px-4 py-2 sm:px-6 lg:px-10"
      >
        <span className="mr-1 hidden text-[0.8125rem] text-ink-3 sm:block">Companies</span>
        <div className="grid min-w-0 flex-1 grid-cols-3 gap-1.5 sm:flex sm:flex-none sm:gap-2">
          {COMPANIES.map((company) => {
            const on = ids.includes(company.id);
            return (
              <Link
                key={company.id}
                href={hrefFor(toggleView(ids, company.id), active)}
                replace
                scroll={false}
                aria-label={`${on ? "Hide" : "Show"} ${company.name}`}
                className={`co-${company.id} flex h-11 min-w-0 items-center gap-1.5 rounded-lg border px-2 text-[0.8125rem] font-medium transition-colors duration-150 sm:h-9 sm:gap-2 sm:px-2.5 ${
                  on
                    ? "border-line-strong bg-surface text-ink"
                    : "border-transparent bg-wash/70 text-ink-3 hover:text-ink-2"
                }`}
              >
                <CompanyIcon company={company} size="sm" muted={!on} />
                <span className="text-[0.75rem] leading-[1.15] sm:truncate sm:text-[0.8125rem]">{company.short}</span>
                <Check
                  aria-hidden
                  className={`ml-auto hidden size-3.5 shrink-0 sm:block ${on ? "text-ink-2" : "invisible"}`}
                  strokeWidth={2.5}
                />
              </Link>
            );
          })}
        </div>
        <Link
          href={hrefFor(ALL_VIEW, active)}
          replace
          scroll={false}
          aria-disabled={all}
          tabIndex={all ? -1 : undefined}
          className={`inline-flex h-11 shrink-0 items-center rounded-lg px-2 text-[0.8125rem] font-medium transition-colors duration-150 sm:h-9 ${
            all ? "pointer-events-none text-ink-3/60" : "text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink"
          }`}
        >
          All<span className="hidden sm:inline">&nbsp;three</span>
        </Link>
      </div>
    </div>
  );
}
