import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
    </style>
    <slot></slot>
  `,
  is: "lrnapp-studio-submission-editbar-message"
});
