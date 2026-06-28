import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  confirmLeave,
  isInternalNavigationLink,
  isUnsavedChangesBlocking,
  leavePageViaHistoryBack,
  pushUnsavedHistoryTrap,
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

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isUnsavedChangesBlocking()) return;
      event.preventDefault();
    };

    const onClickCapture = (event: MouseEvent) => {
      if (!isUnsavedChangesBlocking()) return;

      const anchor = (event.target as Element).closest("a");
      if (!anchor || !isInternalNavigationLink(anchor)) return;

      if (!confirmLeave()) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      resetUnsavedHistoryTraps();
    };

    const onPopState = () => {
      if (!isUnsavedChangesBlocking()) return;

      if (!confirmLeave()) {
        pushUnsavedHistoryTrap();
        return;
      }

      leavePageViaHistoryBack();
      // history.go updates the URL but App Router may not re-render until synced
      queueMicrotask(() => {
        router.replace(
          `${window.location.pathname}${window.location.search}${window.location.hash}`,
        );
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
