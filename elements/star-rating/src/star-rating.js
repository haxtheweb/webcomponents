/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit-element";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
/**
 * `star-rating`
 * `Rating display widget or button to do rating`
 *
 * @demo demo/index.html
 * @element star-rating
 */
class StarRating extends SimpleColors {
  static get tag() {
    return "star-rating";
  }

  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
          font-size: 12px;
          font-weight: normal;
          --star-rating-padding-left: 12px;
          --star-rating-margin: 0;
          --star-rating-size: 24px;
        }
        .wrapper {
          display: inline-flex;
        }
        .stars {
          background-color: var(
            --star-rating-background-color,
            var(--simple-colors-default-theme-grey-9)
          );
        }
        simple-icon,
        simple-icon-button {
          --simple-icon-color: var(
            --star-rating-color,
            var(--simple-colors-default-theme-accent-7)
          );
          --simple-icon-height: var(--star-rating-size, 24px);
          --simple-icon-width: var(--star-rating-size, 24px);
        }
        .rating {
          padding-left: var(--star-rating-padding-left);
          margin: var(--star-rating-margin);
          line-height: var(--star-rating-size, 24px);
          vertical-align: center;
        }
        :host(:not([interactive])) simple-icon-button::part(button) {
          cursor: unset;
        }
      `,
    ];
  }

  static get properties() {
    return {
      ...super.properties,
      score: { type: Number }, // so like <star-rating score="50" possible="100">
      possible: { type: Number },
      interactive: { type: Boolean, reflect: true },
      numStars: { type: Number, attribute: "num-stars" },
      _calPercent: { type: Number }, // this value we'll calculate based on changes to score and possible
    };
  }

  // these defaults in constructor assume that it's an empty star rating by default
  constructor() {
    super();
    this._calPercent = 0;
    this.numStars = 5;
    this.score = 10;
    this.possible = 100;
    this.dark = true;
    this.contrast = 0;
    this.accentColor = "yellow";
  }

  render() {
    return html`
      <div class="wrapper">
        <div class="stars">
          ${this.renderStar(this.numStars, this.interactive)}
        </div>
        <div class="rating">
          ${this._calPercent} (${this.score}/${this.possible})
        </div>
      </div>
    `;
  }

  renderStar(amount, interactive) {
    if (amount === 0) {
      return html``;
    }
    let count = 0;
    const content = [];
    while (count < amount) {
      let icon = "star";
      if (count + 1 <= amount * this._calPercent) {
      } else if (
        amount * this._calPercent - (count + 1) < -0.01 &&
        amount * this._calPercent - (count + 1) >= -0.5
      ) {
        icon = "star-half";
      } else {
        icon = "star-border";
      }
      // interactive so it's a button
      if (interactive) {
        content.push(
          html`<simple-icon-button
            @click="${this.interactiveEvent}"
            icon="${icon}"
            accent-color="${this.accentColor}"
            ?dark="${this.dark}"
            contrast="${this.contrast}"
            class="star"
            data-value="${Number(count + 1)}"
          ></simple-icon-button>`
        );
      } else {
        content.push(
          html`<simple-icon
            icon="${icon}"
            accent-color="${this.accentColor}"
            ?dark="${this.dark}"
            contrast="${this.contrast}"
            class="star"
          ></simple-icon>`
        );
      }
      count++;
    }
    return content;
  }

  interactiveEvent(e) {
    this.dispatchEvent(
      new CustomEvent("star-rating-click", {
        bubbles: true,
        cancelable: true,
        detail: {
          value: e.target.getAttribute("data-value"),
        },
      })
    );
  }
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    // run through properties that have changed in this change record. Probably just 1 but at initial setup
    // it could be all of them at the same time
    changedProperties.forEach((oldValue, propName) => {
      // also sanity check that it's NOT 0 so we don't bust our Math via division by 0
      if (this.possible === 0) {
        this.possible = 1;
      }
      // https://stackoverflow.com/questions/6137986/javascript-roundoff-number-to-nearest-0-5
      if (["score", "possible"].includes(propName) && this.possible !== 0) {
        // this way when score or possible update, numStars will update automatically
        this._calPercent = Math.round((this.score / this.possible) * 100) / 100;
      }
    });
  }
}
customElements.define(StarRating.tag, StarRating);
export { StarRating };
