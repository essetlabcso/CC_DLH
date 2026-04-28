import Link from "next/link";

import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";

type ForbiddenPageProps = {
  searchParams?: Promise<{
    workspace?: string;
  }>;
};

export default async function ForbiddenPage({ searchParams }: ForbiddenPageProps) {
  const params = await searchParams;
  const workspace = params?.workspace;

  return (
    <WorkspaceShell eyebrow="Access Boundary" title="Access not available">
      <p>
        Your current DEC access does not include this area.
      </p>
      {workspace ? (
        <p className="workspace-note">Requested area: {workspace}</p>
      ) : null}
      <nav aria-label="Access recovery" className="workspace-nav">
        <Link className="workspace-link primary" href="/staff">
          Staff access
        </Link>
        <Link className="workspace-link" href="/">
          Home
        </Link>
      </nav>
    </WorkspaceShell>
  );
}
