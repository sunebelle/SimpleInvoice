import { redirectToLoginWhenSessionExpired } from "@/features/auth/server/session-expired";
import type {
  Invoice,
  InvoiceListResponse,
} from "@/features/invoice/types/invoice";
import type { InvoiceSummaryStats } from "@/features/invoice/types/summary";
import type { InvoiceListFilters } from "@/features/invoice/utils/query-params";
import { buildInvoiceApiQuery } from "@/features/invoice/utils/query-params";
import { bffFetch } from "@/lib/bff/server-fetch";

export async function fetchInvoiceListFromBff(
  filters: InvoiceListFilters,
): Promise<InvoiceListResponse> {
  const query = buildInvoiceApiQuery(filters);
  const path = query ? `/api/invoices?${query}` : "/api/invoices";
  const response = await bffFetch(path);

  if (response.status === 401) {
    redirectToLoginWhenSessionExpired();
  }

  if (!response.ok) {
    const errData = (await response.json().catch(() => ({}))) as {
      error?: string;
    };
    throw new Error(errData.error || "Failed to fetch invoices");
  }

  return response.json() as Promise<InvoiceListResponse>;
}

export async function fetchInvoiceByIdFromBff(
  invoiceId: string,
): Promise<Invoice> {
  const response = await bffFetch(
    `/api/invoices/${encodeURIComponent(invoiceId)}`,
  );

  if (response.status === 401) {
    redirectToLoginWhenSessionExpired();
  }

  if (response.status === 404) {
    throw new Error("Invoice not found");
  }

  if (!response.ok) {
    const errData = (await response.json().catch(() => ({}))) as {
      error?: string;
    };
    throw new Error(errData.error || "Failed to fetch invoice");
  }

  const payload = (await response.json()) as { data: Invoice };
  return payload.data;
}

export async function fetchInvoiceSummaryFromBff(): Promise<InvoiceSummaryStats> {
  const response = await bffFetch("/api/invoices/summary");

  if (response.status === 401) {
    redirectToLoginWhenSessionExpired();
  }

  if (!response.ok) {
    const errData = (await response.json().catch(() => ({}))) as {
      error?: string;
    };
    throw new Error(errData.error || "Failed to fetch summary");
  }

  return response.json() as Promise<InvoiceSummaryStats>;
}
