import dynamic from "next/dynamic";
import {
  type CreateInvoiceFormData,
  fetchInvoiceByIdFromBff,
  mapInvoiceToCreateFormData,
} from "@/features/invoice";
import { isRedirectError } from "@/lib/navigation/next-errors";

const CreateInvoiceForm = dynamic(
  () =>
    import("@/features/invoice/components/create/create-invoice-form").then(
      (mod) => mod.CreateInvoiceForm,
    ),
  {
    loading: () => (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-muted-foreground">
        Loading form...
      </div>
    ),
  },
);

type CreateInvoicePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CreateInvoicePage({
  searchParams,
}: CreateInvoicePageProps) {
  const params = await searchParams;
  const duplicateId = Array.isArray(params.duplicate)
    ? params.duplicate[0]
    : params.duplicate;

  let initialValues: CreateInvoiceFormData | undefined;
  let duplicateSourceNumber: string | undefined;

  if (duplicateId) {
    try {
      const source = await fetchInvoiceByIdFromBff(duplicateId);
      initialValues = mapInvoiceToCreateFormData(source);
      duplicateSourceNumber = source.invoiceNumber;
    } catch (error) {
      if (isRedirectError(error)) throw error;
      console.error("Failed to load duplicate source:", error);
    }
  }

  return (
    <CreateInvoiceForm
      initialValues={initialValues}
      duplicateSourceNumber={duplicateSourceNumber}
    />
  );
}
