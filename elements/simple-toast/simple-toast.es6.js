/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "@polymer/paper-toast/paper-toast.js";
import "@polymer/paper-button/paper-button.js";

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
class SimpleToast extends LitElement {
  
  //styles function
  static get styles() {
    return  [
      css`
:host {
  display: block;
}

:host([hidden]) {
  display: none;
}

paper-toast {
  width: var(--simple-toast-width, inherit);
  height: var(--simple-toast-height, inherit);
  color: var(--simple-toast-color, white);
  background-color: var(--simple-toast-bg, black);
  top: var(--simple-toast-top, inherit);
  margin: var(--simple-toast-margin, 16px);
  padding: var(--simple-toast-padding, 16px);
  left: var(--simple-toast-left, inherit);
  bottom: var(--simple-toast-bottom, inherit);
  right: var(--simple-toast-right, inherit);
  border: var(--simple-toast-border, inherit);
  z-index: var(--simple-toast-z-index, inherit);
  font-size: var(--simple-toast-font-size, inherit);
}
      `
    ];
  }
  // render function
  render() {
    return html`

<paper-toast id="toast" text="${this.text}" duration="${this.duration}" opened="${this.opened}" @opened-changed="${this.openedChanged}" .class="${this.classStyle}">
  <slot></slot>
  <paper-button .hidden="${!this.closeButton}" @click="${this.hide}">${this.closeText}</paper-button>
</paper-toast>`;
  }

  // properties available to the custom element for data binding
    static get properties() {
    let props = {
  /**
   * Opened state of the toast, use event to change
   */
  "opened": {
    "name": "opened",
    "type": Boolean,
    "reflect": true
  },
  /**
   * Plain text based message to display
   */
  "text": {
    "name": "text",
    "type": String
  },
  /**
   * Class name, fit-bottom being a useful one
   */
  "classStyle": {
    "name": "classStyle",
    "type": String,
    "attribute": "class-style"
  },
  /**
   * Text for the close button
   */
  "closeText": {
    "name": "closeText",
    "type": String,
    "attribute": "close-text"
  },
  /**
   * How long the toast message should be displayed
   */
  "duration": {
    "name": "duration",
    "type": Number
  },
  /**
   * Event callback when hide is called
   */
  "eventCallback": {
    "name": "eventCallback",
    "type": String,
    "attribute": "event-callback"
  },
  /**
   * If there should be a close button shown
   */
  "closeButton": {
    "name": "closeButton",
    "type": Boolean,
    "reflect": true,
    "attribute": "close-button"
  }
}
;
    if (super.properties) {
      props = Object.assign(props, super.properties);
    }
    return props;
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
    this.opened = false;
    this.text = "Saved";
    this.classStyle = "";
    this.closeText = "Close";
    this.duration = 4000;
    this.closeButton = true;
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
    super.connectedCallback();
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
    while (this.firstChild !== null) {
      this.removeChild(this.firstChild);
    }
    if (e.detail.slot) {
      this.appendChild(e.detail.slot);
    }
    setTimeout(() => {
      this.show();
    }, 25);
  }

  show() {
    this.shadowRoot.querySelector("#toast").show();
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
    this.shadowRoot.querySelector("#toast").hide();
  }
}
window.customElements.define(SimpleToast.tag, SimpleToast);
export { SimpleToast };
