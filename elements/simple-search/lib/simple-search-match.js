/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";

/**
 * `simple-search-match`
 * @element simple-search-match
 * matched term that can be searched with simple-search
 * 
### Styling

`<simple-search-match>` provides the following custom properties
for styling:

Custom property | Description | Default
----------------|-------------|----------
`--simple-search-match-font-family` | font-family for matched content | unset
`--simple-search-match-font-weight` | font-weight for matched content | bold
`--simple-search-match-text-color` | text color for matched content | #000
`--simple-search-match-bg-color` | background-color for matched content | #f0f0f0
`--simple-search-match-border-color` | border-color for matched content | #ddd
`--simple-search-match-border` | border for matched content | 1px solid
`--simple-search-match-border-radius` | border-radius for matched content | 0.16px
`--simple-search-match-padding` | padding for matched conten | 0.16px 4px
 *

 * @demo ./demo/index.html
 */
class SimpleSearchMatch extends LitElement {
  static get tag() {
    return "simple-search-match";
  }

  static get properties() {
    return {
      ...super.properties,

      matchNumber: {
        type: Number,
        reflect: true,
        attribute: "match-number",
      },
    };
  }

  // render function
  static get styles() {
    return [
      css`
        :host {
          margin-right: 4px;
          font-family: var(--simple-search-match-font-family, unset);
          color: var(--simple-search-match-text-color, #000);
          background-color: var(--simple-search-match-bg-color, #f0f0f0);
          border: var(--simple-search-match-border, 1px solid);
          border-color: var(--simple-search-match-border-color, #ddd);
          padding: var(--simple-search-match-padding, 0.16px 0px 0.16px 4px);
          border-radius: var(--simple-search-match-border-radius, 0.16px);
          font-weight: var(--simple-search-match-font-weight, bold);
        }
      `,
    ];
  }

  render() {
    return html` <slot></slot> `;
  }
}
customElements.define(SimpleSearchMatch.tag, SimpleSearchMatch);

export { SimpleSearchMatch };
