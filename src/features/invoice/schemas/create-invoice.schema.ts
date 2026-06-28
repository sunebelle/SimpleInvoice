import { z } from "zod";
import { addDaysISO, todayISO } from "@/features/invoice/utils/date";

export const CURRENCY_OPTIONS = ["GBP", "USD", "EUR", "VND"] as const;

const invoiceDocumentSchema = z.object({
  documentId: z.string(),
  documentName: z.string(),
  documentUrl: z.string(),
});

export const createInvoiceSchema = z.object({
  invoiceNumber: z.string().trim().min(1, "Invoice Number is required."),
  invoiceReference: z.string().trim(),
  currency: z.enum(CURRENCY_OPTIONS),
  invoiceDate: z.string().min(1, "Invoice Date is required."),
  dueDate: z.string().min(1, "Due Date is required."),
  description: z.string(),
  customerName: z.string().trim().min(1, "Customer Name is required."),
  customerEmail: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .pipe(z.email("Please enter a valid Customer Email.")),
  customerMobile: z.string(),
  itemName: z.string().trim().min(1, "Item Name is required."),
  quantity: z
    .number({ error: "Quantity must be a number." })
    .min(1, "Quantity must be greater than 0."),
  rate: z
    .number({ error: "Rate must be a number." })
    .min(0, "Rate cannot be negative."),
  documents: z.array(invoiceDocumentSchema),
});

export type CreateInvoiceFormData = z.infer<typeof createInvoiceSchema>;

export function getCreateInvoiceDefaultValues(): CreateInvoiceFormData {
  return {
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    invoiceReference: `#REF-${Date.now().toString().slice(-4)}`,
    currency: "GBP",
    invoiceDate: todayISO(),
    dueDate: addDaysISO(7),
    description: "",
    customerName: "",
    customerEmail: "",
    customerMobile: "",
    itemName: "",
    quantity: 1,
    rate: 0,
    documents: [],
  };
}
