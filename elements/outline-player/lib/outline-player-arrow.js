import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
/**
 * `outline-player-arrow`
 * @demo demo/index.html
 */
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        position: relative;
        font-family: libre baskerville;
        width: 48px;
        --app-drawer-width: 300px;
        --outline-player-dark: #222222;
        --outline-player-light: #f8f8f8;
      }

      paper-icon-button {
        --paper-icon-button-ink-color: var(--outline-player-dark);
      }
    </style>

    <div id="container">
      <paper-icon-button
        id="button"
        disabled="[[disabled]]"
        icon="[[icon]]"
      ></paper-icon-button>
      <paper-tooltip for="button" position="bottom" offset="14">
        <slot></slot>
      </paper-tooltip>
    </div>
  `,

  is: "outline-player-arrow",

  properties: {
    icon: {
      type: String,
      value: "icons:arrow-back"
    },
    disabled: {
      type: Boolean,
      value: true,
      reflectToAttribute: true
    }
  }
});
