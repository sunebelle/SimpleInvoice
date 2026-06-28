import { describe, expect, it } from "vitest";
import { createMockInvoice } from "@/test/utils/fixtures";
import { render, screen } from "@/test/utils/render";
import { InvoiceTableRow } from "./invoice-table-row";

describe("InvoiceTableRow", () => {
  it("renders invoice number, customer and status", () => {
    const invoice = createMockInvoice();

    render(
      <table>
        <tbody>
          <InvoiceTableRow invoice={invoice} />
        </tbody>
      </table>,
    );

    expect(screen.getByText("INV-1001")).toBeInTheDocument();
    expect(screen.getByText("Nguyen Van A")).toBeInTheDocument();
    expect(screen.getByText("Paid")).toBeInTheDocument();
  });

  it("links to invoice detail and duplicate routes", () => {
    const invoice = createMockInvoice({ invoiceId: "abc-123" });

    render(
      <table>
        <tbody>
          <InvoiceTableRow invoice={invoice} />
        </tbody>
      </table>,
    );

    expect(screen.getByRole("link", { name: /view invoice/i })).toHaveAttribute(
      "href",
      "/invoices/abc-123",
    );
    expect(
      screen.getByRole("link", { name: /duplicate invoice/i }),
    ).toHaveAttribute("href", "/invoices/create?duplicate=abc-123");
  });
});
