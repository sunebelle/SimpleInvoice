import type {
  InvoiceOrdering,
  InvoiceSortBy,
} from "@/features/invoice/types/invoice";

export const INVOICE_PAGE_SIZE = 10;

export const INVOICE_STATUS_OPTIONS = [
  "All",
  "Draft",
  "Sent",
  "Paid",
  "Due",
  "Overdue",
] as const;

export const INVOICE_SORT_OPTIONS: { value: InvoiceSortBy; label: string }[] = [
  { value: "CREATED_DATE", label: "Created Date" },
  { value: "DUE_DATE", label: "Due Date" },
];

export const DEFAULT_INVOICE_SORT: InvoiceSortBy = "CREATED_DATE";
export const DEFAULT_INVOICE_ORDERING: InvoiceOrdering = "DESCENDING";

export const SKELETON_ROW_COUNT = 5;
