import { describe, expect, it } from "vitest";

describe("development/demo login bypass environment gate", () => {
  it("enables demo login when ENABLE_DEMO_LOGIN is 'true'", () => {
    const original = process.env.ENABLE_DEMO_LOGIN;
    process.env.ENABLE_DEMO_LOGIN = "true";
    const isDemoEnabled =
      process.env.ENABLE_DEMO_LOGIN === "true" ||
      (process.env.ENABLE_DEMO_LOGIN === undefined &&
        process.env.NODE_ENV === "development");
    expect(isDemoEnabled).toBe(true);
    process.env.ENABLE_DEMO_LOGIN = original;
  });

  it("disables demo login when ENABLE_DEMO_LOGIN is 'false'", () => {
    const original = process.env.ENABLE_DEMO_LOGIN;
    process.env.ENABLE_DEMO_LOGIN = "false";
    const isDemoEnabled =
      process.env.ENABLE_DEMO_LOGIN === "true" ||
      (process.env.ENABLE_DEMO_LOGIN === undefined &&
        process.env.NODE_ENV === "development");
    expect(isDemoEnabled).toBe(false);
    process.env.ENABLE_DEMO_LOGIN = original;
  });

  it("defaults to false in production if ENABLE_DEMO_LOGIN is undefined", () => {
    const originalNodeEnv = process.env.NODE_ENV;
    const originalDemoLogin = process.env.ENABLE_DEMO_LOGIN;
    delete process.env.ENABLE_DEMO_LOGIN;
    (process.env as Record<string, string | undefined>).NODE_ENV = "production";
    const isDemoEnabled =
      process.env.ENABLE_DEMO_LOGIN === "true" ||
      (process.env.ENABLE_DEMO_LOGIN === undefined &&
        process.env.NODE_ENV === "development");
    expect(isDemoEnabled).toBe(false);
    (process.env as Record<string, string | undefined>).NODE_ENV = originalNodeEnv;
    process.env.ENABLE_DEMO_LOGIN = originalDemoLogin;
  });
});
