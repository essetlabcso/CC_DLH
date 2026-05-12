/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from "vitest";

import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";

import {
  returnDiagnosisRecordToDraftAction,
  reopenDiagnosisRecordAction,
} from "./actions";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
  redirect: vi.fn((target: string) => {
    throw new Error(`NEXT_REDIRECT:${target}`);
  }),
}));

vi.mock("@/lib/auth/server", () => ({
  requireWorkspaceIdentity: vi.fn(),
}));

vi.mock("@/lib/db/client", () => ({
  prisma: {
    $transaction: vi.fn(),
    diagnosisRecord: {
      findUnique: vi.fn(),
    },
  },
}));

// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------

const ACTOR_IDENTITY = {
  session: { role: "admin" },
  user: {
    id: "admin-1",
    email: "admin@example.org",
    name: "Admin User",
    organization: { name: "DEC" },
    organizationId: "org-1",
  },
} as any;

const APPROVED_UNLOCKED_RECORD = {
  id: "record-1",
  datasetId: "dataset-1",
  approvalStatus: "APPROVED",
  archivedAt: null,
  isActive: true,
  isLocked: false,
  lockedAt: null,
  lockedById: null,
  approvedAt: new Date("2026-01-01T00:00:00.000Z"),
  approvedById: "admin-0",
  capacityGapStatement: "Gap statement",
  capacityPracticeArea: "Practice area",
  coreCapacityArea: "Core area",
  courseFitDecision: "Course-addressable",
  courseCreationStatus: "AVAILABLE_FOR_COURSE_SETUP",
  currentBaseline: "Baseline",
  dataSensitivityLevel: "LOW",
  desiredPractice: "Desired practice",
  diagnosisCode: "MEAL-001",
  diagnosisTitle: "Title",
  evidenceSource: "Source",
  evaluationAnchor: "Anchor",
  ksmeRoute: "Skill",
  noHarmNote: "No harm",
  region: "East Africa",
  safeguardingRiskLevel: "Low",
  separableKnowledgeSkillComponent: "",
  targetAudience: "MEAL staff",
  visibilityScope: "ADMIN_ONLY",
  changeReason: "",
  dataset: { approvalStatus: "APPROVED", archivedAt: null },
  _count: { selectedCourseSetups: 0 },
} as any;

const LOCKED_RECORD = {
  ...APPROVED_UNLOCKED_RECORD,
  isLocked: true,
  lockedAt: new Date("2026-01-02T00:00:00.000Z"),
  lockedById: "admin-0",
} as any;

// ---------------------------------------------------------------------------
// returnDiagnosisRecordToDraftAction
// ---------------------------------------------------------------------------

describe("returnDiagnosisRecordToDraftAction", () => {
  const tx = {
    adminAuditLog: { create: vi.fn() },
    diagnosisRecord: { update: vi.fn() },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireWorkspaceIdentity).mockResolvedValue(ACTOR_IDENTITY);
    vi.mocked(prisma.$transaction).mockImplementation(async (callback) =>
      callback(tx as never),
    );
  });

  it("blocks when no reason is provided", async () => {
    const formData = new FormData();

    await expect(
      returnDiagnosisRecordToDraftAction("record-1", formData),
    ).rejects.toThrow("NEXT_REDIRECT");

    expect(prisma.diagnosisRecord.findUnique).not.toHaveBeenCalled();
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it("blocks when the record is already locked (released)", async () => {
    vi.mocked(prisma.diagnosisRecord.findUnique).mockResolvedValue(
      LOCKED_RECORD,
    );
    const formData = new FormData();
    formData.set("returnReason", "Correction needed.");

    await expect(
      returnDiagnosisRecordToDraftAction("record-1", formData),
    ).rejects.toThrow(/NEXT_REDIRECT.*record-1\?error=/);

    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it("blocks when the record is already selected by a Course Setup", async () => {
    vi.mocked(prisma.diagnosisRecord.findUnique).mockResolvedValue({
      ...APPROVED_UNLOCKED_RECORD,
      _count: { selectedCourseSetups: 1 },
    } as any);
    const formData = new FormData();
    formData.set("returnReason", "Correction needed.");

    await expect(
      returnDiagnosisRecordToDraftAction("record-1", formData),
    ).rejects.toThrow(/NEXT_REDIRECT.*record-1\?error=/);

    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it("returns the record to DRAFT and writes an audit entry when all guards pass", async () => {
    vi.mocked(prisma.diagnosisRecord.findUnique).mockResolvedValue(
      APPROVED_UNLOCKED_RECORD,
    );
    tx.diagnosisRecord.update.mockResolvedValue({
      ...APPROVED_UNLOCKED_RECORD,
      approvalStatus: "DRAFT",
      approvedAt: null,
      approvedById: null,
    } as any);
    const formData = new FormData();
    formData.set("returnReason", "Needs further evidence review.");

    await expect(
      returnDiagnosisRecordToDraftAction("record-1", formData),
    ).rejects.toThrow("NEXT_REDIRECT:/admin/diagnosis-records/record-1?returned=1");

    expect(tx.diagnosisRecord.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          approvalStatus: "DRAFT",
          approvedAt: null,
          approvedById: null,
          changeReason: "Needs further evidence review.",
        }),
      }),
    );
    expect(tx.adminAuditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: "DIAGNOSIS_RECORD_RETURNED_TO_DRAFT",
          reason: "Needs further evidence review.",
          riskLevel: "MEDIUM",
        }),
      }),
    );
  });
});

// ---------------------------------------------------------------------------
// reopenDiagnosisRecordAction
// ---------------------------------------------------------------------------

describe("reopenDiagnosisRecordAction", () => {
  const tx = {
    adminAuditLog: { create: vi.fn() },
    diagnosisRecord: { update: vi.fn() },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireWorkspaceIdentity).mockResolvedValue(ACTOR_IDENTITY);
    vi.mocked(prisma.$transaction).mockImplementation(async (callback) =>
      callback(tx as never),
    );
  });

  it("blocks when no reason is provided", async () => {
    const formData = new FormData();

    await expect(
      reopenDiagnosisRecordAction("record-1", formData),
    ).rejects.toThrow("NEXT_REDIRECT");

    expect(prisma.diagnosisRecord.findUnique).not.toHaveBeenCalled();
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it("blocks when the record is already selected by a Course Setup", async () => {
    vi.mocked(prisma.diagnosisRecord.findUnique).mockResolvedValue({
      ...LOCKED_RECORD,
      _count: { selectedCourseSetups: 2 },
    } as any);
    const formData = new FormData();
    formData.set("reopenReason", "Correction needed.");

    await expect(
      reopenDiagnosisRecordAction("record-1", formData),
    ).rejects.toThrow(/NEXT_REDIRECT.*record-1\?error=/);

    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it("reopens the record, clears lock fields, resets status, and writes an audit entry when all guards pass", async () => {
    vi.mocked(prisma.diagnosisRecord.findUnique).mockResolvedValue(
      LOCKED_RECORD,
    );
    tx.diagnosisRecord.update.mockResolvedValue({
      ...LOCKED_RECORD,
      approvalStatus: "DRAFT",
      approvedAt: null,
      approvedById: null,
      courseCreationStatus: "NOT_SELECTED",
      isLocked: false,
      lockedAt: null,
      lockedById: null,
    } as any);
    const formData = new FormData();
    formData.set("reopenReason", "Evidence anchor must be corrected.");

    await expect(
      reopenDiagnosisRecordAction("record-1", formData),
    ).rejects.toThrow("NEXT_REDIRECT:/admin/diagnosis-records/record-1?reopened=1");

    expect(tx.diagnosisRecord.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          approvalStatus: "DRAFT",
          approvedAt: null,
          approvedById: null,
          courseCreationStatus: "NOT_SELECTED",
          isLocked: false,
          lockedAt: null,
          lockedById: null,
          changeReason: "Evidence anchor must be corrected.",
        }),
      }),
    );
    expect(tx.adminAuditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: "DIAGNOSIS_RECORD_REOPENED",
          reason: "Evidence anchor must be corrected.",
          riskLevel: "MEDIUM",
        }),
      }),
    );
  });
});
