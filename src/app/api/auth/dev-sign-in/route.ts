import { NextResponse } from "next/server";

import { isDecRole } from "@/lib/access";
import {
  createSession,
  createSessionToken,
  getSessionCookieName,
} from "@/lib/auth/session";
import { prisma } from "@/lib/db/client";
import { upsertLocalDevUser } from "@/lib/auth/persistence";

export async function POST(request: Request) {
  const formData = await request.formData();
  const role = String(formData.get("role") || "");
  const next = normalizeNextPath(String(formData.get("next") || "/"));

  if (!isDecRole(role)) {
    return NextResponse.redirect(new URL("/sign-in?error=role", request.url));
  }

  const user = await upsertLocalDevUser(prisma, role);
  const session = createSession({
    userId: user.id,
    organizationId: user.organizationId,
    email: user.email,
    name: user.name,
    role,
  });
  const token = await createSessionToken(session);
  const response = NextResponse.redirect(new URL(next, request.url));

  response.cookies.set(getSessionCookieName(), token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(session.expiresAt),
  });

  return response;
}

function normalizeNextPath(value: string) {
  if (!value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  return value;
}
