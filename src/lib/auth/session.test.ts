import { describe, expect, it } from "vitest";

import { createSession, createSessionToken, parseSessionToken } from "./session";

describe("signed DEC sessions", () => {
  it("round-trips a valid signed session", async () => {
    const session = createSession(
      {
        userId: "user-1",
        organizationId: "org-1",
        email: "learner@example.test",
        name: "Learner One",
        role: "learner",
      },
      1000,
    );
    const token = await createSessionToken(session, "test-secret");

    await expect(parseSessionToken(token, "test-secret", 2000)).resolves.toEqual(
      session,
    );
  });

  it("rejects tampered tokens", async () => {
    const session = createSession(
      {
        userId: "user-1",
        organizationId: "org-1",
        email: "learner@example.test",
        name: "Learner One",
        role: "learner",
      },
      1000,
    );
    const token = await createSessionToken(session, "test-secret");
    const [payload, signature] = token.split(".");
    const tampered = `${payload}x.${signature}`;

    await expect(parseSessionToken(tampered, "test-secret", 2000)).resolves.toBeNull();
  });

  it("rejects expired tokens", async () => {
    const session = createSession(
      {
        userId: "user-1",
        organizationId: "org-1",
        email: "learner@example.test",
        name: "Learner One",
        role: "learner",
      },
      1000,
    );
    const token = await createSessionToken(session, "test-secret");

    await expect(
      parseSessionToken(token, "test-secret", session.expiresAt + 1),
    ).resolves.toBeNull();
  });
});
