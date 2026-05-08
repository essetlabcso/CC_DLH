import {
  CourseAccessMode,
  CourseTargetLearnerType,
  DeliveryMode,
  EnrollmentMode,
} from "@prisma/client";

export type CourseSetupInput = {
  title: string;
  summary: string;
  primaryLearnerGroup: string;
  language: string;
  formatAndTime: string;
  level: string;
  capacityArea: string;
  sensitiveFlag: boolean;
  certificateIntent: string;
  selectedDiagnosisRecordId: string;
  learnerReality: {
    deviceAccess: string;
    connectivity: string;
    timeAvailable: string;
  };
  accessMode: CourseAccessMode;
  targetLearnerType: CourseTargetLearnerType;
  deliveryMode: DeliveryMode;
  enrollmentMode: EnrollmentMode;
  publicCatalogVisible: boolean;
  memberCatalogVisible: boolean;
  certificateEnabled: boolean;
  /**
   * NOTE ON PRACTICAL PROOF SOURCE OF TRUTH:
   * - CourseSetup.practicalProofEnabled represents course setup intent / eligibility only.
   * - CoursePracticalProofConfig.enabled remains the operational proof configuration.
   * - Publish and readiness checks must later ensure these are aligned.
   */
  practicalProofEnabled: boolean;
  requiresProgramAssignment: boolean;
  requiresCohortAssignment: boolean;
  defaultDueDays: number | null;
  accessRestrictionNote: string;
  learnerVisibilitySummary: string;
};

export type CourseSetupValidationResult =
  | {
      ok: true;
      value: CourseSetupInput;
    }
  | {
      ok: false;
      missingFields?: string[];
      validationErrors?: string[];
    };

const requiredFields: readonly (keyof CourseSetupInput)[] = [
  "title",
  "summary",
  "primaryLearnerGroup",
  "language",
  "formatAndTime",
  "level",
  "capacityArea",
];

export function parseCourseSetupFormData(
  formData: FormData,
): CourseSetupValidationResult {
  const validationErrors: string[] = [];

  const accessModeRaw = formData.get("accessMode");
  const targetLearnerTypeRaw = formData.get("targetLearnerType");
  const deliveryModeRaw = formData.get("deliveryMode");
  const enrollmentModeRaw = formData.get("enrollmentMode");

  if (accessModeRaw && !Object.values(CourseAccessMode).includes(accessModeRaw as CourseAccessMode)) {
    validationErrors.push("Invalid Access Mode value submitted.");
  }
  if (targetLearnerTypeRaw && !Object.values(CourseTargetLearnerType).includes(targetLearnerTypeRaw as CourseTargetLearnerType)) {
    validationErrors.push("Invalid Target Learner Type value submitted.");
  }
  if (deliveryModeRaw && !Object.values(DeliveryMode).includes(deliveryModeRaw as DeliveryMode)) {
    validationErrors.push("Invalid Delivery Mode value submitted.");
  }
  if (enrollmentModeRaw && !Object.values(EnrollmentMode).includes(enrollmentModeRaw as EnrollmentMode)) {
    validationErrors.push("Invalid Enrollment Mode value submitted.");
  }

  const defaultDueDaysRaw = formData.get("defaultDueDays");
  let defaultDueDays: number | null = null;
  if (defaultDueDaysRaw !== null && defaultDueDaysRaw !== "") {
    const num = Number(defaultDueDaysRaw);
    if (isNaN(num)) {
      validationErrors.push("Default Due Days must be a valid number.");
    } else if (num < 0) {
      validationErrors.push("Default Due Days cannot be negative.");
    } else if (!Number.isInteger(num)) {
      validationErrors.push("Default Due Days must be an integer.");
    } else {
      defaultDueDays = num;
    }
  }

  const value: CourseSetupInput = {
    title: getTextValue(formData, "title"),
    summary: getTextValue(formData, "summary"),
    primaryLearnerGroup: getTextValue(formData, "primaryLearnerGroup"),
    language: getTextValue(formData, "language"),
    formatAndTime: getTextValue(formData, "formatAndTime"),
    level: getTextValue(formData, "level"),
    capacityArea: getTextValue(formData, "capacityArea"),
    sensitiveFlag: formData.get("sensitiveFlag") === "on" || formData.get("sensitiveFlag") === "true",
    certificateIntent: getTextValue(formData, "certificateIntent"),
    selectedDiagnosisRecordId: getTextValue(
      formData,
      "selectedDiagnosisRecordId",
    ),
    learnerReality: {
      deviceAccess: getTextValue(formData, "deviceAccess"),
      connectivity: getTextValue(formData, "connectivity"),
      timeAvailable: getTextValue(formData, "timeAvailable"),
    },
    accessMode: (accessModeRaw as CourseAccessMode) || CourseAccessMode.MEMBER_CSO_ONLY,
    targetLearnerType: (targetLearnerTypeRaw as CourseTargetLearnerType) || CourseTargetLearnerType.MEMBER_CSO,
    deliveryMode: (deliveryModeRaw as DeliveryMode) || DeliveryMode.SELF_PACED,
    enrollmentMode: (enrollmentModeRaw as EnrollmentMode) || EnrollmentMode.SELF_ENROLL,
    publicCatalogVisible: formData.get("publicCatalogVisible") === "on" || formData.get("publicCatalogVisible") === "true",
    memberCatalogVisible: formData.get("memberCatalogVisible") !== "off" && formData.get("memberCatalogVisible") !== "false",
    certificateEnabled: formData.get("certificateEnabled") !== "off" && formData.get("certificateEnabled") !== "false",
    practicalProofEnabled: formData.get("practicalProofEnabled") === "on" || formData.get("practicalProofEnabled") === "true",
    requiresProgramAssignment: formData.get("requiresProgramAssignment") === "on" || formData.get("requiresProgramAssignment") === "true",
    requiresCohortAssignment: formData.get("requiresCohortAssignment") === "on" || formData.get("requiresCohortAssignment") === "true",
    defaultDueDays,
    accessRestrictionNote: getTextValue(formData, "accessRestrictionNote"),
    learnerVisibilitySummary: getTextValue(formData, "learnerVisibilitySummary"),
  };

  const missingFields = requiredFields.filter((field) => !value[field]);

  if (missingFields.length > 0) {
    return {
      ok: false,
      missingFields,
    };
  }

  const policyErrors = validateCourseSetupAccessPolicy(value);
  validationErrors.push(...policyErrors);

  if (validationErrors.length > 0) {
    return {
      ok: false,
      validationErrors,
    };
  }

  return {
    ok: true,
    value,
  };
}

export function validateCourseSetupAccessPolicy(input: CourseSetupInput): string[] {
  const errors: string[] = [];

  // VAL-1: Public course with Cohort/Program Assignment
  if (
    input.targetLearnerType === CourseTargetLearnerType.PUBLIC &&
    (input.requiresCohortAssignment || input.requiresProgramAssignment)
  ) {
    errors.push("Public courses cannot require program or cohort assignments.");
  }

  // VAL-2: Public Catalog Visibility on Restricted Courses
  const publicModes: CourseAccessMode[] = [
    CourseAccessMode.PUBLIC_OPEN,
    CourseAccessMode.PUBLIC_REGISTRATION_REQUIRED,
  ];
  if (!publicModes.includes(input.accessMode) && input.publicCatalogVisible) {
    errors.push("Restricted courses cannot be visible in the public catalog.");
  }

  // PUBLIC_OPEN or PUBLIC_REGISTRATION_REQUIRED with targetLearnerType = MEMBER_CSO
  if (
    publicModes.includes(input.accessMode) &&
    input.targetLearnerType === CourseTargetLearnerType.MEMBER_CSO
  ) {
    errors.push("Public access modes cannot have target learner type set to Member CSO.");
  }

  // targetLearnerType = PUBLIC with memberCatalogVisible = true, unless targetLearnerType = BOTH is used
  if (
    input.targetLearnerType === CourseTargetLearnerType.PUBLIC &&
    input.memberCatalogVisible
  ) {
    errors.push("Public target learner types cannot be visible in the member catalog.");
  }

  // publicCatalogVisible = true unless accessMode is PUBLIC_OPEN or PUBLIC_REGISTRATION_REQUIRED
  if (input.publicCatalogVisible && !publicModes.includes(input.accessMode)) {
    errors.push("Course can only be visible in the public catalog if access mode is Public Open or Public Registration Required.");
  }

  // practicalProofEnabled = true when targetLearnerType is PUBLIC or accessMode is public
  if (
    input.practicalProofEnabled &&
    (input.targetLearnerType === CourseTargetLearnerType.PUBLIC || publicModes.includes(input.accessMode))
  ) {
    errors.push("Practical proofs are only enabled for member CSO learning areas.");
  }

  // VAL-4: Program Assigned Missing Directive
  if (
    input.accessMode === CourseAccessMode.PROGRAM_ASSIGNED &&
    !input.requiresProgramAssignment
  ) {
    errors.push("Program assigned courses must have program assignment required.");
  }

  // VAL-5: Cohort Assigned Missing Directive
  if (
    input.accessMode === CourseAccessMode.COHORT_ASSIGNED &&
    !input.requiresCohortAssignment
  ) {
    errors.push("Cohort assigned courses must have cohort assignment required.");
  }

  return errors;
}

export function isCourseSetupComplete(input: CourseSetupInput) {
  return requiredFields.every((field) => Boolean(input[field]));
}

export function hasDiagnosisEvidenceAnchor(input: CourseSetupInput) {
  return Boolean(input.selectedDiagnosisRecordId);
}

function getTextValue(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}
