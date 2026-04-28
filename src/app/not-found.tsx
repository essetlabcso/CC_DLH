import Link from "next/link";

import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";

export default function NotFound() {
  return (
    <WorkspaceShell eyebrow="Not Found" title="Page not found">
      <p>The page you requested is not available in DEC Learning Hub.</p>
      <nav aria-label="Return route" className="workspace-nav">
        <Link className="workspace-link primary" href="/">
          Home
        </Link>
      </nav>
    </WorkspaceShell>
  );
}
