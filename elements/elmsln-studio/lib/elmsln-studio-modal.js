/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element";
import "@lrnwebcomponents/simple-modal/simple-modal.js";

/**
 * `elmsln-studio-modal`
 * Navigation Link for ELMS:LN Studio
 *
 * @customElement elmsln-studio-modal
 * @lit-html
 * @lit-element 
 */
class ElmslnStudioModal extends LitElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "elmsln-studio-modal";
  }

  static get properties() {
    return {
      title: { type: Object },
      header: { type: Object },
      content: { type: Object },
      buttons: { type: Object },
      modal: { type: Object },
      styles: { type: Object }
    };
  }
  static get styles() {
    return css`
      :host {
        display: block;
      }
      :host([hidden]) {
        display: none;
      }
      button {
        border: none;
        background-color: transparent;
      }
      button:focus,
      button:hover {
        outline: none;
      }
    `;
  }
  constructor() {
    super();
    this.modal = window.SimpleModal.requestAvailability();
  }

  render() {
    return html`
      <button id="modal" @click="${this.modalOpen}">
        <slot></slot>
      </button>
    `;
  }

  modalOpen(event) {
    let evt, button = this.shadowRoot.getElementById('modal'), 
      styles = {
      '--simple-modal-width': '90%',
      '--simple-modal-height': '90vh',
      '--simple-modal-titlebar-height': "40px",
      "--simple-modal-titlebar-line-height": "40px",
      "--simple-modal-titlebar-height": "40px",
      "--simple-modal-titlebar-padding": "0px 5px",
      "--simple-modal-titlebar-background": "white",
      "--simple-modal-header-background": "white",
      "--simple-modal-content-padding": "0px 5px"
    };
    Object.keys(this.styles || {}).forEach(key=>
      styles[key] = this.styles[key]
    );

    this.dispatchEvent(
      new CustomEvent("modal-button-click", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this
      })
    );

    evt = new CustomEvent("simple-modal-show", {
      bubbles: true,
      composed: true,
      cancelable: false,
      detail: {
        title: false,
        elements: { 
          header: this.header, 
          content: this.content,
          buttons: this.buttons 
        },
        styles: styles,
        invokedBy: button,
        clone: false,
      }
    });
    console.log(this.modal,button,evt);
    this.dispatchEvent(evt);
  }
}
customElements.define("elmsln-studio-modal", ElmslnStudioModal);
export { ElmslnStudioModal };
