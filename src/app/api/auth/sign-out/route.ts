import { NextResponse } from "next/server";

import { getSessionCookieName } from "@/lib/auth/session";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/sign-in", request.url));

  response.cookies.set(getSessionCookieName(), "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  });

  return response;
}
