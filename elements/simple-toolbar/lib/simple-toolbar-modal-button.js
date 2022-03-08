/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { SimpleToolbarButtonBehaviors } from "./simple-toolbar-button.js";
import { SimpleModalStore } from "@lrnwebcomponents/simple-modal/simple-modal.js";

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
          :host([hidden]), 
          [hidden] {
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
        },
        title: {
          attribute: "string",
          type: String,
          reflect: true
        }
      };
    }

    constructor() {
      super();
      window.SimpleModal.requestAvailability();
      window.removeEventListener("simple-modal-hide", this._handleModalClose.bind(this));
      window.removeEventListener("simple-modal-show", this._handleModalOpen.bind(this));
    }

    render(){
      return html`${super.render()}${this.modalTemplate}`
    }

    get modalTemplate(){
      return html`
        <slot hidden name="header"></slot>
        <slot hidden name="precontent"></slot>
        <slot hidden name="content"></slot>
        <slot hidden name="buttons"></slot>
        <slot hidden name="custom"></slot>
      `;
    }

    _handleModalClose(e){
      this.toggled = false;
    }

    _handleModalOpen(e){
      if(e.detail && e.deal.invokedBy && e.deal.invokedBy == this) this.toggled = true;
    }

    _getModalStyles(target){
      let styles = getComputedStyle(target);
      return {
        "--simple-modal-titlebar-color": styles.getPropertyValue('--simple-toolbar-button-bg'),
        "--simple-modal-titlebar-background": styles.getPropertyValue('--simple-toolbar-button-color'),
        "--simple-modal-header-color": styles.getPropertyValue('--simple-toolbar-button-hover-color'),
        "--simple-modal-header-background": styles.getPropertyValue('--simple-toolbar-button-hover-bg'),
        "--simple-modal-content-container-color": styles.getPropertyValue('--simple-toolbar-button-color'),
        "--simple-modal-content-container-background": styles.getPropertyValue('--simple-toolbar-button-bg'),
        "--simple-modal-buttons-color": styles.getPropertyValue('--simple-toolbar-button-color'),
        "--simple-modal-buttons-background": styles.getPropertyValue('--simple-toolbar-button-bg'),
        "--simple-modal-z-index": Number(styles.getPropertyValue('--simple-toolbar-button-z-index)')+2),
      };
    
    }

    _handleClick(e){
      this.toggleModal();
    }

    /**
     * toggles button if shortcutKey is pressed
     *
     * @param {string} key
     * @event toggle
     */
    _handleShortcutKeys(e, key) {
      if(!!this.shortcutKeys && this.shortcutKeys != '')this.dispatchEvent(
        new CustomEvent("toggle", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: {
            ...e.detail,
            button: this,
            shortcutKey: this,
          },
        })
      );
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
      let styles = this._getModalStyles(this), 
        elements = {};

      [...this.children].forEach(child=>{
        let clone = child.cloneNode(true), 
          slot = child.slot;
        clone.hidden = false;
        delete clone.slot;
        if(!elements[slot]) elements[slot] = [];
        elements[slot].push(clone);
      });

      this.dispatchEvent(
        new CustomEvent("simple-modal-show", {
          bubbles: true,
          cancelable: true,
          detail: {
            title: this.title || this.label,
            id: this.id || this.getAttribute('id'),
            elements: elements,
            styles: styles,
            invokedBy: this,
          }
        })
      );
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
