export type LookupCategoryFormResult =
  | {
      ok: true;
      data: {
        categoryKey: string;
        categoryName: string;
        description: string;
        isActive: boolean;
        workflowPhase: string;
      };
      reason: string;
    }
  | {
      ok: false;
      message: string;
    };

export type LookupValueFormResult =
  | {
      ok: true;
      data: {
        categoryId: string;
        changeReason: string;
        description: string;
        displayLabel: string;
        displayOrder: number;
        helpText: string;
        isActive: boolean;
        parentValueId: string | null;
        valueKey: string;
        visibleInMonitoring: boolean;
        visibleToAdmin: boolean;
        visibleToCreator: boolean;
        visibleToParticipant: boolean;
        visibleToReviewer: boolean;
      };
      reason: string;
    }
  | {
      ok: false;
      message: string;
    };

export function parseLookupCategoryForm(
  formData: FormData,
  { requireReason = false }: { requireReason?: boolean } = {},
): LookupCategoryFormResult {
  const categoryKey = normalizeKey(readString(formData, "categoryKey"));
  const categoryName = readString(formData, "categoryName");
  const workflowPhase =
    normalizeKey(readString(formData, "workflowPhase")) || "cross-workflow";
  const description = readString(formData, "description");
  const reason = readString(formData, "changeReason");

  if (!categoryKey) {
    return { ok: false, message: "Enter a stable category key." };
  }

  if (!categoryName) {
    return { ok: false, message: "Enter a category name." };
  }

  if (requireReason && !reason) {
    return { ok: false, message: "Enter a reason for this update." };
  }

  return {
    ok: true,
    data: {
      categoryKey,
      categoryName,
      description,
      isActive: readBoolean(formData, "isActive", true),
      workflowPhase,
    },
    reason,
  };
}

export function parseLookupValueForm(
  formData: FormData,
  { requireReason = false }: { requireReason?: boolean } = {},
): LookupValueFormResult {
  const categoryId = readString(formData, "categoryId");
  const valueKey = normalizeKey(readString(formData, "valueKey"));
  const displayLabel = readString(formData, "displayLabel");
  const changeReason = readString(formData, "changeReason");
  const displayOrder = parseInteger(readString(formData, "displayOrder"));

  if (!categoryId) {
    return { ok: false, message: "Choose a reference category." };
  }

  if (!valueKey) {
    return { ok: false, message: "Enter a stable value key." };
  }

  if (!displayLabel) {
    return { ok: false, message: "Enter a display label." };
  }

  if (requireReason && !changeReason) {
    return { ok: false, message: "Enter a reason for this update." };
  }

  return {
    ok: true,
    data: {
      categoryId,
      changeReason,
      description: readString(formData, "description"),
      displayLabel,
      displayOrder,
      helpText: readString(formData, "helpText"),
      isActive: readBoolean(formData, "isActive", true),
      parentValueId: readString(formData, "parentValueId") || null,
      valueKey,
      visibleInMonitoring: readBoolean(formData, "visibleInMonitoring", false),
      visibleToAdmin: readBoolean(formData, "visibleToAdmin", true),
      visibleToCreator: readBoolean(formData, "visibleToCreator", true),
      visibleToParticipant: readBoolean(
        formData,
        "visibleToParticipant",
        false,
      ),
      visibleToReviewer: readBoolean(formData, "visibleToReviewer", true),
    },
    reason: changeReason,
  };
}

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readBoolean(formData: FormData, key: string, defaultValue: boolean) {
  if (!formData.has(key)) {
    return false;
  }

  const value = formData.get(key);

  if (typeof value !== "string") {
    return defaultValue;
  }

  return ["1", "true", "on", "yes"].includes(value.toLowerCase());
}

function parseInteger(value: string) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeKey(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}
