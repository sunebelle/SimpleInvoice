import { notFound } from "next/navigation";
import { fetchInvoiceByIdFromBff, InvoiceDetailPage } from "@/features/invoice";
import { isRedirectError } from "@/lib/navigation/next-errors";

type InvoiceDetailRouteProps = {
  params: Promise<{ id: string }>;
};

export default async function InvoiceDetailRoute({
  params,
}: InvoiceDetailRouteProps) {
  const { id } = await params;

  try {
    const invoice = await fetchInvoiceByIdFromBff(id);
    return <InvoiceDetailPage invoice={invoice} />;
  } catch (error) {
    if (isRedirectError(error)) throw error;
    if ((error as Error).message === "Invoice not found") notFound();
    throw error;
  }
}
