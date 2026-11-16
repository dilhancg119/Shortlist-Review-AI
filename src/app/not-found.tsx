import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-[30rem] flex-col justify-center px-6">
      <h1 className="text-[1.5rem] font-semibold tracking-[-0.015em] text-ink">That view does not exist</h1>
      <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-2">
        The link may name a company that is not on the shortlist. Start again from the full comparison.
      </p>
      <p className="mt-5">
        <Link
          href="/all"
          className="inline-flex h-10 items-center rounded-lg bg-ink px-4 text-[0.875rem] font-medium text-surface"
        >
          Compare all three
        </Link>
      </p>
    </main>
  );
}
