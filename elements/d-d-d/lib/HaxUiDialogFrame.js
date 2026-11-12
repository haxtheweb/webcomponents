/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * HAX UI dialog frame: the one look for every HAX modal (site admin, system
 * settings, Merlin, the editor's dialogs, the image pop up). A 48px dark
 * titlebar with a 16px bold title and a 32px close button, on a white /
 * coalyGray surface with 8px corners, light and dark. See
 * design-system/source/hax-ui-admin.md, "Dialog frame".
 *
 * Two forms, for the two ways HAX opens a modal:
 *
 * - simple-modal: spread a style map into the simple-modal-show detail,
 *     styles: { ...HaxUiDialogFrame, "--simple-modal-width": "420px" }
 *   or, for a simple-modal-template, put haxUiDialogVars(HaxUiDialogFrame)
 *   in the element's styles so the template passes them along.
 *   HaxUiDialogConfirm is the confirm card (discard changes, delete):
 *   no dark bar, the question as a bold heading, actions at the bottom
 *   right, drawn with hax-confirm-dialog.
 * - web-dialog or a dialog drawn by hand: HaxUiDialogTitlebarStyles gives
 *   .hax-ui-dialog-titlebar, .hax-ui-dialog-title and .hax-ui-dialog-close.
 *
 * Each value puts the --hax-ui-* token first with its DDD value behind it,
 * because a modal sits outside the shadow roots that define the tokens.
 * Size, z-index and backdrop are left to each opener; they really differ.
 */
import { css, unsafeCSS } from "lit";

/** The titlebar: 48px coalyGray / potentialMidnight band, 16px bold title */
export const HaxUiDialogTitlebar = Object.freeze({
  "--simple-modal-titlebar-background":
    "var(--hax-ui-titlebar, light-dark(var(--ddd-theme-default-coalyGray), var(--ddd-theme-default-potentialMidnight)))",
  "--simple-modal-titlebar-color":
    "var(--hax-ui-on-titlebar, var(--ddd-theme-default-white))",
  "--simple-modal-titlebar-height": "var(--hax-ui-titlebar-height, 48px)",
  // the same on a phone: the admin shell sizes its body from this height
  "--simple-modal-titlebar-mobile-height":
    "var(--hax-ui-titlebar-height, 48px)",
  "--simple-modal-titlebar-padding": "0 var(--ddd-spacing-3, 12px) 0 16px",
  "--simple-modal-titlebar-font-size": "16px",
  "--simple-modal-titlebar-font-weight": "var(--ddd-font-weight-bold, 700)",
  "--simple-modal-title-icon-size": "18px",
  "--simple-modal-breadcrumb-gap": "6px",
  "--simple-modal-breadcrumb-icon-gap": "6px",
  "--simple-modal-title-text-offset": "0",
  "--simple-modal-titlebar-icon-height": "20px",
  "--simple-modal-titlebar-icon-width": "20px",
});

/** The surface under the titlebar: white / coalyGray, 8px corners */
export const HaxUiDialogSurface = Object.freeze({
  "--simple-modal-content-container-background":
    "light-dark(var(--ddd-theme-default-white), var(--ddd-theme-default-coalyGray))",
  "--simple-modal-content-container-color":
    "light-dark(var(--ddd-theme-default-coalyGray), var(--ddd-theme-default-white))",
  "--simple-modal-buttons-background":
    "light-dark(var(--ddd-theme-default-white), var(--ddd-theme-default-coalyGray))",
  "--simple-modal-border-radius": "var(--ddd-radius-sm, 8px)",
});

/** Titlebar and surface together: what most dialogs spread */
export const HaxUiDialogFrame = Object.freeze({
  ...HaxUiDialogTitlebar,
  ...HaxUiDialogSurface,
});

/**
 * The confirm card, as the admin's leave prompt draws it: a 460px surface
 * panel with its question as a bold heading, no dark titlebar. The modal
 * keeps its title, so the dialog keeps its accessible name; put a
 * hax-confirm-dialog in it for the message and the buttons.
 */
export const HaxUiDialogConfirm = Object.freeze({
  "--simple-modal-titlebar-background":
    "light-dark(var(--ddd-theme-default-white), var(--ddd-theme-default-coalyGray))",
  "--simple-modal-titlebar-color":
    "light-dark(var(--ddd-theme-default-coalyGray), var(--ddd-theme-default-white))",
  "--simple-modal-titlebar-height": "auto",
  "--simple-modal-titlebar-mobile-height": "auto",
  "--simple-modal-titlebar-padding": "16px 16px 0",
  "--simple-modal-titlebar-font-size": "15px",
  "--simple-modal-titlebar-font-size-mobile": "15px",
  "--simple-modal-titlebar-font-weight": "var(--ddd-font-weight-bold, 700)",
  "--simple-modal-title-text-offset": "0",
  "--simple-modal-title-align": "start",
  "--simple-modal-content-container-background":
    "light-dark(var(--ddd-theme-default-white), var(--ddd-theme-default-coalyGray))",
  "--simple-modal-content-padding": "0",
  "--simple-modal-width": "460px",
  "--simple-modal-max-width": "calc(100vw - 32px)",
  "--simple-modal-min-width": "300px",
  "--simple-modal-height": "auto",
  "--simple-modal-min-height": "0",
  "--simple-modal-border-radius": "var(--ddd-radius-sm, 8px)",
  "--simple-modal-z-index": "100000000",
});

/**
 * A style map as a :host rule, for a simple-modal-template: the template
 * reads these custom properties off itself when it opens the modal.
 * Only the frame's own maps are passed in, so the text is trusted.
 */
export function haxUiDialogVars(map) {
  return css`
    :host {
      ${unsafeCSS(
        Object.keys(map)
          .map((prop) => `${prop}: ${map[prop]};`)
          .join("\n"),
      )}
    }
  `;
}

/**
 * The same titlebar for a dialog that draws its own (web-dialog): put
 * .hax-ui-dialog-titlebar on the bar, .hax-ui-dialog-title on its heading
 * and .hax-ui-dialog-close on the close button (with an aria-label).
 */
export const HaxUiDialogTitlebarStyles = [
  css`
    .hax-ui-dialog-titlebar {
      flex: none;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      gap: var(--ddd-spacing-2, 8px);
      height: var(--hax-ui-titlebar-height, 48px);
      margin: 0;
      padding: 0 var(--ddd-spacing-3, 12px) 0 var(--ddd-spacing-4, 16px);
      font-family: var(--hax-ui-admin-font-family, var(--ddd-font-navigation));
      color: var(--hax-ui-on-titlebar, var(--ddd-theme-default-white));
      background-color: var(
        --hax-ui-titlebar,
        light-dark(
          var(--ddd-theme-default-coalyGray),
          var(--ddd-theme-default-potentialMidnight)
        )
      );
    }
    .hax-ui-dialog-title {
      flex: 1 1 auto;
      min-width: 0;
      margin: 0;
      font-size: 16px;
      font-weight: var(--ddd-font-weight-bold, 700);
      line-height: 1.2;
    }
    .hax-ui-dialog-close {
      all: unset;
      box-sizing: border-box;
      flex: none;
      cursor: pointer;
      display: inline-grid;
      place-items: center;
      width: 32px;
      height: 32px;
      border-radius: var(--hax-ui-radius, var(--ddd-radius-xs, 4px));
      color: inherit;
      --simple-icon-width: 20px;
      --simple-icon-height: 20px;
      transition: background-color var(--hax-ui-duration, 150ms)
        var(--hax-ui-easing, ease);
    }
    .hax-ui-dialog-close:hover:not(:disabled),
    .hax-ui-dialog-close:focus-visible {
      background-color: rgba(255, 255, 255, 0.12);
    }
    .hax-ui-dialog-close:focus-visible {
      outline: var(--hax-ui-focus-width, 2px) solid
        var(--ddd-theme-default-keystoneYellow, #ffd100);
      outline-offset: -2px;
    }
    .hax-ui-dialog-close:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    @media (prefers-reduced-motion: reduce) {
      .hax-ui-dialog-close {
        transition: none;
      }
    }
  `,
];
