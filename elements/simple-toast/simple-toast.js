/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import "./lib/simple-toast-el.js";
// register globally so we can make sure there is only one
globalThis.SimpleToast = globalThis.SimpleToast || {};
// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same simple-toast element, making it a singleton.
globalThis.SimpleToast.requestAvailability = () => {
  // if there is no single instance, generate one and append it to end of the document
  if (!globalThis.SimpleToast.instance && globalThis.document) {
    globalThis.SimpleToast.instance =
      globalThis.document.createElement("simple-toast");
    globalThis.document.body.appendChild(globalThis.SimpleToast.instance);
  }
  return globalThis.SimpleToast.instance;
};

/**
 * `simple-toast`
 * `A singular toast / message for conistency`
 * @demo demo/index.html
 * @element simple-toast
 */
class SimpleToast extends DDD {
  //styles function
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        :host([hidden]) {
          display: none;
        }

        simple-toast-el {
          box-shadow: var(--ddd-boxShadow-sm);
          width: var(--simple-toast-width, auto);
          color: var(
            --simple-toast-color,
            var(--ddd-theme-primary, var(--ddd-theme-default-white))
          );
          background-color: var(
            --simple-toast-bg,
            var(--ddd-theme-default-coalyGray)
          );
          top: var(--simple-toast-top);
          margin: var(--simple-toast-margin, var(--ddd-spacing-2));
          padding: var(--simple-toast-padding, var(--ddd-spacing-4));
          left: var(--simple-toast-left, var(--ddd-spacing-9));
          bottom: var(--simple-toast-bottom, var(--ddd-spacing-9));
          right: var(--simple-toast-right);
          border: var(--simple-toast-border);
          z-index: var(--simple-toast-z-index, 1000);
          font-size: var(--simple-toast-font-size, var(--ddd-font-size-s));
        }

        button {
          margin-left: var(--ddd-spacing-2);
          color: inherit;
          background: transparent;
          border: var(--ddd-border-xs);
          border-color: currentColor;
          border-radius: var(--ddd-radius-xs);
          padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
          cursor: pointer;
          font-size: var(--ddd-font-size-xs);
        }
        button:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `,
    ];
  }

  // render function
  render() {
    return html` <simple-toast-el
      id="toast"
      text="${this.text}"
      duration="${this.duration}"
      ?opened="${this.opened}"
      @opened-changed="${this.openedChanged}"
      .class="${this.classStyle}"
    >
      <slot></slot>
      <button .hidden="${!this.closeButton}" @click="${this.hide}">
        ${this.closeText}
      </button>
    </simple-toast-el>`;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,

      /**
       * Opened state of the toast, use event to change
       */
      opened: {
        type: Boolean,
        reflect: true,
      },
      /**
       * Plain text based message to display
       */
      text: {
        type: String,
      },
      /**
       * Class name, fit-bottom being a useful one
       */
      classStyle: {
        type: String,
        attribute: "class-style",
      },
      /**
       * Text for the close button
       */
      closeText: {
        type: String,
        attribute: "close-text",
      },
      /**
       * How long the toast message should be displayed
       */
      duration: {
        type: Number,
      },
      /**
       * Event callback when hide is called
       */
      eventCallback: {
        type: String,
        attribute: "event-callback",
      },
      /**
       * If there should be a close button shown
       */
      closeButton: {
        type: Boolean,
        reflect: true,
        attribute: "close-button",
      },
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
  constructor() {
    super();
    this.windowControllers = new AbortController();
    this.setDefaultToast();
  }
  connectedCallback() {
    super.connectedCallback();
    globalThis.addEventListener(
      "simple-toast-hide",
      this.hideSimpleToast.bind(this),
      { signal: this.windowControllers.signal },
    );

    globalThis.addEventListener(
      "simple-toast-show",
      this.showSimpleToast.bind(this),
      { signal: this.windowControllers.signal },
    );
  }
  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    this.windowControllers.abort();

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
globalThis.customElements.define(SimpleToast.tag, SimpleToast);
export { SimpleToast };
