/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "../simple-modal.js";
/**
 * `simple-modal-template`
 * `A simple modal that ensures accessibility and stack order context appropriately`
 * @demo ./demo/template.html
 * @customElement simple-modal-template
 */
class SimpleModalTemplate extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: none;
          --simple-modal-width: auto;
          --simple-modal-height: auto;
          --simple-modal-min-width: unset;
          --simple-modal-min-height: unset;
          --simple-modal-max-width: unset;
          --simple-modal-max-height: unset;
          --simple-modal-titlebar-color: #444;
          --simple-modal-titlebar-background: #ddd;
          --simple-modal-header-color: #222;
          --simple-modal-header-background: #ccc;
          --simple-modal-content-container-color: #222;
          --simple-modal-content-container-background: #fff;
          --simple-modal-buttons-color: blue;
          --simple-modal-buttons-background: #fff;
          --simple-modal-button-color: var(--simple-modal-buttons-color);
          --simple-modal-button-background: var(
            --simple-modal-buttons-background-color
          );
        }
      `
    ];
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "simple-modal-template";
  }
  constructor() {
    super();
    this.modalId = null;
    this.title = "";
    this.modal = window.SimpleModal.requestAvailability();
  }
  //render function
  static get properties() {
    return {
      /**
       * the desired id for the modal
       */
      modalId: {
        type: Object,
        attribute: "modal-id"
      },
      /**
       * the simple-modal
       */
      modal: {
        type: Object
      },
      /**
       * the modal title
       */
      title: {
        type: String
      }
    };
  }
  //render function
  render() {
    return html`
      <slot name="header"></slot> <slot name="content"></slot>
      <slot name="buttons"></slot>
    `;
  }
  /**
   * sets event listeners for a specified target
   *
   * @param {object} the object that will have the event listener
   * @param {string} the event name
   * @param {boolean} whether the event bubbles (default is true)
   * @param {boolean} whether the event can be canceled (default is true)
   * @returns {object} the modal object
   */
  associateEvents(target, evt = "click", bubbles = true, cancelable = true) {
    target.addEventListener(evt, e => {
      this.openModal(target, bubbles, cancelable);
    });
    return this.modal;
  }

  /**
   * dispatches event to populate and open the simple modal based template values
   *
   * @param {object} the object that will have the event listener
   * @param {boolean} whether the event bubbles (default is true)
   * @param {boolean} whether the event can be canceled (default is true)
   */
  openModal(target, bubbles = true, cancelable = true) {
    let tplStyles = getComputedStyle(this),
      styles = {};
    [
      "--simple-modal-width",
      "--simple-modal-height",
      "--simple-modal-min-width",
      "--simple-modal-min-height",
      "--simple-modal-max-width",
      "--simple-modal-max-height",
      "--simple-modal-titlebar-color",
      "--simple-modal-titlebar-background",
      "--simple-modal-header-color",
      "--simple-modal-header-background",
      "--simple-modal-content-container-color",
      "--simple-modal-content-container-background",
      "--simple-modal-buttons-color",
      "--simple-modal-buttons-background",
      "--simple-modal-button-color",
      "--simple-modal-button-background"
    ].forEach(prop => {
      styles[prop] = tplStyles.getPropertyValue(prop);
    });
    const evt = new CustomEvent("simple-modal-show", {
      bubbles: bubbles,
      cancelable: cancelable,
      composed: true,
      detail: {
        id: this.getAttribute("modal-id"),
        elements: {
          header: this._getSlot("header"),
          content: this._getSlot("content"),
          buttons: this._getSlot("buttons")
        },
        invokedBy: target,
        modalClass: this.getAttribute("class"),
        styles: styles,
        clone: false,
        title: this.title !== null ? this.title : false
      }
    });
    window.dispatchEvent(evt);
  }
  /**
   * clones content in a named slot
   *
   * @param {string} the name of the slot
   * @returns {object} a clone of the slotted content (or false if there is no slotted content)
   */
  _getSlot(slotName) {
    let slot = this.querySelectorAll('[slot="' + slotName + '"]');
    // account for slot passing down from parent element
    if (slot && slot[0] && slot[0].tagName == "SLOT") {
      slot = slot[0].assignedNodes({ flatten: true });
    }
    let container = document.createElement("div");
    slot.forEach(el => {
      container.appendChild(el.cloneNode(true));
    });
    return slot !== null ? container.cloneNode(true) : false;
  }
}
window.customElements.define(SimpleModalTemplate.tag, SimpleModalTemplate);
export { SimpleModalTemplate };
