import { cleanup, type RenderOptions, render } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { afterEach } from "vitest";
import { InvoiceListProvider } from "@/features/invoice/context/invoice-list-context";
import type { Invoice } from "@/features/invoice/types/invoice";
import type { InvoiceListFilters } from "@/features/invoice/utils/query-params";

afterEach(() => cleanup());

export const defaultInvoiceListFilters: InvoiceListFilters = {
  page: 1,
  keyword: "",
  fromDate: "",
  toDate: "",
  status: "All",
  sortBy: "CREATED_DATE",
  ordering: "DESCENDING",
};

interface InvoiceListWrapperProps {
  children: ReactNode;
  filters?: InvoiceListFilters;
  invoices?: Invoice[];
  totalRecords?: number;
  error?: string;
}

function InvoiceListWrapper({
  children,
  filters = defaultInvoiceListFilters,
  invoices = [],
  totalRecords = 0,
  error,
}: InvoiceListWrapperProps) {
  return (
    <InvoiceListProvider
      filters={filters}
      invoices={invoices}
      totalRecords={totalRecords}
      error={error}
    >
      {children}
    </InvoiceListProvider>
  );
}

interface RenderWithInvoiceListOptions extends Omit<RenderOptions, "wrapper"> {
  filters?: InvoiceListFilters;
  invoices?: Invoice[];
  totalRecords?: number;
  error?: string;
}

export function renderWithInvoiceList(
  ui: ReactElement,
  {
    filters,
    invoices,
    totalRecords,
    error,
    ...options
  }: RenderWithInvoiceListOptions = {},
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <InvoiceListWrapper
        filters={filters}
        invoices={invoices}
        totalRecords={totalRecords}
        error={error}
      >
        {children}
      </InvoiceListWrapper>
    ),
    ...options,
  });
}

export * from "@testing-library/react";
