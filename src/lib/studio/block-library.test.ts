import { LessonBlockType } from "@prisma/client";
import { describe, expect, it } from "vitest";

import {
  blockJustificationLabels,
  buildCreatorAddedBlockContent,
  findBlockLibraryItem,
  parseCreatorAddedBlockFormData,
} from "./block-library";

describe("Build Studio block library", () => {
  it("finds governed library items by id", () => {
    const item = findBlockLibraryItem("guided-practice");

    expect(item?.type).toBe(LessonBlockType.SCENARIO);
    expect(item?.purpose).toContain("practical action");
  });

  it("requires a block, title, justification, and purpose link", () => {
    const result = parseCreatorAddedBlockFormData(new FormData());

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.missingFields).toContain("blockId");
      expect(result.missingFields).toContain("title");
      expect(result.missingFields).toContain("justification");
      expect(result.missingFields).toContain("purposeLink");
    }
  });

  it("accepts creator-added blocks only with purpose-linked justification", () => {
    const formData = new FormData();

    formData.set("blockId", "safety-note");
    formData.set("title", "Protect sensitive case details");
    formData.set("justification", "supports-safeguarding");
    formData.set(
      "purposeLink",
      "Supports the approved safeguarding learner action.",
    );

    const result = parseCreatorAddedBlockFormData(formData);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.libraryItem.type).toBe(LessonBlockType.CALLOUT);
      expect(result.value.justification).toBe("supports-safeguarding");
    }
  });

  it("builds transparent draft content for added blocks", () => {
    const item = findBlockLibraryItem("job-aid");

    expect(item).toBeDefined();
    const content = buildCreatorAddedBlockContent({
      title: "Reporting checklist",
      libraryItem: item!,
      justificationLabel: blockJustificationLabels["adds-approved-resource"],
      purposeLink: "Supports the approved reporting pathway action.",
    });

    expect(content.title).toBe("Reporting checklist");
    expect(content.body).toContain("Creator-added block");
    expect(content.linkedLearnerAction).toContain("reporting pathway");
  });
});
