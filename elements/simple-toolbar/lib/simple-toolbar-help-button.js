/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { SimpleToolbarModalButtonBehaviors } from "./simple-toolbar-modal-button.js";
import { EndUserDocProperties } from "@lrnwebcomponents/end-user-doc/end-user-doc.js";

/**
 * @extends SimpleToolbarModalButtonBehaviors
 */
const SimpleToolbarHelpButtonBehaviors = function (SuperClass) {
  return class extends SimpleToolbarModalButtonBehaviors(SuperClass) {
    /**
     * Store the tag name to make it easier to obtain directly.
     */
    static get tag() {
      return "simple-toolbar-help-button";
    }

    static get properties() {
      return {
        ...super.properties,
        ...EndUserDocProperties,
        /**
         * whether help documentation can be searched
         */
         searchable: {
          name: "helpSearchable",
          type: Boolean,
          attribute: "searchable",
          reflect: true,
        },
        /**
         * display mode for help documents
         */
        displayMode: {
          name: "displayMode",
          type: Boolean,
          attribute: "display-mode",
          reflect: true,
        },
        /**
         * modal mode for styling
         */
        modalMode: {
          name: "modalMode",
          type: Boolean,
          attribute: "modal-mode",
          reflect: true,
        },
      };
    }

    

    constructor() {
      super();
      this.icon = "help-outline";
      this.toggled = false;
      this.toggles = true;
      this.label = "Help";
      this.disabled = false;
      this.shortcutKeys = "F1";
      this.modalMode = "toolbar-help";
    }

    get endUserDoc(){
      return this.shadowRoot 
        && this.shadowRoot.querySelector('end-user-doc') 
        ? this.shadowRoot.querySelector('end-user-doc') 
        : undefined;
    }

    get modalTemplate(){
      return html`
        <end-user-doc 
          hidden 
          ?searchable="${this.searchable}" 
          ?printable="${this.printable}" 
          display-mode="${this.displayMode}">
        </end-user-doc>`;
    }

    openModal(){
      let styles = this._getModalStyles(this), 
        content = this.endUserDoc.cloneNode(true);
        
      content.hidden = false;
      content.contents = this.endUserDoc.contents;
      this.dispatchEvent(
        new CustomEvent("simple-modal-show", {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: {
            mode: this.modalMode || undefined,
            title: this.title || this.label,
            elements: { content: content },
            styles: styles,
            invokedBy: this,
          }
        })
      );
    }
  };
};

/**
 * `simple-toolbar-help-button`
 * a more button to toggle collapsed buttons in the rich text editor
 *
 * @customElement
 * @extends SimpleToolbarHelpButtonBehaviors
 * @extends LitElement
 * @lit-html
 * @lit-element
 * @demo ./demo/buttons.html
 */
class SimpleToolbarHelpButton extends SimpleToolbarHelpButtonBehaviors(LitElement) {}

window.customElements.define(
  SimpleToolbarHelpButton.tag,
  SimpleToolbarHelpButton
);
export { SimpleToolbarHelpButton, SimpleToolbarHelpButtonBehaviors };
