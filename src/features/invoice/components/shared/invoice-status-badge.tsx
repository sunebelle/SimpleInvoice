import type { InvoiceStatus } from "@/features/invoice/types/invoice";
import {
  getActiveInvoiceStatus,
  normalizeInvoiceStatusList,
} from "@/features/invoice/utils/display";

const STATUS_STYLES: Record<string, string> = {
  Draft: "bg-muted text-muted-foreground border-border",
  Sent: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  Paid: "bg-chart-1/10 text-chart-1 border-chart-1/20",
  Due: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  Overdue: "bg-destructive/10 text-destructive border-destructive/20",
  Outstanding: "bg-destructive/10 text-destructive border-destructive/20",
};

interface InvoiceStatusBadgeProps {
  statusList: InvoiceStatus[] | string[];
}

export function InvoiceStatusBadge({ statusList }: InvoiceStatusBadgeProps) {
  const normalized = normalizeInvoiceStatusList(statusList);
  const activeStatus = getActiveInvoiceStatus(normalized);
  const badgeStyle =
    STATUS_STYLES[activeStatus] ??
    "bg-muted text-muted-foreground border-border";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide ${badgeStyle}`}
    >
      {activeStatus}
    </span>
  );
}
