/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
/**
 * Shared rules for the one admin dialog docked below a live top bar: the
 * site editor's Site Settings and the dashboard's System Settings.
 *
 * The dialog that is docked follows one contract: `needsLeaveCheck` is
 * true while it holds unsaved changes, and `requestLeave(proceed)` runs
 * `proceed` once the person saves or discards (or right away when nothing
 * is unsaved).
 */

/**
 * Merlin stays live above a docked admin dialog, so a command picked there
 * must not drop unsaved changes or run while the dialog holds its own copy
 * of the data (outline-designer keeps its tree until Save).
 * - Admin commands (`isAdminCommand(path)`) move the dialog to that place;
 *   with unsaved changes the dialog asks first.
 * - Any other command closes the dialog first, asking first when there are
 *   unsaved changes, then runs.
 * Call it from a super-daemon-row-selected listener while docked; it
 * cancels the event when it takes over running the command.
 */
export function handleDockedMerlinRow(e, options) {
  const host = options.host;
  if (!host || host.__dockedMerlinReplaying) {
    return;
  }
  const row = e && e.detail ? e.detail : null;
  if (!row || !row.eventName) {
    return;
  }
  const path = typeof row.path === "string" ? row.path : "";
  const adminCommand = !!options.isAdminCommand(path);
  const dialog = options.dialog;
  const needsCheck = !!(dialog && dialog.isConnected && dialog.needsLeaveCheck);
  if (adminCommand && !needsCheck) {
    return;
  }
  e.preventDefault();
  const eventName = row.eventName;
  const value = row.value;
  const isProgram = eventName === "super-daemon-run-program";
  const run = () => {
    host.__dockedMerlinReplaying = true;
    try {
      host.dispatchEvent(
        new CustomEvent(eventName, {
          composed: true,
          bubbles: true,
          cancelable: true,
          detail: value,
        }),
      );
    } finally {
      host.__dockedMerlinReplaying = false;
    }
    // as a selected row does: a single command closes Merlin, a program
    // keeps it open for its next step
    if (!isProgram) {
      options.closeMerlin();
    }
  };
  if (!needsCheck) {
    options.closeDialog();
    run();
    return;
  }
  // the leave prompt is in the dialog; Merlin gets out of its way
  options.closeMerlin();
  options.guard(() => {
    if (adminCommand) {
      run();
      return;
    }
    options.closeDialog();
    // a program asks its next step in Merlin, which is closed now, so it
    // is picked again rather than run blind
    if (!isProgram) {
      run();
    }
  });
}

/**
 * Ask `dialog` before `proceed` when it holds unsaved changes; otherwise
 * run `proceed` right away.
 */
export function guardDockedAdminLeave(dialog, proceed) {
  if (
    dialog &&
    dialog.isConnected &&
    dialog.needsLeaveCheck &&
    typeof dialog.requestLeave === "function"
  ) {
    dialog.requestLeave(proceed);
    return;
  }
  proceed();
}

/**
 * True while the shared simple-modal is open, docked and holding `dialog`.
 */
export function isDockedAdminOpen(dialog) {
  const modal =
    globalThis.SimpleModal && globalThis.SimpleModal.instance
      ? globalThis.SimpleModal.instance
      : null;
  return !!(
    modal &&
    modal.opened &&
    modal.docked &&
    dialog &&
    dialog.parentNode === modal
  );
}

/**
 * Close the shared modal (the docked dialog).
 */
export function closeDockedAdmin() {
  globalThis.dispatchEvent(
    new CustomEvent("simple-modal-hide", {
      bubbles: true,
      cancelable: true,
      detail: {},
    }),
  );
}
