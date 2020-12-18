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
          --simple-modal-z-index: 100000001;
          --simple-modal-width: auto;
          --simple-modal-height: auto;
          --simple-modal-min-width: 80vw;
          --simple-modal-min-height: 70vh;
          --simple-modal-max-width: unset;
          --simple-modal-max-height: unset;
          --simple-modal-titlebar-color: black;
          --simple-modal-titlebar-background: #ddd;
          --simple-modal-header-color: black;
          --simple-modal-header-background: #ccc;
          --simple-modal-content-container-color: black;
          --simple-modal-content-container-background: #ffffff;
          --simple-modal-buttons-color: blue;
          --simple-modal-buttons-background: #fff;
          --simple-modal-button-color: var(--simple-modal-buttons-color);
          --simple-modal-button-background: var(
            --simple-modal-buttons-background-color
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
    this.title = "View page source";
  }
}
window.customElements.define(HaxExportDialog.tag, HaxExportDialog);
export { HaxExportDialog };
