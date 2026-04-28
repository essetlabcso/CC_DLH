import { requireWorkspaceAccess } from "@/lib/auth/server";

export default async function ReviewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireWorkspaceAccess("/review");

  return children;
}
