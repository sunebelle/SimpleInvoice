import { describe, expect, it } from "vitest";
import { mapCreateInvoicePayload } from "./mapper";

describe("mapCreateInvoicePayload", () => {
  const baseForm = {
    invoiceNumber: "INV-123456",
    invoiceReference: "#REF-1234",
    currency: "GBP" as const,
    invoiceDate: "2024-01-15",
    dueDate: "2024-01-22",
    description: "Test invoice",
    customerName: "Nguyen Van A",
    customerEmail: "test@example.com",
    customerMobile: "+84901234567",
    itemName: "Consulting Service",
    quantity: 2,
    rate: 500,
    documents: [],
  };

  it("maps form data to API payload structure", () => {
    const result = mapCreateInvoicePayload(baseForm);

    expect(result.invoices).toHaveLength(1);
    const invoice = result.invoices[0];

    expect(invoice.invoiceNumber).toBe("INV-123456");
    expect(invoice.currency).toBe("GBP");
    expect(invoice.customer.firstName).toBe("Nguyen");
    expect(invoice.customer.lastName).toBe("Van A");
    expect(invoice.customer.contact.email).toBe("test@example.com");
    expect(invoice.bankAccount).toBeDefined();
    expect(invoice.documents).toHaveLength(1);
    expect(invoice.extensions).toHaveLength(2);
    expect(invoice.items[0].itemName).toBe("Consulting Service");
    expect(invoice.items[0].quantity).toBe(2);
    expect(invoice.items[0].rate).toBe(500);
    expect(invoice.items[0].extensions).toHaveLength(2);
  });
});
