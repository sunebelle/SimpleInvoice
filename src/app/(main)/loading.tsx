import { InvoiceTableSkeleton } from "@/features/invoice";

export default function MainLoading() {
  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="rounded-xl border border-border bg-card/20 overflow-hidden">
        <table className="w-full">
          <tbody>
            <InvoiceTableSkeleton />
          </tbody>
        </table>
      </div>
    </div>
  );
}
