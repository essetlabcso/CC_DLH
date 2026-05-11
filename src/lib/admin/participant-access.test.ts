import { beforeEach, describe, expect, it, vi } from "vitest";

import { prisma } from "@/lib/db/client";

import {
  getAdminParticipantAccessOverview,
  parseParticipantAccessFilters,
} from "./participant-access";

vi.mock("@/lib/db/client", () => ({
  prisma: {
    learnerEnrollment: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
    learnerInvitation: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
    programParticipant: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
    cohortParticipant: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
    organization: {
      findMany: vi.fn(),
    },
    program: {
      findMany: vi.fn(),
    },
    cohort: {
      findMany: vi.fn(),
    },
    course: {
      findMany: vi.fn(),
    },
  },
}));

function mockEmptyResults() {
  vi.mocked(prisma.learnerEnrollment.findMany).mockResolvedValue([] as never);
  vi.mocked(prisma.learnerEnrollment.count).mockResolvedValue(0);
  vi.mocked(prisma.learnerInvitation.findMany).mockResolvedValue([] as never);
  vi.mocked(prisma.learnerInvitation.count).mockResolvedValue(0);
  vi.mocked(prisma.programParticipant.findMany).mockResolvedValue([] as never);
  vi.mocked(prisma.programParticipant.count).mockResolvedValue(0);
  vi.mocked(prisma.cohortParticipant.findMany).mockResolvedValue([] as never);
  vi.mocked(prisma.cohortParticipant.count).mockResolvedValue(0);
  vi.mocked(prisma.organization.findMany).mockResolvedValue([] as never);
  vi.mocked(prisma.program.findMany).mockResolvedValue([] as never);
  vi.mocked(prisma.cohort.findMany).mockResolvedValue([] as never);
  vi.mocked(prisma.course.findMany).mockResolvedValue([] as never);
}

describe("parseParticipantAccessFilters", () => {
  it("extracts known filter keys from params", () => {
    const result = parseParticipantAccessFilters({
      organizationId: "org-1",
      programId: "prog-1",
      cohortId: "coh-1",
      courseId: "course-1",
      enrollmentStatus: "ENROLLED",
      search: "alice",
    });

    expect(result).toEqual({
      organizationId: "org-1",
      programId: "prog-1",
      cohortId: "coh-1",
      courseId: "course-1",
      enrollmentStatus: "ENROLLED",
      search: "alice",
    });
  });

  it("returns undefined for missing or empty values", () => {
    const result = parseParticipantAccessFilters({});

    expect(result).toEqual({
      organizationId: undefined,
      programId: undefined,
      cohortId: undefined,
      courseId: undefined,
      enrollmentStatus: undefined,
      search: undefined,
    });
  });

  it("handles array values by taking the first element", () => {
    const result = parseParticipantAccessFilters({
      organizationId: ["org-1", "org-2"],
    });

    expect(result.organizationId).toBe("org-1");
  });
});

describe("getAdminParticipantAccessOverview", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns empty arrays and zero counts when no data exists", async () => {
    mockEmptyResults();

    const result = await getAdminParticipantAccessOverview({});

    expect(result.enrollments).toEqual([]);
    expect(result.invitations).toEqual([]);
    expect(result.programParticipants).toEqual([]);
    expect(result.cohortParticipants).toEqual([]);
    expect(result.totals).toEqual({
      enrollments: 0,
      invitations: 0,
      programParticipants: 0,
      cohortParticipants: 0,
    });
  });

  it("maps enrollment rows with safe fields only", async () => {
    mockEmptyResults();
    const enrolledAt = new Date("2026-03-01T00:00:00.000Z");

    vi.mocked(prisma.learnerEnrollment.findMany).mockResolvedValue([
      {
        id: "enr-1",
        source: "SELF_ENROLL",
        status: "ENROLLED",
        enrolledAt,
        startedAt: null,
        completedAt: null,
        user: { name: "Alice", email: "alice@example.org" },
        organization: { name: "CSO One" },
        course: { title: "Budget Basics" },
        courseVersion: { versionNumber: 1, status: "PUBLISHED" },
      },
    ] as never);
    vi.mocked(prisma.learnerEnrollment.count).mockResolvedValue(1);

    const result = await getAdminParticipantAccessOverview({});

    expect(result.enrollments).toEqual([
      {
        id: "enr-1",
        learnerName: "Alice",
        learnerEmail: "alice@example.org",
        organizationName: "CSO One",
        courseTitle: "Budget Basics",
        versionNumber: 1,
        versionStatus: "PUBLISHED",
        source: "SELF_ENROLL",
        status: "ENROLLED",
        enrolledAt,
        startedAt: null,
        completedAt: null,
      },
    ]);
    expect(result.totals.enrollments).toBe(1);
  });

  it("maps invitation rows without exposing tokenHash or metadata", async () => {
    mockEmptyResults();
    const createdAt = new Date("2026-03-01T00:00:00.000Z");
    const expiresAt = new Date("2026-06-01T00:00:00.000Z");

    vi.mocked(prisma.learnerInvitation.findMany).mockResolvedValue([
      {
        id: "inv-1",
        email: "bob@example.org",
        status: "CREATED",
        createdAt,
        expiresAt,
        acceptedAt: null,
        organization: { name: "CSO Two" },
        program: { name: "DEC Core" },
        cohort: null,
        course: { title: "Budget Basics" },
        courseVersion: { versionNumber: 2, status: "PUBLISHED" },
      },
    ] as never);
    vi.mocked(prisma.learnerInvitation.count).mockResolvedValue(1);

    const result = await getAdminParticipantAccessOverview({});

    expect(result.invitations).toEqual([
      {
        id: "inv-1",
        email: "bob@example.org",
        organizationName: "CSO Two",
        programName: "DEC Core",
        cohortName: null,
        courseTitle: "Budget Basics",
        versionLabel: "v2 (PUBLISHED)",
        status: "CREATED",
        createdAt,
        expiresAt,
        acceptedAt: null,
      },
    ]);
    expect(result.totals.invitations).toBe(1);
  });

  it("maps program participant rows with safe fields", async () => {
    mockEmptyResults();
    const joinedAt = new Date("2026-02-01T00:00:00.000Z");

    vi.mocked(prisma.programParticipant.findMany).mockResolvedValue([
      {
        id: "pp-1",
        status: "ACTIVE",
        joinedAt,
        endedAt: null,
        user: { name: "Carol", email: "carol@example.org" },
        organization: { name: "CSO Three" },
        program: { name: "DEC Core" },
      },
    ] as never);
    vi.mocked(prisma.programParticipant.count).mockResolvedValue(1);

    const result = await getAdminParticipantAccessOverview({});

    expect(result.programParticipants).toEqual([
      {
        id: "pp-1",
        learnerName: "Carol",
        learnerEmail: "carol@example.org",
        organizationName: "CSO Three",
        programName: "DEC Core",
        status: "ACTIVE",
        joinedAt,
        endedAt: null,
      },
    ]);
  });

  it("maps cohort participant rows with safe fields", async () => {
    mockEmptyResults();
    const joinedAt = new Date("2026-02-01T00:00:00.000Z");
    const dueAt = new Date("2026-05-01T00:00:00.000Z");

    vi.mocked(prisma.cohortParticipant.findMany).mockResolvedValue([
      {
        id: "cp-1",
        status: "ASSIGNED",
        joinedAt,
        endedAt: null,
        dueAt,
        user: { name: "Dave", email: "dave@example.org" },
        organization: { name: "CSO Four" },
        cohort: { name: "Cohort A" },
        program: { name: "DEC Core" },
      },
    ] as never);
    vi.mocked(prisma.cohortParticipant.count).mockResolvedValue(1);

    const result = await getAdminParticipantAccessOverview({});

    expect(result.cohortParticipants).toEqual([
      {
        id: "cp-1",
        learnerName: "Dave",
        learnerEmail: "dave@example.org",
        organizationName: "CSO Four",
        cohortName: "Cohort A",
        programName: "DEC Core",
        status: "ASSIGNED",
        joinedAt,
        endedAt: null,
        dueAt,
      },
    ]);
  });

  it("uses explicit select and never includes tokenHash", async () => {
    mockEmptyResults();

    await getAdminParticipantAccessOverview({});

    // Verify invitation query uses explicit select without tokenHash
    const invitationCall = vi.mocked(prisma.learnerInvitation.findMany).mock
      .calls[0]?.[0] as { select?: Record<string, unknown> } | undefined;

    expect(invitationCall).toBeDefined();
    expect(invitationCall?.select).toBeDefined();
    expect(invitationCall?.select).not.toHaveProperty("tokenHash");

    // Verify enrollment query uses explicit select without metadata or reason
    const enrollmentCall = vi.mocked(prisma.learnerEnrollment.findMany).mock
      .calls[0]?.[0] as { select?: Record<string, unknown> } | undefined;

    expect(enrollmentCall).toBeDefined();
    expect(enrollmentCall?.select).toBeDefined();
    expect(enrollmentCall?.select).not.toHaveProperty("metadata");
    expect(enrollmentCall?.select).not.toHaveProperty("reason");
  });

  it("applies organization filter to all queries", async () => {
    mockEmptyResults();

    await getAdminParticipantAccessOverview({ organizationId: "org-1" });

    expect(prisma.learnerEnrollment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ organizationId: "org-1" }),
      }),
    );
    expect(prisma.learnerInvitation.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ organizationId: "org-1" }),
      }),
    );
    expect(prisma.programParticipant.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ organizationId: "org-1" }),
      }),
    );
    expect(prisma.cohortParticipant.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ organizationId: "org-1" }),
      }),
    );
  });

  it("applies program filter where applicable", async () => {
    mockEmptyResults();

    await getAdminParticipantAccessOverview({ programId: "prog-1" });

    expect(prisma.learnerEnrollment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ programId: "prog-1" }),
      }),
    );
    expect(prisma.learnerInvitation.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ programId: "prog-1" }),
      }),
    );
    expect(prisma.programParticipant.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ programId: "prog-1" }),
      }),
    );
    expect(prisma.cohortParticipant.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ programId: "prog-1" }),
      }),
    );
  });

  it("applies search filter to name and email fields", async () => {
    mockEmptyResults();

    await getAdminParticipantAccessOverview({ search: "alice" });

    expect(prisma.learnerEnrollment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          user: {
            OR: [
              { name: { contains: "alice" } },
              { email: { contains: "alice" } },
            ],
          },
        }),
      }),
    );
    expect(prisma.learnerInvitation.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          email: { contains: "alice" },
        }),
      }),
    );
  });

  it("applies enrollment status filter to enrollments only", async () => {
    mockEmptyResults();

    await getAdminParticipantAccessOverview({ enrollmentStatus: "ENROLLED" });

    expect(prisma.learnerEnrollment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ status: "ENROLLED" }),
      }),
    );
    // Other queries should not have enrollment status filter
    const invitationWhere = (
      vi.mocked(prisma.learnerInvitation.findMany).mock.calls[0]?.[0] as
        | { where?: Record<string, unknown> }
        | undefined
    )?.where;
    expect(invitationWhere).not.toHaveProperty("status");
  });

  it("returns filter options from option queries", async () => {
    mockEmptyResults();
    vi.mocked(prisma.organization.findMany).mockResolvedValue([
      { id: "org-1", name: "CSO One" },
    ] as never);
    vi.mocked(prisma.program.findMany).mockResolvedValue([
      { id: "prog-1", name: "DEC Core", code: "DEC-CORE" },
    ] as never);
    vi.mocked(prisma.cohort.findMany).mockResolvedValue([
      { id: "coh-1", name: "Cohort A" },
    ] as never);
    vi.mocked(prisma.course.findMany).mockResolvedValue([
      { id: "course-1", title: "Budget Basics" },
    ] as never);

    const result = await getAdminParticipantAccessOverview({});

    expect(result.filterOptions).toEqual({
      organizations: [{ id: "org-1", name: "CSO One" }],
      programs: [{ id: "prog-1", name: "DEC Core", code: "DEC-CORE" }],
      cohorts: [{ id: "coh-1", name: "Cohort A" }],
      courses: [{ id: "course-1", title: "Budget Basics" }],
    });
  });

  it("caps enrollment results at 100 and other tables at 50", async () => {
    mockEmptyResults();

    await getAdminParticipantAccessOverview({});

    expect(prisma.learnerEnrollment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 100 }),
    );
    expect(prisma.learnerInvitation.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 50 }),
    );
    expect(prisma.programParticipant.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 50 }),
    );
    expect(prisma.cohortParticipant.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 50 }),
    );
  });
});
