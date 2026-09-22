import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/tasks", "/schedule", "/notes", "/documents", "/members", "/onboarding", "/join", "/account"];
const authRoutes = ["/sign-in", "/sign-up"];

function matchesRoute(pathname: string, routes: readonly string[]) {
  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasSessionCookie = Boolean(getSessionCookie(request));

  if (matchesRoute(pathname, protectedRoutes) && !hasSessionCookie) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("error", "Silakan masuk untuk melanjutkan.");
    signInUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(signInUrl);
  }

  if (matchesRoute(pathname, authRoutes) && hasSessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/tasks/:path*", "/schedule/:path*", "/notes/:path*", "/documents/:path*", "/members/:path*", "/onboarding/:path*", "/join/:path*", "/account/:path*", "/sign-in", "/sign-up"],
};
