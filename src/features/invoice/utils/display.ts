import type {
  Invoice,
  InvoiceParty,
  InvoiceStatus,
} from "@/features/invoice/types/invoice";
import { getCurrencySymbol } from "@/features/invoice/utils/currency";

export function getInvoicePartyName(party?: InvoiceParty | null): string {
  if (!party) return "N/A";

  const name = party.name?.trim();
  if (name) return name;

  const fullName = [party.firstName, party.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  if (fullName) return fullName;

  return party.contact?.email?.trim() || "N/A";
}

export function getInvoicePartySubtext(
  party?: InvoiceParty | null,
): string | undefined {
  if (!party) return undefined;

  const primary = getInvoicePartyName(party);
  const email = party.contact?.email?.trim();
  if (email && email !== primary) return email;

  const mobile = party.contact?.mobileNumber?.trim();
  if (mobile && mobile !== primary) return mobile;

  return undefined;
}

export function normalizeInvoiceStatusList(
  statusList?: InvoiceStatus[] | string[],
): InvoiceStatus[] {
  if (!statusList?.length) return [];

  if (typeof statusList[0] === "string") {
    return (statusList as string[]).map((key) => ({ key, value: true }));
  }

  return statusList as InvoiceStatus[];
}

export function getActiveInvoiceStatus(
  statusList?: InvoiceStatus[] | string[],
): string {
  const normalized = normalizeInvoiceStatusList(statusList);
  const active = normalized.find((status) => status.value);

  return active?.key ?? normalized[0]?.key ?? "Unknown";
}

export function getInvoiceReference(invoice: Invoice): string | undefined {
  const candidates = [
    invoice.invoiceReference?.trim(),
    invoice.referenceNo?.trim(),
  ].filter(Boolean) as string[];

  const reference = candidates.find((value) => value !== invoice.invoiceNumber);

  return reference;
}

export function getInvoiceAmountSymbol(invoice: Invoice): string {
  return invoice.currencySymbol?.trim() || getCurrencySymbol(invoice.currency);
}

export function getInvoiceDisplayAmount(invoice: Invoice): number {
  return invoice.totalAmount ?? invoice.invoiceGrossTotal ?? 0;
}

export function getInvoiceAmountSubtext(invoice: Invoice): string | undefined {
  const symbol = getInvoiceAmountSymbol(invoice);
  const total = getInvoiceDisplayAmount(invoice);

  if (invoice.balanceAmount > 0 && invoice.balanceAmount !== total) {
    return `Balance: ${symbol}${invoice.balanceAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
  }

  return invoice.currency;
}
