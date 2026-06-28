"use client";

import type { InvoiceSummaryStats } from "@/features/invoice/types/summary";
import { formatCurrency } from "@/features/invoice/utils/currency";

interface InvoiceSummaryDashboardProps {
  summary: InvoiceSummaryStats;
}

function SummaryCard({
  label,
  value,
  subtext,
  accent,
}: {
  label: string;
  value: string;
  subtext?: string;
  accent?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card/40 p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p
        className={`mt-2 text-2xl font-extrabold ${accent ?? "text-foreground"}`}
      >
        {value}
      </p>
      {subtext && (
        <p className="mt-1 text-xs text-muted-foreground">{subtext}</p>
      )}
    </div>
  );
}

export function InvoiceSummaryDashboard({
  summary,
}: InvoiceSummaryDashboardProps) {
  const paidPct =
    summary.totalInvoices > 0
      ? Math.round((summary.paidCount / summary.totalInvoices) * 100)
      : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <SummaryCard
        label="Total Invoices"
        value={summary.totalInvoices.toLocaleString()}
      />
      <SummaryCard
        label="Total Revenue"
        value={formatCurrency(summary.totalRevenue, "£")}
        subtext="Sum of invoice amounts"
      />
      <SummaryCard
        label="Paid"
        value={summary.paidCount.toLocaleString()}
        subtext={`${paidPct}% of total`}
        accent="text-chart-1"
      />
      <SummaryCard
        label="Unpaid"
        value={summary.unpaidCount.toLocaleString()}
        subtext="Due, overdue, draft, sent"
        accent="text-chart-2"
      />
    </div>
  );
}
