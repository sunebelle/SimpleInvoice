import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  isInternalNavigationLink,
  isUnsavedChangesBlocking,
  leavePageViaHistoryBack,
  pushUnsavedHistoryTrap,
  requestConfirmLeave,
  resetUnsavedHistoryTraps,
  setUnsavedChangesBlocking,
} from "@/lib/navigation/unsaved-changes";

export function useUnsavedChangesGuard(enabled: boolean) {
  const router = useRouter();

  useEffect(() => {
    setUnsavedChangesBlocking(enabled);
    if (!enabled) {
      resetUnsavedHistoryTraps();
    }
    return () => setUnsavedChangesBlocking(false);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    // For browser reloads/closes, we still have to use the native prompt.
    // The browser requires a synchronous `preventDefault`.
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isUnsavedChangesBlocking()) return;
      event.preventDefault();
    };

    const onClickCapture = (event: MouseEvent) => {
      if (!isUnsavedChangesBlocking()) return;

      const anchor = (event.target as Element).closest("a");
      if (!anchor || !isInternalNavigationLink(anchor)) return;

      event.preventDefault();
      event.stopPropagation();
      const href = anchor.href;

      requestConfirmLeave().then((confirmed) => {
        if (confirmed) {
          resetUnsavedHistoryTraps();
          router.push(href);
        }
      });
    };

    const onPopState = () => {
      if (!isUnsavedChangesBlocking()) return;

      // The popstate already fired, so the URL changed.
      // We must trap it again while we wait for the user to confirm.
      pushUnsavedHistoryTrap();

      requestConfirmLeave().then((confirmed) => {
        if (confirmed) {
          leavePageViaHistoryBack();
          queueMicrotask(() => {
            router.replace(
              `${window.location.pathname}${window.location.search}${window.location.hash}`,
            );
          });
        }
      });
    };

    pushUnsavedHistoryTrap();

    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("click", onClickCapture, true);
    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("click", onClickCapture, true);
      window.removeEventListener("popstate", onPopState);
    };
  }, [enabled, router]);
}
