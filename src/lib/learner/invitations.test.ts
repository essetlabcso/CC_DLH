import { describe, expect, it } from "vitest";

import {
  generateLearnerInvitationToken,
  hashLearnerInvitationToken,
  isUsableLearnerInvitationToken,
  normalizeLearnerInvitationToken,
} from "./invitations";

describe("learner invitation token helpers", () => {
  it("generates URL-safe tokens and hashes them without returning the raw token", () => {
    const token = generateLearnerInvitationToken();
    const hash = hashLearnerInvitationToken(token);

    expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
    expect(hash).not.toContain(token);
  });

  it("normalizes and validates incoming invitation tokens before lookup", () => {
    expect(normalizeLearnerInvitationToken("  abc123  ")).toBe("abc123");
    expect(isUsableLearnerInvitationToken(" abc123 ")).toBe(true);
    expect(isUsableLearnerInvitationToken("   ")).toBe(false);
  });

  it("hashes equivalent trimmed tokens consistently", () => {
    expect(hashLearnerInvitationToken(" token-1 ")).toBe(
      hashLearnerInvitationToken("token-1"),
    );
  });
});
