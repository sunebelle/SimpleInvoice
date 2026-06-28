"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { InvoiceDocumentList } from "@/features/invoice/components/shared/invoice-document-list";
import { InvoiceStatusBadge } from "@/features/invoice/components/shared/invoice-status-badge";
import type { Invoice } from "@/features/invoice/types/invoice";
import {
  downloadInvoicePdf,
  printInvoice,
} from "@/features/invoice/utils/client/export-invoice-pdf";
import { formatCurrency } from "@/features/invoice/utils/currency";
import { formatDateOnly } from "@/features/invoice/utils/date";
import {
  getInvoiceAmountSubtext,
  getInvoiceAmountSymbol,
  getInvoiceDisplayAmount,
  getInvoicePartyName,
  getInvoicePartySubtext,
  getInvoiceReference,
} from "@/features/invoice/utils/display";
import { Badge } from "@/components/ui/badge";

interface InvoiceDetailPageProps {
  invoice: Invoice;
}

export function InvoiceDetailPage({ invoice }: InvoiceDetailPageProps) {
  const router = useRouter();
  const customerName = getInvoicePartyName(invoice.customer);
  const customerSubtext = getInvoicePartySubtext(invoice.customer);
  const merchantName = getInvoicePartyName(invoice.merchant);
  const merchantSubtext = getInvoicePartySubtext(invoice.merchant);
  const reference = getInvoiceReference(invoice);
  const amount = getInvoiceDisplayAmount(invoice);
  const symbol = getInvoiceAmountSymbol(invoice);
  const amountSubtext = getInvoiceAmountSubtext(invoice);

  return (
    <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <Link
            href="/"
            className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Invoices
          </Link>
          <h1 className="text-3xl font-extrabold text-foreground mt-2 tracking-tight">
            {invoice.invoiceNumber}
          </h1>
          {reference && (
            <p className="text-sm text-muted-foreground mt-1">
              Ref: {reference}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <InvoiceStatusBadge statusList={invoice.status} />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => downloadInvoicePdf(invoice)}
          >
            Download PDF
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => printInvoice(invoice)}
          >
            Print
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() =>
              router.push(
                `/invoices/create?duplicate=${encodeURIComponent(invoice.invoiceId)}`,
              )
            }
          >
            Duplicate
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <section className="rounded-xl border border-border bg-card/20 p-6 space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Customer
          </h2>
          <p className="text-lg font-semibold">{customerName || "—"}</p>
          {customerSubtext && (
            <p className="text-sm text-muted-foreground">{customerSubtext}</p>
          )}
        </section>

        <section className="rounded-xl border border-border bg-card/20 p-6 space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Merchant
          </h2>
          <p className="text-lg font-semibold">{merchantName || "—"}</p>
          {merchantSubtext && (
            <p className="text-sm text-muted-foreground">{merchantSubtext}</p>
          )}
        </section>

        <section className="rounded-xl border border-border bg-card/20 p-6 space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Dates
          </h2>
          <p className="text-sm">
            <span className="text-muted-foreground">Invoice: </span>
            {formatDateOnly(invoice.invoiceDate)}
          </p>
          <p className="text-sm">
            <span className="text-muted-foreground">Due: </span>
            {formatDateOnly(invoice.dueDate)}
          </p>
        </section>

        <section className="rounded-xl border border-border bg-card/20 p-6 space-y-2 lg:col-span-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Description
          </h2>
          <p className="text-sm text-foreground">
            {invoice.description?.trim() || "—"}
          </p>
        </section>
      </div>

      <section className="rounded-xl border border-border bg-card/20 p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Financial Summary
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Subtotal</p>
            <p className="font-semibold">{formatCurrency(invoice.invoiceSubTotal, symbol)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Tax</p>
            <p className="font-semibold">{formatCurrency(invoice.totalTax, symbol)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Discount</p>
            <p className="font-semibold text-red-500">{formatCurrency(invoice.totalDiscount, symbol)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Total</p>
            <p className="font-bold">{formatCurrency(invoice.totalAmount, symbol)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Paid</p>
            <p className="font-semibold text-green-500">{formatCurrency(invoice.totalPaid, symbol)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Balance</p>
            <p className="font-bold text-primary">{formatCurrency(invoice.balanceAmount, symbol)}</p>
          </div>
        </div>
      </section>

      {invoice.customFields && invoice.customFields.length > 0 && (
        <section className="rounded-xl border border-border bg-card/20 p-6 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Custom Fields
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {invoice.customFields.map((field, idx) => (
              <div key={idx} className="space-y-1">
                <p className="text-xs text-muted-foreground">{field.key}</p>
                <p className="text-sm font-medium">{field.value}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {invoice.items && invoice.items.length > 0 && (
        <section className="rounded-xl border border-border bg-card/20 p-6 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            Line Items <Badge variant="secondary" className="text-xs">{invoice.items.length}</Badge>
          </h2>
          <div className="text-sm text-muted-foreground italic">
            (Items data available)
          </div>
        </section>
      )}

      {invoice.payments && invoice.payments.length > 0 && (
        <section className="rounded-xl border border-border bg-card/20 p-6 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            Payments <Badge variant="secondary" className="text-xs">{invoice.payments.length}</Badge>
          </h2>
          <div className="text-sm text-muted-foreground italic">
            (Payments data available)
          </div>
        </section>
      )}

      <section className="rounded-xl border border-border bg-card/20 p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Attachments
        </h2>
        <InvoiceDocumentList documents={invoice.documents} />
      </section>
    </div>
  );
}
