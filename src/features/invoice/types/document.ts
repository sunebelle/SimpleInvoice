export interface InvoiceDocument {
  documentId: string;
  documentName: string;
  documentUrl: string;
}

export interface UploadedDocument extends InvoiceDocument {
  fileSize?: number;
  mimeType?: string;
}
