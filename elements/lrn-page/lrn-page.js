import { LitElement, html, css } from "lit-element/lit-element.js";
/**
`lrn-page`
A LRN element for a "page" of material. This ensures there's an OERSchema wrapper
so that all content produced has a baseline level of being identified as OER.

* @demo demo/index.html
*/
class LrnPage extends LitElement {
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
  constructor() {
    super();
    import("@lrnwebcomponents/oer-schema/oer-schema.js");
  }
  render() {
    return html` <oer-schema><slot></slot></oer-schema> `;
  }

  static get tag() {
    return "lrn-page";
  }
}
window.customElements.define(LrnPage.tag, LrnPage);
export { LrnPage };
