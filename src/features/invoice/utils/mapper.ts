import type { CreateInvoiceFormData } from "@/features/invoice/schemas/create-invoice.schema";
import { addDaysISO, todayISO } from "@/features/invoice/utils/date";

export function mapCreateInvoicePayload(body: CreateInvoiceFormData) {
  const firstName = body.customerName.split(" ")[0] || "Customer";
  const lastName = body.customerName.split(" ").slice(1).join(" ") || "Name";

  return {
    invoices: [
      {
        bankAccount: {
          bankId: "",
          sortCode: "09-01-01",
          accountNumber: "12345678",
          accountName: "John Terry",
        },
        customer: {
          firstName,
          lastName,
          contact: {
            email: body.customerEmail,
            mobileNumber: body.customerMobile || "+8499999999",
          },
          addresses: [
            {
              premise: "CT11",
              countryCode: "VN",
              postcode: "1000",
              county: "hoangmai",
              city: "hanoi",
              addressType: "BILLING",
            },
          ],
        },
        documents:
          body.documents.length > 0
            ? body.documents.map((doc) => ({
                documentId: doc.documentId,
                documentName: doc.documentName,
                documentUrl: doc.documentUrl,
              }))
            : [
                {
                  documentId: "96ea7d60-89ed-4c3b-811c-d2c61f5feab2",
                  documentName: "Bill",
                  documentUrl: "http://url.com/#123",
                },
              ],
        invoiceNumber: body.invoiceNumber,
        invoiceReference: body.invoiceReference || `#REF-${Date.now()}`,
        currency: body.currency || "GBP",
        invoiceDate: body.invoiceDate || todayISO(),
        dueDate: body.dueDate || addDaysISO(7),
        description: body.description || "Invoice created from Web App",
        customFields: [
          {
            key: "invoiceCustomField",
            value: "value",
          },
        ],
        extensions: [
          {
            addDeduct: "ADD",
            value: 10,
            type: "PERCENTAGE",
            name: "tax",
          },
          {
            addDeduct: "DEDUCT",
            type: "FIXED_VALUE",
            value: 10.0,
            name: "discount",
          },
        ],
        items: [
          {
            itemReference: "itemRef",
            description: body.itemName,
            quantity: Number(body.quantity),
            rate: Number(body.rate),
            itemName: body.itemName,
            itemUOM: "KG",
            customFields: [
              {
                key: "taxiationAndDiscounts_Name",
                value: "VAT",
              },
            ],
            extensions: [
              {
                addDeduct: "ADD",
                value: 10,
                type: "FIXED_VALUE",
                name: "tax",
              },
              {
                addDeduct: "DEDUCT",
                value: 10,
                type: "PERCENTAGE",
                name: "tax",
              },
            ],
          },
        ],
      },
    ],
  };
}
