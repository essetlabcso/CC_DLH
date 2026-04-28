export const roles = ["learner", "creator", "reviewer", "admin"] as const;

export type DecRole = (typeof roles)[number];

export type ProtectedWorkspace = {
  pathPrefix: string;
  label: string;
  allowedRoles: readonly DecRole[];
};

export const protectedWorkspaces: readonly ProtectedWorkspace[] = [
  {
    pathPrefix: "/learn",
    label: "Learner",
    allowedRoles: ["learner", "admin"],
  },
  {
    pathPrefix: "/studio",
    label: "Studio",
    allowedRoles: ["creator", "admin"],
  },
  {
    pathPrefix: "/review",
    label: "Review",
    allowedRoles: ["reviewer", "admin"],
  },
  {
    pathPrefix: "/admin",
    label: "Admin",
    allowedRoles: ["admin"],
  },
];

export function isDecRole(value: string | undefined): value is DecRole {
  return roles.includes(value as DecRole);
}

export function findProtectedWorkspace(pathname: string) {
  return protectedWorkspaces.find(
    (workspace) =>
      pathname === workspace.pathPrefix ||
      pathname.startsWith(`${workspace.pathPrefix}/`),
  );
}

export function canAccessWorkspace(
  role: DecRole | undefined,
  workspace: ProtectedWorkspace,
) {
  return role !== undefined && workspace.allowedRoles.includes(role);
}
