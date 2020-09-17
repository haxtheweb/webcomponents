/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 * `lrnapp-fab-menu`
 * `floating action button with menu`
 * @demo demo/index.html
 * @element lrnapp-fab-menu
 */
class LrnappFabMenu extends LitElement {
  constructor() {
    super();
    this.icon = "add";
    this.disabled = false;
    setTimeout(() => {
      import("@polymer/paper-fab/paper-fab.js");
      import(
        "@lrnwebcomponents/lrnapp-fab-menu/lib/lrnapp-fab-speed-dial-action.js"
      );
      import("@lrnwebcomponents/paper-fab-speed-dial/paper-fab-speed-dial.js");
      import(
        "@lrnwebcomponents/paper-fab-speed-dial/lib/paper-fab-speed-dial-overlay.js"
      );
    }, 0);
  }
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        lrnapp-fab-speed-dial-action:not(:defined),
        paper-fab-speed-dial-overlay:not(:defined),
        paper-fab-speed-dial:not(:defined) {
          display: none;
        }
        .open,
        .overlay {
          position: fixed;
          bottom: var(--paper-fab-speed-dial-bottom, 16px);
          right: var(--paper-fab-speed-dial-right, 16px);
        }
        .open {
          --paper-fab-background: var(--paper-fab-speed-dial-background);
          --paper-fab-keyboard-focus-background: var(
            --paper-fab-speed-dial-keyboard-focus-background
          );
        }
        .close {
          --paper-fab-background: var(--paper-grey-500);
          --paper-fab-keyboard-focus-background: var(--paper-grey-500);
          margin-top: 20px;
          display: inline-block;
        }
        .overlay {
          text-align: right;
        }
      `,
    ];
  }
  render() {
    return html`
      <paper-fab
        icon="${this.icon}"
        class="open"
        @click="${this.open}"
        ?hidden="${this.opened}"
        ?disabled="${this.disabled}"
      ></paper-fab>

      <paper-fab-speed-dial-overlay
        class="overlay"
        ?opened="${this.opened}"
        @opened-changed="${this.openedChangedEvent}"
        with-backdrop
      >
        <slot></slot>
        <paper-fab
          icon="close"
          class="close"
          @click="${this.close}"
        ></paper-fab>
      </paper-fab-speed-dial-overlay>
    `;
  }
  openedChangedEvent(e) {
    this.opened = e.detail.value;
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "opened") {
        this.dispatchEvent(
          new CustomEvent("opened-changed", {
            value: this[propName],
          })
        );
      }
    });
  }
  static get tag() {
    return "lrnapp-fab-menu";
  }
  static get properties() {
    return {
      icon: {
        type: String,
      },
      opened: {
        type: Boolean,
      },
      disabled: {
        type: Boolean,
      },
    };
  }
  // Public methods
  open(e) {
    // Required for mobile Safari to avoid passing the tap event to an element below the FAB
    if (e) {
      e.preventDefault();
    }

    this.opened = true;
  }
  close(e) {
    // Required for mobile Safari to avoid passing the tap event to an element below the FAB
    if (e) {
      e.preventDefault();
    }
    this.opened = false;
  }
}
window.customElements.define(LrnappFabMenu.tag, LrnappFabMenu);
export { LrnappFabMenu };
