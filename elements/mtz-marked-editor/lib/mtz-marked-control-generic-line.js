import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/iron-a11y-keys/iron-a11y-keys.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import { mtzMarkedControlLineBehaviorImpl } from "./mtz-marked-control-line-behavior.js";
import { mtzMarkedControlBehavior } from "./mtz-marked-control-behavior.js";

class MtzMarkedControlGenericLine extends mtzMarkedControlBehavior(
  mtzMarkedControlLineBehaviorImpl(PolymerElement)
) {
  static get template() {
    return html`
      <style>
        :host {
          display: inline-block;
        }
      </style>

      <paper-icon-button
        icon="[[icon]]"
        noink="[[noink]]"
        on-click="_handleCommand"
        alt="[[title]]"
      ></paper-icon-button>

      <iron-a11y-keys
        keys="[[keys]]"
        on-keys-pressed="_handleCommand"
        target="[[__editor]]"
      ></iron-a11y-keys>
    `;
  }

  static get tag() {
    return "mtz-marked-control-generic-line";
  }

  static get properties() {
    return {
      ...super.properties,

      title: String,
      icon: String,
      keys: String,
      noink: Boolean, // Pass-through
    };
  }
}
window.customElements.define(
  MtzMarkedControlGenericLine.tag,
  MtzMarkedControlGenericLine
);
export { MtzMarkedControlGenericLine };
