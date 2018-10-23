import {
  html,
  PolymerElement
} from "./node_modules/@polymer/polymer/polymer-element.js";
import { HAXWiring } from "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
export { LrnappMediaUpload };
class LrnappMediaUpload extends PolymerElement {
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
        title: "Lrnapp media-upload",
        description: "Automated conversion of lrnapp-media-upload/",
        icon: "icons:android",
        color: "green",
        groups: ["Media"],
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
    return "lrnapp-media-upload";
  }
  connectedCallback() {
    super.connectedCallback();
    this.HAXWiring = new HAXWiring();
    this.HAXWiring.setHaxProperties(
      LrnappMediaUpload.haxProperties,
      LrnappMediaUpload.tag,
      this
    );
  }
}
window.customElements.define(LrnappMediaUpload.tag, LrnappMediaUpload);
