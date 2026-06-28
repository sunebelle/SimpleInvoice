import { SKELETON_ROW_COUNT } from "@/features/invoice/constants";

export function InvoiceTableSkeleton() {
  return (
    <>
      {Array.from({ length: SKELETON_ROW_COUNT }, (_, i) => (
        <tr key={`skeleton-${i + 1}`} className="animate-pulse">
          <td className="py-5 px-6">
            <div className="h-4 w-28 rounded bg-muted" />
            <div className="h-3 w-16 rounded bg-muted/60 mt-1.5" />
          </td>
          <td className="py-5 px-6">
            <div className="h-4 w-32 rounded bg-muted" />
            <div className="h-3 w-40 rounded bg-muted/60 mt-1.5" />
          </td>
          <td className="py-5 px-6">
            <div className="h-4 w-24 rounded bg-muted" />
          </td>
          <td className="py-5 px-6">
            <div className="h-4 w-24 rounded bg-muted" />
          </td>
          <td className="py-5 px-6 text-right">
            <div className="h-4 w-20 rounded bg-muted ml-auto" />
          </td>
          <td className="py-5 px-6 text-center">
            <div className="h-6 w-16 rounded-full bg-muted mx-auto" />
          </td>
          <td className="py-5 px-4 text-center">
            <div className="h-8 w-16 rounded bg-muted mx-auto" />
          </td>
        </tr>
      ))}
    </>
  );
}
