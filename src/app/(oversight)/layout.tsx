import { requireWorkspaceAccess } from "@/lib/auth/server";

export default async function OversightLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireWorkspaceAccess("/oversight");

  return <>{children}</>;
}
