type WorkspaceShellProps = {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
};

export function WorkspaceShell({ eyebrow, title, children }: WorkspaceShellProps) {
  return (
    <main className="page-shell">
      <section className="workspace-panel" aria-labelledby="page-title">
        <p className="workspace-kicker">{eyebrow}</p>
        <h1 className="workspace-title" id="page-title">
          {title}
        </h1>
        <div className="workspace-copy">{children}</div>
      </section>
    </main>
  );
}
