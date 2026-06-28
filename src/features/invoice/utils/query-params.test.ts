import { describe, expect, it } from "vitest";
import {
  buildInvoiceApiQuery,
  buildInvoiceListQuery,
  parseInvoiceListSearchParams,
} from "./query-params";

describe("parseInvoiceListSearchParams", () => {
  it("returns defaults for empty params", () => {
    expect(parseInvoiceListSearchParams({})).toEqual({
      page: 1,
      keyword: "",
      fromDate: "",
      toDate: "",
      status: "All",
      sortBy: "CREATED_DATE",
      ordering: "DESCENDING",
    });
  });

  it("parses valid filter params", () => {
    expect(
      parseInvoiceListSearchParams({
        page: "2",
        keyword: " INV-001 ",
        fromDate: "2024-01-01",
        toDate: "2024-12-31",
        status: "Paid",
        sortBy: "DUE_DATE",
        ordering: "ASCENDING",
      }),
    ).toEqual({
      page: 2,
      keyword: "INV-001",
      fromDate: "2024-01-01",
      toDate: "2024-12-31",
      status: "Paid",
      sortBy: "DUE_DATE",
      ordering: "ASCENDING",
    });
  });

  it("falls back for invalid page and sort values", () => {
    expect(
      parseInvoiceListSearchParams({
        page: "-1",
        sortBy: "INVALID",
        ordering: "INVALID",
      }),
    ).toEqual({
      page: 1,
      keyword: "",
      fromDate: "",
      toDate: "",
      status: "All",
      sortBy: "CREATED_DATE",
      ordering: "DESCENDING",
    });
  });
});

describe("buildInvoiceListQuery", () => {
  it("omits default values from query string", () => {
    expect(
      buildInvoiceListQuery({
        page: 1,
        keyword: "",
        fromDate: "",
        toDate: "",
        status: "All",
        sortBy: "CREATED_DATE",
        ordering: "DESCENDING",
      }),
    ).toBe("");
  });

  it("builds query for active filters", () => {
    const query = buildInvoiceListQuery({
      page: 3,
      keyword: "INV",
      fromDate: "2024-01-01",
      toDate: "",
      status: "Due",
      sortBy: "DUE_DATE",
      ordering: "ASCENDING",
    });

    expect(query).toBe(
      "page=3&keyword=INV&fromDate=2024-01-01&status=Due&sortBy=DUE_DATE&ordering=ASCENDING",
    );
  });
});

describe("buildInvoiceApiQuery", () => {
  it("uses BFF API param names", () => {
    const query = buildInvoiceApiQuery({
      page: 2,
      keyword: "INV-1",
      fromDate: "",
      toDate: "",
      status: "Paid",
      sortBy: "CREATED_DATE",
      ordering: "DESCENDING",
    });

    expect(query).toBe(
      "pageNum=2&pageSize=10&sortBy=CREATED_DATE&ordering=DESCENDING&keyword=INV-1&status=Paid",
    );
  });
});
