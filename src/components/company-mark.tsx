import Image from "next/image";
import type { Company } from "@/lib/companies";

/** The company's square logo icon, in a small tile. */
export function CompanyIcon({
  company,
  size = "md",
  muted = false,
}: {
  company: Company;
  size?: "sm" | "md";
  /** Greyed out, for a company that is filtered off. */
  muted?: boolean;
}) {
  return (
    <span
      className={`grid shrink-0 place-items-center overflow-hidden rounded-[5px] bg-surface ring-1 ring-line ${
        size === "sm" ? "size-5" : "size-6"
      }`}
    >
      <Image
        src={company.logo.icon}
        alt=""
        width={24}
        height={24}
        className={`size-full object-contain transition-[filter,opacity] duration-150 ${
          muted ? "opacity-55 grayscale" : ""
        }`}
      />
    </span>
  );
}

/**
 * A company's identity: its logo icon plus its name. In charts the name sits
 * beside the coloured mark it labels, so identity never rests on colour alone.
 */
export function CompanyMark({
  company,
  label = "name",
  size = "md",
  wrap = false,
  className = "",
}: {
  company: Company;
  label?: "name" | "short" | "none";
  size?: "sm" | "md";
  /** Let a long name wrap instead of truncating, for narrow columns. */
  wrap?: boolean;
  className?: string;
}) {
  return (
    <span
      title={label === "none" ? company.name : undefined}
      className={`co-${company.id} inline-flex min-w-0 items-center gap-2 ${className}`}
    >
      <CompanyIcon company={company} size={size} />
      {label === "none" ? (
        <span className="sr-only">{company.name}</span>
      ) : (
        <span className={`font-medium text-ink ${wrap ? "leading-tight" : "truncate"}`}>
          {label === "short" ? company.short : company.name}
        </span>
      )}
    </span>
  );
}

/** The company's full logo, for places with room to show it. */
export function CompanyLogo({ company }: { company: Company }) {
  const { full, width, height } = company.logo;
  return (
    <span className="flex h-12 items-center">
      <Image
        src={full}
        alt={`${company.name} logo`}
        width={width}
        height={height}
        sizes="160px"
        className="h-auto max-h-12 w-auto max-w-[9.5rem] rounded-[3px] object-contain"
      />
    </span>
  );
}
