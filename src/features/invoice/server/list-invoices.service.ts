import type { SessionTokens } from "@/features/auth/server/session";
import { INVOICE_PAGE_SIZE } from "@/features/invoice/constants";
import { fetchInvoices } from "@/features/invoice/server/invoice.api";
import type { InvoiceListResponse } from "@/features/invoice/types/invoice";
import type { InvoiceListFilters } from "@/features/invoice/utils/query-params";

/** Calls the external invoice API — use only from BFF route handlers. */
export async function listInvoices(
  session: SessionTokens,
  filters: InvoiceListFilters,
): Promise<InvoiceListResponse> {
  return fetchInvoices(session.accessToken, session.orgToken, {
    pageNum: filters.page,
    pageSize: INVOICE_PAGE_SIZE,
    sortBy: filters.sortBy,
    ordering: filters.ordering,
    status: filters.status !== "All" ? filters.status : undefined,
    keyword: filters.keyword || undefined,
    fromDate: filters.fromDate || undefined,
    toDate: filters.toDate || undefined,
  });
}
