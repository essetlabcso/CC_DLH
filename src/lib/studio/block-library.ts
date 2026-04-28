import { LessonBlockType } from "@prisma/client";

export const creatorBlockOrigins = ["DESIGN_REQUIRED", "CREATOR_ADDED"] as const;

export type CreatorBlockOrigin = (typeof creatorBlockOrigins)[number];

export const blockJustifications = [
  "supports-required-action",
  "provides-minimum-information",
  "improves-practice",
  "improves-assessment-readiness",
  "supports-accessibility",
  "supports-localization",
  "supports-safeguarding",
  "improves-navigation",
  "adds-approved-resource",
  "other-reviewer-note",
] as const;

export type BlockJustification = (typeof blockJustifications)[number];

export type BlockLibraryItem = {
  id: string;
  label: string;
  type: LessonBlockType;
  purpose: string;
};

export type BlockLibrarySubcategory = {
  label: string;
  items: readonly BlockLibraryItem[];
};

export type BlockLibraryCategory = {
  label: string;
  subcategories: readonly BlockLibrarySubcategory[];
};

export type CreatorAddedBlockInput = {
  blockId: string;
  title: string;
  justification: BlockJustification | "";
  purposeLink: string;
};

export type CreatorAddedBlockValidationResult =
  | {
      ok: true;
      value: CreatorAddedBlockInput & {
        libraryItem: BlockLibraryItem;
      };
    }
  | {
      ok: false;
      missingFields: string[];
    };

export const blockJustificationLabels: Record<BlockJustification, string> = {
  "supports-required-action": "Supports required action",
  "provides-minimum-information": "Provides minimum information",
  "improves-practice": "Improves practice",
  "improves-assessment-readiness": "Improves assessment readiness",
  "supports-accessibility": "Supports accessibility",
  "supports-localization": "Supports localization",
  "supports-safeguarding": "Supports safeguarding",
  "improves-navigation": "Improves navigation",
  "adds-approved-resource": "Adds approved resource",
  "other-reviewer-note": "Other - reviewer attention",
};

export const creatorAddedBlockFieldLabels: Record<string, string> = {
  blockId: "block type",
  title: "block title",
  justification: "added block justification",
  purposeLink: "purpose link",
};

export const blockLibrary: readonly BlockLibraryCategory[] = [
  {
    label: "Structure and Navigation",
    subcategories: [
      {
        label: "Lesson flow",
        items: [
          libraryItem(
            "section-header",
            "Section header",
            LessonBlockType.TEXT,
            "Help learners understand the next part of the lesson.",
          ),
          libraryItem(
            "progress-note",
            "Progress note",
            LessonBlockType.CALLOUT,
            "Orient learners to where they are in the lesson flow.",
          ),
        ],
      },
    ],
  },
  {
    label: "Text and Explanation",
    subcategories: [
      {
        label: "Plain-language support",
        items: [
          libraryItem(
            "short-explainer",
            "Short explainer",
            LessonBlockType.TEXT,
            "Add essential information needed for the learner action.",
          ),
          libraryItem(
            "key-concept",
            "Key concept",
            LessonBlockType.CALLOUT,
            "Highlight one concept that supports practice or assessment.",
          ),
        ],
      },
    ],
  },
  {
    label: "Practice and Scenario",
    subcategories: [
      {
        label: "Applied practice",
        items: [
          libraryItem(
            "guided-practice",
            "Guided practice",
            LessonBlockType.SCENARIO,
            "Give learners a practical action to try before assessment.",
          ),
          libraryItem(
            "reflection-prompt",
            "Reflection prompt",
            LessonBlockType.REFLECTION,
            "Connect the lesson to the learner's CSO context.",
          ),
        ],
      },
    ],
  },
  {
    label: "Assessment and Resources",
    subcategories: [
      {
        label: "Checks and reusable aids",
        items: [
          libraryItem(
            "knowledge-check",
            "Knowledge check",
            LessonBlockType.CHECK,
            "Check readiness for the approved learner action.",
          ),
          libraryItem(
            "job-aid",
            "Job aid",
            LessonBlockType.CALLOUT,
            "Provide a reusable field reference or checklist.",
          ),
        ],
      },
    ],
  },
  {
    label: "Accessibility and Safety",
    subcategories: [
      {
        label: "Learner protection",
        items: [
          libraryItem(
            "accessibility-note",
            "Accessibility note",
            LessonBlockType.CALLOUT,
            "Add an equivalent low-bandwidth or accessible support note.",
          ),
          libraryItem(
            "safety-note",
            "Safety note",
            LessonBlockType.CALLOUT,
            "Add a safeguarding, civic-space, or data safety reminder.",
          ),
        ],
      },
    ],
  },
];

export function parseCreatorAddedBlockFormData(
  formData: FormData,
): CreatorAddedBlockValidationResult {
  const value: CreatorAddedBlockInput = {
    blockId: getTextValue(formData, "blockId"),
    title: getTextValue(formData, "title"),
    justification: normalizeJustification(
      getTextValue(formData, "justification"),
    ),
    purposeLink: getTextValue(formData, "purposeLink"),
  };
  const missingFields = (Object.entries(value) as [string, string][])
    .filter(([, fieldValue]) => !fieldValue)
    .map(([field]) => field);
  const libraryItem = findBlockLibraryItem(value.blockId);

  if (!libraryItem) {
    missingFields.push("blockId");
  }

  if (missingFields.length > 0 || !libraryItem) {
    return {
      ok: false,
      missingFields: Array.from(new Set(missingFields)),
    };
  }

  return {
    ok: true,
    value: {
      ...value,
      libraryItem,
    },
  };
}

export function findBlockLibraryItem(blockId: string) {
  return blockLibrary
    .flatMap((category) => category.subcategories)
    .flatMap((subcategory) => subcategory.items)
    .find((item) => item.id === blockId);
}

export function buildCreatorAddedBlockContent(input: {
  title: string;
  libraryItem: BlockLibraryItem;
  justificationLabel: string;
  purposeLink: string;
}) {
  return {
    title: input.title,
    purpose: input.libraryItem.purpose,
    body: [
      "Creator-added block. Draft learner-facing content here during the next editing pass.",
      `Purpose link: ${input.purposeLink}`,
      `Justification: ${input.justificationLabel}`,
    ].join("\n\n"),
    linkedLearnerAction: input.purposeLink,
    sourceStoryboardField: "creator-added block library",
  };
}

function libraryItem(
  id: string,
  label: string,
  type: LessonBlockType,
  purpose: string,
): BlockLibraryItem {
  return {
    id,
    label,
    type,
    purpose,
  };
}

function normalizeJustification(value: string): BlockJustification | "" {
  return blockJustifications.includes(value as BlockJustification)
    ? (value as BlockJustification)
    : "";
}

function getTextValue(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}
