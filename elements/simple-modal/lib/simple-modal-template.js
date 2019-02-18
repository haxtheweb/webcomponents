/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "../simple-modal.js";
/**
 * `simple-modal-template`
 * `A simple modal that ensures accessibility and stack order context appropriately`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/template.html
 */
class SimpleModalTemplate extends PolymerElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "simple-modal-template";
  }

  //render function
  static get properties() {
    return {
      /**
       * the simple-modal
       */
      modal: {
        type: "Object",
        computed: "_getModal()"
      },
      /**
       * the modal title
       */
      title: {
        type: "String",
        value: ""
      }
    };
  }
  //render function
  static get template() {
    return html`
      <style>
        :host {
          display: none;
          --simple-modal-width: 50vw;
          --simple-modal-height: 50vh;
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
      </style>
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
  associateEvents(target, evt = "tap", bubbles = true, cancelable = true) {
    let root = this;
    target.addEventListener(evt, e => {
      root.openModal(target, bubbles, cancelable);
    });
    return root.modal;
  }
  /**
   * gets the simple-modal
   *
   * @returns {object} the modal object
   */
  _getModal() {
    return window.SimpleModal.requestAvailability();
  }
  /**
   * dispatches event to populate and open the simple modal based template values
   *
   * @param {object} the object that will have the event listener
   * @param {boolean} whether the event bubbles (default is true)
   * @param {boolean} whether the event can be canceled (default is true)
   */
  openModal(target, bubbles = true, cancelable = true) {
    const styles = getComputedStyle(this),
      evt = new CustomEvent("simple-modal-show", {
        bubbles: bubbles,
        cancelable: cancelable,
        detail: {
          title: this.title !== null ? this.title : false,
          elements: {
            header: this._getSlot("header"),
            content: this._getSlot("content"),
            buttons: this._getSlot("buttons")
          },
          invokedBy: target
        }
      });
    [
      "--simple-modal-width",
      "--simple-modal-height",
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
      this.modal.style.setProperty(prop, styles.getPropertyValue(prop));
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
    let slot = this.querySelector('[slot="' + slotName + '"]');
    return slot !== null ? slot.cloneNode(true) : false;
  }
}
window.customElements.define(SimpleModalTemplate.tag, SimpleModalTemplate);
export { SimpleModalTemplate };
