import { requireWorkspaceAccess } from "@/lib/auth/server";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireWorkspaceAccess("/admin");

  return <AdminShell>{children}</AdminShell>;
}
