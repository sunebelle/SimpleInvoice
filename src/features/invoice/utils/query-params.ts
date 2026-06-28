import {
  DEFAULT_INVOICE_ORDERING,
  DEFAULT_INVOICE_SORT,
  INVOICE_PAGE_SIZE,
} from "@/features/invoice/constants";
import type {
  InvoiceOrdering,
  InvoiceSortBy,
} from "@/features/invoice/types/invoice";

export interface InvoiceListFilters {
  page: number;
  keyword: string;
  fromDate: string;
  toDate: string;
  status: string;
  sortBy: InvoiceSortBy;
  ordering: InvoiceOrdering;
}

const SORT_VALUES: InvoiceSortBy[] = ["CREATED_DATE", "DUE_DATE"];
const ORDER_VALUES: InvoiceOrdering[] = ["ASCENDING", "DESCENDING"];

function readParam(
  params: Record<string, string | string[] | undefined>,
  key: string,
): string | undefined {
  const value = params[key];
  if (Array.isArray(value)) return value[0];
  return value;
}

function parsePositiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.floor(parsed);
}

function parseSortBy(value: string | undefined): InvoiceSortBy {
  if (value && SORT_VALUES.includes(value as InvoiceSortBy)) {
    return value as InvoiceSortBy;
  }
  return DEFAULT_INVOICE_SORT;
}

function parseOrdering(value: string | undefined): InvoiceOrdering {
  if (value && ORDER_VALUES.includes(value as InvoiceOrdering)) {
    return value as InvoiceOrdering;
  }
  return DEFAULT_INVOICE_ORDERING;
}

export function parseInvoiceListSearchParams(
  params: Record<string, string | string[] | undefined>,
): InvoiceListFilters {
  return {
    page: parsePositiveInt(readParam(params, "page"), 1),
    keyword: readParam(params, "keyword")?.trim() ?? "",
    fromDate: readParam(params, "fromDate") ?? "",
    toDate: readParam(params, "toDate") ?? "",
    status: readParam(params, "status") ?? "All",
    sortBy: parseSortBy(readParam(params, "sortBy")),
    ordering: parseOrdering(readParam(params, "ordering")),
  };
}

export function buildInvoiceListQuery(filters: InvoiceListFilters): string {
  const query = new URLSearchParams();

  if (filters.page > 1) query.set("page", filters.page.toString());
  if (filters.keyword) query.set("keyword", filters.keyword);
  if (filters.fromDate) query.set("fromDate", filters.fromDate);
  if (filters.toDate) query.set("toDate", filters.toDate);
  if (filters.status !== "All") query.set("status", filters.status);
  if (filters.sortBy !== DEFAULT_INVOICE_SORT) {
    query.set("sortBy", filters.sortBy);
  }
  if (filters.ordering !== DEFAULT_INVOICE_ORDERING) {
    query.set("ordering", filters.ordering);
  }

  return query.toString();
}

/** Query string for `GET /api/invoices` (BFF), uses API param names. */
export function buildInvoiceApiQuery(filters: InvoiceListFilters): string {
  const query = new URLSearchParams();

  query.set("pageNum", filters.page.toString());
  query.set("pageSize", INVOICE_PAGE_SIZE.toString());
  query.set("sortBy", filters.sortBy);
  query.set("ordering", filters.ordering);

  if (filters.keyword) query.set("keyword", filters.keyword);
  if (filters.status !== "All") query.set("status", filters.status);
  if (filters.fromDate) query.set("fromDate", filters.fromDate);
  if (filters.toDate) query.set("toDate", filters.toDate);

  return query.toString();
}

export { INVOICE_PAGE_SIZE };
