import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import "./node_modules/@polymer/paper-button/paper-button.js";
import "./node_modules/@lrnwebcomponents/lrndesign-dialog/lrndesign-dialog.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
    </style>
    <paper-button raised="" onclick="dialog.toggle()">{{buttonLabel}}</paper-button>
    <lrndesign-dialog id="dialog">
      <h2>{{title}}</h2>
      <div>
        <slot></slot>
      </div>
    </lrndesign-dialog>
`,
  is: "lrndesign-buttondialog",
  properties: {
    buttonLabel: { type: String, value: "Label" },
    title: { type: String, value: "Heading" }
  }
});
