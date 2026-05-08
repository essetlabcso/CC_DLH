import { CohortStatus } from "@prisma/client";
import { describe, expect, it } from "vitest";

import {
  buildCohortCourseCreateData,
  buildCohortCreateData,
  validateCohortInput,
} from "./cohorts";

describe("cohort foundation helpers", () => {
  it("builds cohort create data linked to a program", () => {
    const result = buildCohortCreateData({
      name: " MEAL Cohort 1 ",
      slug: "meal-cohort-1",
      programId: "program-1",
      status: CohortStatus.ACTIVE,
      deliveryNotes: " Blended delivery ",
    });

    expect(result.ok).toBe(true);
    expect(result.ok && result.data).toMatchObject({
      name: "MEAL Cohort 1",
      slug: "meal-cohort-1",
      programId: "program-1",
      status: CohortStatus.ACTIVE,
      deliveryNotes: "Blended delivery",
    });
  });

  it("rejects invalid cohort slugs and date ranges", () => {
    const result = validateCohortInput({
      name: "C",
      slug: "unsafe slug",
      startsAt: new Date("2026-07-01T00:00:00.000Z"),
      endsAt: new Date("2026-06-01T00:00:00.000Z"),
    });

    expect(result.ok).toBe(false);
    expect(result.errors).toEqual(["name", "slug", "endsAt"]);
  });

  it("builds cohort-course records with required version references", () => {
    const result = buildCohortCourseCreateData({
      cohortId: "cohort-1",
      courseId: "course-1",
      courseVersionId: "version-1",
      required: false,
      displayOrder: 2,
    });

    expect(result.ok).toBe(true);
    expect(result.ok && result.data).toMatchObject({
      cohortId: "cohort-1",
      courseId: "course-1",
      courseVersionId: "version-1",
      required: false,
      displayOrder: 2,
    });
  });

  it("requires a course version when linking a course to a cohort", () => {
    const result = buildCohortCourseCreateData({
      cohortId: "cohort-1",
      courseId: "course-1",
      courseVersionId: "",
    });

    expect(result.ok).toBe(false);
    expect(result.errors).toEqual(["courseVersionId"]);
  });
});
