import type { SessionTokens } from "@/features/auth/server/session";
import { fetchInvoices } from "@/features/invoice/server/invoice.api";
import type { Invoice } from "@/features/invoice/types/invoice";

const LOOKUP_PAGE_SIZE = 50;
const MAX_LOOKUP_PAGES = 20;

/** Resolves a single invoice by scanning paginated list (no detail API in spec). */
export async function findInvoiceById(
  session: SessionTokens,
  invoiceId: string,
): Promise<Invoice | null> {
  let page = 1;

  while (page <= MAX_LOOKUP_PAGES) {
    const response = await fetchInvoices(
      session.accessToken,
      session.orgToken,
      {
        pageNum: page,
        pageSize: LOOKUP_PAGE_SIZE,
        sortBy: "CREATED_DATE",
        ordering: "DESCENDING",
      },
    );

    const match = response.data?.find(
      (invoice) => invoice.invoiceId === invoiceId,
    );
    if (match) return match;

    const totalRecords = response.paging?.totalRecords ?? 0;
    if (page * LOOKUP_PAGE_SIZE >= totalRecords) return null;
    page += 1;
  }

  return null;
}
