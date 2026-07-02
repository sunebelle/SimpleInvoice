"use client";

import { usePathname, useRouter } from "next/navigation";
import type { SubmitEvent } from "react";
import { useCallback, useEffect, useState, useTransition, useRef } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import {
  DEFAULT_INVOICE_ORDERING,
  DEFAULT_INVOICE_SORT,
} from "@/features/invoice/constants";
import type {
  InvoiceOrdering,
  InvoiceSortBy,
} from "@/features/invoice/types/invoice";
import {
  buildInvoiceListQuery,
  type InvoiceListFilters,
} from "@/features/invoice/utils/query-params";

export function useInvoiceListFilters(filters: InvoiceListFilters) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [searchInput, setSearchInput] = useState(filters.keyword);
  const [draftFromDate, setDraftFromDate] = useState(filters.fromDate);
  const [draftToDate, setDraftToDate] = useState(filters.toDate);
  
  const debouncedSearch = useDebounce(searchInput, 500);
  const isInitialMount = useRef(true);

  useEffect(() => {
    setSearchInput(filters.keyword);
    setDraftFromDate(filters.fromDate);
    setDraftToDate(filters.toDate);
  }, [filters.keyword, filters.fromDate, filters.toDate]);

  const navigate = useCallback(
    (next: InvoiceListFilters) => {
      const query = buildInvoiceListQuery(next);
      const href = query ? `${pathname}?${query}` : pathname;

      startTransition(() => {
        router.push(href);
      });
    },
    [pathname, router],
  );

  const patchFilters = useCallback(
    (patch: Partial<InvoiceListFilters>) => {
      navigate({ ...filters, ...patch });
    },
    [filters, navigate],
  );

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    if (debouncedSearch !== filters.keyword) {
      patchFilters({ keyword: debouncedSearch.trim(), page: 1 });
    }
  }, [debouncedSearch, filters.keyword, patchFilters]);

  const handleSearchSubmit = useCallback(
    (e: SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      patchFilters({ keyword: searchInput.trim(), page: 1 });
    },
    [patchFilters, searchInput],
  );

  const handleResetSearch = useCallback(() => {
    setSearchInput("");
    patchFilters({ keyword: "", page: 1 });
  }, [patchFilters]);

  const handleStatusChange = useCallback(
    (status: string) => {
      patchFilters({ status, page: 1 });
    },
    [patchFilters],
  );

  const handleSortChange = useCallback(
    (sortBy: InvoiceSortBy) => {
      patchFilters({ sortBy, page: 1 });
    },
    [patchFilters],
  );

  const toggleOrdering = useCallback(() => {
    const ordering: InvoiceOrdering =
      filters.ordering === "ASCENDING" ? "DESCENDING" : "ASCENDING";
    patchFilters({ ordering, page: 1 });
  }, [filters.ordering, patchFilters]);

  const handlePageChange = useCallback(
    (page: number) => {
      patchFilters({ page });
    },
    [patchFilters],
  );

  const applyDateRange = useCallback(() => {
    patchFilters({
      fromDate: draftFromDate,
      toDate: draftToDate,
      page: 1,
    });
  }, [draftFromDate, draftToDate, patchFilters]);

  const clearDateFilter = useCallback(() => {
    setDraftFromDate("");
    setDraftToDate("");
    patchFilters({ fromDate: "", toDate: "", page: 1 });
  }, [patchFilters]);

  const handleResetAllFilters = useCallback(() => {
    setSearchInput("");
    setDraftFromDate("");
    setDraftToDate("");
    navigate({
      page: 1,
      keyword: "",
      fromDate: "",
      toDate: "",
      status: "All",
      sortBy: DEFAULT_INVOICE_SORT,
      ordering: DEFAULT_INVOICE_ORDERING,
    });
  }, [navigate]);

  const hasActiveFilters =
    filters.keyword !== "" ||
    filters.status !== "All" ||
    filters.fromDate !== "" ||
    filters.toDate !== "";

  const hasDraftDateChanges =
    draftFromDate !== filters.fromDate || draftToDate !== filters.toDate;

  return {
    isPending,
    searchInput,
    draftFromDate,
    draftToDate,
    hasActiveFilters,
    hasDraftDateChanges,
    setSearchInput,
    setDraftFromDate,
    setDraftToDate,
    handleSearchSubmit,
    handleResetSearch,
    handleStatusChange,
    handleSortChange,
    toggleOrdering,
    handlePageChange,
    applyDateRange,
    clearDateFilter,
    handleResetAllFilters,
  };
}
