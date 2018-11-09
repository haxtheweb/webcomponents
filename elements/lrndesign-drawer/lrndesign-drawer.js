import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/app-layout/app-layout.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
/**
`lrndesign-drawer`


@demo demo/index.html
*/
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        --lrndesign-drawer-width: 30%;
      }
      app-header {
        z-index: 100;
      }
      app-drawer {
        --app-drawer-width: var(--lrndesign-drawer-width);
        --app-drawer-content-container: {
          padding: 16px;
          overflow-y: scroll;
          margin-top: 112px;
        }
      }
    </style>
    <app-header>
      <app-drawer opened="{{opened}}" align="{{align}}">
        <slot></slot>
      </app-drawer>
    </app-header>
    <paper-icon-button icon="[[icon]]" alt="[[alt]]" id="flyout-drawer"></paper-icon-button>
    <paper-tooltip for="flyout-drawer">[[alt]]</paper-tooltip>
`,

  is: "lrndesign-drawer",

  properties: {
    /**
     * State for if it is currently open.
     */
    opened: {
      type: Boolean,
      value: false
    },
    /**
     * Icon to present for clicking.
     */
    icon: {
      type: String,
      value: "icon"
    },
    /**
     * Side of the screen to align the flyout (right or left)
     */
    align: {
      type: String,
      value: "left"
    },
    /**
     * Alt / hover text for this link
     */
    alt: {
      type: String,
      value: ""
    }
  },

  /**
   * Initalize the flyout and ensure it's not open to start
   * while adding the click event to it.
   */
  ready: function() {
    let root = this;
    let opened = this.opened;
    this.shadowRoot
      .querySelector("paper-icon-button")
      .addEventListener("click", function(e) {
        root.opened = !root.opened;
      });
  }
});
