import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Sign-in for the dashboard: one shared account, read from the environment.
 *
 *   AUTH_USERNAME  the staff username
 *   AUTH_PASSWORD  the password
 *   AUTH_SECRET    optional; signs session cookies. Defaults to a value
 *                  derived from the password, so changing the password
 *                  signs everyone out.
 *
 * Set them in `.env.local` for local work (see `.env.example`) and in the
 * host's settings when deployed. This file only ever runs on the server (the
 * proxy and the sign-in action), so the password is never sent to the browser.
 * If either value is missing, nobody can sign in.
 */
const USERNAME = process.env.AUTH_USERNAME ?? "";
const PASSWORD = process.env.AUTH_PASSWORD ?? "";
const CONFIGURED = USERNAME !== "" && PASSWORD !== "";

export const SESSION_COOKIE = "shortlist_session";
/** How long a sign-in lasts, in seconds (30 days). */
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

const SECRET = process.env.AUTH_SECRET ?? `shortlist-review:${PASSWORD}`;

/** Compares two strings without leaking where they differ through timing. */
function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

/** The username is not case sensitive; the password is. */
export function checkCredentials(username: string, password: string) {
  if (!CONFIGURED) return false;
  const userOk = safeEqual(username.trim().toUpperCase(), USERNAME.toUpperCase());
  const passwordOk = safeEqual(password, PASSWORD);
  return userOk && passwordOk;
}

function sign(expires: number) {
  return createHmac("sha256", SECRET).update(`${USERNAME}:${expires}`).digest("hex");
}

/** A signed token of the form `<expiry>.<signature>`, stored in the session cookie. */
export function createSessionToken(now = Date.now()) {
  const expires = now + SESSION_MAX_AGE * 1000;
  return `${expires}.${sign(expires)}`;
}

export function isValidSession(token: string | undefined, now = Date.now()) {
  if (!token || !CONFIGURED) return false;
  const [expiresPart, signature] = token.split(".");
  const expires = Number(expiresPart);
  if (!signature || !Number.isSafeInteger(expires) || expires <= now) return false;
  return safeEqual(signature, sign(expires));
}

/** Where to send someone after signing in. Only same-site paths are allowed. */
export function safeDestination(from: string | null | undefined) {
  if (!from || !from.startsWith("/") || from.startsWith("//") || from.startsWith("/login")) return "/all";
  return from;
}
