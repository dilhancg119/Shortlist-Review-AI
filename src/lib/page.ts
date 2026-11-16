import { notFound } from "next/navigation";
import type { Company } from "./companies";
import { parseView } from "./selection";

export type ViewPageProps = { params: Promise<{ view: string }> };

/** Resolves the `[view]` segment to the selected companies, or 404s. */
export async function selectedFrom(params: ViewPageProps["params"]): Promise<Company[]> {
  const { view } = await params;
  const selected = parseView(decodeURIComponent(view));
  if (!selected) notFound();
  return selected;
}
