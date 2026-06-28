"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { useInvoiceListContext } from "@/features/invoice/context/invoice-list-context";
import { cn } from "@/lib/utils/cn";
import { InvoiceFiltersContent } from "./invoice-filters";

export function InvoiceFiltersDrawer() {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const { hasActiveFilters } = useInvoiceListContext();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  return (
    <div className="lg:hidden">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-2"
        aria-label="Filters"
        aria-expanded={open}
        aria-controls="invoice-filters-drawer"
        onClick={() => setOpen(true)}
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <title>Filter icon</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011.293-.707L9 9.414V18a1 1 0 01-.553.894l-2 1A1 1 0 016 19v-6.586L2.293 6.707A1 1 0 013 6h18z"
          />
        </svg>
        Filters
        {hasActiveFilters && (
          <span className="inline-flex h-2 w-2 rounded-full bg-primary" />
        )}
      </Button>

      {open && (
        <div className="fixed inset-0 z-50" aria-hidden={false}>
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Dismiss filters overlay"
            tabIndex={open ? 0 : -1}
            onClick={close}
          />

          <aside
            id="invoice-filters-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={cn(
              "absolute inset-y-0 left-0 flex w-[min(100%,20rem)] flex-col border-r border-sidebar-border bg-sidebar shadow-xl transition-transform duration-300 ease-out translate-x-0",
            )}
          >
            <div className="flex items-center justify-between border-b border-sidebar-border px-4 py-3">
              <h2
                id={titleId}
                className="text-sm font-bold text-sidebar-foreground"
              >
                Filters
              </h2>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                aria-label="Close filters"
                onClick={close}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  role="img"
                  aria-label="Close"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              <InvoiceFiltersContent showTitle={false} onAction={close} />
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
