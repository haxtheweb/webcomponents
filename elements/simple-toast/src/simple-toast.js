/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "./lib/simple-toast-el.js";
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
export const SimpleToastStore = window.SimpleToast.requestAvailability();

/**
 * `simple-toast`
 * `A singular toast / message for conistency`
 * @demo demo/index.html
 * @element simple-toast
 */
class SimpleToast extends SimpleColors {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

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
  constructor() {
    super();
    this.setDefaultToast();
  }
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
    window.removeEventListener(
      "simple-toast-hide",
      this.hideSimpleToast.bind(this)
    );
    window.removeEventListener(
      "simple-toast-show",
      this.showSimpleToast.bind(this)
    );
    super.disconnectedCallback();
  }
  /**
   * Hide callback
   */
  hideSimpleToast(e) {
    this.hide();
  }
  openedChanged(e) {
    this.opened = e.detail.value;
  }
  setDefaultToast() {
    this.opened = false;
    this.text = "Saved";
    this.classStyle = "";
    this.closeText = "Close";
    this.duration = 3000;
    this.accentColor = "grey";
    this.dark = false;
    this.eventCallback = null;
    this.closeButton = true;
    while (this.firstChild !== null) {
      this.removeChild(this.firstChild);
    }
  }
  /**
   * Show / available callback
   */
  showSimpleToast(e) {
    // establish defaults and then let event change settings
    this.setDefaultToast();
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
    if (e.detail.slot) {
      this.appendChild(e.detail.slot);
    }
    if (e.detail.accentColor) {
      this.accentColor = e.detail.accentColor;
    }
    if (e.detail.dark) {
      this.dark = e.detail.dark;
    }
    this.show();
  }

  show(e) {
    this.opened = true;
  }
  hide(e) {
    if (this.eventCallback) {
      const evt = new CustomEvent(this.eventCallback, {
        bubbles: true,
        cancelable: true,
        detail: true,
        composed: true,
      });
      this.dispatchEvent(evt);
    }
    this.opened = false;
  }
}
window.customElements.define(SimpleToast.tag, SimpleToast);
export { SimpleToast };
