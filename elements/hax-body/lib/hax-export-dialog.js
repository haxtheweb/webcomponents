import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-modal/lib/simple-modal-template.js";
import "./hax-view-source.js";
/**
 * `hax-export-dialog`
 * @element hax-export-dialog
 * `Export dialog with all export options and settings provided.`
 */
class HaxExportDialog extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: none;
        }
        simple-modal-template {
          display: none;
          --simple-modal-resize: horizontal;
          --simple-modal-z-index: 100000001;
          --simple-modal-width: 95vw;
          --simple-modal-height: 75vh;
          --simple-modal-min-width: 200px;
          --simple-modal-min-height: auto;
          --simple-modal-titlebar-color: var(--hax-tray-text-color, black);
          --simple-modal-titlebar-background: var(
            --hax-titlebar-background-color,
            #f0f4f8
          );
          --simple-modal-titlebar-padding: var(--hax-tray-margin, 4px);
          --simple-modal-titlebar-height: calc(
            20px + 2 * var(--hax-tray-margin, 4px)
          );
          --simple-modal-content-container-color: var(
            --hax-tray-text-color,
            black
          );
          --simple-modal-content-container-background: var(
            --hax-tray-background-color,
            #fff
          );
          --simple-modal-content-padding: calc(2 * var(--hax-tray-margin, 4px))
            0px 0px;
          --simple-modal-buttons-background: var(
            --hax-tray-background-color,
            #fff
          );
        }
      `,
    ];
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("simple-modal-show", this.modalToggle.bind(this));
  }
  disconnectedCallback() {
    window.removeEventListener(
      "simple-modal-show",
      this.modalToggle.bind(this)
    );
    super.disconnectedCallback();
  }
  /**
   * a bit hacky but gets around the cloning element and events issue
   */
  modalToggle(e) {
    if (e.detail.id == "hax-export") {
      e.detail.elements.content.children[0].openSource();
    }
  }
  render() {
    return html`
      <simple-modal-template
        modal-id="hax-export"
        id="dialog"
        .title="${this.title}"
      >
        <hax-view-source slot="content"></hax-view-source>
      </simple-modal-template>
    `;
  }
  static get tag() {
    return "hax-export-dialog";
  }

  static get properties() {
    return {
      /**
       * Title
       */
      title: {
        type: String,
      },
    };
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
          piece: "haxExport",
          object: this,
        },
      })
    );
  }

  constructor() {
    super();
    this.title = "View Page Source";
  }
}
window.customElements.define(HaxExportDialog.tag, HaxExportDialog);
export { HaxExportDialog };
