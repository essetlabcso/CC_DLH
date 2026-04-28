import { requireWorkspaceAccess } from "@/lib/auth/server";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireWorkspaceAccess("/admin");

  return children;
}
