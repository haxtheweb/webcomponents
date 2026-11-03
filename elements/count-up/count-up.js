/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { IntersectionObserverMixin } from "@haxtheweb/intersection-element/lib/IntersectionObserverMixin.js";
import { DDDAccentStyles } from "@haxtheweb/d-d-d/lib/DDDAccent.js";
import { CountUp } from "./lib/countup.js";

/**
 * `count-up`
 * `count up js wrapper with minimal styling`
 * @litElement
 * @demo demo/index.html
 * @element count-up
 */
class CountUpElement extends IntersectionObserverMixin(LitElement) {
  //styles function
  static get styles() {
    return [
      DDDAccentStyles,
      css`
        :host {
          display: inline-flex;
        }

        :host([hidden]) {
          display: none;
        }

        .wrapper {
          display: block;
          text-align: center;
          width: 100%;
          height: 100%;
        }
        /* the accent is a short rule above the number */
        .wrapper::before {
          content: "";
          display: block;
          width: var(--ddd-spacing-12, 48px);
          height: var(--ddd-spacing-1, 4px);
          margin: 0 auto var(--ddd-spacing-2, 8px);
          border-radius: var(--ddd-radius-xs, 4px);
          background-color: var(
            --ddd-accent-color,
            light-dark(
              var(--ddd-theme-default-beaverBlue, #1e407c),
              var(--ddd-theme-default-pughBlue, #96bee6)
            )
          );
        }

        /* DDD heading colour so the number reads on light and dark */
        #counter {
          color: var(
            --count-up-color,
            light-dark(
              var(--ddd-theme-default-nittanyNavy, #001e44),
              var(--ddd-theme-default-white, #ffffff)
            )
          );
          font-weight: var(
            --count-up-number-font-weight,
            var(--ddd-font-weight-bold, 700)
          );
          font-size: var(--count-up-number-font-size);
        }
      `,
    ];
  }

  // render function
  render() {
    return html` <div class="wrapper">
      <slot name="prefix"></slot>
      <div id="counter"></div>
      <slot name="suffix"></slot>
    </div>`;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,

      /**
       * Starting point for counting
       */
      start: {
        type: Number,
      },
      /**
       * End point for counting stopping
       */
      end: {
        type: Number,
      },
      /**
       * Duration to count
       */
      duration: {
        type: Number,
      },
      /**
       * Disable easing animation
       */
      noeasing: {
        type: Boolean,
      },
      /**
       * decimal places to show
       */
      decimalplaces: {
        type: Number,
      },
      /**
       * separator for 100s groupings
       */
      separator: {
        type: String,
      },
      /**
       * decimal point character
       */
      decimal: {
        type: String,
      },
      /**
       * prefix string before the number counting
       */
      prefixtext: {
        type: String,
      },
      /**
       * suffix string after the number counting
       */
      suffixtext: {
        type: String,
      },
      thresholds: {
        type: Array,
      },
      rootMargin: {
        type: String,
        attribute: "root-margin",
      },
      ratio: {
        type: Number,
        reflect: true,
      },
      elementVisible: {
        type: Boolean,
      },
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  /**
   * Specialized functions / life-cycle via haxHooks
   */
  haxHooks() {
    return {
      progressiveEnhancement: "haxprogressiveEnhancement",
      editModeChanged: "haxeditModeChanged",
    };
  }
  /**
   * Hook for HAX progressive enhancement: the number it counts up to, for RSS,
   * bots and readers without JavaScript.
   */
  haxprogressiveEnhancement(_el) {
    return this.end == null || Number.isNaN(Number(this.end))
      ? ""
      : `<span data-prog-fallback>${Number(this.end)}</span>`;
  }
  /**
   * Drop the saved fallback while editing; the hook writes a fresh one on save,
   * so a stale copy is never saved next to it.
   */
  haxeditModeChanged(value) {
    if (value) {
      this.querySelectorAll("[data-prog-fallback]").forEach((node) =>
        node.remove(),
      );
    }
  }
  static get tag() {
    return "count-up";
  }
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
  constructor() {
    super();
    this.start = 0;
    this.end = 100;
    this.duration = 2.5;
    this.noeasing = false;
    this.decimalplaces = 0;
    this.separator = ",";
    this.decimal = ".";
    this.prefixtext = " ";
    this.suffixtext = " ";
  }
  /**
   * LitElement ready
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this._buildCountUp();
  }

  /**
   * true when the reader asked the system for reduced motion
   */
  _prefersReducedMotion() {
    return Boolean(
      globalThis.matchMedia &&
        globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }

  _buildCountUp() {
    const reduced = this._prefersReducedMotion();
    const options = {
      startVal: this.start,
      decimalPlaces: this.decimalplaces,
      // reduced motion: no animation, the final number shows straight away
      duration: reduced ? 0 : this.duration,
      useEasing: !this.noeasing,
      separator: this.separator,
      decimal: this.decimal,
      prefix: this.prefixtext,
      suffix: this.suffixtext,
    };
    this._countUp = new CountUp(
      this.shadowRoot.querySelector("#counter"),
      this.end,
      options,
    );
    if (reduced) {
      this._countUp.start();
    }
  }
  /**
   * When our interection element claims we are visible then
   * we can start counting
   */
  updated(propertiesChanged) {
    if (super.updated) {
      super.updated(propertiesChanged);
    }
    propertiesChanged.forEach((oldValue, propName) => {
      if (propName == "elementVisible" && this[propName]) {
        this._countUp.start();
      }
      if (this.shadowRoot && propName == "end" && this[propName]) {
        this._buildCountUp();
        if (this.elementVisible) {
          this._countUp.start();
        }
      }
    });
  }
}
globalThis.customElements.define(CountUpElement.tag, CountUpElement);
export { CountUpElement, CountUp };
