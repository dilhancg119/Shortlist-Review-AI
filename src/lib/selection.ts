import { COMPANIES, type Company, type CompanyId } from "./companies";

/**
 * The company filter lives in the first URL segment so every view is a
 * shareable, statically generated page:
 *
 *   /all/work
 *   /blue-lanka/teams
 *   /green-holiday-vs-blue-lanka/opportunity
 */

const SEPARATOR = "-vs-";
export const ALL_VIEW = "all";

const ORDER: CompanyId[] = COMPANIES.map((c) => c.id);

export function viewFor(ids: CompanyId[]): string {
  const ordered = ORDER.filter((id) => ids.includes(id));
  if (ordered.length === 0 || ordered.length === ORDER.length) return ALL_VIEW;
  return ordered.map((id) => COMPANIES.find((c) => c.id === id)!.slug).join(SEPARATOR);
}

/** Returns the selected companies in canonical order, or null for an unknown view. */
export function parseView(view: string): Company[] | null {
  if (view === ALL_VIEW) return COMPANIES;
  const slugs = view.split(SEPARATOR);
  const picked = COMPANIES.filter((c) => slugs.includes(c.slug));
  if (picked.length !== slugs.length) return null;
  // Reject non-canonical spellings so each selection has exactly one URL.
  if (viewFor(picked.map((c) => c.id)) !== view) return null;
  return picked;
}

/** Every valid selection: all three, each pair, each single company. */
export function allViews(): string[] {
  const views = new Set<string>();
  const n = ORDER.length;
  for (let mask = 1; mask < 1 << n; mask++) {
    views.add(viewFor(ORDER.filter((_, i) => mask & (1 << i))));
  }
  return [...views];
}

export function staticViewParams() {
  return allViews().map((view) => ({ view }));
}

/** The view you land on after toggling one company in the filter. */
export function toggleView(selected: CompanyId[], id: CompanyId): string {
  const next = selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id];
  return viewFor(next);
}

export type SectionId = "overview" | "work" | "teams" | "clients" | "opportunity" | "sources";

export function hrefFor(view: string, section: SectionId): string {
  return section === "overview" ? `/${view}` : `/${view}/${section}`;
}
