export const UNSAVED_CHANGES_MESSAGE =
  "Thay đổi chưa được lưu sẽ bị mất. Bạn có chắc muốn rời khỏi trang?";

let isBlocking = false;
let isConfirming = false;
/** Survives React Strict Mode remount — must match real history.pushState count */
let historyTrapDepth = 0;

export function setUnsavedChangesBlocking(block: boolean) {
  isBlocking = block;
}

export function isUnsavedChangesBlocking(): boolean {
  return isBlocking;
}

export function pushUnsavedHistoryTrap(): void {
  window.history.pushState({ unsavedGuard: true }, "", window.location.href);
  historyTrapDepth += 1;
}

export function resetUnsavedHistoryTraps(): void {
  historyTrapDepth = 0;
}

/** After user confirms browser back — leave the guarded page in one step */
export function leavePageViaHistoryBack(): void {
  const traps = historyTrapDepth;
  historyTrapDepth = 0;
  if (traps > 0) {
    // +1: current page entry (user's Back already consumed the top trap)
    window.history.go(-(traps + 1));
  }
}

// ----- Async Custom Modal Confirmation -----

type ConfirmResolver = (confirmed: boolean) => void;
let pendingConfirm: ConfirmResolver | null = null;

export function requestConfirmLeave(): Promise<boolean> {
  return new Promise((resolve) => {
    if (!isBlocking) {
      resolve(true);
      return;
    }
    if (isConfirming) {
      resolve(false);
      return;
    }
    
    isConfirming = true;
    pendingConfirm = resolve;
    
    // Dispatch a custom event to trigger the React modal
    window.dispatchEvent(new CustomEvent("show-unsaved-changes-modal"));
  });
}

export function resolveConfirmLeave(confirmed: boolean) {
  if (pendingConfirm) {
    pendingConfirm(confirmed);
    pendingConfirm = null;
  }
  isConfirming = false;
  if (confirmed) {
    isBlocking = false;
  }
}

// ----- Helpers -----

export function isInternalNavigationLink(anchor: HTMLAnchorElement): boolean {
  if (anchor.target === "_blank") return false;

  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("javascript:")) {
    return false;
  }

  try {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return false;
    if (url.pathname === window.location.pathname) return false;
    return true;
  } catch {
    return false;
  }
}
