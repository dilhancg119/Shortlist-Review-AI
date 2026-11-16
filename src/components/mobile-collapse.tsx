"use client";

import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";

/**
 * A section that folds away on phones and tablets and is always open on
 * desktop. Long lists stay one tap away without making the page endless.
 */
export function MobileCollapse({
  summary,
  defaultOpen = false,
  className = "",
  children,
}: {
  summary: React.ReactNode;
  /** Whether the section starts open on small screens. */
  defaultOpen?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();

  return (
    <div className={className}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((value) => !value)}
        className="flex min-h-11 w-full items-center justify-between gap-3 text-left lg:hidden"
      >
        <span className="min-w-0">{summary}</span>
        <ChevronDown
          aria-hidden
          className={`size-4 shrink-0 text-ink-3 transition-transform duration-200 ease-out ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div className="hidden lg:block">{summary}</div>
      <div id={id} className={`${open ? "" : "hidden"} lg:block`}>
        {children}
      </div>
    </div>
  );
}
