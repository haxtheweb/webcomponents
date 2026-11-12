/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-modal/lib/simple-modal-template.js";
import "@haxtheweb/d-d-d/lib/hax-confirm-dialog.js";
import {
  HaxUiDialogConfirm,
  haxUiDialogVars,
} from "@haxtheweb/d-d-d/lib/HaxUiDialogFrame.js";
import { HaxComponentStyles } from "./hax-ui-styles.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
/**
 * `hax-cancel-dialog`
 * @element hax-cancel-dialog
 * `Asks before the tray's cancel throws away unsaved changes.`
 *
 * It is the same confirm card as the site admin's discard prompt (the HAX
 * UI dialog frame's HaxUiDialogConfirm with a hax-confirm-dialog): the
 * question as a bold heading, a muted message, "No" focused first and
 * "Yes" as a danger fill. hax-store still opens it from the tray's cancel
 * button through #dialog and still hears simple-modal-confirmed with that
 * button as invokedBy, so nothing that listens for hax-cancel changes.
 */
class HaxCancelDialog extends I18NMixin(LitElement) {
  static get styles() {
    return [
      ...HaxComponentStyles,
      haxUiDialogVars(HaxUiDialogConfirm),
      css`
        :host {
          display: none;
          --simple-modal-resize: none;
          margin: 0;
          padding: 0;
        }
      `,
    ];
  }
  connectedCallback() {
    super.connectedCallback();
    this.windowControllers = new AbortController();
    globalThis.addEventListener(
      "hax-confirm-dialog-confirm",
      this._confirmed.bind(this),
      { signal: this.windowControllers.signal },
    );
  }
  disconnectedCallback() {
    this.windowControllers.abort();
    super.disconnectedCallback();
  }
  render() {
    return html`
      <simple-modal-template
        modal-id="hax-cancel"
        mode="hax-ui"
        id="dialog"
        .title="${this.t.cancelTitle}"
      >
        <hax-confirm-dialog
          slot="content"
          id="hax-cancel-confirm"
          destructive
          message="${this.t.cancelWithoutSaving}"
          confirm-label="${this.t.cancelYes}"
          cancel-label="${this.t.cancelNo}"
        ></hax-confirm-dialog>
      </simple-modal-template>
    `;
  }
  /**
   * The modal holds a copy of the card, so its "Yes" is told apart by id.
   * Answer the way simple-modal's dialog-confirm did, with the modal's
   * invokedBy, before the card closes the modal.
   */
  _confirmed(e) {
    const card = e.composedPath()[0];
    if (!card || card.id !== "hax-cancel-confirm") {
      return;
    }
    const modal = globalThis.SimpleModal
      ? globalThis.SimpleModal.requestAvailability()
      : null;
    (modal || globalThis).dispatchEvent(
      new CustomEvent("simple-modal-confirmed", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          opened: false,
          invokedBy: modal ? modal.invokedBy : null,
        },
      }),
    );
  }
  static get tag() {
    return "hax-cancel-dialog";
  }

  /**
   * Attached to the DOM, now fire that we exist.
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    // fire an event that this is a core piece of the system
    this.dispatchEvent(
      new CustomEvent("hax-register-core-piece", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
          piece: "haxCancel",
          object: this,
        },
      }),
    );
  }
  /**
   * Focus the safe choice ("No") when the dialog becomes visible.
   */
  focusInitial() {
    if (!this.shadowRoot) {
      return;
    }
    const card = this.shadowRoot.querySelector("#hax-cancel-confirm");
    if (card && typeof card.focusInitial === "function") {
      card.focusInitial();
    }
  }

  constructor() {
    super();
    this.windowControllers = new AbortController();
    this.t = {
      cancelTitle: "Confirm Cancel",
      cancelWithoutSaving:
        "Any changes since your last save will be lost. Cancel anyway?",
      cancelYes: "Yes",
      cancelNo: "No",
    };
    this.registerLocalization({
      context: this,
      namespace: "hax",
    });
  }
}
globalThis.customElements.define(HaxCancelDialog.tag, HaxCancelDialog);
export { HaxCancelDialog };
