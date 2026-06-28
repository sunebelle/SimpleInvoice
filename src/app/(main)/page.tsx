import {
  fetchInvoiceListFromBff,
  fetchInvoiceSummaryFromBff,
  InvoiceListPage,
  parseInvoiceListSearchParams,
} from "@/features/invoice";
import { isRedirectError } from "@/lib/navigation/next-errors";

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const filters = parseInvoiceListSearchParams(await searchParams);

  try {
    const [data, summary] = await Promise.all([
      fetchInvoiceListFromBff(filters),
      fetchInvoiceSummaryFromBff(),
    ]);

    return (
      <InvoiceListPage
        invoices={data.data ?? []}
        totalRecords={data.paging?.totalRecords ?? 0}
        filters={filters}
        summary={summary}
      />
    );
  } catch (error) {
    if (isRedirectError(error)) throw error;

    console.error("Home page invoice fetch failed:", error);

    return (
      <InvoiceListPage
        invoices={[]}
        totalRecords={0}
        filters={filters}
        error={(error as Error).message || "Failed to load invoices."}
      />
    );
  }
}
