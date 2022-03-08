/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { SimpleToolbarButtonBehaviors } from "./simple-toolbar-button.js";
import "@lrnwebcomponents/simple-modal/lib/simple-modal-template.js";
const SimpleToolbarModalButtonBehaviors = function (SuperClass) {
  return class extends SimpleToolbarButtonBehaviors(SuperClass) {
    /**
     * Store the tag name to make it easier to obtain directly.
     */
    static get tag() {
      return "simple-toolbar-modal-button";
    }
    static get styles() {
      return [
        ...super.styles,
        css`
          :host([hidden]) {
            display: none !important;
          }
        `,
      ];
    }

    static get properties() {
      return {
        ...super.properties,
        id: {
          attribute: "id",
          type: String,
          reflect: true
        }
      };
    }

    constructor() {
      super();
      window.removeEventListener("simple-modal-hide", this._handleModalClose.bind(this));
      window.removeEventListener("simple-modal-show", this._handleModalOpen.bind(this));
    }

    render(){
      return html`${super.render()}${this.modalTemplate}`
    }
    get modalStyles(){
      return css`
        simple-modal-template {
          --simple-modal-titlebar-color: var(--simple-toolbar-button-bg);
          --simple-modal-titlebar-background: var(--simple-toolbar-button-color);
          --simple-modal-header-color: var(--simple-toolbar-button-hover-color);
          --simple-modal-header-background: var(--simple-toolbar-button-hover-bg);
          --simple-modal-content-container-color: var(--simple-toolbar-button-color);
          --simple-modal-content-container-background: var(--simple-toolbar-button-bg);
          --simple-modal-buttons-color: var(--simple-toolbar-button-color);
          --simple-modal-buttons-background: var(--simple-toolbar-button-bg);
        }
      `;
    }

    get modalTemplate(){
      return html`
        <simple-modal-template modal-id="${this.id || 'modal-button'}-modal" title="${this.label}">
          ${this.headerTemplate}
          ${this.precontentTemplate}
          ${this.contentTemplate}
          ${this.customTemplate}
          ${this.buttonsTemplate}
        </simple-modal-template>
        <slot></slot>
      `;
    }

    get headerTemplate(){
      return;
    }

    get contentTemplate(){
      return;
    }

    get precontentTemplate(){
      return;
    }

    get buttonsTemplate(){
      return;
    }

    get customTemplate(){
      return;
    }

    get shadowModal(){
      return this.shadowRoot 
        && this.shadowRoot.querySelector('simple-modal-template') 
        ? this.shadowRoot.querySelector('simple-modal-template') 
        : undefined;
    }

    _handleModalClose(e){
      this.toggled = false;
      this.__children.forEach(child=>this.append(child));
      this.__children = undefined;
    }

    _handleModalOpen(e){
      if(e.detail && e.deal.invokedBy && e.deal.invokedBy == this) this.toggled = true;
    }

    _handleClick(e){
      this.toggleModal();
    }

    toggleModal(){
      if(this.toggled){
        this.closeModal();
      } else {
        this.openModal(this);
      }
    }

    closeModal(){
      window.dispatchEvent(
        new CustomEvent("simple-modal-hide", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: false,
        })
      );
    }

    openModal(){
      if(this.shadowModal && this.shadowModal.openModal) {
        this.__children = [...this.children];
        this.__children.forEach(child=>this.shadowModal.append(child));
        this.shadowModal.openModal();
      }
    }
  };
};

/**
 * `simple-toolbar-modal-button`
 * a more button to toggle collapsed buttons in the rich text editor
 *
 * @customElement
 * @extends SimpleToolbarButtonBehaviors
 * @extends LitElement
 * @lit-html
 * @lit-element
 * @demo ./demo/buttons.html
 */
class SimpleToolbarModalButton extends SimpleToolbarModalButtonBehaviors(LitElement) {}
window.customElements.define(
  SimpleToolbarModalButton.tag,
  SimpleToolbarModalButton
);
export { SimpleToolbarModalButtonBehaviors, SimpleToolbarModalButton };
