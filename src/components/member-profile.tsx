"use client";

import { ExternalLink, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { TeamMember } from "@/lib/companies";
import { LargePhoto, Portrait, initialsOf } from "./portrait";

/** Width divided by height of the large photo in the dialog. */
const FRAME = 4 / 5;

/**
 * One person in the team directory. The photo is a button: it opens a dialog
 * with the photo at reading size and a link to the person on LinkedIn.
 *
 * A confirmed profile URL (`member.linkedin`) is linked directly. Without
 * one the link runs a LinkedIn people search for the name and company, and
 * says so, so a search is never passed off as the person's profile.
 */
export function MemberProfile({ member, companyName }: { member: TeamMember; companyName: string }) {
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (open && !dialog.current?.open) dialog.current?.showModal();
  }, [open]);

  const linkedin =
    member.linkedin ??
    `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(`${member.name} ${companyName}`)}`;

  return (
    <div className="flex min-w-0 items-center gap-3">
      <button
        ref={trigger}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label={`${member.name}: larger photo and LinkedIn`}
        className="shrink-0 cursor-zoom-in rounded-lg transition-[box-shadow,transform] duration-150 ease-out hover:shadow-[0_0_0_2px_var(--line-strong)] active:scale-[0.97]"
      >
        <Portrait src={member.photo} name={member.name} focus={member.focus} />
      </button>
      <div className="min-w-0">
        <p className="text-[0.875rem] font-medium leading-snug text-ink">{member.name}</p>
        <p className="text-[0.8125rem] leading-snug text-ink-2">{member.title}</p>
        {member.note ? <p className="mt-0.5 text-[0.75rem] leading-snug text-ink-3">{member.note}</p> : null}
      </div>

      {open ? (
        <dialog
          ref={dialog}
          aria-labelledby={titleId}
          onClose={() => {
            setOpen(false);
            // The dialog unmounts on close, so hand focus back by hand.
            trigger.current?.focus();
          }}
          onClick={(event) => {
            // The dialog element itself is only hit on the backdrop.
            if (event.target === event.currentTarget) dialog.current?.close();
          }}
          className="m-auto w-[min(24rem,calc(100vw-2rem))] max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-xl bg-surface p-0 text-ink shadow-[0_24px_64px_-16px_oklch(0.22_0.018_265/0.45)] backdrop:bg-[oklch(0.22_0.018_265/0.55)]"
        >
          <div className="relative">
            <div
              className="relative grid w-full place-items-center overflow-hidden bg-wash text-[2.5rem] font-semibold tracking-wide text-ink-3"
              style={{ aspectRatio: FRAME }}
            >
              <span aria-hidden>{initialsOf(member.name)}</span>
              {member.photo && !failed ? (
                <LargePhoto src={member.photo} focus={member.focus} frame={FRAME} onError={() => setFailed(true)} />
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              aria-label="Close"
              className="absolute right-2.5 top-2.5 grid size-11 place-items-center !rounded-full bg-surface/90 text-ink shadow-sm transition-colors duration-150 hover:bg-surface"
            >
              <X aria-hidden className="size-5" />
            </button>
          </div>

          <div className="px-5 pb-5 pt-4">
            <h4 id={titleId} className="text-[1.0625rem] font-semibold leading-snug text-ink">
              {member.name}
            </h4>
            <p className="text-[0.875rem] leading-snug text-ink-2">
              {member.title}, {companyName}
            </p>
            {member.note ? <p className="mt-1 text-[0.8125rem] leading-snug text-ink-3">{member.note}</p> : null}

            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex min-h-11 items-center justify-center gap-2 rounded-lg bg-ink px-4 text-[0.875rem] font-medium text-surface transition-opacity duration-150 hover:opacity-90"
            >
              {member.linkedin ? "LinkedIn profile" : "Find on LinkedIn"}
              <ExternalLink aria-hidden className="size-4" />
            </a>
            {member.linkedin ? null : (
              <p className="mt-2 text-center text-[0.75rem] leading-snug text-ink-3">
                Opens a LinkedIn search for this name and company.
              </p>
            )}
          </div>
        </dialog>
      ) : null}
    </div>
  );
}
