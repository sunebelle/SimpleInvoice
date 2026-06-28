process.env.AUTH_BASE_URL = "https://auth.example.com";
process.env.API_BASE_URL = "https://api.example.com";
process.env.CLIENT_ID = "mock-client-id";
process.env.CLIENT_SECRET = "mock-client-secret";

import { beforeEach, describe, expect, it, vi } from "vitest";
import { createInvoice, fetchInvoices } from "./invoice.api";

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("invoice.api", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe("fetchInvoices", () => {
    it("should fetch invoices successfully with query params", async () => {
      const mockResponse = {
        data: [{ invoiceId: "inv-1" }],
        paging: { pageNumber: 1, pageSize: 10, totalRecords: 1 },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await fetchInvoices(
        "mock-access-token",
        "mock-org-token",
        {
          pageNum: 1,
          pageSize: 10,
          sortBy: "CREATED_DATE",
        },
      );

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(
          "https://api.example.com/invoice-service/1.0.0/invoices?pageNum=1&pageSize=10&sortBy=CREATED_DATE",
        ),
        expect.objectContaining({
          method: "GET",
          headers: {
            Authorization: "Bearer mock-access-token",
            "org-token": "mock-org-token",
            "Content-Type": "application/json",
          },
        }),
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("createInvoice", () => {
    it("should create invoice successfully", async () => {
      const mockPayload = { invoices: [{ invoiceNumber: "INV-1" }] };
      const mockResponse = { success: true };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await createInvoice(
        "mock-access-token",
        "mock-org-token",
        mockPayload,
      );

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/invoice-service/1.0.0/invoices",
        expect.objectContaining({
          method: "POST",
          headers: {
            Authorization: "Bearer mock-access-token",
            "org-token": "mock-org-token",
            "Operation-Mode": "SYNC",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mockPayload),
        }),
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
