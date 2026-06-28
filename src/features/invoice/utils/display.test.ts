import { describe, expect, it } from "vitest";
import type { Invoice } from "@/features/invoice/types/invoice";
import {
  getActiveInvoiceStatus,
  getInvoiceAmountSubtext,
  getInvoiceDisplayAmount,
  getInvoicePartyName,
  getInvoicePartySubtext,
  getInvoiceReference,
  normalizeInvoiceStatusList,
} from "./display";

describe("invoice display helpers", () => {
  it("prefers party name, then first/last name, then email", () => {
    expect(getInvoicePartyName({ name: "Akila Jayasinghe" })).toBe(
      "Akila Jayasinghe",
    );
    expect(
      getInvoicePartyName({
        firstName: "Nguyen",
        lastName: "Van A",
        contact: { email: "test@example.com" },
      }),
    ).toBe("Nguyen Van A");
    expect(
      getInvoicePartyName({ contact: { email: "test@example.com" } }),
    ).toBe("test@example.com");
  });

  it("returns customer subtext from contact details", () => {
    expect(
      getInvoicePartySubtext({
        firstName: "Nguyen",
        lastName: "Van A",
        contact: { email: "test@example.com" },
      }),
    ).toBe("test@example.com");
  });

  it("normalizes string status arrays", () => {
    expect(normalizeInvoiceStatusList(["Paid"])).toEqual([
      { key: "Paid", value: true },
    ]);
  });

  it("finds active status from key/value pairs", () => {
    expect(
      getActiveInvoiceStatus([
        { key: "Paid", value: false },
        { key: "Overdue", value: true },
      ]),
    ).toBe("Overdue");
  });

  it("hides duplicate invoice reference", () => {
    const invoice = {
      invoiceNumber: "INV-1",
      invoiceReference: "INV-1",
    } as Invoice;

    expect(getInvoiceReference(invoice)).toBeUndefined();
    expect(
      getInvoiceReference({
        ...invoice,
        referenceNo: "#123456",
      }),
    ).toBe("#123456");
  });

  it("uses totalAmount and shows balance subtext when needed", () => {
    const invoice = {
      totalAmount: 1090,
      invoiceGrossTotal: 1000,
      balanceAmount: 500,
      currency: "GBP",
      currencySymbol: "£",
    } as Invoice;

    expect(getInvoiceDisplayAmount(invoice)).toBe(1090);
    expect(getInvoiceAmountSubtext(invoice)).toBe("Balance: £500.00");
  });
});
