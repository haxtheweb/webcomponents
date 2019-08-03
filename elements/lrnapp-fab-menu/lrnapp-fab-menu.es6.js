/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-styles/paper-styles.js";
/**
 * `lrnapp-fab-menu`
 * `floating action button with menu`
 *
 * @demo demo/index.html
 */
class LrnappFabMenu extends PolymerElement {
  constructor() {
    super();
    import("@polymer/paper-fab/paper-fab.js");
    import("@lrnwebcomponents/lrnapp-fab-menu/lib/lrnapp-fab-speed-dial-action.js");
    import("@lrnwebcomponents/paper-fab-speed-dial/paper-fab-speed-dial.js");
    import("@lrnwebcomponents/paper-fab-speed-dial/lib/paper-fab-speed-dial-overlay.js");
  }
  static get template() {
    return html`
      <style>
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
      </style>

      <paper-fab
        icon="[[icon]]"
        class="open"
        on-click="open"
        hidden$="[[opened]]"
        disabled$="[[disabled]]"
      ></paper-fab>

      <paper-fab-speed-dial-overlay
        class="overlay"
        opened="{{opened}}"
        with-backdrop
      >
        <slot></slot>
        <paper-fab icon="close" class="close" on-click="close"></paper-fab>
      </paper-fab-speed-dial-overlay>
    `;
  }
  static get tag() {
    return "lrnapp-fab-menu";
  }
  static get properties() {
    return {
      icon: {
        type: String,
        value: "add"
      },
      opened: {
        type: Boolean,
        notify: true
      },
      disabled: {
        type: Boolean,
        value: false
      }
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
