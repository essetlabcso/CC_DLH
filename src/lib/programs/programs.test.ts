import { ParticipationStatus, ProgramStatus } from "@prisma/client";
import { describe, expect, it } from "vitest";

import {
  buildProgramCreateData,
  buildProgramOrganizationCreateData,
  validateProgramInput,
  validateProgramOrganizationInput,
} from "./programs";

describe("program foundation helpers", () => {
  it("builds clean program create data", () => {
    const result = buildProgramCreateData({
      name: " MEAL Pathway ",
      slug: "meal-pathway",
      code: " MEAL-1 ",
      description: " Outcome evidence support ",
      status: ProgramStatus.ACTIVE,
      ownerOrganizationId: "org-1",
    });

    expect(result.ok).toBe(true);
    expect(result.ok && result.data).toMatchObject({
      name: "MEAL Pathway",
      slug: "meal-pathway",
      code: "MEAL-1",
      description: "Outcome evidence support",
      status: ProgramStatus.ACTIVE,
      ownerOrganizationId: "org-1",
    });
  });

  it("rejects unsafe program slugs and inverted date ranges", () => {
    const result = validateProgramInput({
      name: "M",
      slug: "Not Safe",
      startsAt: new Date("2026-06-01T00:00:00.000Z"),
      endsAt: new Date("2026-05-01T00:00:00.000Z"),
    });

    expect(result.ok).toBe(false);
    expect(result.errors).toEqual(["name", "slug", "endsAt"]);
  });

  it("builds unique program organization participation data", () => {
    const joinedAt = new Date("2026-05-07T00:00:00.000Z");
    const result = buildProgramOrganizationCreateData({
      programId: "program-1",
      organizationId: "org-1",
      status: ParticipationStatus.ACTIVE,
      joinedAt,
      notes: " First cohort ",
    });

    expect(result.ok).toBe(true);
    expect(result.ok && result.data).toMatchObject({
      programId: "program-1",
      organizationId: "org-1",
      status: ParticipationStatus.ACTIVE,
      joinedAt,
      notes: "First cohort",
    });
  });

  it("requires both sides of a program organization link", () => {
    const result = validateProgramOrganizationInput({
      programId: "",
      organizationId: "",
    });

    expect(result.ok).toBe(false);
    expect(result.errors).toEqual(["programId", "organizationId"]);
  });
});
