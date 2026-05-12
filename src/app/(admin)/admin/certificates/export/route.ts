import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { getAdminCertificateOverview } from "@/lib/admin/certificates";

export async function GET(request: Request) {
  const identity = await requireWorkspaceIdentity("/admin/certificates");
  
  const url = new URL(request.url);
  const q = url.searchParams.get("q") || undefined;
  const rawStatus = url.searchParams.get("status");
  const status = rawStatus === "ACTIVE" || rawStatus === "REVOKED" ? rawStatus : undefined;
  const courseId = url.searchParams.get("courseId") || undefined;

  const overview = await getAdminCertificateOverview(identity.user.organizationId, {
    query: q,
    status,
    courseId,
  });

  const header = [
    "Certificate Number",
    "Course Title",
    "Course Version",
    "Learner Name",
    "Learner Email", // Intentional Admin-only registry export field
    "Issued At",
    "Status",
    "Revoked At"
  ].join(",");

  const escapeCsvValue = (value: string | number | null | undefined) => {
    if (value === null || value === undefined) return '""';
    let str = String(value);
    
    // Prevent spreadsheet injection
    if (/^[=+\-@\t\r]/.test(str)) {
      str = "'" + str;
    }
    
    return `"${str.replace(/"/g, '""')}"`;
  };

  // Note: Export audit logging is deferred as there is no safe existing
  // adminAuditActionMetadata pattern for CSV exports yet.

  const rows = overview.certificates.map(cert => {
    return [
      escapeCsvValue(cert.certificateNumber),
      escapeCsvValue(cert.courseTitle),
      escapeCsvValue(cert.courseVersionNumber),
      escapeCsvValue(cert.learnerName),
      escapeCsvValue(cert.learnerEmail),
      escapeCsvValue(cert.issuedAt.toISOString()),
      escapeCsvValue(cert.revokedAt ? "REVOKED" : "ACTIVE"),
      escapeCsvValue(cert.revokedAt ? cert.revokedAt.toISOString() : "")
    ].join(",");
  });

  const csvContent = [header, ...rows].join("\n");

  const today = new Date().toISOString().split("T")[0];
  const filename = `dec-certificates-${today}.csv`;

  return new Response(csvContent, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
