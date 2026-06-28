import type { InvoiceDocument } from "@/features/invoice/types/document";

export function parseInvoiceDocuments(documents: unknown[]): InvoiceDocument[] {
  return documents
    .map((doc) => {
      if (!doc || typeof doc !== "object") return null;
      const record = doc as Record<string, unknown>;
      const documentId = String(record.documentId ?? "");
      const documentName = String(record.documentName ?? "Document");
      const documentUrl = String(record.documentUrl ?? "");
      if (!documentUrl) return null;
      return { documentId, documentName, documentUrl };
    })
    .filter((doc): doc is InvoiceDocument => doc !== null);
}
