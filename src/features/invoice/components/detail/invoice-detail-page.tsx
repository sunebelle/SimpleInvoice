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

interface InvoiceDetailPageProps {
  invoice: Invoice;
}

export function InvoiceDetailPage({ invoice }: InvoiceDetailPageProps) {
  const router = useRouter();
  const customerName = getInvoicePartyName(invoice.customer);
  const customerSubtext = getInvoicePartySubtext(invoice.customer);
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="rounded-xl border border-border bg-card/20 p-6 space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Customer
          </h2>
          <p className="text-lg font-semibold">{customerName}</p>
          {customerSubtext && (
            <p className="text-sm text-muted-foreground">{customerSubtext}</p>
          )}
        </section>

        <section className="rounded-xl border border-border bg-card/20 p-6 space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Amount
          </h2>
          <p className="text-2xl font-extrabold">
            {formatCurrency(amount, symbol)}
          </p>
          {amountSubtext && (
            <p className="text-sm text-muted-foreground">{amountSubtext}</p>
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

        <section className="rounded-xl border border-border bg-card/20 p-6 space-y-2">
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
          Attachments
        </h2>
        <InvoiceDocumentList documents={invoice.documents} />
      </section>
    </div>
  );
}
