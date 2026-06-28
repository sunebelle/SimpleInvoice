"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { type Control, Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { Input, Textarea } from "@/components/ui/input";
import { selectFullClassName } from "@/components/ui/select-styles";
import { SESSION_EXPIRED_REASON } from "@/features/auth/constants/session";
import { DocumentUpload } from "@/features/invoice/components/create/document-upload";
import { useUnsavedChangesGuard } from "@/features/invoice/hooks/use-unsaved-changes-guard";
import {
  type CreateInvoiceFormData,
  CURRENCY_OPTIONS,
  createInvoiceSchema,
  getCreateInvoiceDefaultValues,
} from "@/features/invoice/schemas/create-invoice.schema";
import { getCurrencySymbol } from "@/features/invoice/utils/currency";

const labelClassName =
  "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2";

const sectionClassName =
  "rounded-xl border border-border bg-card/20 p-6 backdrop-blur-sm";

const sectionTitleClassName =
  "text-lg font-bold text-card-foreground mb-4 flex items-center gap-2";

function InvoiceTotalAmount({
  control,
}: {
  control: Control<CreateInvoiceFormData>;
}) {
  const [quantity, rate, currency] = useWatch({
    control,
    name: ["quantity", "rate", "currency"],
  });
  const totalAmount = (quantity ?? 0) * (rate ?? 0);

  return (
    <div>
      <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
        Total Amount
      </span>
      <div className="w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-foreground font-bold text-lg flex items-center justify-end">
        {getCurrencySymbol(currency ?? "GBP")}
        {totalAmount.toLocaleString("en-US", {
          minimumFractionDigits: 2,
        })}
      </div>
    </div>
  );
}

interface CreateInvoiceFormProps {
  initialValues?: CreateInvoiceFormData;
  duplicateSourceNumber?: string;
}

export function CreateInvoiceForm({
  initialValues,
  duplicateSourceNumber,
}: CreateInvoiceFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<CreateInvoiceFormData>({
    mode: "onChange",
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: initialValues ?? getCreateInvoiceDefaultValues(),
  });

  useUnsavedChangesGuard(
    (isDirty || Boolean(duplicateSourceNumber)) && !success && !isSubmitting,
  );

  const onSubmit = async (data: CreateInvoiceFormData) => {
    setServerError("");
    setSuccess(false);
    
    const toastId = toast.loading("Creating invoice...");

    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.status === 401 && result.code === "SESSION_EXPIRED") {
        toast.dismiss(toastId);
        router.push(`/login?reason=${SESSION_EXPIRED_REASON}`);
        return;
      }

      if (!res.ok) {
        throw new Error(result.error || "Failed to create invoice");
      }

      setSuccess(true);
      toast.success("Invoice has been created successfully!", { id: toastId });
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1500);
    } catch (err) {
      console.error(err);
      const errorMessage = (err as Error).message || "An error occurred while creating the invoice.";
      setServerError(errorMessage);
      toast.error(errorMessage, { id: toastId });
    }
  };

  return (
    <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to Invoices
        </Link>
        <h1 className="text-3xl font-extrabold text-foreground mt-2 tracking-tight">
          {duplicateSourceNumber ? "Duplicate Invoice" : "Create Invoice"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {duplicateSourceNumber
            ? `Cloned from ${duplicateSourceNumber} — review and edit before saving`
            : "Issue a new invoice to a customer"}
        </p>
      </div>

      {duplicateSourceNumber && (
        <div className="mb-6 rounded-lg bg-chart-2/10 border border-chart-2/30 p-4 text-sm text-chart-2">
          Duplicating invoice <strong>{duplicateSourceNumber}</strong>. Invoice
          number and dates have been updated automatically.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <section className={sectionClassName}>
          <h2 className={sectionTitleClassName}>
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Invoice Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="inv-number" className={labelClassName}>
                Invoice Number *
              </label>
              <Input
                id="inv-number"
                type="text"
                disabled={isSubmitting || success}
                {...register("invoiceNumber")}
              />
              <FieldError message={errors.invoiceNumber?.message} />
            </div>
            <div>
              <label htmlFor="inv-reference" className={labelClassName}>
                Invoice Reference
              </label>
              <Input
                id="inv-reference"
                type="text"
                disabled={isSubmitting || success}
                {...register("invoiceReference")}
              />
            </div>
            <div>
              <label htmlFor="inv-date" className={labelClassName}>
                Invoice Date *
              </label>
              <Input
                id="inv-date"
                type="date"
                disabled={isSubmitting || success}
                {...register("invoiceDate")}
              />
              <FieldError message={errors.invoiceDate?.message} />
            </div>
            <div>
              <label htmlFor="due-date" className={labelClassName}>
                Due Date *
              </label>
              <Input
                id="due-date"
                type="date"
                disabled={isSubmitting || success}
                {...register("dueDate")}
              />
              <FieldError message={errors.dueDate?.message} />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="inv-currency" className={labelClassName}>
                Currency
              </label>
              <select
                id="inv-currency"
                disabled={isSubmitting || success}
                className={selectFullClassName}
                {...register("currency")}
              >
                {CURRENCY_OPTIONS.map((code) => (
                  <option key={code} value={code}>
                    {code} ({getCurrencySymbol(code)})
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="inv-description" className={labelClassName}>
                Description / Memo
              </label>
              <Textarea
                id="inv-description"
                rows={2}
                disabled={isSubmitting || success}
                {...register("description")}
              />
            </div>
          </div>
        </section>

        <section className={sectionClassName}>
          <h2 className={sectionTitleClassName}>
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Customer Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label htmlFor="customer-name" className={labelClassName}>
                Customer Full Name *
              </label>
              <Input
                id="customer-name"
                type="text"
                disabled={isSubmitting || success}
                {...register("customerName")}
              />
              <FieldError message={errors.customerName?.message} />
            </div>
            <div>
              <label htmlFor="customer-email" className={labelClassName}>
                Email Address *
              </label>
              <Input
                id="customer-email"
                type="email"
                disabled={isSubmitting || success}
                {...register("customerEmail")}
              />
              <FieldError message={errors.customerEmail?.message} />
            </div>
            <div>
              <label htmlFor="customer-mobile" className={labelClassName}>
                Mobile Number
              </label>
              <Input
                id="customer-mobile"
                type="text"
                disabled={isSubmitting || success}
                {...register("customerMobile")}
              />
            </div>
          </div>
        </section>

        <section className={sectionClassName}>
          <h2 className={sectionTitleClassName}>
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Service / Item Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-3">
              <label htmlFor="item-name" className={labelClassName}>
                Item Name *
              </label>
              <Input
                id="item-name"
                type="text"
                disabled={isSubmitting || success}
                {...register("itemName")}
              />
              <FieldError message={errors.itemName?.message} />
            </div>
            <div>
              <label htmlFor="item-quantity" className={labelClassName}>
                Quantity *
              </label>
              <Input
                id="item-quantity"
                type="number"
                min={1}
                disabled={isSubmitting || success}
                {...register("quantity", { valueAsNumber: true })}
              />
              <FieldError message={errors.quantity?.message} />
            </div>
            <div>
              <label htmlFor="item-rate" className={labelClassName}>
                Rate *
              </label>
              <Input
                id="item-rate"
                type="number"
                min={0}
                step="0.01"
                disabled={isSubmitting || success}
                {...register("rate", { valueAsNumber: true })}
              />
              <FieldError message={errors.rate?.message} />
            </div>
            <InvoiceTotalAmount control={control} />
          </div>
        </section>

        {/* <section className={sectionClassName}>
          <h2 className={sectionTitleClassName}>
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Attachments
          </h2>
          <Controller
            control={control}
            name="documents"
            render={({ field }) => (
              <DocumentUpload
                documents={field.value ?? []}
                onChange={field.onChange}
                disabled={isSubmitting || success}
              />
            )}
          />
        </section> */}

        <div className="flex items-center justify-end gap-4 border-t border-border pt-6">
          <Link
            href="/"
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Cancel
          </Link>
          <Button
            type="submit"
            className="px-6 py-2.5"
            disabled={isSubmitting || success || !isValid}
          >
            {isSubmitting ? "Creating..." : "Create Invoice"}
          </Button>
        </div>
      </form>
    </div>
  );
}
