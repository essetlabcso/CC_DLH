import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";

type StaffPageProps = {
  searchParams?: Promise<{
    next?: string;
    workspace?: string;
    error?: string;
  }>;
};

const staffRoles = [
  {
    role: "creator",
    label: "Course creator",
    description: "Enter the Course Creator Studio.",
    defaultNext: "/studio",
  },
  {
    role: "reviewer",
    label: "Reviewer / publisher",
    description: "Enter the review and forward-movement workspace.",
    defaultNext: "/review",
  },
  {
    role: "admin",
    label: "Admin",
    description: "Enter the platform governance workspace.",
    defaultNext: "/admin",
  },
] as const;

export default async function StaffPage({ searchParams }: StaffPageProps) {
  const params = await searchParams;
  const requestedNext = normalizeStaffNext(params?.next);
  const workspace = params?.workspace;
  const error = params?.error;

  return (
    <WorkspaceShell eyebrow="Staff Access" title="DEC staff sign in">
      <p>
        This area is for DEC staff and authorized course production roles. The
        buttons below are temporary local access controls until the production
        identity provider is connected.
      </p>
      {workspace ? (
        <p className="workspace-note">Requested staff area: {workspace}</p>
      ) : null}
      {error ? (
        <p className="workspace-error">Choose a valid staff role to continue.</p>
      ) : null}
      <div className="staff-access-list">
        {staffRoles.map((staffRole) => (
          <form
            action="/api/auth/dev-sign-in"
            className="staff-access-card"
            key={staffRole.role}
            method="post"
          >
            <input name="role" type="hidden" value={staffRole.role} />
            <input
              name="next"
              type="hidden"
              value={requestedNext || staffRole.defaultNext}
            />
            <div>
              <h2>{staffRole.label}</h2>
              <p>{staffRole.description}</p>
            </div>
            <button className="workspace-button" type="submit">
              Continue
            </button>
          </form>
        ))}
      </div>
    </WorkspaceShell>
  );
}

function normalizeStaffNext(value: string | undefined) {
  if (
    value === "/studio" ||
    value?.startsWith("/studio/") ||
    value === "/review" ||
    value?.startsWith("/review/") ||
    value === "/admin" ||
    value?.startsWith("/admin/")
  ) {
    return value;
  }

  if (value === "/creator" || value?.startsWith("/creator/")) {
    return "/studio";
  }

  return undefined;
}
