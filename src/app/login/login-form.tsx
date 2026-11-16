"use client";

import { Eye, EyeOff } from "lucide-react";
import { useActionState, useState } from "react";
import { login } from "./actions";

const field =
  "h-12 w-full rounded-lg border border-line-strong bg-surface px-3.5 text-[1rem] text-ink outline-none transition-colors duration-150 placeholder:text-ink-3 focus:border-ink focus:ring-2 focus:ring-ink/15 aria-invalid:border-danger";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  const [showPassword, setShowPassword] = useState(false);
  const invalid = Boolean(state?.error);

  return (
    <form action={action} className="space-y-4" noValidate>
      <div>
        <label htmlFor="username" className="mb-1.5 block text-[0.8125rem] font-medium text-ink">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          defaultValue={state?.username ?? ""}
          autoComplete="username"
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          required
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? "login-error" : undefined}
          className={field}
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-[0.8125rem] font-medium text-ink">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            required
            aria-invalid={invalid || undefined}
            aria-describedby={invalid ? "login-error" : undefined}
            className={`${field} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="absolute inset-y-0 right-0 grid w-12 place-items-center rounded-r-lg text-ink-3 transition-colors duration-150 hover:text-ink"
          >
            {showPassword ? <EyeOff aria-hidden className="size-[1.125rem]" /> : <Eye aria-hidden className="size-[1.125rem]" />}
          </button>
        </div>
      </div>

      <p
        id="login-error"
        role="alert"
        className={`text-[0.8125rem] leading-snug text-danger ${invalid ? "" : "hidden"}`}
      >
        {state?.error}
      </p>

      <button
        type="submit"
        disabled={pending}
        className="h-12 w-full rounded-lg bg-ink text-[0.9375rem] font-medium text-surface transition-opacity duration-150 hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Signing in" : "Sign in"}
      </button>
    </form>
  );
}
