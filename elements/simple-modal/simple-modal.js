/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-dialog/paper-dialog.js";
import "@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/neon-animation/animations/scale-up-animation.js";
import "@polymer/neon-animation/animations/scale-down-animation.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom";
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
  // render function
  static get template() {
    return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}

#close {
  float: right;
  top: 0;
  font-size: 12px;
  text-transform: none;
  right: 0;
  position: absolute;
  padding: 4px;
  margin: 0;
  color: var(--simple-modal-color, black);
  background-color: transparent;
  min-width: unset;
}

#close iron-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 2px;
}</style>
<paper-dialog id="dialog" entry-animation="scale-up-animation"
exit-animation="fade-out-animation" opened="{{opened}}" with-backdrop always-on-top>
  <h2 hidden$="[[!title]]">[[title]]</h2>
  <slot name="header"></slot>
  <paper-dialog-scrollable>
    <slot name="content"></slot>
  </paper-dialog-scrollable>
  <div class="buttons">
    <slot name="buttons"></slot>
  </div>
  <paper-button id="close" on-tap="close" hidden$="[[!opened]]"><iron-icon icon="[[closeIcon]]"></iron-icon> [[closeLabel]]</paper-button>
</paper-dialog>`;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * heading / label of the modal
       */
      title: {
        name: "title",
        type: String,
        value: ""
      },
      /**
       * open state
       */
      opened: {
        name: "opened",
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        observer: "_openedChanged"
      },
      /**
       * Close label
       */
      closeLabel: {
        name: "closeLabel",
        type: String,
        value: "Close"
      },
      /**
       * Close icon
       */
      closeIcon: {
        name: "closeIcon",
        type: String,
        value: "cancel"
      },
      /**
       * The element that invoked this. This way we can track our way back accessibly
       */
      invokedBy: {
        name: "invokedBy",
        type: Object
      }
    };
  }

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
    this.show(e.detail.title, e.detail.elements, e.detail.invokedBy);
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
