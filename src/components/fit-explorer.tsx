"use client";

import { useSyncExternalStore } from "react";
import { COMPANIES, COMPANY_BY_ID, type CompanyId } from "@/lib/companies";
import { CRITERIA, DEFAULT_WEIGHTS, ranking, type CriterionId, type Weights } from "@/lib/fit";
import { FitRanking } from "./charts";
import { CompanyMark } from "./company-mark";
import { CompareGrid, CompareRow } from "./matrix";
import { MobileCollapse } from "./mobile-collapse";
import { Panel } from "./ui";

/*
 * Weights live outside React so they survive a change of company filter,
 * which is a navigation to another page. A full reload restores the defaults.
 */
let currentWeights: Weights = DEFAULT_WEIGHTS;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function setWeights(next: Weights) {
  currentWeights = next;
  listeners.forEach((listener) => listener());
}

/**
 * The fit score with adjustable weights. Scores stay fixed (they come from
 * the evidence); weights express what matters most to us in a first client.
 */
export function FitExplorer({ selected }: { selected: CompanyId[] }) {
  const weights = useSyncExternalStore(
    subscribe,
    () => currentWeights,
    () => DEFAULT_WEIGHTS,
  );

  const total = CRITERIA.reduce((sum, c) => sum + weights[c.id], 0);
  const changed = CRITERIA.some((c) => weights[c.id] !== DEFAULT_WEIGHTS[c.id]);
  const ranked = ranking(weights).filter((r) => selected.includes(r.id));
  const companies = selected.map((id) => COMPANY_BY_ID[id]);

  function setWeight(id: CriterionId, value: number) {
    setWeights({ ...currentWeights, [id]: value });
  }

  return (
    <div className="space-y-5">
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <Panel>
          {total === 0 ? (
            <p className="px-5 py-8 text-[0.875rem] text-ink-2">
              Every weight is at zero, so there is nothing to score. Raise at least one weight.
            </p>
          ) : (
            <FitRanking ranked={ranked} companies={COMPANY_BY_ID} total={COMPANIES.length} reasons="verdict" />
          )}
        </Panel>

        <Panel className="px-4 py-1.5 sm:px-5 lg:py-4">
          <MobileCollapse
            summary={
              <h3 className="flex flex-wrap items-baseline gap-x-2 text-[0.875rem]">
                <span className="font-semibold text-ink">Weights</span>
                <span className="text-[0.8125rem] text-ink-3 lg:hidden">Adjust what matters most</span>
              </h3>
            }
          >
            <div className="pb-3 lg:pb-0">
              <div className="flex items-center justify-between gap-3 lg:mt-0.5">
                <p className="text-[0.75rem] leading-relaxed text-ink-3">
                  Drag to say what matters most. The ranking updates as you go.
                </p>
                <button
                  type="button"
                  onClick={() => setWeights(DEFAULT_WEIGHTS)}
                  disabled={!changed}
                  className="h-11 shrink-0 rounded-md px-2 text-[0.8125rem] font-medium text-ink underline decoration-line-strong underline-offset-4 transition-colors duration-150 hover:decoration-ink disabled:text-ink-3/60 disabled:no-underline lg:h-8"
                >
                  Reset
                </button>
              </div>
              <div className="mt-3 space-y-3.5">
                {CRITERIA.map((criterion) => {
                  const share = total === 0 ? 0 : Math.round((weights[criterion.id] / total) * 100);
                  return (
                    <div key={criterion.id}>
                      <label
                        htmlFor={`weight-${criterion.id}`}
                        className="flex items-baseline justify-between gap-3 text-[0.8125rem]"
                      >
                        <span className="font-medium text-ink">{criterion.label}</span>
                        <span className="tabular-nums text-ink-2">{share}%</span>
                      </label>
                      <input
                        id={`weight-${criterion.id}`}
                        type="range"
                        min={0}
                        max={50}
                        step={5}
                        value={weights[criterion.id]}
                        onChange={(event) => setWeight(criterion.id, Number(event.target.value))}
                        className="mt-1 h-10 w-full cursor-pointer lg:h-6"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </MobileCollapse>
        </Panel>
      </div>

      <CompareGrid companies={companies} stack>
        {CRITERIA.map((criterion) => (
          <CompareRow
            key={criterion.id}
            count={companies.length}
            label={criterion.label}
            hint={criterion.question}
            stack
          >
            {companies.map((company) => {
              const { score, evidence } = criterion.scores[company.id];
              return (
                <div key={company.id} className={`co-${company.id} min-w-0 md:pr-4`}>
                  <div className="flex items-center gap-2.5">
                    <CompanyMark company={company} label="short" size="sm" className="md:hidden" />
                    <span aria-hidden className="ml-auto flex gap-[3px] md:ml-0">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <span
                          key={n}
                          className={`h-1.5 w-4 rounded-[2px] ${n <= score ? "bg-co" : "bg-line"}`}
                        />
                      ))}
                    </span>
                    <span className="text-[0.8125rem] tabular-nums text-ink-3">
                      <span className="font-semibold text-ink">{score}</span> / 5
                    </span>
                  </div>
                  <p className="mt-1.5 text-[0.8125rem] leading-snug text-ink-2">{evidence}</p>
                </div>
              );
            })}
          </CompareRow>
        ))}
      </CompareGrid>
    </div>
  );
}
