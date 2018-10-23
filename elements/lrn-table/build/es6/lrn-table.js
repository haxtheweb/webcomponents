import {
  html,
  PolymerElement
} from "./node_modules/@polymer/polymer/polymer-element.js";
import { HAXWiring } from "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
export { LrnTable };
class LrnTable extends PolymerElement {
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
        title: "Lrn table",
        description: "Automated conversion of lrn-table/",
        icon: "icons:android",
        color: "green",
        groups: ["Table"],
        handles: [{ type: "todo:read-the-docs-for-usage" }],
        meta: { author: "btopro", owner: "The Pennsylvania State University" }
      },
      settings: { quick: [], configure: [], advanced: [] }
    };
  }
  static get properties() {
    return {};
  }
  static get tag() {
    return "lrn-table";
  }
  connectedCallback() {
    super.connectedCallback();
    this.HAXWiring = new HAXWiring();
    this.HAXWiring.setHaxProperties(LrnTable.haxProperties, LrnTable.tag, this);
  }
}
window.customElements.define(LrnTable.tag, LrnTable);
