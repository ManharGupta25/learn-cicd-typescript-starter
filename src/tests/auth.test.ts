import { describe, it, expect, test } from "vitest";
import { getAPIKey } from "../api/auth.ts";
import type { IncomingHttpHeaders } from "http";

describe("getAPIKey", () => {
  it("returns API key when header is valid", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "ApiKey my-secret-key",
    };
    expect(getAPIKey(headers)).toBe("my-secret-key");
  });

  it("returns null if authorization header is missing", () => {
    const headers: IncomingHttpHeaders = {};
    expect(getAPIKey(headers)).toBeNull();
  });

  it("returns null if prefix is not ApiKey", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "Bearer my-secret-key",
    };
    expect(getAPIKey(headers)).toBeNull();
  });

  it("returns null if header is malformed", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "ApiKeyOnlyNoSpace",
    };
    expect(getAPIKey(headers)).toBeNull();
  });

  it("returns null if only prefix is present", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "ApiKey",
    };
    expect(getAPIKey(headers)).toBeNull();
  });

  it("returns key even if extra tokens are present", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "ApiKey my-secret-key with-extra-data",
    };
    expect(getAPIKey(headers)).toBe("my-secret-key");
  });

  it("is case-sensitive for prefix (must be 'ApiKey')", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "apikey my-secret-key",
    };
    expect(getAPIKey(headers)).toBeNull();
  });

  it("handles header with extra whitespace", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "  ApiKey    padded-key   ",
    };
    expect(getAPIKey(headers)).toBe("padded-key");
  });

  it("handles headers with unexpected types (e.g., array)", () => {
    const headers: IncomingHttpHeaders = {
      authorization: ["ApiKey multi-key"] as unknown as string, // force simulate malformed headers
    };
    expect(getAPIKey(headers)).toBeNull();
  });
});
