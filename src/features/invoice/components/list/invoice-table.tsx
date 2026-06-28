"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { INVOICE_PAGE_SIZE } from "@/features/invoice/constants";
import { useInvoiceListContext } from "@/features/invoice/context/invoice-list-context";
import { cn } from "@/lib/utils/cn";
import { InvoiceTableRow } from "./invoice-table-row";
import { InvoiceTableSkeleton } from "./invoice-table-skeleton";

const ROW_HEIGHT = 72;

export function InvoiceTable() {
  const { invoices, isPending, filters, totalRecords, handlePageChange } =
    useInvoiceListContext();

  const parentRef = useRef<HTMLDivElement>(null);
  const isRefreshing = isPending;
  const page = filters.page;
  const totalPages = Math.ceil(totalRecords / INVOICE_PAGE_SIZE) || 1;
  const showInitialSkeleton = isRefreshing && invoices.length === 0;

  const virtualizer = useVirtualizer({
    count: invoices.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 5,
  });

  const virtualRows = virtualizer.getVirtualItems();

  return (
    <div
      className={cn(
        "relative rounded-xl border border-border bg-card/20 overflow-hidden",
        isRefreshing && invoices.length > 0 && "opacity-70",
      )}
    >
      {isRefreshing && (
        <div
          className="absolute inset-x-0 top-0 z-10 h-0.5 animate-pulse bg-primary"
          aria-hidden
        />
      )}

      <div
        ref={parentRef}
        className="overflow-x-auto max-h-[650px] overflow-y-auto"
      >
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 z-10 bg-card">
            <tr className="border-b border-border bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground z-10">
              <th className="py-4 px-6">Invoice Number</th>
              <th className="py-4 px-6">Customer</th>
              <th className="py-4 px-6">Invoice Date</th>
              <th className="py-4 px-6">Due Date</th>
              <th className="py-4 px-6 text-right">Amount</th>
              <th className="py-4 px-6 text-center">Status</th>
              <th className="py-4 px-4 text-center w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm text-foreground">
            {showInitialSkeleton ? (
              <InvoiceTableSkeleton />
            ) : invoices.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-12 text-center text-muted-foreground"
                >
                  <svg
                    className="mx-auto h-12 w-12 text-muted mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    role="img"
                    aria-label="No Invoices Icon"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  No invoices found.
                </td>
              </tr>
            ) : (
              <>
                {virtualRows.length > 0 && virtualRows[0].start > 0 && (
                  <tr aria-hidden>
                    <td
                      colSpan={7}
                      style={{
                        height: virtualRows[0].start,
                        padding: 0,
                        border: 0,
                      }}
                    />
                  </tr>
                )}
                {virtualRows.map((virtualRow) => {
                  const invoice = invoices[virtualRow.index];
                  return (
                    <InvoiceTableRow
                      key={invoice.invoiceId}
                      invoice={invoice}
                    />
                  );
                })}
                {virtualRows.length > 0 && (
                  <tr aria-hidden>
                    <td
                      colSpan={7}
                      style={{
                        height:
                          virtualizer.getTotalSize() -
                          (virtualRows[virtualRows.length - 1]?.end ?? 0),
                        padding: 0,
                        border: 0,
                      }}
                    />
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>

      {invoices.length > 0 && (
        <div className="border-t border-border bg-muted/30 px-6 py-4 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {(page - 1) * INVOICE_PAGE_SIZE + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-foreground">
              {Math.min(page * INVOICE_PAGE_SIZE, totalRecords)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">
              {totalRecords}
            </span>{" "}
            records
          </span>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page === 1 || isRefreshing}
              onClick={() => handlePageChange(Math.max(page - 1, 1))}
            >
              Previous
            </Button>
            <span className="text-xs text-muted-foreground px-2">
              Page <span className="font-semibold text-foreground">{page}</span>{" "}
              of{" "}
              <span className="font-semibold text-foreground">
                {totalPages}
              </span>
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page === totalPages || isRefreshing}
              onClick={() => handlePageChange(Math.min(page + 1, totalPages))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
