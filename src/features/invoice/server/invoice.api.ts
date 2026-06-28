import { getEnv } from "@/config/env";
import { SESSION_EXPIRED_USER_MESSAGE } from "@/features/auth/constants/session";
import type {
  FetchInvoicesParams,
  InvoiceListResponse,
} from "@/features/invoice/types/invoice";
import { readExternalApiError } from "@/lib/api/api-error";

export async function fetchInvoices(
  accessToken: string,
  orgToken: string,
  params: FetchInvoicesParams,
): Promise<InvoiceListResponse> {
  const { API_BASE_URL } = getEnv();

  if (!API_BASE_URL) {
    throw new Error("Missing API_BASE_URL configurations");
  }

  const query = new URLSearchParams();
  if (params.pageNum) query.append("pageNum", params.pageNum.toString());
  if (params.pageSize) query.append("pageSize", params.pageSize.toString());
  if (params.sortBy) query.append("sortBy", params.sortBy);
  if (params.ordering) query.append("ordering", params.ordering);
  if (params.status) query.append("status", params.status);
  if (params.keyword) query.append("keyword", params.keyword);
  if (params.fromDate) query.append("fromDate", params.fromDate);
  if (params.toDate) query.append("toDate", params.toDate);

  const url = `${API_BASE_URL}/invoice-service/1.0.0/invoices?${query.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "org-token": orgToken,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw await readExternalApiError(response, {
      sessionExpiredMessage: SESSION_EXPIRED_USER_MESSAGE,
    });
  }

  return response.json() as Promise<InvoiceListResponse>;
}

export async function createInvoice(
  accessToken: string,
  orgToken: string,
  invoiceData: unknown,
): Promise<unknown> {
  const { API_BASE_URL } = getEnv();

  if (!API_BASE_URL) {
    throw new Error("Missing API_BASE_URL configurations");
  }

  const response = await fetch(
    `${API_BASE_URL}/invoice-service/1.0.0/invoices`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "org-token": orgToken,
        "Operation-Mode": "SYNC",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invoiceData),
    },
  );

  if (!response.ok) {
    throw await readExternalApiError(response, {
      sessionExpiredMessage: SESSION_EXPIRED_USER_MESSAGE,
    });
  }

  return response.json();
}
