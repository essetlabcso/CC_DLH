import { ParticipationStatus, ProgramStatus } from "@prisma/client";

export type ProgramInput = {
  name: string;
  slug: string;
  code?: string | null;
  description?: string | null;
  status?: ProgramStatus;
  startsAt?: Date | null;
  endsAt?: Date | null;
  ownerOrganizationId?: string | null;
};

export type ProgramOrganizationInput = {
  programId: string;
  organizationId: string;
  status?: ParticipationStatus;
  joinedAt?: Date | null;
  endedAt?: Date | null;
  notes?: string | null;
};

export function validateProgramInput(input: ProgramInput) {
  const errors: string[] = [];

  if (input.name.trim().length < 2) {
    errors.push("name");
  }

  if (!isSafeSlug(input.slug)) {
    errors.push("slug");
  }

  if (input.status && !Object.values(ProgramStatus).includes(input.status)) {
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

export function buildProgramCreateData(input: ProgramInput) {
  const validation = validateProgramInput(input);

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
      code: normalizeOptional(input.code),
      description: normalizeOptional(input.description) || "",
      status: input.status || ProgramStatus.DRAFT,
      startsAt: input.startsAt || null,
      endsAt: input.endsAt || null,
      ownerOrganizationId: input.ownerOrganizationId || null,
    },
  };
}

export function buildProgramUpdateData(input: ProgramInput) {
  return buildProgramCreateData(input);
}

export function validateProgramOrganizationInput(
  input: ProgramOrganizationInput,
) {
  const errors: string[] = [];

  if (!input.programId.trim()) {
    errors.push("programId");
  }

  if (!input.organizationId.trim()) {
    errors.push("organizationId");
  }

  if (input.status && !Object.values(ParticipationStatus).includes(input.status)) {
    errors.push("status");
  }

  if (input.joinedAt && input.endedAt && input.endedAt < input.joinedAt) {
    errors.push("endedAt");
  }

  return {
    ok: errors.length === 0,
    errors,
  };
}

export function buildProgramOrganizationCreateData(
  input: ProgramOrganizationInput,
) {
  const validation = validateProgramOrganizationInput(input);

  if (!validation.ok) {
    return {
      ok: false as const,
      errors: validation.errors,
    };
  }

  return {
    ok: true as const,
    data: {
      programId: input.programId,
      organizationId: input.organizationId,
      status: input.status || ParticipationStatus.ACTIVE,
      joinedAt: input.joinedAt || new Date(),
      endedAt: input.endedAt || null,
      notes: normalizeOptional(input.notes) || "",
    },
  };
}

function isSafeSlug(value: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.trim());
}

function normalizeOptional(value: string | null | undefined) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}
