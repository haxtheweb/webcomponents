import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "./lrnapp-studio-submission-editbar-message.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
    </style>
    <paper-tooltip position="top" animation-delay="0" offset="-20">
      <slot name="lrnapp-studio-submission-editbar-message"></slot>
    </paper-tooltip>
    <slot></slot>
  `,
  is: "lrnapp-studio-submission-editbar"
});
