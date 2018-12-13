/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import * as async from "@polymer/polymer/lib/utils/async.js";
import "@polymer/paper-dialog/paper-dialog.js";
import "@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/neon-animation/animations/scale-up-animation.js";
import "@polymer/neon-animation/animations/fade-out-animation.js";
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
/**
 * `simple-modal`
 * `A simple modal that ensures accessibility and stack order context appropriately`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html demo
 * @demo demo/template.html using simple-modal-template
 */
class SimpleModal extends PolymerElement {
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          --simple-modal-titlebar-color: #444;
          --simple-modal-titlebar-background: #ddd;
          --simple-modal-header-color: #222;
          --simple-modal-header-background: #ccc;
        }

        :host([hidden]) {
          display: none;
        }

        :host ::slotted(*) {
          font-size: 14px;
          @apply --simple-modal-content;
        }

        :host #dialog {
          display: block;
          margin: auto;
          width: auto;
          height: auto;
          z-index: 1000;
          min-width: 50vw;
          min-height: 50vh;
          border-radius: 3px;
          @apply --simple-modal-dialog;
        }

        :host #titlebar {
          margin-top: 0;
          padding: 0px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: var(--simple-modal-titlebar-color);
          background-color: var(--simple-modal-titlebar-background);
          border-radius: 3px 3px 0 0;
          @apply --simple-modal-top;
        }

        :host #headerbar {
          margin: 0;
          padding: 0 16px;
          color: var(--simple-modal-header-color);
          background-color: var(--simple-modal-header-background);
          @apply --simple-modal-headerbar;
        }

        :host h2 {
          margin-right: 8px;
          padding: 0;
          flex: auto;
          font-size: 18px;
          line-height: 18px;
          @apply --simple-modal-title;
        }

        :host #close {
          top: 0;
          padding: 10px 0;
          min-width: unset;
          text-transform: none;
          color: var(--simple-modal-titlebar-color);
          background-color: transparent;
          @apply --simple-modal-close;
        }

        :host #close iron-icon {
          width: 16px;
          height: 16px;
          color: var(--simple-modal-titlebar-color);
          @apply --simple-modal-close-icon;
        }

        .content {
          padding: 8px 16px;
          @apply --simple-modal-content-container;
        }

        .buttons {
          position: absolute;
          bottom: 0;
          padding: 8px 16px;
          @apply --simple-modal-buttons;
        }
      </style>
      <paper-dialog
        id="dialog"
        always-on-top
        aria-describedby="simple-modal-content"
        aria-label$="[[_getAriaLabel(title)]]"
        aria-labelledby$="[[_getAriaLabelledby(title)]]"
        aria-modal="true"
        entry-animation="scale-up-animation"
        exit-animation="fade-out-animation"
        role="dialog"
        opened="{{opened}}"
        with-backdrop
      >
        <div id="titlebar">
          <h2 id="simple-modal-title" hidden$="[[!title]]">[[title]]</h2>
          <div></div>
          <paper-button
            id="close"
            dialog-dismiss
            hidden$="[[!opened]]"
            label="[[closeLabel]]"
          >
            <iron-icon aria-hidden="true" icon="[[closeIcon]]"></iron-icon>
          </paper-button>
        </div>
        <div id="headerbar"><slot name="header"></slot></div>
        <paper-dialog-scrollable id="simple-modal-content">
          <slot name="content"></slot>
        </paper-dialog-scrollable>
        <div class="buttons"><slot name="buttons"></slot></div>
      </paper-dialog>
    `;
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
        value: "close"
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
    window.addEventListener("simple-modal-hide", this.close.bind(this));
    window.addEventListener("simple-modal-show", this.showEvent.bind(this));
  }
  /**
   * Ensure everything is visible in what's been expanded.
   */
  _resizeContent(e) {
    // fake a resize event to make contents happy
    async.microTask.run(() => {
      window.dispatchEvent(new Event("resize"));
    });
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
        this.show(
          e.detail.title,
          e.detail.elements,
          e.detail.invokedBy,
          e.detail.clone
        );
      }, 100);
    } else {
      this.show(
        e.detail.title,
        e.detail.elements,
        e.detail.invokedBy,
        e.detail.clone
      );
    }
  }
  /**
   * Show the modal and display the material
   */
  show(title, elements, invokedBy, clone = false) {
    this.set("invokedBy", invokedBy);
    this.title = title;
    let element;
    // append element areas into the appropriate slots
    // ensuring they are set if it wasn't previously
    let slots = ["header", "content", "buttons"];
    for (var i in slots) {
      if (elements[slots[i]]) {
        if (clone) {
          element = elements[slots[i]].cloneNode(true);
        } else {
          element = elements[slots[i]];
        }
        element.setAttribute("slot", slots[i]);
        dom(this).appendChild(element);
      }
    }
    // minor delay to help the above happen prior to opening
    setTimeout(() => {
      this.opened = true;
      this._resizeContent();
    }, 100);
  }
  /**
   * check state and if we should clean up on close.
   * This keeps the DOM tiddy and allows animation to happen gracefully.
   */
  animationEnded(e) {
    // wipe the slot of our modal
    this.title = "";
    while (dom(this).firstChild !== null) {
      dom(this).removeChild(dom(this).firstChild);
    }
    if (this.invokedBy) {
      async.microTask.run(() => {
        setTimeout(() => {
          this.invokedBy.focus();
        }, 500);
      });
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
      const evt = new CustomEvent("simple-modal-closed", {
        bubbles: true,
        cancelable: true,
        detail: {
          opened: false,
          invokedBy: this.invokedBy
        }
      });
      this.dispatchEvent(evt);
    } else if (newValue) {
      const evt = new CustomEvent("simple-modal-opened", {
        bubbles: true,
        cancelable: true,
        detail: {
          opened: true,
          invokedBy: this.invokedBy
        }
      });
      this.dispatchEvent(evt);
    }
  }
  /**
   * If there is a title, aria-labelledby should point to #simple-modal-title
   */
  _getAriaLabelledBy(title) {
    return !title ? null : "simple-modal-title";
  }
  /**
   * If there is no title, supply a generic aria-label
   */
  _getAriaLabel(title) {
    return !title ? "Modal Dialog" : null;
  }
  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("simple-modal-hide", this.close.bind(this));
    window.removeEventListener("simple-modal-show", this.showEvent.bind(this));
  }
}
window.customElements.define(SimpleModal.tag, SimpleModal);
export { SimpleModal };
