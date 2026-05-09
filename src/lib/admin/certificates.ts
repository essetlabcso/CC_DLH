import type { CertificateStatusEventType } from "@prisma/client";

import { prisma } from "@/lib/db/client";

export type AdminCertificateRecord = {
  id: string;
  certificateNumber: string;
  issuedAt: Date;
  revokedAt: Date | null;
  learnerName: string;
  learnerEmail: string;
  courseId: string;
  courseTitle: string;
  courseVersionNumber: number;
  organizationName: string;
  statusEvents: {
    id: string;
    eventType: CertificateStatusEventType;
    note: string;
    createdAt: Date;
    actorName: string | null;
  }[];
};

export type AdminCertificateOverview = {
  certificates: AdminCertificateRecord[];
  totals: {
    active: number;
    revoked: number;
    total: number;
  };
};

export async function getAdminCertificateOverview(
  organizationId: string,
): Promise<AdminCertificateOverview> {
  const certificates = await prisma.learnerCertificate.findMany({
    where: {
      courseVersion: {
        course: {
          organizationId,
        },
      },
    },
    orderBy: {
      issuedAt: "desc",
    },
    select: {
      certificateNumber: true,
      id: true,
      issuedAt: true,
      revokedAt: true,
      user: {
        select: {
          email: true,
          name: true,
        },
      },
      courseVersion: {
        select: {
          versionNumber: true,
          course: {
            select: {
              id: true,
              organization: {
                select: {
                  name: true,
                },
              },
              title: true,
            },
          },
        },
      },
      statusEvents: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          actor: {
            select: {
              name: true,
            },
          },
          createdAt: true,
          eventType: true,
          id: true,
          note: true,
        },
      },
    },
  });

  const records = certificates.map((certificate) => ({
    id: certificate.id,
    certificateNumber: certificate.certificateNumber,
    issuedAt: certificate.issuedAt,
    revokedAt: certificate.revokedAt,
    learnerName: certificate.user.name,
    learnerEmail: certificate.user.email,
    courseId: certificate.courseVersion.course.id,
    courseTitle: certificate.courseVersion.course.title,
    courseVersionNumber: certificate.courseVersion.versionNumber,
    organizationName: certificate.courseVersion.course.organization.name,
    statusEvents: certificate.statusEvents.map((event) => ({
      id: event.id,
      eventType: event.eventType,
      note: event.note,
      createdAt: event.createdAt,
      actorName: event.actor?.name ?? null,
    })),
  }));

  return {
    certificates: records,
    totals: {
      active: records.filter((certificate) => !certificate.revokedAt).length,
      revoked: records.filter((certificate) => certificate.revokedAt).length,
      total: records.length,
    },
  };
}
