import {
  html,
  PolymerElement
} from "./node_modules/@polymer/polymer/polymer-element.js";
import { HAXWiring } from "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
export { IronA11YAnnouncer };
class IronA11YAnnouncer extends PolymerElement {
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
        title: "Iron a-11-y-announcer",
        description: "Automated conversion of iron-a11y-announcer/",
        icon: "icons:android",
        color: "green",
        groups: ["A"],
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
    return "iron-a-11-y-announcer";
  }
  connectedCallback() {
    super.connectedCallback();
    this.HAXWiring = new HAXWiring();
    this.HAXWiring.setHaxProperties(
      IronA11YAnnouncer.haxProperties,
      IronA11YAnnouncer.tag,
      this
    );
  }
}
window.customElements.define(IronA11YAnnouncer.tag, IronA11YAnnouncer);
