import Link from "next/link";
import { memo } from "react";
import type { Invoice } from "@/features/invoice/types/invoice";
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
import { InvoiceStatusBadge } from "../shared/invoice-status-badge";

interface InvoiceTableRowProps {
  invoice: Invoice;
}

function InvoiceTableRowComponent({ invoice }: InvoiceTableRowProps) {
  const customerName = getInvoicePartyName(invoice.customer);
  const customerSubtext = getInvoicePartySubtext(invoice.customer);
  const reference = getInvoiceReference(invoice);
  const amountSymbol = getInvoiceAmountSymbol(invoice);
  const amount = getInvoiceDisplayAmount(invoice);
  const amountSubtext = getInvoiceAmountSubtext(invoice);

  return (
    <tr className="hover:bg-accent/40 transition-colors">
      <td className="py-4.5 px-6 font-medium text-card-foreground">
        <div>{invoice.invoiceNumber}</div>
        {reference && (
          <div className="text-xs text-muted-foreground mt-0.5">
            Ref: {reference}
          </div>
        )}
        {invoice.description?.trim() && (
          <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
            {invoice.description.trim()}
          </div>
        )}
      </td>
      <td className="py-4.5 px-6">
        <div className="font-medium text-foreground">{customerName}</div>
        {customerSubtext && (
          <div className="text-xs text-muted-foreground mt-0.5">
            {customerSubtext}
          </div>
        )}
      </td>
      <td className="py-4.5 px-6 text-muted-foreground">
        {formatDateOnly(invoice.invoiceDate)}
      </td>
      <td className="py-4.5 px-6 text-muted-foreground">
        {formatDateOnly(invoice.dueDate)}
      </td>
      <td className="py-4.5 px-6 text-right font-semibold text-card-foreground">
        <div>{formatCurrency(amount, amountSymbol)}</div>
        {amountSubtext && (
          <div className="text-xs font-normal text-muted-foreground mt-0.5">
            {amountSubtext}
          </div>
        )}
      </td>
      <td className="py-4.5 px-6 text-center">
        <InvoiceStatusBadge statusList={invoice.status} />
      </td>
      <td className="py-4.5 px-4 text-center">
        <div className="inline-flex items-center gap-1">
          <Link
            href={`/invoices/${encodeURIComponent(invoice.invoiceId)}`}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-primary transition-colors"
            title="View invoice"
            aria-label={`View invoice ${invoice.invoiceNumber}`}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              role="img"
              aria-label="View"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </Link>
          <Link
            href={`/invoices/create?duplicate=${encodeURIComponent(invoice.invoiceId)}`}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-primary transition-colors"
            title="Duplicate invoice"
            aria-label={`Duplicate invoice ${invoice.invoiceNumber}`}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              role="img"
              aria-label="Duplicate"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </Link>
        </div>
      </td>
    </tr>
  );
}

export const InvoiceTableRow = memo(InvoiceTableRowComponent);
