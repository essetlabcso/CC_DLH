import { NextRequest, NextResponse } from "next/server";

import { canAccessWorkspace, findProtectedWorkspace } from "@/lib/access";
import { getSessionCookieName, parseSessionToken } from "@/lib/auth/session";

export async function middleware(request: NextRequest) {
  const workspace = findProtectedWorkspace(request.nextUrl.pathname);

  if (!workspace) {
    return NextResponse.next();
  }

  const sessionToken = request.cookies.get(getSessionCookieName())?.value;
  const session = await parseSessionToken(sessionToken);

  if (!session) {
    const signInUrl = new URL(
      workspace.pathPrefix === "/learn" ? "/sign-in" : "/staff",
      request.url,
    );
    signInUrl.searchParams.set("next", request.nextUrl.pathname);
    signInUrl.searchParams.set("workspace", workspace.label.toLowerCase());

    return NextResponse.redirect(signInUrl);
  }

  if (!canAccessWorkspace(session.role, workspace)) {
    const forbiddenUrl = new URL("/forbidden", request.url);
    forbiddenUrl.searchParams.set("next", request.nextUrl.pathname);
    forbiddenUrl.searchParams.set("workspace", workspace.label.toLowerCase());

    return NextResponse.redirect(forbiddenUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/learn/:path*", "/studio/:path*", "/review/:path*", "/admin/:path*"],
};
