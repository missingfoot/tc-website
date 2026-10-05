"use client";

import { useEffect, useRef } from "react";

/**
 * Opens and closes a native <dialog> as a modal to match `open`. Attach the returned ref to the
 * dialog; it also takes focus itself, so its first button (e.g. a "?" tooltip) doesn't pop open.
 */
export function useModalDialog(open: boolean) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      dialog.focus();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);
  return ref;
}
