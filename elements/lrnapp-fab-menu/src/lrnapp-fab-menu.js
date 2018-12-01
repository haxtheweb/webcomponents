/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-fab/paper-fab.js";
import "@lrnwebcomponents/paper-fab-speed-dial/paper-fab-speed-dial.js";
import "@lrnwebcomponents/paper-fab-speed-dial/lib/paper-fab-speed-dial-overlay.js";
import "@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
/**
 * `lrnapp-fab-menu`
 * `floating action button with menu`
 *
 * @demo demo/index.html
 */
let LrnappFabMenu = Polymer({
  _template: html`
    <custom-style>
      <style include="materializecss-styles-colors"></style>
      <style>
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
    </custom-style>
    <paper-fab
      icon="[[icon]]"
      class="open blue"
      on-tap="open"
      hidden$="[[opened]]"
      disabled$="[[disabled]]"
    ></paper-fab>

    <paper-fab-speed-dial-overlay
      class="overlay"
      opened="{{opened}}"
      with-backdrop
    >
      <slot></slot>
      <paper-fab icon="close" class="close" on-tap="close"></paper-fab>
    </paper-fab-speed-dial-overlay>
  `,

  is: "lrnapp-fab-menu",

  properties: {
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
  },

  // Public methods
  open: function(e) {
    // Required for mobile Safari to avoid passing the tap event to an element below the FAB
    if (e) {
      e.preventDefault();
    }

    this.opened = true;
  },

  close: function(e) {
    // Required for mobile Safari to avoid passing the tap event to an element below the FAB
    if (e) {
      e.preventDefault();
    }

    this.opened = false;
  }
});
export { LrnappFabMenu };
