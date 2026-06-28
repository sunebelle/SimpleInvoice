import { describe, expect, it } from "vitest";
import { SESSION_EXPIRED_USER_MESSAGE } from "@/features/auth/constants/session";
import { parseExternalApiError } from "./api-error";

describe("parseExternalApiError", () => {
  it("maps 401 to a friendly session expired message", () => {
    const error = parseExternalApiError(
      401,
      '{"errors":[{"code":"899.S00.401.00","message":"Authentication failed. Missing, invalid, or expired credentials."}]}',
      { sessionExpiredMessage: SESSION_EXPIRED_USER_MESSAGE },
    );

    expect(error.message).toBe(SESSION_EXPIRED_USER_MESSAGE);
    expect(error.status).toBe(401);
    expect(error.code).toBe("SESSION_EXPIRED");
  });

  it("extracts message from structured error JSON", () => {
    const error = parseExternalApiError(
      400,
      '{"errors":[{"message":"Invalid invoice number"}]}',
    );

    expect(error.message).toBe("Invalid invoice number");
    expect(error.status).toBe(400);
  });
});
