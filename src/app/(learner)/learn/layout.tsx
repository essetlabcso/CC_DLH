import { requireWorkspaceAccess } from "@/lib/auth/server";

export default async function LearnerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireWorkspaceAccess("/learn");

  return children;
}
