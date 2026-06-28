import type { ReactNode } from "react";
import { Button } from "./button";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = "OK",
  cancelText = "Cancel",
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card w-full max-w-md rounded-xl shadow-lg border border-border p-6 animate-in fade-in zoom-in duration-200">
        <h2 className="text-xl font-bold mb-2 text-foreground">{title}</h2>
        <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
          {description}
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
