/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import { AccentCard } from "../accent-card.js";

/**
 * `accent-card-clickable`
 * @element accent-card-clickable
 * a card with optional accent stylings.
 * 
### Styling
See `<accent-card-clickable>`
 *
 * @demo ./demo/index.html demo
 */
class AccentCardClickable extends LitElement {
  /**
   * Store tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "accent-card-clickable";
  }
  // render function
  static get styles() {
    return [
      css`
        :host,
        accent-card {
          display: flex;
          align-items: stretch;
          justify-content: stretch;
          flex-direction: column;
        }
        accent-card {
          position: relative;
          flex: 1 1 auto;
        }
        accent-card:focus-within,
        accent-card:hover {
          outline: 1px solid
            var(
              --accent-card-border-color,
              --simple-colors-default-theme-accent-6,
              #ddd
            );
        }
        ::slotted(*:not([data-clickable]:first-of-type)) {
          z-index: 2;
          position: relative;
        }
        ::slotted([data-clickable]:first-of-type) {
          z-index: 1;
        }
        ::slotted([data-clickable]:first-of-type):after {
          content: " ";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          right: 0;
        }
      `,
    ];
  }
  render() {
    return html`
      <accent-card
        accent-color="${this.accentColor}"
        ?accent-background="${this.accentBackground}"
        ?accent-heading="${this.accentHeading}"
        ?flat="${this.flat}"
        ?horizontal="${this.horizontal}"
        ?no-border="${this.noBorder}"
        image-align="${this.imageAlign}"
        image-src="${this.imageSrc}"
        image-valign="${this.imageValign}"
      >
        <slot name="heading" slot="heading"></slot>
        <slot name="corner" slot="corner"></slot>
        <slot name="subheading" slot="subheading"></slot>
        <slot name="content" slot="content"></slot>
        <slot name="footer" slot="footer"></slot>
      </accent-card>
    `;
  }

  // haxProperty definition
  static get haxProperties() {
    let haxProperties = AccentCard.haxProperties;
    haxProperties;
  }

  constructor() {
    super();
    this.accentBackground = false;
    this.accentHeading = false;
    this.flat = false;
    this.horizontal = false;
    this.noBorder = false;
  }

  // properties available to custom element for data binding
  static get properties() {
    return {
      ...SimpleColors.properties,
      ...AccentCard.properties,
    };
  }
}
customElements.define(AccentCardClickable.tag, AccentCardClickable);
export { AccentCardClickable };
