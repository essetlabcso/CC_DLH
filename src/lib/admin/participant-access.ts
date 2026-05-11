import { prisma } from "@/lib/db/client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AdminEnrollmentRow = {
  id: string;
  learnerName: string;
  learnerEmail: string;
  organizationName: string;
  courseTitle: string;
  versionNumber: number;
  versionStatus: string;
  source: string;
  status: string;
  enrolledAt: Date | null;
  startedAt: Date | null;
  completedAt: Date | null;
};

export type AdminInvitationRow = {
  id: string;
  email: string;
  organizationName: string;
  programName: string | null;
  cohortName: string | null;
  courseTitle: string | null;
  versionLabel: string | null;
  status: string;
  createdAt: Date;
  expiresAt: Date;
  acceptedAt: Date | null;
};

export type AdminProgramParticipantRow = {
  id: string;
  learnerName: string;
  learnerEmail: string;
  organizationName: string;
  programName: string;
  status: string;
  joinedAt: Date | null;
  endedAt: Date | null;
};

export type AdminCohortParticipantRow = {
  id: string;
  learnerName: string;
  learnerEmail: string;
  organizationName: string;
  cohortName: string;
  programName: string | null;
  status: string;
  joinedAt: Date | null;
  endedAt: Date | null;
  dueAt: Date | null;
};

export type AdminParticipantAccessFilterOptions = {
  organizations: { id: string; name: string }[];
  programs: { id: string; name: string; code: string | null }[];
  cohorts: { id: string; name: string }[];
  courses: { id: string; title: string }[];
};

export type AdminParticipantAccessFilters = {
  organizationId?: string;
  programId?: string;
  cohortId?: string;
  courseId?: string;
  enrollmentStatus?: string;
  search?: string;
};

export type AdminParticipantAccessOverview = {
  enrollments: AdminEnrollmentRow[];
  invitations: AdminInvitationRow[];
  programParticipants: AdminProgramParticipantRow[];
  cohortParticipants: AdminCohortParticipantRow[];
  totals: {
    enrollments: number;
    invitations: number;
    programParticipants: number;
    cohortParticipants: number;
  };
  filterOptions: AdminParticipantAccessFilterOptions;
};

// ---------------------------------------------------------------------------
// Filter parser
// ---------------------------------------------------------------------------

export function parseParticipantAccessFilters(
  params: Record<string, string | string[] | undefined>,
): AdminParticipantAccessFilters {
  return {
    organizationId: toSingleString(params.organizationId),
    programId: toSingleString(params.programId),
    cohortId: toSingleString(params.cohortId),
    courseId: toSingleString(params.courseId),
    enrollmentStatus: toSingleString(params.enrollmentStatus),
    search: toSingleString(params.search),
  };
}

function toSingleString(
  value: string | string[] | undefined,
): string | undefined {
  if (!value) return undefined;
  const v = Array.isArray(value) ? value[0] : value;
  return v || undefined;
}

// ---------------------------------------------------------------------------
// Data loader
// ---------------------------------------------------------------------------

const ENROLLMENT_LIMIT = 100;
const OTHER_LIMIT = 50;

export async function getAdminParticipantAccessOverview(
  filters: AdminParticipantAccessFilters,
): Promise<AdminParticipantAccessOverview> {
  const enrollmentWhere = buildEnrollmentWhere(filters);
  const invitationWhere = buildInvitationWhere(filters);
  const programParticipantWhere = buildProgramParticipantWhere(filters);
  const cohortParticipantWhere = buildCohortParticipantWhere(filters);

  const [
    enrollments,
    invitations,
    programParticipants,
    cohortParticipants,
    enrollmentCount,
    invitationCount,
    programParticipantCount,
    cohortParticipantCount,
    filterOptions,
  ] = await Promise.all([
    prisma.learnerEnrollment.findMany({
      where: enrollmentWhere,
      select: {
        id: true,
        source: true,
        status: true,
        enrolledAt: true,
        startedAt: true,
        completedAt: true,
        user: {
          select: { name: true, email: true },
        },
        organization: {
          select: { name: true },
        },
        course: {
          select: { title: true },
        },
        courseVersion: {
          select: { versionNumber: true, status: true },
        },
      },
      orderBy: [{ createdAt: "desc" }],
      take: ENROLLMENT_LIMIT,
    }),
    prisma.learnerInvitation.findMany({
      where: invitationWhere,
      select: {
        id: true,
        email: true,
        status: true,
        createdAt: true,
        expiresAt: true,
        acceptedAt: true,
        organization: { select: { name: true } },
        program: { select: { name: true } },
        cohort: { select: { name: true } },
        course: { select: { title: true } },
        courseVersion: { select: { versionNumber: true, status: true } },
      },
      orderBy: [{ createdAt: "desc" }],
      take: OTHER_LIMIT,
    }),
    prisma.programParticipant.findMany({
      where: programParticipantWhere,
      select: {
        id: true,
        status: true,
        joinedAt: true,
        endedAt: true,
        user: { select: { name: true, email: true } },
        organization: { select: { name: true } },
        program: { select: { name: true } },
      },
      orderBy: [{ createdAt: "desc" }],
      take: OTHER_LIMIT,
    }),
    prisma.cohortParticipant.findMany({
      where: cohortParticipantWhere,
      select: {
        id: true,
        status: true,
        joinedAt: true,
        endedAt: true,
        dueAt: true,
        user: { select: { name: true, email: true } },
        organization: { select: { name: true } },
        cohort: { select: { name: true } },
        program: { select: { name: true } },
      },
      orderBy: [{ createdAt: "desc" }],
      take: OTHER_LIMIT,
    }),
    prisma.learnerEnrollment.count({ where: enrollmentWhere }),
    prisma.learnerInvitation.count({ where: invitationWhere }),
    prisma.programParticipant.count({ where: programParticipantWhere }),
    prisma.cohortParticipant.count({ where: cohortParticipantWhere }),
    loadFilterOptions(),
  ]);

  return {
    enrollments: enrollments.map(toEnrollmentRow),
    invitations: invitations.map(toInvitationRow),
    programParticipants: programParticipants.map(toProgramParticipantRow),
    cohortParticipants: cohortParticipants.map(toCohortParticipantRow),
    totals: {
      enrollments: enrollmentCount,
      invitations: invitationCount,
      programParticipants: programParticipantCount,
      cohortParticipants: cohortParticipantCount,
    },
    filterOptions,
  };
}

// ---------------------------------------------------------------------------
// Where-clause builders
// ---------------------------------------------------------------------------

type WhereClause = Record<string, unknown>;

function buildEnrollmentWhere(
  filters: AdminParticipantAccessFilters,
): WhereClause {
  const where: WhereClause = {};
  if (filters.organizationId) where.organizationId = filters.organizationId;
  if (filters.programId) where.programId = filters.programId;
  if (filters.cohortId) where.cohortId = filters.cohortId;
  if (filters.courseId) where.courseId = filters.courseId;
  if (filters.enrollmentStatus) where.status = filters.enrollmentStatus;
  if (filters.search) {
    where.user = {
      OR: [
        { name: { contains: filters.search } },
        { email: { contains: filters.search } },
      ],
    };
  }
  return where;
}

function buildInvitationWhere(
  filters: AdminParticipantAccessFilters,
): WhereClause {
  const where: WhereClause = {};
  if (filters.organizationId) where.organizationId = filters.organizationId;
  if (filters.programId) where.programId = filters.programId;
  if (filters.cohortId) where.cohortId = filters.cohortId;
  if (filters.courseId) where.courseId = filters.courseId;
  if (filters.search) {
    where.email = { contains: filters.search };
  }
  return where;
}

function buildProgramParticipantWhere(
  filters: AdminParticipantAccessFilters,
): WhereClause {
  const where: WhereClause = {};
  if (filters.organizationId) where.organizationId = filters.organizationId;
  if (filters.programId) where.programId = filters.programId;
  if (filters.search) {
    where.user = {
      OR: [
        { name: { contains: filters.search } },
        { email: { contains: filters.search } },
      ],
    };
  }
  return where;
}

function buildCohortParticipantWhere(
  filters: AdminParticipantAccessFilters,
): WhereClause {
  const where: WhereClause = {};
  if (filters.organizationId) where.organizationId = filters.organizationId;
  if (filters.programId) where.programId = filters.programId;
  if (filters.cohortId) where.cohortId = filters.cohortId;
  if (filters.search) {
    where.user = {
      OR: [
        { name: { contains: filters.search } },
        { email: { contains: filters.search } },
      ],
    };
  }
  return where;
}

// ---------------------------------------------------------------------------
// Filter options loader
// ---------------------------------------------------------------------------

async function loadFilterOptions(): Promise<AdminParticipantAccessFilterOptions> {
  const [organizations, programs, cohorts, courses] = await Promise.all([
    prisma.organization.findMany({
      select: { id: true, name: true },
      orderBy: [{ name: "asc" }],
    }),
    prisma.program.findMany({
      select: { id: true, name: true, code: true },
      orderBy: [{ name: "asc" }],
    }),
    prisma.cohort.findMany({
      select: { id: true, name: true },
      orderBy: [{ name: "asc" }],
    }),
    prisma.course.findMany({
      where: { status: "ACTIVE" },
      select: { id: true, title: true },
      orderBy: [{ title: "asc" }],
    }),
  ]);

  return { organizations, programs, cohorts, courses };
}

// ---------------------------------------------------------------------------
// Row mappers (safe field projection)
// ---------------------------------------------------------------------------

function toEnrollmentRow(record: {
  id: string;
  source: string;
  status: string;
  enrolledAt: Date | null;
  startedAt: Date | null;
  completedAt: Date | null;
  user: { name: string; email: string };
  organization: { name: string };
  course: { title: string };
  courseVersion: { versionNumber: number; status: string };
}): AdminEnrollmentRow {
  return {
    id: record.id,
    learnerName: record.user.name,
    learnerEmail: record.user.email,
    organizationName: record.organization.name,
    courseTitle: record.course.title,
    versionNumber: record.courseVersion.versionNumber,
    versionStatus: record.courseVersion.status,
    source: record.source,
    status: record.status,
    enrolledAt: record.enrolledAt,
    startedAt: record.startedAt,
    completedAt: record.completedAt,
  };
}

function toInvitationRow(record: {
  id: string;
  email: string;
  status: string;
  createdAt: Date;
  expiresAt: Date;
  acceptedAt: Date | null;
  organization: { name: string } | null;
  program: { name: string } | null;
  cohort: { name: string } | null;
  course: { title: string } | null;
  courseVersion: { versionNumber: number; status: string } | null;
}): AdminInvitationRow {
  return {
    id: record.id,
    email: record.email,
    organizationName: record.organization?.name ?? "Not linked",
    programName: record.program?.name ?? null,
    cohortName: record.cohort?.name ?? null,
    courseTitle: record.course?.title ?? null,
    versionLabel: record.courseVersion
      ? `v${record.courseVersion.versionNumber} (${record.courseVersion.status})`
      : null,
    status: record.status,
    createdAt: record.createdAt,
    expiresAt: record.expiresAt,
    acceptedAt: record.acceptedAt,
  };
}

function toProgramParticipantRow(record: {
  id: string;
  status: string;
  joinedAt: Date | null;
  endedAt: Date | null;
  user: { name: string; email: string };
  organization: { name: string };
  program: { name: string };
}): AdminProgramParticipantRow {
  return {
    id: record.id,
    learnerName: record.user.name,
    learnerEmail: record.user.email,
    organizationName: record.organization.name,
    programName: record.program.name,
    status: record.status,
    joinedAt: record.joinedAt,
    endedAt: record.endedAt,
  };
}

function toCohortParticipantRow(record: {
  id: string;
  status: string;
  joinedAt: Date | null;
  endedAt: Date | null;
  dueAt: Date | null;
  user: { name: string; email: string };
  organization: { name: string } | null;
  cohort: { name: string };
  program: { name: string } | null;
}): AdminCohortParticipantRow {
  return {
    id: record.id,
    learnerName: record.user.name,
    learnerEmail: record.user.email,
    organizationName: record.organization?.name ?? "Not linked",
    cohortName: record.cohort.name,
    programName: record.program?.name ?? null,
    status: record.status,
    joinedAt: record.joinedAt,
    endedAt: record.endedAt,
    dueAt: record.dueAt,
  };
}
