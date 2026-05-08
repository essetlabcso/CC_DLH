import { describe, expect, it, vi } from "vitest";

import { isProtectedReferenceCategory } from "./reference-data";

vi.mock("@/lib/db/client", () => ({
  prisma: {},
}));

describe("admin reference data safety labels", () => {
  it("marks workflow-critical lookup categories as protected areas", () => {
    expect(isProtectedReferenceCategory("ksme_routes")).toBe(true);
    expect(isProtectedReferenceCategory("course_fit_decisions")).toBe(true);
    expect(isProtectedReferenceCategory("certificate_rules")).toBe(true);
    expect(isProtectedReferenceCategory("proof_types")).toBe(true);
    expect(isProtectedReferenceCategory("capacity_areas")).toBe(true);
  });

  it("does not mark ordinary operational lookup categories as protected areas", () => {
    expect(isProtectedReferenceCategory("organization_types")).toBe(false);
    expect(isProtectedReferenceCategory("course_languages")).toBe(false);
    expect(isProtectedReferenceCategory("geographic_focus_areas")).toBe(false);
  });
});
