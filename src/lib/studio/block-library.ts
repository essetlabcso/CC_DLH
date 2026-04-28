import { LessonBlockType } from "@prisma/client";

import type { BuildStudioBlockContent } from "@/lib/studio/build-studio";

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
    label: "Structure",
    subcategories: [
      {
        label: "Lesson flow and orientation",
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
          libraryItem(
            "next-step",
            "Next-step instruction",
            LessonBlockType.CALLOUT,
            "Help learners understand what to do next in the course flow.",
          ),
        ],
      },
    ],
  },
  {
    label: "Explain",
    subcategories: [
      {
        label: "Plain-language guidance",
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
          libraryItem(
            "worked-example",
            "Worked example",
            LessonBlockType.TEXT,
            "Show how the approved learner action looks in a realistic CSO context.",
          ),
        ],
      },
    ],
  },
  {
    label: "Practice",
    subcategories: [
      {
        label: "Applied practice tasks",
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
    label: "Decide",
    subcategories: [
      {
        label: "Decision support",
        items: [
          libraryItem(
            "decision-point",
            "Decision point",
            LessonBlockType.SCENARIO,
            "Ask learners to choose between realistic options linked to the approved action.",
          ),
          libraryItem(
            "branching-scenario",
            "Branching scenario",
            LessonBlockType.SCENARIO,
            "Practice a consequence-aware decision without changing the approved course scope.",
          ),
        ],
      },
    ],
  },
  {
    label: "Reflect",
    subcategories: [
      {
        label: "Context reflection",
        items: [
          libraryItem(
            "context-reflection",
            "Context reflection",
            LessonBlockType.REFLECTION,
            "Help learners compare the approved practice with their own CSO setting.",
          ),
          libraryItem(
            "commitment-note",
            "Commitment note",
            LessonBlockType.REFLECTION,
            "Prompt learners to identify one realistic next step after the lesson.",
          ),
        ],
      },
    ],
  },
  {
    label: "Check",
    subcategories: [
      {
        label: "Knowledge and readiness checks",
        items: [
          libraryItem(
            "knowledge-check",
            "Knowledge check",
            LessonBlockType.CHECK,
            "Check readiness for the approved learner action.",
          ),
          libraryItem(
            "quick-check",
            "Quick check",
            LessonBlockType.CHECK,
            "Confirm one essential idea before the learner continues.",
          ),
        ],
      },
    ],
  },
  {
    label: "Apply",
    subcategories: [
      {
        label: "Reusable field support",
        items: [
          libraryItem(
            "job-aid",
            "Job aid",
            LessonBlockType.CALLOUT,
            "Provide a reusable field reference or checklist.",
          ),
          libraryItem(
            "template-task",
            "Template task",
            LessonBlockType.TEXT,
            "Guide learners to complete a simple template linked to the approved action.",
          ),
        ],
      },
    ],
  },
  {
    label: "Safeguard",
    subcategories: [
      {
        label: "Safety and sensitive context",
        items: [
          libraryItem(
            "safety-note",
            "Safety note",
            LessonBlockType.CALLOUT,
            "Add a safeguarding, civic-space, or data safety reminder.",
          ),
          libraryItem(
            "data-safety-note",
            "Data safety note",
            LessonBlockType.CALLOUT,
            "Remind learners how to avoid exposing sensitive personal or organizational data.",
          ),
        ],
      },
    ],
  },
  {
    label: "Access",
    subcategories: [
      {
        label: "Accessibility and low-bandwidth support",
        items: [
          libraryItem(
            "accessibility-note",
            "Accessibility note",
            LessonBlockType.CALLOUT,
            "Add an equivalent low-bandwidth or accessible support note.",
          ),
          libraryItem(
            "plain-language-note",
            "Plain-language note",
            LessonBlockType.TEXT,
            "Simplify a difficult term or step without changing the approved meaning.",
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
}): BuildStudioBlockContent {
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
    accessibilityNote: "",
    safeguardingNote: "",
    aiReviewStatus: "not-used",
    aiReviewNote: "",
    reviewReadinessNote: "Creator-added block must remain aligned to the approved Design Handover.",
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
