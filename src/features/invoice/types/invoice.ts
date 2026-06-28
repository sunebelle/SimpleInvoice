export interface InvoiceStatus {
  key: string;
  value: boolean;
}

export interface InvoiceCustomField {
  key: string;
  value: string;
}

/** Customer / merchant entity from invoice list API */
export interface InvoicePartyContact {
  email?: string;
  mobileNumber?: string;
}

export interface InvoiceParty {
  id?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  contact?: InvoicePartyContact;
  addresses?: unknown[];
}

/** Invoice record from GET /invoice-service/.../invoices */
export interface Invoice {
  invoiceId: string;
  invoiceNumber: string;
  invoiceReference?: string;
  referenceNo?: string;
  createdAt: string;
  createdBy: string;
  currency: string;
  currencySymbol: string;
  description?: string;
  invoiceDate: string;
  dueDate: string;
  invoiceSubTotal: number;
  totalDiscount: number;
  totalTax: number;
  totalAmount: number;
  totalPaid: number;
  balanceAmount: number;
  invoiceGrossTotal: number;
  numberOfDocuments: number;
  customer: InvoiceParty;
  merchant: InvoiceParty;
  documents: unknown[];
  items: unknown[];
  extensions: unknown[];
  payments: unknown[];
  status: InvoiceStatus[] | string[];
  subStatus: InvoiceStatus[];
  type: string;
  version: string;
  customFields: InvoiceCustomField[];
}

export interface InvoicePaging {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
}

export interface InvoiceListResponse {
  data: Invoice[];
  paging?: InvoicePaging;
}

export type InvoiceOrdering = "ASCENDING" | "DESCENDING";

export type InvoiceSortBy = "CREATED_DATE" | "DUE_DATE";

export interface FetchInvoicesParams {
  pageNum?: number;
  pageSize?: number;
  sortBy?: string;
  ordering?: InvoiceOrdering;
  status?: string;
  keyword?: string;
  fromDate?: string;
  toDate?: string;
}

export type { CreateInvoiceFormData } from "@/features/invoice/schemas/create-invoice.schema";
