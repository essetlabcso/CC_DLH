import { describe, expect, it } from "vitest";

import {
  parseRevisionRequestFormData,
  summarizeRevisionRequest,
} from "./revisions";

describe("revision request helpers", () => {
  it("requires a revision reason", () => {
    const result = parseRevisionRequestFormData(new FormData());

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.missingFields).toEqual(["revisionReason"]);
    }
  });

  it("trims and summarizes a revision request", () => {
    const formData = new FormData();

    formData.set(
      "revisionReason",
      "  Learner feedback suggests the reporting pathway needs clearer examples.  ",
    );

    const result = parseRevisionRequestFormData(formData);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.revisionReason).toBe(
        "Learner feedback suggests the reporting pathway needs clearer examples.",
      );
      expect(
        summarizeRevisionRequest("Safeguarding response", result.value),
      ).toBe(
        "Revision requested for Safeguarding response: Learner feedback suggests the reporting pathway needs clearer examples.",
      );
    }
  });
});
