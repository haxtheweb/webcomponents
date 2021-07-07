/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { SchemaBehaviors } from "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import { IntersectionObserverMixin } from "@lrnwebcomponents/intersection-element/lib/IntersectionObserverMixin.js";
import { I18NMixin } from "@lrnwebcomponents/i18n-manager/lib/I18NMixin.js";
/**
 * `a11y-gif-player`
 * plays gifs in an accessible way by having the user click to play their animation
### Styling

`<a11y-gif-player>` provides the following custom properties
for styling:

Custom property | Description | Default
----------------|-------------|----------
`--a11y-gif-player-border` | border around player/button | none
`--a11y-gif-player-border-radius` | border-radius for player/button | 0
`--a11y-gif-player-focus-border` | border-radius for player/button when hovered or focused | none
`--a11y-gif-player-cursor` | cursor for player/button when hovered or focused | pointer
`--a11y-gif-player-outline` | outline for player/button when hovered or focused | 
`--a11y-gif-player-disabled-cursor` | cursor for player/button when disabled | not-allowed
`--a11y-gif-player-arrow-size` | arrow icon size | 30%
`--a11y-gif-player-arrow-opacity` | default arrow icon opacity | 0.5
`--a11y-gif-player-button-focus-opacity` | arrow icon opacity when hovered or focused | 0.7
`--a11y-gif-player-button-color` | arrow icon color | #000000
`--a11y-gif-player-arrow-border-color` | arrow icon border color | #ffffff
`--a11y-gif-player-arrow-border-width` | arrow icon border width | 15px
`--a11y-gif-player-button-text-color` | arrow icon text color | #ffffff
`--a11y-gif-player-button-bg` | button background color when no static image | #cccccc
 *
 * @demo ./demo/index.html
 * @element a11y-gif-player
 */
class A11yGifPlayer extends I18NMixin(
  IntersectionObserverMixin(SchemaBehaviors(LitElement))
) {
  constructor() {
    super();
    this.__gifLoaded = false;
    this.disabled = false;
    this.tooltip = "";
    this.__playing = false;
    this._updateFromSlot();
    this.t = {
      toggleAnimation: "Toggle animation",
    };
    this.registerLocalization({
      context: this,
      basePath: import.meta.url,
      locales: ["es"],
    });
  }
  /**
   * LitElement render styles
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        :host([hidden]) {
          display: none;
        }
        .sr-only {
          position: absolute;
          left: -9999999px;
          top: 0;
          width: 0;
          overflow: hidden;
        }
        #container {
          padding: 0;
          margin: 0;
          position: relative;
          border: var(--a11y-gif-player-border, none);
          border-radius: var(--a11y-gif-player-border-radius, 0);
        }
        img {
          width: 100%;
        }
        button {
          position: absolute;
          width: 100%;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          background-size: contain;
          background-color: var(--a11y-gif-player-button-bg, #cccccc);
        }
        button:active,
        button:focus,
        button:hover {
          border: var(--a11y-gif-player-focus-border, none);
          outline: var(--a11y-gif-player-outline, 3px solid);
        }
        button[disabled] {
          cursor: var(--a11y-gif-player-disabled-cursor, not-allowed);
        }
        button[aria-pressed="true"] {
          opacity: 0;
        }
        svg {
          position: absolute;
          top: 35%;
          left: 35%;
          width: var(--a11y-gif-player-arrow-size, 30%);
          height: var(--a11y-gif-player-arrow-size, 30%);
        }
        g {
          opacity: var(--a11y-gif-player-arrow-opacity, 0.5);
        }
        button:not([disabled]):active g,
        button:not([disabled]):hover g,
        button:not([disabled]):focus g {
          opacity: var(--a11y-gif-player-button-focus-opacity, 0.7);
        }
        polygon {
          fill: var(--a11y-gif-player-button-color, #000000);
          stroke: var(--a11y-gif-player-arrow-border-color, #ffffff);
          stroke-width: var(--a11y-gif-player-arrow-border-width, 15px);
        }
        text {
          fill: var(--a11y-gif-player-button-text-color, #ffffff);
        }
        #longdesc {
          position: absolute;
          left: 2px;
          bottom: 2px;
          width: calc(100% - 2px);
          font-size: 80%;
        }
        simple-tooltip {
          --simple-tooltip-background: #000000;
          --simple-tooltip-opacity: 1;
          --simple-tooltip-text-color: #ffffff;
          --simple-tooltip-delay-in: 0;
        }
      `,
    ];
  }
  __imageLoaded(e) {
    this.__gifLoaded = true;
  }
  render() {
    return html`${this.elementVisible
      ? html`
          <div id="container">
            <slot hidden></slot>
            <img
              src="${this.__gifLoaded && this.__playing
                ? this.src
                : this.srcWithoutAnimation}"
              alt="${this.alt}"
              loading="lazy"
              aria-describedby="${this.longdesc ? "longdesc" : ""} ${(
                this.describedBy || ""
              ).trim()}"
              slot="summary"
            />
            ${this.__playing
              ? html`<img
                  src="${this.src}"
                  alt=""
                  hidden
                  slot="summary"
                  @load="${this.__imageLoaded}"
                />`
              : nothing}

            <button
              id="button"
              aria-controls="gif"
              aria-pressed="${this.__playing ? "true" : "false"}"
              @click="${this.toggle}"
              ?disabled="${this.disabled || !this.src}"
              .style="background-image: url('${this.srcWithoutAnimation}')"
            >
              <svg
                id="svg"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 200 200"
              >
                <g>
                  <polygon points="30,20 30,180 170,100"></polygon>
                  <text x="50" y="115" font-size="40px">GIF</text>
                </g>
              </svg>
              <span class="sr-only">
                ${this.__playing && this.tooltipPlaying
                  ? this.tooltipPlaying
                  : this.tooltip}
              </span>
            </button>
            <a11y-details
              id="longdesc"
              ?hidden="${!this.src || !this.longdesc}"
              .style="opacity:${this.__playing ? 0 : 1}"
            >
              <div slot="summary">info</div>
              <div slot="details">${this.longdesc}</div>
            </a11y-details>
          </div>
          <simple-tooltip for="button" offset="30" animation-delay="0">
            ${this.__playing && this.tooltipPlaying
              ? this.tooltipPlaying
              : this.tooltip}
          </simple-tooltip>
        `
      : nothing} `;
  }
  /**
   * Convention
   */
  static get tag() {
    return "a11y-gif-player";
  }
  /**
   * LitElement / popular convention
   */
  static get properties() {
    return {
      ...super.properties,
      /**
       * Alt text of gif
       */
      alt: {
        type: String,
      },
      /**
       * Whether button is disabled
       */
      disabled: {
        type: Boolean,
      },
      /*
       * other id's to add to aria-describedby
       */
      describedBy: {
        attribute: "described-by",
        type: String,
      },
      /**
       * longer image description for accesibility
       */
      longdesc: {
        type: String,
        attribute: "longdesc",
      },
      /**
       * Source of animated gif
       */
      src: {
        type: String,
      },
      /**
       * Source of static version of image
       */
      srcWithoutAnimation: {
        type: String,
        attribute: "src-without-animation",
      },
      /**
       * default tooltip
       */
      tooltip: {
        type: String,
      },
      /**
       * tooltip when playing
       */
      tooltipPlaying: {
        type: String,
        attribute: "tooltip-playing",
      },
      /**
       * whether GIF is playing
       */
      __playing: {
        type: Boolean,
      },
      /**
       * if the gif source is loaded to avoid jarring on load
       */
      __gifLoaded: {
        type: Boolean,
      },
    };
  }
  /**
   * LitElement updated life-cycle
   */
  updated(changedProperties) {
    super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      // import on visibility
      if (propName === "elementVisible" && this[propName]) {
        import("@lrnwebcomponents/a11y-details/a11y-details.js");
        import("@lrnwebcomponents/simple-tooltip/simple-tooltip.js");
      }
    });
  }
  /**
   * mutation observer for a11y-details
   * @readonly
   * @returns {object}
   */
  get observer() {
    let callback = () => this._updateFromSlot();
    return new MutationObserver(callback);
  }
  connectedCallback() {
    if (super.connectedCallback) super.connectedCallback();
    this.observer.observe(this, {
      attributes: false,
      childList: true,
      subtree: false,
    });
    window.addEventListener("beforeprint", (event) => {
      this.shadowRoot.querySelector("#longdesc").toggleOpen();
    });
    window.addEventListener("afterprint", (event) => {
      this.shadowRoot.querySelector("#longdesc").toggleOpen();
    });
  }
  disconnectedCallback() {
    if (super.disconnectedCallback) super.disconnectedCallback();
    this.observer.disconnect();
    window.removeEventListener("beforeprint", (event) => {
      this.shadowRoot.querySelector("#longdesc").toggleOpen();
    });
    window.removeEventListener("afterprint", (event) => {
      this.shadowRoot.querySelector("#longdesc").toggleOpen();
    });
  }
  /**
   * plays the animation regarless of previous state
   */
  play() {
    this.__playing = true;
  }
  /**
   * stops the animation regarless of previous state
   */
  stop() {
    this.__playing = false;
  }
  /**
   * toggles the animation based on current state
   */
  toggle() {
    if (this.__playing) {
      this.stop();
    } else {
      this.play();
    }
  }
  /**
   * deprecated. toggles the animation based on current state
   */
  toggleAnimation() {
    if (this.__playing) {
      this.stop();
    } else {
      this.play();
    }
  }
  /**
   * when slot changes update with animated gif
   */
  _updateFromSlot() {
    let img = this.querySelector("img"),
      src = img ? img.src : undefined,
      alt = img ? img.alt : undefined;
    if (src) this.srcWithoutAnimation = src;
    if (alt) this.alt = alt;
  }
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return (
      decodeURIComponent(import.meta.url) +
      `/../lib/${this.tag}.haxProperties.json`
    );
  }
}
window.customElements.define(A11yGifPlayer.tag, A11yGifPlayer);
export { A11yGifPlayer };
