import type { Invoice } from "@/features/invoice/types/invoice";

export function createMockInvoice(overrides: Partial<Invoice> = {}): Invoice {
  return {
    invoiceId: "inv-001",
    invoiceNumber: "INV-1001",
    invoiceReference: "#REF-1001",
    createdAt: "2024-01-01T00:00:00Z",
    createdBy: "user",
    currency: "GBP",
    currencySymbol: "£",
    description: "Consulting services",
    invoiceDate: "2024-01-15",
    dueDate: "2024-01-22",
    invoiceSubTotal: 1000,
    totalDiscount: 0,
    totalTax: 0,
    totalAmount: 1000,
    totalPaid: 0,
    balanceAmount: 1000,
    invoiceGrossTotal: 1000,
    numberOfDocuments: 1,
    customer: {
      firstName: "Nguyen",
      lastName: "Van A",
      contact: { email: "test@example.com" },
    },
    merchant: { name: "Merchant" },
    documents: [
      {
        documentId: "doc-1",
        documentName: "Contract.pdf",
        documentUrl: "https://example.com/contract.pdf",
      },
    ],
    items: [],
    extensions: [],
    payments: [],
    status: [{ key: "Paid", value: true }],
    subStatus: [],
    type: "STANDARD",
    version: "1",
    customFields: [],
    ...overrides,
  };
}
