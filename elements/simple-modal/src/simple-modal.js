/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import "@polymer/paper-dialog/paper-dialog.js";
import "@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/neon-animation/animations/scale-up-animation.js";
import "@polymer/neon-animation/animations/scale-down-animation.js";
export { SimpleModal };
/**
 * `simple-modal`
 * `A simple modal that ensures accessibility and stack order context appropriately`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SimpleModal extends PolymerElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "simple-modal";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("simple-modal-show", this.showEvent.bind(this));
  }
  /**
   * show event call to open the modal and display it's content
   */
  showEvent(e) {
    // if we're already opened and we get told to open again....
    // swap out the contents
    if (this.opened) {
      // wipe the slot of our modal
      while (dom(this).firstChild !== null) {
        dom(this).removeChild(dom(this).firstChild);
      }
      setTimeout(() => {
        this.show(e.detail.title, e.detail.elements, e.detail.invokedBy);
      }, 100);
    } else {
      this.show(e.detail.title, e.detail.elements, e.detail.invokedBy);
    }
  }
  /**
   * Show the modal and display the material
   */
  show(title, elements, invokedBy) {
    this.set("invokedBy", invokedBy);
    this.title = title;
    // append element areas into the appropriate slots
    // ensuring they are set if it wasn't previously
    let slots = ["header", "content", "buttons"];
    for (var i in slots) {
      if (elements[slots[i]]) {
        let element = elements[slots[i]].cloneNode(true);
        element.setAttribute("slot", slots[i]);
        dom(this).appendChild(element);
      }
    }
    // minor delay to help the above happen prior to opening
    setTimeout(() => {
      this.opened = true;
    }, 100);
  }
  /**
   * check state and if we should clean up on close.
   * This keeps the DOM tiddy and allows animation to happen gracefully.
   */
  animationEnded(e) {
    if (!this.opened) {
      if (this.invokedBy) {
        setTimeout(() => {
          this.invokedBy.focus();
          this.title = "";
          // wipe the slot of our modal
          while (dom(this).firstChild !== null) {
            dom(this).removeChild(dom(this).firstChild);
          }
        }, 100);
      }
    }
  }
  /**
   * Close the modal and do some clean up
   */
  close() {
    this.$.dialog.close();
  }
  // Observer opened for changes
  _openedChanged(newValue, oldValue) {
    if (typeof newValue !== typeof undefined && !newValue) {
      this.animationEnded();
    }
  }
  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("simple-modal-show", this.showEvent.bind(this));
  }
}
window.customElements.define(SimpleModal.tag, SimpleModal);
// register globally so we can make sure there is only one
window.simpleModal = window.simpleModal || {};
// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same modal
window.simpleModal.requestAvailability = () => {
  if (!window.simpleModal.instance) {
    window.simpleModal.instance = document.createElement("simple-modal");
    document.body.appendChild(window.simpleModal.instance);
  }
  return window.simpleModal.instance;
};
