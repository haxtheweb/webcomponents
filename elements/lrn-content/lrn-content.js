import { LitElement, html, css } from "lit-element/lit-element.js";
/**
`lrn-content`
  A LRN element for presenting content with a simple heading.
  This is to improve accessibility, consistency, and tag things
  with OER schema.
* @demo demo/index.html
*/
class LrnContent extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
      `,
    ];
  }
  render() {
    return html`
      <div typeof="oer:SupportingMaterial">
        ${this.title ? html` <h2 property="oer:name">${this.title}</h2> ` : ``}
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
      },
    };
  }
}
window.customElements.define(LrnContent.tag, LrnContent);
export { LrnContent };
