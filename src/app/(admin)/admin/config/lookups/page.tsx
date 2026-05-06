import { redirect } from "next/navigation";
import { requireWorkspaceIdentity } from "@/lib/auth/server";

type LookupsRedirectPageProps = {
  searchParams?: Promise<{
    category?: string;
    search?: string;
    created?: string;
    updated?: string;
    error?: string;
  }>;
};

export default async function LookupsRedirectPage({
  searchParams,
}: LookupsRedirectPageProps) {
  await requireWorkspaceIdentity("/admin/config/lookups");
  const params = await searchParams;

  const urlParams = new URLSearchParams();
  if (params?.category) urlParams.set("category", params.category);
  if (params?.search) urlParams.set("search", params.search);
  if (params?.created) urlParams.set("created", params.created);
  if (params?.updated) urlParams.set("updated", params.updated);
  if (params?.error) urlParams.set("error", params.error);

  const queryStr = urlParams.toString();
  const target = `/admin/reference-data${queryStr ? `?${queryStr}` : ""}`;

  redirect(target);
}
