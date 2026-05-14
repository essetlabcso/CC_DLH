export const diagnosisCourseFitGuidance =
  "Course-fit depends on what learning can address and what support is also needed.";

export function getDiagnosisCourseFitDisplayLabel(value: string | null | undefined) {
  const normalized = normalizeDecision(value);

  if (!normalized) {
    return "Not set";
  }

  if (
    normalized === "course addressable" ||
    normalized === "course ready"
  ) {
    return "Course-ready";
  }

  if (
    normalized.startsWith("partly course addressable") ||
    normalized === "blended support recommended" ||
    normalized === "course support" ||
    normalized === "course plus support"
  ) {
    return "Course + support";
  }

  if (
    normalized === "learning support pathway" ||
    normalized === "support pathway" ||
    normalized === "not prioritized for phase 1"
  ) {
    return "Learning support pathway";
  }

  if (
    normalized.startsWith("non course support") ||
    normalized === "non course route" ||
    normalized === "non course support route" ||
    normalized === "routed outside course"
  ) {
    return "Non-course support route";
  }

  if (
    normalized === "further diagnosis needed" ||
    normalized === "needs further diagnosis" ||
    normalized.includes("needs further diagnosis") ||
    normalized.includes("unclear")
  ) {
    return "Needs further diagnosis";
  }

  return value?.trim() || "Not set";
}

export function getDiagnosisCourseFitDisplayDetail(
  value: string | null | undefined,
) {
  const label = getDiagnosisCourseFitDisplayLabel(value);

  if (!value?.trim() || label === value.trim()) {
    return label;
  }

  return `${label} (${value.trim()})`;
}

export function getDiagnosisCourseEligibilityDisplayLabel(
  value: string | null | undefined,
) {
  const normalized = normalizeDecision(value);

  if (normalized === "course setup eligible") {
    return "Course-ready";
  }

  if (normalized === "not selectable") {
    return "Support route or more diagnosis needed";
  }

  return value?.trim() || "Not set";
}

export function formatDiagnosisTextForDisplay(value: string | null | undefined) {
  if (!value?.trim()) {
    return value || "";
  }

  return value
    .replace(/not course-addressable by itself/gi, "Not Course-ready by itself")
    .replace(/course-addressable/gi, "course-ready")
    .replace(/partly course ready/gi, "Course + support")
    .replace(/partly course-ready/gi, "Course + support")
    .replace(/partly course addressable/gi, "Course + support")
    .replace(/not prioritized for phase 1/gi, "Learning support pathway")
    .replace(/non-course support required/gi, "Non-course support route")
    .replace(/further diagnosis needed/gi, "Needs further diagnosis");
}

function normalizeDecision(value: string | null | undefined) {
  return (value || "")
    .trim()
    .toLowerCase()
    .replace(/[+/]/g, " plus ")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
