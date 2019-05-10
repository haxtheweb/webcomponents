/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-toast/paper-toast.js";
import "@polymer/paper-button/paper-button.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import * as async from "@polymer/polymer/lib/utils/async.js";

// register globally so we can make sure there is only one
window.SimpleToast = window.SimpleToast || {};
// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same simple-toast element, making it a singleton.
window.SimpleToast.requestAvailability = () => {
  // if there is no single instance, generate one and append it to end of the document
  if (!window.SimpleToast.instance) {
    window.SimpleToast.instance = document.createElement("simple-toast");
    document.body.appendChild(window.SimpleToast.instance);
  }
  return window.SimpleToast.instance;
};

/**
 * `simple-toast`
 * `A singular toast / message for conistency`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SimpleToast extends PolymerElement {
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }

        :host([hidden]) {
          display: none;
        }

        paper-toast {
          @apply --simple-toast-toast;
        }
      </style>
      <paper-toast
        id="toast"
        text="[[text]]"
        duration$="[[duration]]"
        opened="{{opened}}"
        class$="[[classStyle]]"
      >
        <slot></slot>
        <paper-button hidden$="[[!closeButton]]" on-tap="hide"
          >[[closeText]]</paper-button
        >
      </paper-toast>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * Opened state of the toast, use event to change
       */
      opened: {
        name: "opened",
        type: "Boolean",
        value: false,
        reflectToAttribute: true
      },
      /**
       * Plain text based message to display
       */
      text: {
        name: "text",
        type: "String",
        value: "Saved"
      },
      /**
       * Class name, fit-bottom being a useful one
       */
      classStyle: {
        name: "classStyle",
        type: "String",
        value: ""
      },
      /**
       * Text for the close button
       */
      closeText: {
        name: "closeText",
        type: "String",
        value: "Close"
      },
      /**
       * How long the toast message should be displayed
       */
      duration: {
        name: "duration",
        type: "Number",
        value: 4000
      },
      /**
       * Event callback when hide is called
       */
      eventCallback: {
        name: "eventCallback",
        type: "String"
      },
      /**
       * If there should be a close button shown
       */
      closeButton: {
        name: "closeButton",
        type: "Boolean",
        value: true,
        reflectToAttribute: true
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "simple-toast";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();

    window.addEventListener(
      "simple-toast-hide",
      this.hideSimpleToast.bind(this)
    );
    window.addEventListener(
      "simple-toast-show",
      this.showSimpleToast.bind(this)
    );
  }
  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    super.connectedCallback();
    window.removeEventListener(
      "simple-toast-hide",
      this.hideSimpleToast.bind(this)
    );
    window.removeEventListener(
      "simple-toast-show",
      this.showSimpleToast.bind(this)
    );
  }
  /**
   * Hide callback
   */
  hideSimpleToast(e) {
    this.hide();
  }
  /**
   * Show / available callback
   */
  showSimpleToast(e) {
    // add your code to run when the singleton is called for
    if (e.detail.duration) {
      this.duration = e.detail.duration;
    }
    if (e.detail.text) {
      this.text = e.detail.text;
    }
    if (e.detail.classStyle) {
      this.classStyle = e.detail.classStyle;
    }
    if (e.detail.closeText) {
      this.closeText = e.detail.closeText;
    }
    if (e.detail.closeButton) {
      this.closeButton = e.detail.closeButton;
    }
    if (e.detail.eventCallback) {
      this.eventCallback = e.detail.eventCallback;
    }
    while (dom(this).firstChild !== null) {
      dom(this).removeChild(dom(this).firstChild);
    }
    if (e.detail.slot) {
      dom(this).appendChild(e.detail.slot);
    }
    async.microTask.run(() => {
      setTimeout(() => {
        this.show();
      }, 50);
    });
  }

  show() {
    this.$.toast.show();
  }
  hide() {
    if (this.eventCallback) {
      const evt = new CustomEvent(this.eventCallback, {
        bubbles: true,
        cancelable: true,
        detail: true
      });
      this.dispatchEvent(evt);
    }
    this.$.toast.hide();
  }
}
window.customElements.define(SimpleToast.tag, SimpleToast);
export { SimpleToast };
