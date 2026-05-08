import { describe, expect, it } from "vitest";
import {
  CourseAccessMode,
  CourseTargetLearnerType,
  DeliveryMode,
  EnrollmentMode,
} from "@prisma/client";

import {
  hasDiagnosisEvidenceAnchor,
  isCourseSetupComplete,
  parseCourseSetupFormData,
} from "./course-setup";

function buildValidFormData() {
  const formData = new FormData();
  formData.set("title", "Practical safeguarding response");
  formData.set("summary", "A short practical course.");
  formData.set("primaryLearnerGroup", "Local CSO programme staff");
  formData.set("language", "English");
  formData.set("formatAndTime", "Mobile, 45 minutes");
  formData.set("level", "Introductory");
  formData.set("capacityArea", "Safeguarding and accountability");
  formData.set("selectedDiagnosisRecordId", "diagnosis-record-1");
  formData.set("deviceAccess", "Shared smartphones");
  formData.set("connectivity", "Intermittent mobile data");
  formData.set("timeAvailable", "Short learning sessions");
  
  // New fields
  formData.set("accessMode", CourseAccessMode.MEMBER_CSO_ONLY);
  formData.set("targetLearnerType", CourseTargetLearnerType.MEMBER_CSO);
  formData.set("deliveryMode", DeliveryMode.SELF_PACED);
  formData.set("enrollmentMode", EnrollmentMode.SELF_ENROLL);
  formData.set("publicCatalogVisible", "false");
  formData.set("memberCatalogVisible", "true");
  formData.set("certificateEnabled", "true");
  formData.set("practicalProofEnabled", "false");
  formData.set("requiresProgramAssignment", "false");
  formData.set("requiresCohortAssignment", "false");
  formData.set("defaultDueDays", "");
  formData.set("accessRestrictionNote", "");
  formData.set("learnerVisibilitySummary", "");
  return formData;
}

describe("course setup form parsing", () => {
  it("accepts the minimum course setup fields", () => {
    const formData = buildValidFormData();
    const result = parseCourseSetupFormData(formData);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(isCourseSetupComplete(result.value)).toBe(true);
      expect(result.value.learnerReality.connectivity).toBe(
        "Intermittent mobile data",
      );
      expect(result.value.selectedDiagnosisRecordId).toBe(
        "diagnosis-record-1",
      );
      expect(hasDiagnosisEvidenceAnchor(result.value)).toBe(true);
      expect(result.value.accessMode).toBe(CourseAccessMode.MEMBER_CSO_ONLY);
      expect(result.value.targetLearnerType).toBe(CourseTargetLearnerType.MEMBER_CSO);
    }
  });

  it("returns missing required fields", () => {
    const result = parseCourseSetupFormData(new FormData());

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.missingFields).toContain("title");
      expect(result.missingFields).toContain("capacityArea");
    }
  });

  it("rejects public course requiring program assignment (VAL-1)", () => {
    const formData = buildValidFormData();
    formData.set("targetLearnerType", CourseTargetLearnerType.PUBLIC);
    formData.set("requiresProgramAssignment", "true");

    const result = parseCourseSetupFormData(formData);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.validationErrors).toContain(
        "Public courses cannot require program or cohort assignments.",
      );
    }
  });

  it("rejects public course requiring cohort assignment (VAL-1)", () => {
    const formData = buildValidFormData();
    formData.set("targetLearnerType", CourseTargetLearnerType.PUBLIC);
    formData.set("requiresCohortAssignment", "true");

    const result = parseCourseSetupFormData(formData);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.validationErrors).toContain(
        "Public courses cannot require program or cohort assignments.",
      );
    }
  });

  it("rejects public catalog visibility on restricted courses (VAL-2)", () => {
    const formData = buildValidFormData();
    formData.set("accessMode", CourseAccessMode.MEMBER_CSO_ONLY);
    formData.set("publicCatalogVisible", "true");

    const result = parseCourseSetupFormData(formData);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.validationErrors).toContain(
        "Restricted courses cannot be visible in the public catalog.",
      );
    }
  });

  it("rejects program-assigned access mode without program assignment required (VAL-4)", () => {
    const formData = buildValidFormData();
    formData.set("accessMode", CourseAccessMode.PROGRAM_ASSIGNED);
    formData.set("requiresProgramAssignment", "false");

    const result = parseCourseSetupFormData(formData);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.validationErrors).toContain(
        "Program assigned courses must have program assignment required.",
      );
    }
  });

  it("rejects cohort-assigned access mode without cohort assignment required (VAL-5)", () => {
    const formData = buildValidFormData();
    formData.set("accessMode", CourseAccessMode.COHORT_ASSIGNED);
    formData.set("requiresCohortAssignment", "false");

    const result = parseCourseSetupFormData(formData);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.validationErrors).toContain(
        "Cohort assigned courses must have cohort assignment required.",
      );
    }
  });

  it("rejects public targeted course with practical proof enabled (VAL-6)", () => {
    const formData = buildValidFormData();
    formData.set("targetLearnerType", CourseTargetLearnerType.PUBLIC);
    formData.set("practicalProofEnabled", "true");

    const result = parseCourseSetupFormData(formData);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.validationErrors).toContain(
        "Practical proofs are only enabled for member CSO learning areas.",
      );
    }
  });

  // Hardening Pass Regression Tests
  it("rejects invalid enum values submitted from form data", () => {
    const formData = buildValidFormData();
    formData.set("accessMode", "INVALID_ACCESS_MODE");
    formData.set("targetLearnerType", "INVALID_LEARNER_TYPE");
    formData.set("deliveryMode", "INVALID_DELIVERY_MODE");
    formData.set("enrollmentMode", "INVALID_ENROLLMENT_MODE");

    const result = parseCourseSetupFormData(formData);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.validationErrors).toContain("Invalid Access Mode value submitted.");
      expect(result.validationErrors).toContain("Invalid Target Learner Type value submitted.");
      expect(result.validationErrors).toContain("Invalid Delivery Mode value submitted.");
      expect(result.validationErrors).toContain("Invalid Enrollment Mode value submitted.");
    }
  });

  it("rejects negative defaultDueDays", () => {
    const formData = buildValidFormData();
    formData.set("defaultDueDays", "-5");

    const result = parseCourseSetupFormData(formData);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.validationErrors).toContain("Default Due Days cannot be negative.");
    }
  });

  it("rejects non-integer defaultDueDays", () => {
    const formData = buildValidFormData();
    formData.set("defaultDueDays", "10.5");

    const result = parseCourseSetupFormData(formData);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.validationErrors).toContain("Default Due Days must be an integer.");
    }
  });

  it("rejects PUBLIC_OPEN access mode with MEMBER_CSO targetLearnerType", () => {
    const formData = buildValidFormData();
    formData.set("accessMode", CourseAccessMode.PUBLIC_OPEN);
    formData.set("targetLearnerType", CourseTargetLearnerType.MEMBER_CSO);

    const result = parseCourseSetupFormData(formData);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.validationErrors).toContain(
        "Public access modes cannot have target learner type set to Member CSO.",
      );
    }
  });

  it("rejects PUBLIC targetLearnerType with memberCatalogVisible = true", () => {
    const formData = buildValidFormData();
    formData.set("targetLearnerType", CourseTargetLearnerType.PUBLIC);
    formData.set("memberCatalogVisible", "true");

    const result = parseCourseSetupFormData(formData);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.validationErrors).toContain(
        "Public target learner types cannot be visible in the member catalog.",
      );
    }
  });

  it("rejects publicCatalogVisible = true when accessMode is restricted", () => {
    const formData = buildValidFormData();
    formData.set("accessMode", CourseAccessMode.MEMBER_CSO_ONLY);
    formData.set("publicCatalogVisible", "true");

    const result = parseCourseSetupFormData(formData);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.validationErrors).toContain(
        "Course can only be visible in the public catalog if access mode is Public Open or Public Registration Required.",
      );
    }
  });
});
