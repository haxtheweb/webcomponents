/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { SimpleModalCssVars } from "../simple-modal.js";
/**
 * `simple-modal-template`
 * `A simple modal that ensures accessibility and stack order context appropriately`
 * @demo ./demo/template.html
 * @element simple-modal-template
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
        }
      `,
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
    this.title = "";
    this.modal = globalThis.SimpleModal.requestAvailability();
  }
  //render function
  static get properties() {
    return {
      /**
       * the simple-modal
       */
      modal: {
        type: Object,
      },
      /**
       * the modal title
       */
      title: {
        type: String,
      },
      /**
       * the modal title
       */
      mode: {
        type: String,
      },
    };
  }
  //render function
  render() {
    return html`
      <slot name="header"></slot>
      <slot name="content"></slot>
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
    target.addEventListener(evt, (e) => {
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
    SimpleModalCssVars.forEach((prop) => {
      styles[prop] = tplStyles.getPropertyValue(prop);
      // support mosterously large values
      if (prop == "--simple-modal-z-index") {
        styles[prop] = Number(styles[prop]);
      }
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
          buttons: this._getSlot("buttons"),
          custom: this._getCustom(),
        },
        resize: this.resize,
        invokedBy: target,
        modalClass: this.getAttribute("class"),
        styles: styles,
        clone: false,
        mode: this.mode !== null ? this.mode : false,
        title: this.title !== null ? this.title : false,
      },
    });
    globalThis.dispatchEvent(evt);
  }
  _getCustom() {
    let slot = this.querySelectorAll('[slot="custom"]');
    return slot.length == 1 ? slot[0].cloneNode(true) : this._getSlot("custom");
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
    let container = globalThis.document.createElement("div");
    slot.forEach((el) => {
      container.appendChild(el.cloneNode(true));
    });
    return slot !== null ? container.cloneNode(true) : false;
  }
}
customElements.define(SimpleModalTemplate.tag, SimpleModalTemplate);
export { SimpleModalTemplate };
