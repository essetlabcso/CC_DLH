import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  canAccessWorkspace,
  findProtectedWorkspace,
  type DecRole,
} from "@/lib/access";
import {
  getSessionCookieName,
  parseSessionToken,
  type DecSession,
} from "@/lib/auth/session";
import { getPersistedIdentity, type PersistedIdentity } from "@/lib/auth/persistence";
import { prisma } from "@/lib/db/client";

export async function getCurrentSession(): Promise<DecSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName())?.value;

  return parseSessionToken(token);
}

export async function getCurrentIdentity(): Promise<PersistedIdentity | null> {
  return getPersistedIdentity(prisma, await getCurrentSession());
}

export async function requireRole(allowedRoles: readonly DecRole[], next = "/") {
  const identity = await getCurrentIdentity();

  if (!identity) {
    redirect(`/sign-in?next=${encodeURIComponent(next)}`);
  }

  if (!allowedRoles.includes(identity.session.role)) {
    redirect(`/forbidden?next=${encodeURIComponent(next)}`);
  }

  return identity;
}

export async function requireWorkspaceAccess(pathname: string) {
  const workspace = findProtectedWorkspace(pathname);

  if (!workspace) {
    return getCurrentSession();
  }

  const identity = await getCurrentIdentity();

  if (!identity) {
    redirect(
      `/sign-in?next=${encodeURIComponent(pathname)}&workspace=${workspace.label.toLowerCase()}`,
    );
  }

  if (!canAccessWorkspace(identity.session.role, workspace)) {
    redirect(
      `/forbidden?next=${encodeURIComponent(pathname)}&workspace=${workspace.label.toLowerCase()}`,
    );
  }

  return identity;
}

export async function requireWorkspaceIdentity(pathname: string) {
  const identity = await requireWorkspaceAccess(pathname);

  if (!identity || !("user" in identity)) {
    redirect(`/sign-in?next=${encodeURIComponent(pathname)}`);
  }

  return identity;
}
