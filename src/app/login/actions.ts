"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  checkCredentials,
  createSessionToken,
  safeDestination,
} from "@/lib/auth";

export type LoginState = { error: string; username: string } | undefined;

export async function login(_previous: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!username.trim() || !password) {
    return { error: "Enter both your username and your password.", username };
  }
  if (!checkCredentials(username, password)) {
    return { error: "That username or password is not right. Check both and try again.", username };
  }

  const requestHeaders = await headers();
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    // Only mark the cookie secure when the site is served over HTTPS, so
    // signing in still works on a local network address during testing.
    secure: requestHeaders.get("x-forwarded-proto") === "https",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  // The proxy adds ?from= to the sign-in URL; go back to that page.
  let from: string | null = null;
  try {
    from = new URL(requestHeaders.get("referer") ?? "").searchParams.get("from");
  } catch {
    from = null;
  }
  redirect(safeDestination(from));
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/login");
}
