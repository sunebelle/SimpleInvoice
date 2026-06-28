import { describe, expect, it } from "vitest";
import { buildSecurityHeaders } from "./security-headers";

describe("buildSecurityHeaders", () => {
  it("includes baseline headers in development", () => {
    const headers = buildSecurityHeaders(false);
    const keys = headers.map((h) => h.key);

    expect(keys).toContain("X-Frame-Options");
    expect(keys).toContain("X-Content-Type-Options");
    expect(keys).not.toContain("Strict-Transport-Security");
  });

  it("adds HSTS in production", () => {
    const headers = buildSecurityHeaders(true);
    const hsts = headers.find((h) => h.key === "Strict-Transport-Security");

    expect(hsts?.value).toContain("max-age=");
  });
});
