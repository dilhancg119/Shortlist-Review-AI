import { ChevronDown } from "lucide-react";
import { BASIS_LABEL, type Basis, type Fact, type Status } from "@/lib/companies";

/** A titled block of the page. */
export function Section({
  title,
  description,
  aside,
  children,
}: {
  title: string;
  description?: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10 first-of-type:mt-8 lg:mt-12">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div className="max-w-[42rem]">
          <h2 className="text-[1.0625rem] font-semibold tracking-[-0.01em] text-ink">{title}</h2>
          {description ? (
            <p className="mt-1 text-[0.8125rem] leading-relaxed text-ink-2">{description}</p>
          ) : null}
        </div>
        {aside}
      </div>
      {children}
    </section>
  );
}

/** The one container style used for tables and charts. Never nested. */
export function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-line bg-surface ${className}`}>{children}</div>
  );
}

/**
 * Marks a fact that does not come straight from the company's own site.
 * Facts from the site carry no tag, so only the exceptions draw the eye.
 */
export function BasisTag({ basis }: { basis: Basis }) {
  if (basis === "site") return null;
  return (
    <span className="inline-flex items-center rounded-[4px] bg-wash px-1.5 py-0.5 text-[0.6875rem] font-medium leading-none text-ink-2">
      {BASIS_LABEL[basis]}
    </span>
  );
}

/**
 * A fact with its supporting detail. `compact` shows only the headline and
 * tucks the detail behind a tap, which works on touch screens where a hover
 * tooltip would not.
 */
export function FactText({ fact, compact = false }: { fact: Fact; compact?: boolean }) {
  const tone = fact.basis === "unpublished" ? "text-ink-2" : "text-ink";

  if (compact && fact.detail) {
    return (
      <details className="group/fact">
        <summary className="-my-1.5 flex cursor-pointer list-none items-start gap-1.5 py-1.5 [&::-webkit-details-marker]:hidden">
          <span className={`text-[0.875rem] leading-snug ${tone}`}>{fact.text}</span>
          <ChevronDown
            aria-hidden
            className="mt-[3px] size-3.5 shrink-0 text-ink-3 transition-transform duration-200 ease-out group-open/fact:rotate-180"
          />
        </summary>
        <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-ink-2">{fact.detail}</p>
        {fact.basis !== "site" ? (
          <p className="mt-1.5">
            <BasisTag basis={fact.basis} />
          </p>
        ) : null}
      </details>
    );
  }

  return (
    <div>
      <p className={`text-[0.875rem] leading-snug ${tone}`}>{fact.text}</p>
      {fact.detail && !compact ? (
        <p className="mt-1 text-[0.8125rem] leading-relaxed text-ink-2">{fact.detail}</p>
      ) : null}
      {fact.basis !== "site" ? (
        <p className="mt-1.5">
          <BasisTag basis={fact.basis} />
        </p>
      ) : null}
    </div>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 text-[0.8125rem] leading-snug text-ink">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span aria-hidden className="mt-[0.45rem] size-1 shrink-0 rounded-full bg-ink-3" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Present / partly / absent / can't tell. Drawn in ink, not red and green,
 * so status never competes with the company colours.
 */
export function StatusIcon({ status }: { status: Status }) {
  const common = { width: 16, height: 16, viewBox: "0 0 16 16", "aria-hidden": true } as const;
  if (status === "yes") {
    return (
      <svg {...common} className="shrink-0">
        <circle cx="8" cy="8" r="7" fill="var(--ink)" />
        <path d="M4.8 8.3l2.1 2.1 4.3-4.6" fill="none" stroke="var(--surface)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (status === "partial") {
    return (
      <svg {...common} className="shrink-0">
        <circle cx="8" cy="8" r="6.25" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
        <path d="M8 1.75a6.25 6.25 0 0 0 0 12.5z" fill="var(--ink)" />
      </svg>
    );
  }
  if (status === "no") {
    return (
      <svg {...common} className="shrink-0">
        <circle cx="8" cy="8" r="6.25" fill="none" stroke="var(--line-strong)" strokeWidth="1.5" />
      </svg>
    );
  }
  return (
    <svg {...common} className="shrink-0">
      <circle cx="8" cy="8" r="6.25" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="2.4 2.4" />
      <path d="M6.4 6.5a1.7 1.7 0 1 1 2.5 1.5c-.5.3-.9.6-.9 1.2M8 11.2v.1" fill="none" stroke="var(--ink-3)" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/**
 * A hover and focus tooltip with no JavaScript. Tooltips only add detail;
 * every value they show is also printed on the page.
 */
export function Tip({
  content,
  align = "center",
  className = "",
  style,
  positioned = false,
  children,
}: {
  content: React.ReactNode;
  align?: "start" | "center" | "end";
  className?: string;
  style?: React.CSSProperties;
  /** Set when className already positions the trigger (absolute, for example). */
  positioned?: boolean;
  children: React.ReactNode;
}) {
  const position =
    align === "start" ? "left-0" : align === "end" ? "right-0" : "left-1/2 -translate-x-1/2";
  return (
    <span
      tabIndex={0}
      style={style}
      className={`group/tip inline-flex ${positioned ? "" : "relative"} ${className}`}
    >
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute bottom-full z-40 mb-2 w-max max-w-[15rem] rounded-lg bg-ink px-2.5 py-2 text-left text-[0.75rem] font-normal leading-snug text-surface opacity-0 transition-opacity duration-150 ease-out group-hover/tip:opacity-100 group-focus/tip:opacity-100 ${position}`}
      >
        {content}
      </span>
    </span>
  );
}

export const number = new Intl.NumberFormat("en-US");
