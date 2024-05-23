import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-modal/lib/simple-modal-template.js";
import { HaxComponentStyles } from "./hax-ui-styles.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
/**
 * `hax-cancel-dialog`
 * @element hax-cancel-dialog
 * `Export dialog with all export options and settings provided.`
 */
class HaxCancelDialog extends I18NMixin(LitElement) {
  static get styles() {
    return [
      ...HaxComponentStyles,
      css`
        :host {
          display: none;
          --simple-modal-resize: none;
          --simple-modal-width: 200px;
          --simple-modal-height: auto;
          margin: 0;
          padding: 0;
        }
      `,
    ];
  }
  render() {
    return html`
      <simple-modal-template
        modal-id="hax-cancel"
        mode="hax-ui"
        id="dialog"
        .title="${this.t.cancelTitle}"
      >
        <div slot="content">${this.t.cancelWithoutSaving}</div>
        <hax-toolbar id="hax-cancel-buttons" always-expanded slot="buttons">
          <hax-tray-button
            id="hax-cancel-no"
            label="${this.t.cancelNo}"
            dialog-dismiss
            show-text-label
          >
          </hax-tray-button>
          <hax-tray-button
            id="hax-cancel-yes"
            dialog-confirm
            @click="${(e) => console.log(e)}"
            label="${this.t.cancelYes}"
            show-text-label
          >
          </hax-tray-button>
        </hax-toolbar>
      </simple-modal-template>
    `;
  }
  static get tag() {
    return "hax-cancel-dialog";
  }

  /**
   * Attached to the DOM, now fire that we exist.
   */
  firstUpdated() {
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

  constructor() {
    super();
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
customElements.define(HaxCancelDialog.tag, HaxCancelDialog);
export { HaxCancelDialog };
