"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { selectFullClassName } from "@/components/ui/select-styles";
import {
  INVOICE_SORT_OPTIONS,
  INVOICE_STATUS_OPTIONS,
} from "@/features/invoice/constants";
import { useInvoiceListContext } from "@/features/invoice/context/invoice-list-context";
import type { InvoiceSortBy } from "@/features/invoice/types/invoice";
import { cn } from "@/lib/utils/cn";

const labelClassName =
  "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2";

interface InvoiceFiltersContentProps {
  onAction?: () => void;
  showTitle?: boolean;
}

export function InvoiceFiltersContent({
  onAction,
  showTitle = true,
}: InvoiceFiltersContentProps) {
  const {
    filters,
    searchInput,
    draftFromDate,
    draftToDate,
    hasActiveFilters,
    hasDraftDateChanges,
    setSearchInput,
    handleSearchSubmit,
    handleResetSearch,
    setDraftFromDate,
    setDraftToDate,
    applyDateRange,
    clearDateFilter,
    handleResetAllFilters,
    handleStatusChange,
    handleSortChange,
    toggleOrdering,
  } = useInvoiceListContext();

  const hasAppliedDates = filters.fromDate !== "" || filters.toDate !== "";

  return (
    <>
      {showTitle && (
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-foreground">Filters</h2>
          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => {
                handleResetAllFilters();
                onAction?.();
              }}
            >
              Reset all
            </Button>
          )}
        </div>
      )}

      {!showTitle && hasActiveFilters && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs w-full"
          onClick={() => {
            handleResetAllFilters();
            onAction?.();
          }}
        >
          Reset all filters
        </Button>
      )}

      <form
        onSubmit={(e) => {
          handleSearchSubmit(e);
          onAction?.();
        }}
        className="space-y-2"
      >
        <label htmlFor="search-invoices" className={labelClassName}>
          Search
        </label>
        <div className="relative">
          <Input
            id="search-invoices"
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Invoice No..."
            className="pl-10"
          />
          <svg
            className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Search Icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <div className="flex gap-2">
          <Button
            type="submit"
            variant="secondary"
            size="sm"
            className="flex-1"
          >
            Search
          </Button>
          {filters.keyword && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                handleResetSearch();
                onAction?.();
              }}
            >
              Clear
            </Button>
          )}
        </div>
      </form>

      <div className="space-y-2">
        <label htmlFor="status-filter" className={labelClassName}>
          Status
        </label>
        <select
          id="status-filter"
          value={filters.status}
          onChange={(e) => {
            handleStatusChange(e.target.value);
            onAction?.();
          }}
          className={selectFullClassName}
        >
          {INVOICE_STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="sort-by" className={labelClassName}>
          Sort by
        </label>
        <select
          id="sort-by"
          value={filters.sortBy}
          onChange={(e) => {
            handleSortChange(e.target.value as InvoiceSortBy);
            onAction?.();
          }}
          className={selectFullClassName}
        >
          {INVOICE_SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full gap-1.5 font-medium"
          onClick={() => {
            toggleOrdering();
            onAction?.();
          }}
        >
          {filters.ordering === "ASCENDING" ? (
            <>
              <span>Ascending</span>
              <svg
                className="h-3.5 w-3.5 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                role="img"
                aria-label="Ascending Arrow"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                />
              </svg>
            </>
          ) : (
            <>
              <span>Descending</span>
              <svg
                className="h-3.5 w-3.5 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                role="img"
                aria-label="Descending Arrow"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
                />
              </svg>
            </>
          )}
        </Button>
      </div>

      <div className="space-y-2 pt-2 border-t border-border/60">
        <span className={labelClassName}>Date range</span>
        <div className="space-y-2">
          <Input
            id="from-date"
            type="date"
            value={draftFromDate}
            onChange={(e) => setDraftFromDate(e.target.value)}
            className="w-full"
            aria-label="From date"
          />
          <Input
            id="to-date"
            type="date"
            value={draftToDate}
            min={draftFromDate || undefined}
            onChange={(e) => setDraftToDate(e.target.value)}
            className="w-full"
            aria-label="To date"
          />
        </div>
        <div className="flex flex-col gap-2">
          {hasDraftDateChanges && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => {
                applyDateRange();
                onAction?.();
              }}
            >
              Apply dates
            </Button>
          )}
          {hasAppliedDates && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => {
                clearDateFilter();
                onAction?.();
              }}
            >
              Clear dates
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

export function InvoiceFilters({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        "rounded-xl border border-border bg-card/40 p-5 space-y-6 lg:sticky lg:top-20 lg:self-start",
        className,
      )}
    >
      <InvoiceFiltersContent />
    </aside>
  );
}
