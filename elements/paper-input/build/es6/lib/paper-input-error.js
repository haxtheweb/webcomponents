import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@polymer/paper-styles/default-theme.js";
import "../node_modules/@polymer/paper-styles/typography.js";
import { PaperInputAddonBehavior } from "./paper-input-addon-behavior.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: inline-block;
        visibility: hidden;

        color: var(--paper-input-container-invalid-color, var(--error-color));

        @apply --paper-font-caption;
        @apply --paper-input-error;
        position: absolute;
        left:0;
        right:0;
      }

      :host([invalid]) {
        visibility: visible;
      };
    </style>

    <slot></slot>
`,
  is: "paper-input-error",
  behaviors: [PaperInputAddonBehavior],
  properties: {
    invalid: { readOnly: !0, reflectToAttribute: !0, type: Boolean }
  },
  update: function(state) {
    this._setInvalid(state.invalid);
  }
});
