"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type AdminShellProps = {
  children: React.ReactNode;
};

const navItems = [
  {
    label: "Home",
    href: "/admin",
    match: (pathname: string) => pathname === "/admin",
    shortLabel: "H",
  },
  {
    label: "Users & Roles",
    href: "/admin/users",
    match: (pathname: string) =>
      pathname === "/admin/users" ||
      pathname.startsWith("/admin/users/") ||
      pathname.startsWith("/admin/admin-authority"),
    shortLabel: "U",
  },
  {
    label: "CSOs & Programs",
    href: "/admin/organizations",
    match: (pathname: string) =>
      pathname.startsWith("/admin/organizations") ||
      pathname.startsWith("/admin/programs-cohorts") ||
      pathname.startsWith("/admin/participant-access") ||
      pathname.startsWith("/admin/learner-invitations"),
    shortLabel: "C",
  },
  {
    label: "Diagnosis",
    href: "/admin/diagnosis-records",
    match: (pathname: string) =>
      pathname.startsWith("/admin/diagnosis-records") ||
      pathname.startsWith("/admin/diagnosis-datasets"),
    shortLabel: "D",
  },
  {
    label: "Courses",
    href: "/admin/courses",
    match: (pathname: string) =>
      pathname.startsWith("/admin/courses") ||
      pathname.startsWith("/admin/certificates") ||
      pathname.startsWith("/admin/proof-badges"),
    shortLabel: "O",
  },
  {
    label: "Reports",
    href: "/admin/reports",
    match: (pathname: string) =>
      pathname.startsWith("/admin/reports") ||
      pathname.startsWith("/admin/monitoring"),
    shortLabel: "R",
  },
];

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname() || "/admin";

  return (
    <div className="admin-console-shell">
      <header className="admin-console-topbar" aria-label="Admin header">
        <Link className="admin-console-brand" href="/admin">
          <span className="admin-console-logo">
            <Image alt="DEC" height={42} priority src="/dec-logo.svg" width={42} />
          </span>
          <span>
            <strong>CSO Learning Hub Admin</strong>
            <small>DEC platform governance</small>
          </span>
        </Link>

        <label className="admin-console-search">
          <span className="sr-only">Search admin records</span>
          <input
            placeholder="Search users, CSOs, courses, reports..."
            type="search"
          />
        </label>

        <div className="admin-console-actions" aria-label="Admin utilities">
          <Link className="admin-console-icon-button" href="/admin/reference-data">
            Help
          </Link>
          <Link className="admin-console-icon-button" href="/admin/audit-log">
            Alerts
          </Link>
          <Link className="admin-console-profile" href="/admin/users">
            <span aria-hidden="true">A</span>
            <strong>Admin User</strong>
          </Link>
        </div>
      </header>

      <div className="admin-console-body">
        <aside className="admin-console-sidebar" aria-label="Admin modules">
          <nav>
            {navItems.map((item) => {
              const active = item.match(pathname);

              return (
                <Link
                  aria-current={active ? "page" : undefined}
                  className={`admin-console-nav-item${
                    active ? " admin-console-nav-item-active" : ""
                  }`}
                  href={item.href}
                  key={item.label}
                >
                  <span aria-hidden="true">{item.shortLabel}</span>
                  <strong>{item.label}</strong>
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="admin-console-main">{children}</div>
      </div>
    </div>
  );
}
