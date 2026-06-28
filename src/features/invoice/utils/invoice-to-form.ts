import type {
  CreateInvoiceFormData,
  CURRENCY_OPTIONS,
} from "@/features/invoice/schemas/create-invoice.schema";
import type { Invoice } from "@/features/invoice/types/invoice";
import { addDaysISO, todayISO } from "@/features/invoice/utils/date";
import { getInvoicePartyName } from "@/features/invoice/utils/display";

type CurrencyCode = (typeof CURRENCY_OPTIONS)[number];

function parseCurrency(value: string): CurrencyCode {
  const codes: CurrencyCode[] = ["GBP", "USD", "EUR", "VND"];
  return codes.includes(value as CurrencyCode)
    ? (value as CurrencyCode)
    : "GBP";
}

function getFirstItem(invoice: Invoice) {
  const items = invoice.items as Array<{
    itemName?: string;
    description?: string;
    quantity?: number;
    rate?: number;
  }>;
  return items?.[0];
}

/** Maps an existing invoice into create-form defaults for duplicate flow. */
export function mapInvoiceToCreateFormData(
  invoice: Invoice,
): CreateInvoiceFormData {
  const item = getFirstItem(invoice);
  const suffix = Date.now().toString().slice(-6);

  return {
    invoiceNumber: `${invoice.invoiceNumber}-COPY-${suffix}`,
    invoiceReference: invoice.invoiceReference
      ? `${invoice.invoiceReference}-COPY`
      : `#REF-COPY-${suffix}`,
    currency: parseCurrency(invoice.currency),
    invoiceDate: todayISO(),
    dueDate: addDaysISO(7),
    description: invoice.description?.trim() ?? "",
    customerName: getInvoicePartyName(invoice.customer),
    customerEmail: invoice.customer?.contact?.email?.trim() ?? "",
    customerMobile: invoice.customer?.contact?.mobileNumber?.trim() ?? "",
    itemName: item?.itemName || item?.description || "",
    quantity: Number(item?.quantity) > 0 ? Number(item?.quantity) : 1,
    rate: Number(item?.rate) >= 0 ? Number(item?.rate) : 0,
    documents: [],
  };
}
