process.env.AUTH_BASE_URL = "https://auth.example.com";
process.env.API_BASE_URL = "https://api.example.com";
process.env.CLIENT_ID = "mock-client-id";
process.env.CLIENT_SECRET = "mock-client-secret";

import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchAccessToken, fetchUserProfile } from "./auth.api";

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("auth.api", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe("fetchAccessToken", () => {
    it("should fetch access token successfully", async () => {
      const mockResponse = {
        access_token: "mock-access-token",
        expires_in: 3600,
        scope: "openid",
        token_type: "Bearer",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await fetchAccessToken("testuser", "testpass");

      expect(mockFetch).toHaveBeenCalledWith(
        "https://auth.example.com/t/101digital.core/oauth2/token",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }),
      );
      expect(result).toEqual(mockResponse);
    });

    it("should throw error when fetch fails", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: async () => "Invalid client credentials",
      });

      await expect(fetchAccessToken("testuser", "testpass")).rejects.toThrow(
        "Invalid client credentials",
      );
    });
  });

  describe("fetchUserProfile", () => {
    it("should fetch user profile successfully", async () => {
      const mockResponse = {
        data: {
          userId: "user-123",
          memberships: [{ token: "org-token-123" }],
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await fetchUserProfile("mock-access-token");

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/membership-service/1.0.0/users/me",
        expect.objectContaining({
          method: "GET",
          headers: {
            Authorization: "Bearer mock-access-token",
            "Content-Type": "application/json",
          },
        }),
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
