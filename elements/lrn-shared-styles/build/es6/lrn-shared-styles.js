import {
  html,
  PolymerElement
} from "./node_modules/@polymer/polymer/polymer-element.js";
export { LrnSharedStyles };
class LrnSharedStyles extends PolymerElement {
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
  static get properties() {
    return {};
  }
  static get tag() {
    return "lrn-shared-styles";
  }
  connectedCallback() {
    super.connectedCallback();
  }
}
window.customElements.define(LrnSharedStyles.tag, LrnSharedStyles);
