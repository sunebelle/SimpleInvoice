"use client";

import { useEffect, useState } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { resolveConfirmLeave, UNSAVED_CHANGES_MESSAGE } from "@/lib/navigation/unsaved-changes";

export function UnsavedChangesModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleShowModal = () => {
      setIsOpen(true);
    };

    window.addEventListener("show-unsaved-changes-modal", handleShowModal);

    return () => {
      window.removeEventListener("show-unsaved-changes-modal", handleShowModal);
    };
  }, []);

  const handleConfirm = () => {
    setIsOpen(false);
    resolveConfirmLeave(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
    resolveConfirmLeave(false);
  };

  return (
    <ConfirmDialog
      isOpen={isOpen}
      title="Unsaved Changes"
      description={UNSAVED_CHANGES_MESSAGE}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      confirmText="Leave Page"
      cancelText="Stay"
    />
  );
}
