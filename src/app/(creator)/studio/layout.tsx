import { requireWorkspaceAccess } from "@/lib/auth/server";

export default async function StudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireWorkspaceAccess("/studio");

  return children;
}
