"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";
import {
  InvoiceListProvider,
  useInvoiceListContext,
} from "@/features/invoice/context/invoice-list-context";
import type { Invoice } from "@/features/invoice/types/invoice";
import type { InvoiceSummaryStats } from "@/features/invoice/types/summary";
import type { InvoiceListFilters } from "@/features/invoice/utils/query-params";
import { InvoiceFiltersResponsive } from "../filters/invoice-filters-responsive";
import { InvoiceSummaryDashboard } from "./invoice-summary-dashboard";
import { InvoiceTable } from "./invoice-table";

interface InvoiceListPageProps {
  invoices: Invoice[];
  totalRecords: number;
  filters: InvoiceListFilters;
  summary?: InvoiceSummaryStats;
  error?: string;
}

function InvoiceListContent({ summary }: { summary?: InvoiceSummaryStats }) {
  const { error } = useInvoiceListContext();

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      <InvoiceFiltersResponsive />

      <div className="flex-1 min-w-0 w-full space-y-6">
        {summary && <InvoiceSummaryDashboard summary={summary} />}

        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        <InvoiceTable />
      </div>
    </div>
  );
}

export function InvoiceListPage({
  invoices,
  totalRecords,
  filters,
  summary,
  error,
}: InvoiceListPageProps) {
  return (
    <InvoiceListProvider
      filters={filters}
      invoices={invoices}
      totalRecords={totalRecords}
      error={error}
    >
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
              Invoices
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {siteConfig.description}
            </p>
          </div>
          <Link
            href="/invoices/create"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4.5 w-4.5 mr-1.5 shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
              role="img"
              aria-label="Add Icon"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Create Invoice
          </Link>
        </div>

        <InvoiceListContent summary={summary} />
      </div>
    </InvoiceListProvider>
  );
}
