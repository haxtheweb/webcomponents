import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@polymer/paper-styles/typography.js";
import { PaperInputAddonBehavior } from "./paper-input-addon-behavior.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: inline-block;
        float: right;

        @apply --paper-font-caption;
        @apply --paper-input-char-counter;
      }

      :host([hidden]) {
        display: none !important;
      }

      :host-context([dir="rtl"]) {
        float: left;
      }
    </style>

    <span>[[_charCounterStr]]</span>
`,
  is: "paper-input-char-counter",
  behaviors: [PaperInputAddonBehavior],
  properties: { _charCounterStr: { type: String, value: "0" } },
  update: function(state) {
    if (!state.inputElement) {
      return;
    }
    state.value = state.value || "";
    var counter = state.value.toString().length.toString();
    if (state.inputElement.hasAttribute("maxlength")) {
      counter += "/" + state.inputElement.getAttribute("maxlength");
    }
    this._charCounterStr = counter;
  }
});
