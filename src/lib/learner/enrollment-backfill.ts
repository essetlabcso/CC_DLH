export type ExistingEnrollmentMarker = {
  id: string;
  source?: string | null;
};

export type BackfillLessonProgress = {
  startedAt?: Date | null;
  completedAt?: Date | null;
};

export type BackfillFinalTestAttempt = {
  submittedAt: Date;
  passed: boolean;
};

export type BackfillCertificate = {
  issuedAt: Date;
  revokedAt?: Date | null;
};

export type BackfillProofSubmission = {
  submittedAt: Date;
};

export type InferredEnrollmentBackfillInput = {
  userId: string;
  courseId: string;
  courseVersionId: string;
  organizationId: string;
  totalLessons: number;
  lessonProgress?: readonly BackfillLessonProgress[];
  finalTestAttempts?: readonly BackfillFinalTestAttempt[];
  certificates?: readonly BackfillCertificate[];
  proofSubmissions?: readonly BackfillProofSubmission[];
  existingEnrollment?: ExistingEnrollmentMarker | null;
};

export type InferredEnrollmentCandidate = {
  userId: string;
  courseId: string;
  courseVersionId: string;
  organizationId: string;
  source: "LEGACY_INFERRED";
  status: "STARTED" | "COMPLETED";
  startedAt: Date;
  completedAt?: Date;
  metadata: string;
};

export function buildInferredEnrollmentCandidate(
  input: InferredEnrollmentBackfillInput,
): InferredEnrollmentCandidate | null {
  if (input.existingEnrollment) {
    return null;
  }

  const lessonProgress = input.lessonProgress ?? [];
  const finalTestAttempts = input.finalTestAttempts ?? [];
  const certificates = input.certificates ?? [];
  const proofSubmissions = input.proofSubmissions ?? [];
  const activityDates = [
    ...lessonProgress.map((progress) => progress.startedAt).filter(isDate),
    ...lessonProgress.map((progress) => progress.completedAt).filter(isDate),
    ...finalTestAttempts.map((attempt) => attempt.submittedAt),
    ...certificates.map((certificate) => certificate.issuedAt),
    ...proofSubmissions.map((submission) => submission.submittedAt),
  ].sort((left, right) => left.getTime() - right.getTime());

  if (activityDates.length === 0) {
    return null;
  }

  const completedAt = getInferredCompletedAt(input);

  return {
    userId: input.userId,
    courseId: input.courseId,
    courseVersionId: input.courseVersionId,
    organizationId: input.organizationId,
    source: "LEGACY_INFERRED",
    status: completedAt ? "COMPLETED" : "STARTED",
    startedAt: activityDates[0],
    completedAt,
    metadata: JSON.stringify({
      source: "legacy-inferred",
      hasLessonProgress: lessonProgress.length > 0,
      hasFinalTestAttempt: finalTestAttempts.length > 0,
      hasCertificate: certificates.length > 0,
      hasProofSubmission: proofSubmissions.length > 0,
    }),
  };
}

function getInferredCompletedAt(
  input: InferredEnrollmentBackfillInput,
): Date | undefined {
  const lessonProgress = input.lessonProgress ?? [];
  const activeCertificates = (input.certificates ?? []).filter(
    (certificate) => !certificate.revokedAt,
  );
  const passingFinalTestAttempts = (input.finalTestAttempts ?? []).filter(
    (attempt) => attempt.passed,
  );

  if (activeCertificates.length > 0 && passingFinalTestAttempts.length > 0) {
    return latestDate([
      ...activeCertificates.map((certificate) => certificate.issuedAt),
      ...passingFinalTestAttempts.map((attempt) => attempt.submittedAt),
    ]);
  }

  const completedLessonDates = lessonProgress
    .map((progress) => progress.completedAt)
    .filter(isDate);

  if (
    input.totalLessons > 0 &&
    completedLessonDates.length >= input.totalLessons
  ) {
    return latestDate(completedLessonDates);
  }

  return undefined;
}

function latestDate(dates: readonly Date[]) {
  return [...dates].sort((left, right) => right.getTime() - left.getTime())[0];
}

function isDate(value: Date | null | undefined): value is Date {
  return value instanceof Date;
}
