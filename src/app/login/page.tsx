import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[24rem] flex-col justify-center px-5 py-10">
      <div className="flex items-center gap-3">
        <span aria-hidden className="grid size-10 grid-cols-3 items-end gap-[3px] rounded-[10px] bg-ink p-[9px]">
          <span className="h-[55%] rounded-[2px] bg-surface/55" />
          <span className="h-[75%] rounded-[2px] bg-surface/75" />
          <span className="h-full rounded-[2px] bg-surface" />
        </span>
        <span className="leading-tight">
          <span className="block text-[1rem] font-semibold text-ink">Shortlist Review</span>
          <span className="block text-[0.8125rem] text-ink-3">Booking system prospects</span>
        </span>
      </div>

      <h1 className="mt-9 text-[1.5rem] font-semibold leading-tight tracking-[-0.015em] text-ink">Sign in</h1>
      <p className="mb-6 mt-1.5 text-[0.9375rem] leading-relaxed text-ink-2">
        Use your staff username and password.
      </p>

      <LoginForm />
    </main>
  );
}
