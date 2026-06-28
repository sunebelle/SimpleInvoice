import { describe, expect, it } from "vitest";
import { render, screen } from "@/test/utils/render";
import { InvoiceDocumentList } from "./invoice-document-list";

describe("InvoiceDocumentList", () => {
  it("renders empty state when no documents", () => {
    render(<InvoiceDocumentList documents={[]} />);
    expect(
      screen.getByText("No attachments for this invoice."),
    ).toBeInTheDocument();
  });

  it("renders document links", () => {
    render(
      <InvoiceDocumentList
        documents={[
          {
            documentId: "1",
            documentName: "Invoice.pdf",
            documentUrl: "https://example.com/invoice.pdf",
          },
        ]}
      />,
    );

    const link = screen.getByRole("link", { name: "Open document" });
    expect(link).toHaveAttribute("href", "https://example.com/invoice.pdf");
    expect(screen.getByText("Invoice.pdf")).toBeInTheDocument();
  });
});
