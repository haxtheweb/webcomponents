import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@lrnwebcomponents/simple-colors/simple-colors.js";
Polymer({
  _template: html`
    <style is="custom-style">
      :host {
        padding: 0;
        margin: 0;
        border-radius: 0;
        box-sizing: content-box;
      }
      :host([disabled]) {
        opacity: 0.5;
      }
      :host(:not([disabled]):focus),
      :host(:not([disabled]):hover) {
        cursor: pointer;
      }
      :host([disabled]:focus),
      :host([disabled]:hover) {
        cursor: not-allowed;
      }
      :host([selected]) {
        outline: 1px solid white;
      }
      :host([dark][selected]) {
        outline: 1px solid black;
      }
      :host(:focus),
      :host(:hover) {
        outline: 1px dotted white;
      }
      :host([dark]:focus),
      :host([dark]:hover) {
        outline: 1px dotted black;
      }
    </style>
  `,
  is: "simple-colors-picker-swatch",
  properties: {
    disabled: { type: Boolean, value: !1, reflectToAttribute: !0 },
    hex: { type: String, value: null, reflectToAttribute: !0 },
    label: { type: String, value: null, reflectToAttribute: !0 },
    level: { type: Number, value: null, reflectToAttribute: !0 },
    order: { type: Number, value: null, reflectToAttribute: !0 },
    selected: { type: Boolean, value: !1, reflectToAttribute: !0 }
  },
  ready: function() {
    let root = this;
    if (5 < root.level) root.setAttribute("dark", "dark");
    root.style.backgroundColor = root.hex;
    root.addEventListener("click", function(e) {
      root.fire("click-swatch", root);
    });
    root.addEventListener("keyup", function(e) {
      if (13 === e.keyCode || 32 === e.keyCode) {
        root.fire("click-swatch", root);
      } else if (37 === e.keyCode) {
        root.fire("previous-swatch", root);
      } else if (39 === e.keyCode) {
        root.fire("next-swatch", root);
      } else if (38 === e.keyCode) {
        root.fire("next-level", root);
      } else if (40 === e.keyCode) {
        root.fire("previous-level", root);
      }
    });
  }
});
