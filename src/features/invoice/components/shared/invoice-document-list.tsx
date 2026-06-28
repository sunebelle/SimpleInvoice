import { parseInvoiceDocuments } from "@/features/invoice/utils/parse-documents";

interface InvoiceDocumentListProps {
  documents: unknown[];
}

export function InvoiceDocumentList({ documents }: InvoiceDocumentListProps) {
  const parsed = parseInvoiceDocuments(documents);

  if (parsed.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No attachments for this invoice.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {parsed.map((doc) => (
        <li
          key={doc.documentId}
          className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card/40 px-4 py-3"
        >
          <span className="text-sm font-medium truncate">
            {doc.documentName}
          </span>
          <a
            href={doc.documentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-primary hover:underline shrink-0"
          >
            Open document
          </a>
        </li>
      ))}
    </ul>
  );
}
