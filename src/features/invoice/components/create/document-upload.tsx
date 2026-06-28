"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { UploadedDocument } from "@/features/invoice/types/document";

interface DocumentUploadProps {
  documents: UploadedDocument[];
  onChange: (documents: UploadedDocument[]) => void;
  disabled?: boolean;
}

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function DocumentUpload({
  documents,
  onChange,
  disabled,
}: DocumentUploadProps) {
  const [dragOver, setDragOver] = useState(false);

  const addFiles = async (files: FileList | File[]) => {
    const list = Array.from(files);
    const next = [...documents];

    for (const file of list) {
      const documentUrl = await fileToDataUrl(file);
      next.push({
        documentId: crypto.randomUUID(),
        documentName: file.name,
        documentUrl,
        fileSize: file.size,
        mimeType: file.type,
      });
    }

    onChange(next);
  };

  return (
    <div className="space-y-3">
      <section
        aria-label="File upload drop zone"
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (!disabled && e.dataTransfer.files.length) {
            void addFiles(e.dataTransfer.files);
          }
        }}
        className={`rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
          dragOver ? "border-primary bg-primary/5" : "border-border bg-muted/30"
        } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
      >
        <p className="text-sm text-muted-foreground">
          Drag & drop files here, or{" "}
          <label className="text-primary font-semibold cursor-pointer hover:underline">
            browse
            <input
              type="file"
              multiple
              className="sr-only"
              disabled={disabled}
              onChange={(e) => {
                if (e.target.files?.length) void addFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </label>
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          PDF, images, or documents
        </p>
      </section>

      {documents.length > 0 && (
        <ul className="space-y-2">
          {documents.map((doc) => (
            <li
              key={doc.documentId}
              className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card/40 px-3 py-2 text-sm"
            >
              <div className="min-w-0">
                <p className="font-medium truncate">{doc.documentName}</p>
                {doc.fileSize != null && (
                  <p className="text-xs text-muted-foreground">
                    {(doc.fileSize / 1024).toFixed(1)} KB
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={doc.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Preview
                </a>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs text-destructive"
                  disabled={disabled}
                  onClick={() =>
                    onChange(
                      documents.filter((d) => d.documentId !== doc.documentId),
                    )
                  }
                >
                  Remove
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
