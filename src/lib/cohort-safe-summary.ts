import { LearnerEnrollmentStatus, LearnerParticipantStatus } from "@prisma/client";
import { prisma } from "@/lib/db/client";

export interface SafeCohortParticipantEntry {
  userId: string;
  userName: string;
  status: LearnerParticipantStatus;
  dueAt: Date | null;
  completedCourseCount: number;
  supportIndicator: "OVERDUE" | "NONE";
}

export interface CohortSafeSummary {
  cohortName: string;
  totalCourseCount: number;
  totalParticipantsCount: number;
  activeParticipantsCount: number;
  completedParticipantsCount: number;
  roster: SafeCohortParticipantEntry[];
}

export async function getCohortSafeSummary(
  cohortId: string,
  now = new Date(),
): Promise<CohortSafeSummary | null> {
  const cohort = await prisma.cohort.findUnique({
    where: { id: cohortId },
    select: { name: true },
  });

  if (!cohort) {
    return null;
  }

  const [assignedCourses, participants] = await Promise.all([
    prisma.cohortCourse.findMany({
      where: { cohortId },
      select: { courseId: true },
    }),
    prisma.cohortParticipant.findMany({
      where: { cohortId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        user: {
          name: "asc",
        },
      },
    }),
  ]);

  const cohortCourseIds = assignedCourses.map((c) => c.courseId);
  const participantUserIds = participants.map((p) => p.userId);

  // If no courses or no participants, shortcut simple counters
  if (cohortCourseIds.length === 0 || participantUserIds.length === 0) {
    return {
      cohortName: cohort.name,
      totalCourseCount: cohortCourseIds.length,
      totalParticipantsCount: participants.length,
      activeParticipantsCount: participants.filter(p => p.status === LearnerParticipantStatus.ACTIVE).length,
      completedParticipantsCount: participants.filter(p => p.status === LearnerParticipantStatus.COMPLETED).length,
      roster: participants.map(p => ({
        userId: p.user.id,
        userName: p.user.name,
        status: p.status,
        dueAt: p.dueAt,
        completedCourseCount: 0,
        supportIndicator: calculateSupportIndicator(p.status, p.dueAt, now),
      })),
    };
  }

  // Find all completions by these users for these courses
  const completions = await prisma.learnerEnrollment.groupBy({
    by: ["userId"],
    where: {
      userId: { in: participantUserIds },
      courseId: { in: cohortCourseIds },
      status: LearnerEnrollmentStatus.COMPLETED,
    },
    _count: {
      courseId: true,
    },
  });

  const completionMap = new Map<string, number>();
  for (const entry of completions) {
    completionMap.set(entry.userId, entry._count.courseId);
  }

  const activeCount = participants.filter(p => p.status === LearnerParticipantStatus.ACTIVE).length;
  const completedCount = participants.filter(p => p.status === LearnerParticipantStatus.COMPLETED).length;

  const roster: SafeCohortParticipantEntry[] = participants.map((p) => ({
    userId: p.user.id,
    userName: p.user.name,
    status: p.status,
    dueAt: p.dueAt,
    completedCourseCount: completionMap.get(p.userId) ?? 0,
    supportIndicator: calculateSupportIndicator(p.status, p.dueAt, now),
  }));

  return {
    cohortName: cohort.name,
    totalCourseCount: cohortCourseIds.length,
    totalParticipantsCount: participants.length,
    activeParticipantsCount: activeCount,
    completedParticipantsCount: completedCount,
    roster,
  };
}

function calculateSupportIndicator(
  status: LearnerParticipantStatus,
  dueAt: Date | null,
  now: Date
): "OVERDUE" | "NONE" {
  if (status === LearnerParticipantStatus.COMPLETED) {
    return "NONE";
  }

  if (dueAt && dueAt.getTime() < now.getTime()) {
    return "OVERDUE";
  }

  return "NONE";
}
