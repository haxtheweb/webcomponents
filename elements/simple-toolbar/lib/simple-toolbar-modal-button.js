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

    static get properties() {
      return {
        ...super.properties,
        /**
         * The `id` of modal that button controls.
         */
        controls: {
          type: String,
          attribute: "controls-editor",
          reflect: false,
        },
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

    firstUpdated(changedProperties) {
      if(super.firstUpdated) super.firstUpdated(changedProperties);
      this.setAttribute('aria-haspopup',"true");
    }

    render(){
      return this.simpleToolbarModalButtonRender;
    }

    get simpleToolbarModalButtonRender(){
      return html`${super.render()}${this.modalTemplate}`;
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
      let styles = getComputedStyle(target),
        style = (cssVar,defaultVal='unset') => {
          return styles.getPropertyValue(cssVar) || defaultVal; 
        };
      return {
        "--simple-modal-titlebar-color": style('--simple-toolbar-button-bg'),
        "--simple-modal-titlebar-background": style('--simple-toolbar-button-color'),
        "--simple-modal-header-color": style('--simple-toolbar-button-hover-color'),
        "--simple-modal-header-background": style('--simple-toolbar-button-hover-bg'),
        "--simple-modal-content-container-color": style('--simple-toolbar-button-color'),
        "--simple-modal-content-container-background": style('--simple-toolbar-button-bg'),
        "--simple-modal-content-container-overflow": style('--simple-toolbar-modal-container-overflow', 'auto'),
        "--simple-modal-buttons-color": style('--simple-toolbar-button-color'),
        "--simple-modal-buttons-background": style('--simple-toolbar-button-bg'),
        "--simple-modal-z-index": Number(style('--simple-toolbar-button-z-index',2)+2),
        "--simple-modal-resize": style('--simple-toolbar-modal-resize','both'),
        "--simple-modal-min-width": style('--simple-toolbar-modal-min-width'),
        "--simple-modal-min-height": style('--simple-toolbar-modal-min-height'),
        "--simple-modal-width": style('--simple-toolbar-modal-width','75%'),
        "--simple-modal-height": style('--simple-toolbar-modal-height','75vh'),
        "--simple-modal-max-width": style('--simple-toolbar-modal-max-width'),
        "--simple-modal-max-height": style('--simple-toolbar-modal-max-height')
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
 * ### Styling
`<simple-fields>` provides following custom properties
for styling:

Custom property | Description | Default
----------------|-------------|--------
--simple-toolbar-modal-container-overflow | whether content overflow should be visible or scroll |  auto
--simple-toolbar-modal-resize | whether modal can be resized by user (see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/resize})  | both
--simple-toolbar-modal-width | width of modal | --simple-modal-width
--simple-toolbar-modal-height | height of modal | --simple-modal-height
--simple-toolbar-modal-min-width | min-width of modal | --simple-modal-min-width
--simple-toolbar-modal-min-height | min-height of modal | --simple-modal-min-height
--simple-toolbar-modal-max-width | max-width of modal | --simple-modal-max-width
--simple-toolbar-modal-max-height | max-height of modal | --simple-modal-max-height
 */
class SimpleToolbarModalButton extends SimpleToolbarModalButtonBehaviors(LitElement) {}
window.customElements.define(
  SimpleToolbarModalButton.tag,
  SimpleToolbarModalButton
);
export { SimpleToolbarModalButtonBehaviors, SimpleToolbarModalButton };
