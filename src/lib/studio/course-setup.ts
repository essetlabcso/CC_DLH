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
  learnerReality: {
    deviceAccess: string;
    connectivity: string;
    timeAvailable: string;
  };
};

export type CourseSetupValidationResult =
  | {
      ok: true;
      value: CourseSetupInput;
    }
  | {
      ok: false;
      missingFields: string[];
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
  const value: CourseSetupInput = {
    title: getTextValue(formData, "title"),
    summary: getTextValue(formData, "summary"),
    primaryLearnerGroup: getTextValue(formData, "primaryLearnerGroup"),
    language: getTextValue(formData, "language"),
    formatAndTime: getTextValue(formData, "formatAndTime"),
    level: getTextValue(formData, "level"),
    capacityArea: getTextValue(formData, "capacityArea"),
    sensitiveFlag: formData.get("sensitiveFlag") === "on",
    certificateIntent: getTextValue(formData, "certificateIntent"),
    learnerReality: {
      deviceAccess: getTextValue(formData, "deviceAccess"),
      connectivity: getTextValue(formData, "connectivity"),
      timeAvailable: getTextValue(formData, "timeAvailable"),
    },
  };
  const missingFields = requiredFields.filter((field) => !value[field]);

  if (missingFields.length > 0) {
    return {
      ok: false,
      missingFields,
    };
  }

  return {
    ok: true,
    value,
  };
}

export function isCourseSetupComplete(input: CourseSetupInput) {
  return requiredFields.every((field) => Boolean(input[field]));
}

function getTextValue(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}
