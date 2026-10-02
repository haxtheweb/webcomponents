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
 `--simple-search-match-text-color` | text color for matched content | light-dark(--ddd-theme-default-coalyGray, --ddd-theme-default-white)
 `--simple-search-match-bg-color` | background-color for matched content | light-dark(--ddd-theme-default-limestoneMaxLight, --ddd-theme-default-slateGray)
 `--simple-search-match-border-color` | border-color for matched content | light-dark(--ddd-theme-default-limestoneGray, --ddd-theme-default-slateLight)
`--simple-search-match-border` | border for matched content | 1px solid
`--simple-search-match-border-radius` | border-radius for matched content | 0.16px
`--simple-search-match-padding` | padding for matched conten | 0.16px 4px
 *

 * @demo demo/index.html
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
        /* dark-mode-critical match colors migrate with the simple-search
           chip palette as one unit; DDD tokens keep light-scheme contrast
           and flip in dark mode */
        :host {
          margin-right: 4px;
          font-family: var(--simple-search-match-font-family, unset);
          color: var(
            --simple-search-match-text-color,
            light-dark(
              var(--ddd-theme-default-coalyGray),
              var(--ddd-theme-default-white)
            )
          );
          background-color: var(
            --simple-search-match-bg-color,
            light-dark(
              var(--ddd-theme-default-limestoneMaxLight),
              var(--ddd-theme-default-slateGray)
            )
          );
          border: var(--simple-search-match-border, 1px solid);
          border-color: var(
            --simple-search-match-border-color,
            light-dark(
              var(--ddd-theme-default-limestoneGray),
              var(--ddd-theme-default-slateLight)
            )
          );
          padding: var(--simple-search-match-padding, 0.16px 0px 0.16px 4px);
          border-radius: var(--simple-search-match-border-radius, 0.16px);
          font-weight: var(--simple-search-match-font-weight, bold);
        }

        /* keyboard focus affordance for navigable matches (DDD focus tokens) */
        :host(:focus-visible) {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
      `,
    ];
  }

  render() {
    return html` <slot></slot> `;
  }
}
globalThis.customElements.define(SimpleSearchMatch.tag, SimpleSearchMatch);

export { SimpleSearchMatch };
