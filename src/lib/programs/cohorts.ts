import { CohortStatus } from "@prisma/client";

export type CohortInput = {
  name: string;
  slug: string;
  programId?: string | null;
  organizationId?: string | null;
  status?: CohortStatus;
  startsAt?: Date | null;
  endsAt?: Date | null;
  deliveryNotes?: string | null;
};

export type CohortCourseInput = {
  cohortId: string;
  courseId: string;
  courseVersionId: string;
  required?: boolean;
  startsAt?: Date | null;
  dueAt?: Date | null;
  displayOrder?: number;
};

export function validateCohortInput(input: CohortInput) {
  const errors: string[] = [];

  if (input.name.trim().length < 2) {
    errors.push("name");
  }

  if (!isSafeSlug(input.slug)) {
    errors.push("slug");
  }

  if (input.status && !Object.values(CohortStatus).includes(input.status)) {
    errors.push("status");
  }

  if (input.startsAt && input.endsAt && input.endsAt < input.startsAt) {
    errors.push("endsAt");
  }

  return {
    ok: errors.length === 0,
    errors,
  };
}

export function buildCohortCreateData(input: CohortInput) {
  const validation = validateCohortInput(input);

  if (!validation.ok) {
    return {
      ok: false as const,
      errors: validation.errors,
    };
  }

  return {
    ok: true as const,
    data: {
      name: input.name.trim(),
      slug: input.slug.trim().toLowerCase(),
      programId: input.programId || null,
      organizationId: input.organizationId || null,
      status: input.status || CohortStatus.DRAFT,
      startsAt: input.startsAt || null,
      endsAt: input.endsAt || null,
      deliveryNotes: input.deliveryNotes?.trim() || "",
    },
  };
}

export function buildCohortCourseCreateData(input: CohortCourseInput) {
  const errors: string[] = [];

  if (!input.cohortId.trim()) {
    errors.push("cohortId");
  }

  if (!input.courseId.trim()) {
    errors.push("courseId");
  }

  if (!input.courseVersionId.trim()) {
    errors.push("courseVersionId");
  }

  if (input.startsAt && input.dueAt && input.dueAt < input.startsAt) {
    errors.push("dueAt");
  }

  if (errors.length > 0) {
    return {
      ok: false as const,
      errors,
    };
  }

  return {
    ok: true as const,
    data: {
      cohortId: input.cohortId,
      courseId: input.courseId,
      courseVersionId: input.courseVersionId,
      required: input.required ?? true,
      startsAt: input.startsAt || null,
      dueAt: input.dueAt || null,
      displayOrder: input.displayOrder ?? 0,
    },
  };
}

function isSafeSlug(value: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.trim());
}
