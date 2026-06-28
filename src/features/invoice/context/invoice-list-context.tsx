"use client";

import { createContext, type ReactNode, useContext } from "react";
import { useInvoiceListFilters } from "@/features/invoice/hooks/use-invoice-list-filters";
import type { Invoice } from "@/features/invoice/types/invoice";
import type { InvoiceListFilters } from "@/features/invoice/utils/query-params";

type InvoiceListContextValue = {
  filters: InvoiceListFilters;
  invoices: Invoice[];
  totalRecords: number;
  error?: string;
} & ReturnType<typeof useInvoiceListFilters>;

const InvoiceListContext = createContext<InvoiceListContextValue | null>(null);

interface InvoiceListProviderProps {
  filters: InvoiceListFilters;
  invoices: Invoice[];
  totalRecords: number;
  error?: string;
  children: ReactNode;
}

export function InvoiceListProvider({
  filters,
  invoices,
  totalRecords,
  error,
  children,
}: InvoiceListProviderProps) {
  const filterState = useInvoiceListFilters(filters);

  return (
    <InvoiceListContext.Provider
      value={{ filters, invoices, totalRecords, error, ...filterState }}
    >
      {children}
    </InvoiceListContext.Provider>
  );
}

export function useInvoiceListContext() {
  const context = useContext(InvoiceListContext);
  if (!context) {
    throw new Error(
      "useInvoiceListContext must be used within InvoiceListProvider",
    );
  }
  return context;
}
