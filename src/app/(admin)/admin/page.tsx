import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import Link from "next/link";

export default function AdminWorkspacePage() {
  return (
    <WorkspaceShell eyebrow="Admin Workspace" title="Platform oversight">
      <p>
        Manage DEC organizations, users, roles, course oversight, publishing
        governance, certificates, and operational records.
      </p>
      <nav className="workspace-nav" aria-label="Admin workspace actions">
        <Link className="workspace-link primary" href="/admin/certificates">
          Certificate oversight
        </Link>
      </nav>
    </WorkspaceShell>
  );
}
