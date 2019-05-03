import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
/**
`lrn-content`
  A LRN element for presenting content with a simple heading.
  This is to improve accessibility, consistency, and tag things
  with OER schema.

* @demo demo/index.html
*/
class LrnContent extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <div typeof="oer:SupportingMaterial">
        <h2 property="oer:name" hidden$="[[!title]]">[[title]]</h2>
        <div property="oer:description"><slot></slot></div>
      </div>
    `;
  }
  static get tag() {
    return "lrn-content";
  }

  static get properties() {
    return {
      title: {
        type: String,
        value: false
      }
    };
  }
}
window.customElements.define(LrnContent.tag, LrnContent);
export { LrnContent };
