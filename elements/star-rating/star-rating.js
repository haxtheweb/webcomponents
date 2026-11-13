/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css, nothing } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icon-button.js";
import "@haxtheweb/simple-icon/simple-icon.js";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";
import { SchemaBehaviors } from "@haxtheweb/schema-behaviors/schema-behaviors.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { DDDAccentStyles } from "@haxtheweb/d-d-d/lib/DDDAccent.js";
/**
 * `star-rating`
 * `Rating display widget or button to do rating`
 *
 * @demo demo/index.html
 * @element star-rating
 */
class StarRating extends I18NMixin(SchemaBehaviors(SimpleColors)) {
  static get tag() {
    return "star-rating";
  }

  static get haxProperties() {
    return {
      canScale: true,
      gizmo: {
        title: "Star rating",
        description: "Show a star rating, or let readers pick one.",
        icon: "icons:star",
        color: "yellow",
        tags: [
          "Instructional",
          "rating",
          "stars",
          "rubric",
          "scale",
          "feedback",
        ],
        handles: [],
        meta: {
          author: "HAXTheWeb core team",
        },
      },
      settings: {
        configure: [
          {
            property: "score",
            title: "Score",
            description: "Current score value.",
            inputMethod: "number",
          },
          {
            property: "possible",
            title: "Possible",
            description: "Maximum possible score.",
            inputMethod: "number",
          },
          {
            property: "numStars",
            title: "Number of Stars",
            description: "Number of stars to display.",
            inputMethod: "number",
          },
          {
            property: "interactive",
            title: "Interactive",
            description: "Allow user interaction to set the rating.",
            inputMethod: "boolean",
          },
        ],
        advanced: [
          {
            property: "rubricScaleMode",
            title: "Rubric Scale Mode",
            description:
              "Emit OER Schema RubricScale and RubricLevel metadata (levelOrdinal/levelPoints) for each star.",
            inputMethod: "boolean",
          },
        ],
      },
      demoSchema: [
        {
          tag: "star-rating",
          properties: {
            score: 80,
            possible: 100,
            numStars: 5,
          },
          content: "",
        },
      ],
    };
  }

  static get styles() {
    return [
      super.styles,
      DDDAccentStyles,
      css`
        :host {
          display: block;
          font-size: 12px;
          font-weight: var(--ddd-font-weight-regular, normal);
          --star-rating-padding-left: 12px;
          --star-rating-margin: 0;
          --star-rating-size: var(--ddd-icon-xxs, 24px);
          /* one star colour: Roar Golden on light, Keystone Yellow on dark
             (3:1 in both schemes); an accent-color swaps in the DDD accent */
          --star-rating-star-color: var(
            --ddd-accent-color,
            light-dark(
              var(--ddd-theme-default-roarGolden, #bf8226),
              var(--ddd-theme-default-keystoneYellow, #ffd100)
            )
          );
        }
        /* yellow is the default accent, so it keeps the contrast-safe pair */
        :host([accent-color="yellow"]) {
          --star-rating-star-color: light-dark(
            var(--ddd-theme-default-roarGolden, #bf8226),
            var(--ddd-theme-default-keystoneYellow, #ffd100)
          );
        }
        .wrapper {
          display: inline-flex;
          align-items: center;
        }
        .stars {
          display: inline-flex;
          gap: 2px;
          background-color: var(--star-rating-background-color, transparent);
        }
        simple-icon,
        simple-icon-button {
          --simple-icon-color: var(
            --star-rating-color,
            var(--star-rating-star-color)
          );
          --simple-icon-button-focus-color: var(
            --star-rating-color,
            var(--star-rating-star-color)
          );
          --simple-icon-height: var(--star-rating-size, 24px);
          --simple-icon-width: var(--star-rating-size, 24px);
        }
        simple-icon-button::part(button) {
          border-radius: var(--ddd-radius-xs, 4px);
        }
        simple-icon-button::part(button):focus-visible {
          outline: var(--ddd-focus-ring, 2px solid #005fa9);
          outline-offset: var(--ddd-focus-offset, 2px);
        }
        .rating {
          padding-inline-start: var(--star-rating-padding-left);
          margin: var(--star-rating-margin);
          line-height: var(--star-rating-size, 24px);
          font-family: var(--ddd-font-navigation, sans-serif);
          font-weight: var(--ddd-font-weight-medium, 500);
          font-size: var(--ddd-font-size-4xs, 14px);
          color: light-dark(
            var(--ddd-theme-default-slateGray, #314d64),
            var(--ddd-theme-default-limestoneMaxLight, #f5f5f5)
          );
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
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
      /**
       * Opt-in: emit OER Schema RubricScale + RubricLevel metadata.
       */
      rubricScaleMode: {
        type: Boolean,
        attribute: "rubric-scale-mode",
        reflect: true,
      },
      /**
       * 1-based index of the star that currently holds the roving tab
       * stop of the APG radiogroup; unset follows the checked star
       * (haxtheweb/issues#3107)
       */
      _rovingStar: { type: Number },
    };
  }

  // these defaults in constructor assume that it's an empty star rating by default
  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      starRating: "Star rating",
      rateValueOfAmount: "Rate {value} of {amount}",
      ratingValueOutOfAmount: "{value} out of {amount} stars",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("./locales/", import.meta.url).href,
    });
    this._calPercent = 0;
    this.numStars = 5;
    this.score = 10;
    this.possible = 100;
    this.dark = true;
    this.contrast = 0;
    this.accentColor = "yellow";
    this.rubricScaleMode = false;
  }

  /**
   * stars filled out of numStars, rounded to one decimal place and kept
   * within 0..numStars (score 70 of 100 on 5 stars is 3.5)
   */
  get _starValue() {
    const stars = Number(this.numStars) || 0;
    const possible = Number(this.possible) || 1;
    const raw = (stars * (Number(this.score) || 0)) / possible;
    const clamped = Math.min(stars, Math.max(0, raw));
    return Math.round(clamped * 10) / 10;
  }
  /**
   * spoken rating, e.g. "3.5 out of 5 stars"
   */
  get _spokenRating() {
    return this.t.ratingValueOutOfAmount
      .replace("{value}", () => this._starValue)
      .replace("{amount}", () => this.numStars);
  }

  render() {
    // display mode is one image with a spoken label; interactive mode keeps
    // its radiogroup and adds the spoken value as visually hidden text
    return html`
      <div
        class="wrapper"
        typeof="${this.rubricScaleMode ? "oer:RubricScale" : nothing}"
        role="${this.interactive ? nothing : "img"}"
        aria-label="${this.interactive ? nothing : this._spokenRating}"
      >
        <div
          class="stars"
          role="${this.interactive ? "radiogroup" : nothing}"
          aria-label="${this.interactive ? this.t.starRating : nothing}"
          @keydown="${this._starsKeydown}"
          @focusin="${this._starsFocusin}"
        >
          ${this.renderStar(this.numStars, this.interactive)}
        </div>
        <div class="rating">
          <span aria-hidden="true">${this._starValue}/${this.numStars}</span>${
            this.interactive
              ? html`<span class="sr-only">${this._spokenRating}</span>`
              : nothing
          }
        </div>
      </div>
    `;
  }
  /**
   * 1-based index of the star that matches the current rating (0 when the
   * rating rounds to no star); the aria-checked radio of the radiogroup
   * (haxtheweb/issues#3107)
   */
  get _checkedStar() {
    return Math.round(this.numStars * this._calPercent);
  }
  /**
   * 1-based index of the star that holds the roving tab stop: the focused
   * star, else the checked star, else the first star
   * (haxtheweb/issues#3107)
   */
  get _tabStopStar() {
    if (this._rovingStar) {
      return this._rovingStar;
    }
    return this._checkedStar > 0 ? this._checkedStar : 1;
  }
  /**
   * the interactive star hosts, in order
   */
  __starButtons() {
    return this.shadowRoot
      ? [...this.shadowRoot.querySelectorAll("simple-icon-button.star")]
      : [];
  }
  /**
   * the roving tab stop follows whichever star holds focus so the tab
   * order matches where the user is interacting (clicks focus the inner
   * button, so pointer selection keeps its tab stop too)
   * (haxtheweb/issues#3107)
   */
  _starsFocusin(e) {
    if (!this.interactive) {
      return;
    }
    const idx = this.__starButtons().indexOf(e.target);
    if (idx > -1) {
      this._rovingStar = idx + 1;
    }
  }
  /**
   * APG rating radiogroup keys (haxtheweb/issues#3107): ArrowRight/
   * ArrowUp and ArrowLeft/ArrowDown move focus to the next/previous star
   * with wraparound AND select it; Home/End move focus to the first/last
   * star without selecting.
   */
  _starsKeydown(e) {
    if (!this.interactive) {
      return;
    }
    const stars = this.__starButtons();
    if (
      stars.length === 0 ||
      ![
        "ArrowRight",
        "ArrowUp",
        "ArrowLeft",
        "ArrowDown",
        "Home",
        "End",
      ].includes(e.key)
    ) {
      return;
    }
    e.preventDefault();
    // star-rating's own shadowRoot.activeElement is the focused star
    // (document.activeElement would retarget to this host instead)
    const current = Math.max(0, stars.indexOf(this.shadowRoot.activeElement));
    let next;
    switch (e.key) {
      case "ArrowRight":
      case "ArrowUp":
        next = (current + 1) % stars.length;
        break;
      case "ArrowLeft":
      case "ArrowDown":
        next = (current - 1 + stars.length) % stars.length;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = stars.length - 1;
        break;
    }
    stars[next].focus();
    if (e.key !== "Home" && e.key !== "End") {
      this._selectStar(next + 1);
    }
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
        // intentionally empty
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
        const value = count + 1;
        // haxtheweb/issues#3107: true APG radiogroup semantics. The role
        // lands on simple-icon-button's internal native button via the
        // role pass-through so the star hosts stay semantic-free wrappers
        // (axe nested-interactive stays clean); label supplies the inner
        // button's accessible name, aria-checked marks the rating's star,
        // and the roving tab stop rides the inner button's tabindex
        content.push(
          html`<simple-icon-button
            @click="${this.interactiveEvent}"
            icon="${icon}"
            accent-color="${this.accentColor}"
            ?dark="${this.dark}"
            contrast="${this.contrast}"
            class="star"
            data-value="${value}"
            label="${this.t.rateValueOfAmount
              .replace("{value}", () => value)
              .replace("{amount}", () => amount)}"
            .buttonRole="${"radio"}"
            .ariaChecked="${value === this._checkedStar}"
            .buttonTabindex="${value === this._tabStopStar ? 0 : -1}"
            typeof="${this.rubricScaleMode ? "oer:RubricLevel" : nothing}"
            property="${this.rubricScaleMode ? "oer:hasLevel" : nothing}"
            >${
              this.rubricScaleMode
                ? html`<meta
                      property="oer:levelOrdinal"
                      content="${value}"
                    /><meta
                      property="oer:levelPoints"
                      content="${this._rubricLevelPoints(value)}"
                    />`
                : nothing
            }</simple-icon-button
          >`,
        );
      } else {
        content.push(
          html`<simple-icon
            icon="${icon}"
            accent-color="${this.accentColor}"
            ?dark="${this.dark}"
            contrast="${this.contrast}"
            class="star"
            typeof="${this.rubricScaleMode ? "oer:RubricLevel" : nothing}"
            property="${this.rubricScaleMode ? "oer:hasLevel" : nothing}"
            >${
              this.rubricScaleMode
                ? html`<meta
                      property="oer:levelOrdinal"
                      content="${count + 1}"
                    /><meta
                      property="oer:levelPoints"
                      content="${this._rubricLevelPoints(count + 1)}"
                    />`
                : nothing
            }</simple-icon
          >`,
        );
      }
      count++;
    }
    return content;
  }

  /**
   * dispatches the value selection; shared by pointer clicks and the
   * APG arrow-key selects (haxtheweb/issues#3107)
   */
  _selectStar(value) {
    this.dispatchEvent(
      new CustomEvent("star-rating-click", {
        bubbles: true,
        cancelable: true,
        detail: {
          value: String(value),
        },
      }),
    );
  }
  interactiveEvent(e) {
    this._selectStar(e.target.getAttribute("data-value"));
  }
  /**
   * Calculate the points assigned to a given rubric level (1-indexed)
   * based on the total possible score spread evenly across all stars.
   */
  _rubricLevelPoints(level) {
    if (this.numStars === 0) return 0;
    return Math.round((this.possible / this.numStars) * level);
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
globalThis.customElements.define(StarRating.tag, StarRating);
export { StarRating };
