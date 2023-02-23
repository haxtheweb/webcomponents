/**
 * Copyright 2023 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import "web-dialog/index.js";
import "./lib/super-daemon-ui.js";
/**
 * `super-daemon`
 * ``
 * @demo demo/index.html
 * @element super-daemon
 */
class SuperDaemon extends LitElement {
  static get properties() {
    return {
      opened: { type: Boolean, reflect: true },
      key1: { type: String },
      key2: { type: String },
      icon: { type: String },
      items: { type: Array },
    };
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.icon = "hardware:keyboard-return";
    this.opened = false;
    this.items = [];
    const isSafari = window.safari !== undefined;
    if (isSafari) {
      this.key1 = "Ctrl";
    } else {
      this.key1 = "Alt";
    }
    this.key2 = "Shift";
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("keydown", this.keyHandler.bind(this));
    window.addEventListener(
      "super-daemon-define-option",
      this.defineOptionEvent.bind(this)
    );
  }
  disconnectedCallback() {
    super.connectedCallback();
    window.removeEventListener("keydown", this.keyHandler.bind(this));
    window.removeEventListener(
      "super-daemon-define-option",
      this.defineOptionEvent.bind(this)
    );
  }
  // take in via event
  defineOptionEvent(e) {
    this.defineOption(e.detail);
  }

  // minor validation of option; as we have a singleton this is faster when required
  defineOption(option) {
    if (option && option.value && option.title && option.eventName) {
      option.index =
        option.tags.join(" ") +
        " " +
        option.title +
        " " +
        option.key +
        " " +
        option.path;
      this.items.push(option);
    }
  }

  keyHandler(e) {
    // modifier required to activate
    console.log(e.key);
    if (this.allowedCallback()) {
      // open and close events
      if (this.key2 == "Shift" && e.shiftKey) {
        // platform specific additional modifier
        if (this.key1 == "Ctrl" && e.ctrlKey) {
          this.opened = !this.opened;
        } else if (this.key1 == "Alt" && e.altKey) {
          this.opened = !this.opened;
        }
      }
      if (e.key == "Escape" && this.opened) {
        this.opened = false;
      }
      // if we hit enter while in the combo box, we should select the 1st option
      // or move between items as far as focus
      if (
        this.opened &&
        this.shadowRoot.querySelector("super-daemon-ui").filtered.length > 0
      ) {
        switch (e.key) {
          case "Enter":
            // @todo dont do this if we have focus on an item
            this.shadowRoot
              .querySelector("super-daemon-ui")
              .shadowRoot.querySelector("super-daemon-row")
              .selected();
            break;
          case "ArrowUp":
            // @todo get focus on the row via an "active" parameter so we can just target that in the UI
            this.shadowRoot
              .querySelector("super-daemon-ui")
              .shadowRoot.querySelector("super-daemon-row")
              .shadowRoot.querySelector("button")
              .focus();
            break;
          case "ArrowDown":
            this.shadowRoot
              .querySelector("super-daemon-ui")
              .shadowRoot.querySelector("super-daemon-row")
              .shadowRoot.querySelector("button")
              .focus();
            break;
        }
      }
    }
  }
  /**
   * LitElement style callback
   */
  static get styles() {
    // support for using in other classes
    let styles = [];
    if (super.styles) {
      styles = super.styles;
    }
    return [
      ...styles,
      css`
        :host {
          display: none;
        }
        :host([opened]) {
          display: block;
        }
        web-dialog {
          --dialog-border-radius: var(--simple-modal-border-radius, 2px);
          z-index: var(--simple-modal-z-index, 1) !important;
          padding: 0;
        }
        web-dialog::part(dialog) {
          border: 1px solid var(--simple-modal-border-color, #222);
          min-height: var(--simple-modal-min-height, unset);
          min-width: var(--simple-modal-min-width, unset);
          z-index: var(--simple-modal-z-index, 1000);
          resize: var(--simple-modal-resize, unset);
          padding: 0;
          --dialog-height: var(--simple-modal-height, auto);
          --dialog-width: var(--simple-modal-width, 75vw);
          --dialog-max-width: var(--simple-modal-max-width, 100vw);
          --dialog-max-height: var(--simple-modal-max-height, 100vh);
        }
        web-dialog.style-scope.simple-modal {
          display: none !important;
        }
        web-dialog[open].style-scope.simple-modal {
          display: flex !important;
          position: fixed !important;
          margin: auto;
        }
        :host([resize="none"]) web-dialog[open].style-scope.simple-modal,
        :host([resize="horizontal"]) web-dialog[open].style-scope.simple-modal {
          top: calc(50% - var(--simple-modal-height, auto) / 2);
        }
        :host([resize="none"]) web-dialog[open].style-scope.simple-modal,
        :host([resize="vertical"]) web-dialog[open].style-scope.simple-modal {
          left: calc(50% - var(--simple-modal-width, 75vw) / 2);
        }
      `,
    ];
  }
  /**
   * Close the modal and do some clean up
   */
  close() {
    this.opened = false;
    if (window.ShadyCSS && !window.ShadyCSS.nativeShadow) {
      this.shadowRoot
        .querySelector("web-dialog")
        .shadowRoot.querySelector("#backdrop").style.position = "relative";
    }
  }
  open() {
    this.items = [...this.items];
    this.opened = true;
    const wd = this.shadowRoot.querySelector("web-dialog");
    // modal mode kills off the ability to close the dialog
    if (this.modal) {
      wd.$backdrop.removeEventListener("click", wd.onBackdropClick);
      wd.removeEventListener("keydown", wd.onKeyDown, { capture: true });
    } else {
      wd.$backdrop.addEventListener("click", wd.onBackdropClick);
      wd.addEventListener("keydown", wd.onKeyDown, {
        capture: true,
        passive: true,
      });
    }
    if (window.ShadyCSS && !window.ShadyCSS.nativeShadow) {
      this.shadowRoot
        .querySelector("web-dialog")
        .shadowRoot.querySelector("#backdrop").style.position = "fixed";
      this.shadowRoot
        .querySelector("web-dialog")
        .shadowRoot.querySelector("#backdrop").style.top = 0;
      this.shadowRoot
        .querySelector("web-dialog")
        .shadowRoot.querySelector("#backdrop").style.bottom = 0;
      this.shadowRoot
        .querySelector("web-dialog")
        .shadowRoot.querySelector("#backdrop").style.left = 0;
      this.shadowRoot
        .querySelector("web-dialog")
        .shadowRoot.querySelector("#backdrop").style.right = 0;
    }
    this.shadowRoot
      .querySelector("super-daemon-ui")
      .shadowRoot.querySelector("simple-fields-field")
      .focus();
  }
  /**
   * LitElement render callback
   */
  render() {
    return html`
      <web-dialog
        id="dialog"
        center
        role="dialog"
        part="dialog"
        aria-label="Super Daemon"
        aria-modal="true"
        ?open="${this.opened}"
        @open="${this.open}"
        @close="${this.close}"
      >
        <super-daemon-ui
          icon="${this.icon}"
          .items="${this.items}"
          @super-daemon-close="${this.close}"
        ></super-daemon-ui>
      </web-dialog>
    `;
  }
  // override to block calling from global key commands
  allowedCallback() {
    return true;
  }
  /**
   * Convention we use
   */
  static get tag() {
    return "super-daemon";
  }
}
customElements.define(SuperDaemon.tag, SuperDaemon);
export { SuperDaemon };

// register globally so we can make sure there is only one
window.SuperDaemonManager = window.SuperDaemonManager || {};
window.SuperDaemonManager.requestAvailability = () => {
  if (!window.SuperDaemonManager.instance) {
    window.SuperDaemonManager.instance = document.createElement("super-daemon");
    document.body.appendChild(window.SuperDaemonManager.instance);
  }
  return window.SuperDaemonManager.instance;
};
export const SuperDaemonInstance =
  window.SuperDaemonManager.requestAvailability();
