"use client";

import { useMediaQuery } from "@/features/invoice/hooks/use-media-query";
import { InvoiceFilters } from "./invoice-filters";
import { InvoiceFiltersDrawer } from "./invoice-filters-drawer";

export function InvoiceFiltersResponsive() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  if (isDesktop === null) {
    return <div className="hidden lg:block w-full lg:w-72 shrink-0" />;
  }

  if (isDesktop) {
    return (
      <div className="w-full lg:w-72 shrink-0">
        <InvoiceFilters />
      </div>
    );
  }

  return <InvoiceFiltersDrawer />;
}
