import { describe, expect, it } from "vitest";
import { fireEvent, renderWithInvoiceList, screen } from "@/test/utils/render";
import { InvoiceFiltersDrawer } from "./invoice-filters-drawer";

describe("InvoiceFiltersDrawer", () => {
  it("opens drawer when Filters button clicked", () => {
    renderWithInvoiceList(<InvoiceFiltersDrawer />);

    fireEvent.click(screen.getByRole("button", { name: "Filters" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByLabelText("Search")).toBeInTheDocument();
  });

  it("closes drawer when close button clicked", () => {
    renderWithInvoiceList(<InvoiceFiltersDrawer />);

    fireEvent.click(screen.getByRole("button", { name: "Filters" }));
    fireEvent.click(screen.getByRole("button", { name: "Close filters" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
