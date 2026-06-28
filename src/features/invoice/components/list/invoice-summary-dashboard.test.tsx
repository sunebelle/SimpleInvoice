import { describe, expect, it } from "vitest";
import { render, screen } from "@/test/utils/render";
import { InvoiceSummaryDashboard } from "./invoice-summary-dashboard";

describe("InvoiceSummaryDashboard", () => {
  it("renders summary metrics", () => {
    render(
      <InvoiceSummaryDashboard
        summary={{
          totalInvoices: 12,
          totalRevenue: 45000,
          paidCount: 8,
          unpaidCount: 4,
        }}
      />,
    );

    expect(screen.getByText("Total Invoices")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("Paid")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("Unpaid")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
  });
});
