import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, isValidSession } from "@/lib/auth";

/**
 * Runs before every page. Anyone without a valid session is sent to the
 * sign-in screen, and comes back to the page they asked for afterwards.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const signedIn = isValidSession(request.cookies.get(SESSION_COOKIE)?.value);

  if (pathname === "/login") {
    return signedIn ? NextResponse.redirect(new URL("/all", request.url)) : NextResponse.next();
  }
  if (signedIn) return NextResponse.next();

  const login = new URL("/login", request.url);
  if (pathname !== "/" && pathname !== "/all") login.searchParams.set("from", pathname + search);
  return NextResponse.redirect(login);
}

export const config = {
  // Everything except build assets, the app icons and the company logos.
  matcher: ["/((?!_next/static|_next/image|icons/|logos/|icon.svg|apple-icon.png|manifest.webmanifest).*)"],
};
