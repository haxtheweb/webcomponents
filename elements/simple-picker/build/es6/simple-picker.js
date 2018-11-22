import {
  html,
  PolymerElement
} from "./node_modules/@polymer/polymer/polymer-element.js";
import { HAXWiring } from "../../node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
export { SimplePicker };
class SimplePicker extends PolymerElement {
  static get template() {
    return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>`;
  }
  static get haxProperties() {
    return {
      canScale: !0,
      canPosition: !0,
      canEditSource: !1,
      gizmo: {
        title: "Simple picker",
        description: "a simple picker for swatches, icons, etc.",
        icon: "icons:android",
        color: "green",
        groups: ["Picker"],
        handles: [{ type: "todo:read-the-docs-for-usage" }],
        meta: { author: "nikkimk", owner: "The Pennsylvania State University" }
      },
      settings: { quick: [], configure: [], advanced: [] }
    };
  }
  static get properties() {
    return {};
  }
  static get tag() {
    return "simple-picker";
  }
  connectedCallback() {
    super.connectedCallback();
    this.HAXWiring = new HAXWiring();
    this.HAXWiring.setHaxProperties(
      SimplePicker.haxProperties,
      SimplePicker.tag,
      this
    );
  }
}
window.customElements.define(SimplePicker.tag, SimplePicker);
