import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/iron-a11y-keys/iron-a11y-keys.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button.js";
import { mtzMarkedControlWrapperBehaviorImpl } from "./mtz-marked-control-wrapper-behavior.js";
import { mtzMarkedControlBehavior } from "./mtz-marked-control-behavior.js";

class MtzMarkedControlGenericWrap extends mtzMarkedControlBehavior(
  mtzMarkedControlWrapperBehaviorImpl(PolymerElement)
) {
  static get template() {
    return html`
      <style>
        :host {
          display: inline-block;
        }
      </style>

      <simple-icon-button
        icon="[[icon]]"
        noink="[[noink]]"
        on-click="_handleCommand"
        alt="[[title]]"
      ></simple-icon-button>

      <iron-a11y-keys
        keys="[[keys]]"
        on-keys-pressed="_handleCommand"
        target="[[__editor]]"
      ></iron-a11y-keys>
    `;
  }

  static get tag() {
    return "mtz-marked-control-generic-wrap";
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
  MtzMarkedControlGenericWrap.tag,
  MtzMarkedControlGenericWrap
);
export { MtzMarkedControlGenericWrap };
