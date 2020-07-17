import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 * `lorem-data`
 * a threaded discussions component
 * 
### Styling

`<lorem-data>` provides the following custom properties
for styling:

Custom property | Description | Default
----------------|-------------|----------
`--lorem-data-FontSize` | default font-size | 14px
 *
 * @element lorem-data
 * @demo ./demo/index.html demo
 */
class LoremData extends LitElement {
  static get styles() {
    return [
      css``
    ];
  }
  get threads() {
    return html``;
  }

  static get tag() {
    return "lorem-data";
  }

  static get properties() {
    return {};
  }

  constructor() {
    super();
  }
  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      
    });
  }
}
window.customElements.define(LoremData.tag, LoremData);
export { LoremData };
