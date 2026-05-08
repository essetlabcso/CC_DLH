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
import { loadPermissionIdentity } from "@/lib/auth/permission-identity";
import { getPersistedIdentity, type PersistedIdentity } from "@/lib/auth/persistence";
import { prisma } from "@/lib/db/client";
import {
  canAccessAdminWorkspace,
  canViewPublishQueue,
} from "@/lib/permissions/scoped-access";

export async function getCurrentSession(): Promise<DecSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName())?.value;

  return parseSessionToken(token);
}

export async function getCurrentIdentity(): Promise<PersistedIdentity | null> {
  return getPersistedIdentity(prisma, await getCurrentSession());
}

export async function getPermissionIdentity() {
  return loadPermissionIdentity(prisma, await getCurrentIdentity());
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

  if (workspace.pathPrefix === "/admin") {
    const permissionIdentity = await loadPermissionIdentity(prisma, identity);

    if (!permissionIdentity || !canAccessAdminWorkspace(permissionIdentity)) {
      redirect("/forbidden?reason=ADMIN_RESTRICTED");
    }

    return identity;
  }

  if (workspace.pathPrefix === "/review") {
    if (canAccessWorkspace(identity.session.role, workspace)) {
      return identity;
    }

    const permissionIdentity = await loadPermissionIdentity(prisma, identity);

    if (!permissionIdentity || !canViewPublishQueue(permissionIdentity)) {
      redirect(
        `/forbidden?next=${encodeURIComponent(pathname)}&workspace=${workspace.label.toLowerCase()}`,
      );
    }

    return identity;
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

export async function requirePermissionIdentity(pathname: string) {
  const identity = await getPermissionIdentity();

  if (!identity) {
    redirect(`/sign-in?next=${encodeURIComponent(pathname)}`);
  }

  return identity;
}
