import type { SessionTokens } from "@/features/auth/server/session";
import { fetchInvoices } from "@/features/invoice/server/invoice.api";
import type { Invoice } from "@/features/invoice/types/invoice";
import type { InvoiceSummaryStats } from "@/features/invoice/types/summary";
import {
  getActiveInvoiceStatus,
  getInvoiceDisplayAmount,
} from "@/features/invoice/utils/display";

const SUMMARY_PAGE_SIZE = 100;
const MAX_SUMMARY_PAGES = 10;

function isPaidInvoice(invoice: Invoice): boolean {
  const status = getActiveInvoiceStatus(invoice.status);
  return status === "Paid";
}

export async function computeInvoiceSummary(
  session: SessionTokens,
): Promise<InvoiceSummaryStats> {
  const allInvoices: Invoice[] = [];
  let totalInvoices = 0;
  let page = 1;

  while (page <= MAX_SUMMARY_PAGES) {
    const response = await fetchInvoices(
      session.accessToken,
      session.orgToken,
      {
        pageNum: page,
        pageSize: SUMMARY_PAGE_SIZE,
        sortBy: "CREATED_DATE",
        ordering: "DESCENDING",
      },
    );

    const batch = response.data ?? [];
    allInvoices.push(...batch);
    totalInvoices = response.paging?.totalRecords ?? allInvoices.length;

    if (allInvoices.length >= totalInvoices || batch.length === 0) break;
    page += 1;
  }

  const totalRevenue = allInvoices.reduce(
    (sum, invoice) => sum + getInvoiceDisplayAmount(invoice),
    0,
  );
  const paidCount = allInvoices.filter(isPaidInvoice).length;
  const unpaidCount = allInvoices.length - paidCount;

  return {
    totalInvoices,
    totalRevenue,
    paidCount,
    unpaidCount,
  };
}
