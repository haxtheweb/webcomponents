/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import {
  HAX_TRAVELER_ERAS,
  futureTraveler,
  HaxFutureTravelerStyles,
} from "@haxtheweb/hax-network-bar/lib/hax-future-traveler.js";
import { marketingTokens } from "@haxtheweb/hax-marketing-theme/lib/hax-marketing-blocks.js";

/**
 * `hax-future-goggles`
 * `The Future Traveler floating with his goggles lit; click him to travel to another time`
 *
 * Future is what HAX's search and commands answers to ("Ok Future"). This
 * block shows the Future Traveler whose goggles you see it through: he
 * floats, his lenses glow, and every click (or a pick from the row of
 * eras under him) sends him to another time period, drawn the way that era
 * would have drawn him (HAX_TRAVELER_ERAS in hax-network-bar). Nothing
 * floats, pulses or glitches for a visitor who asks for less motion.
 *
 * @element hax-future-goggles
 */
class HaxFutureGoggles extends DDD {
  static get tag() {
    return "hax-future-goggles";
  }
  static get properties() {
    return {
      ...super.properties,
      /** the era he is in, an id from HAX_TRAVELER_ERAS */
      era: { type: String, reflect: true },
      /** the line under him */
      tagline: { type: String },
      /** how to change the era, said once */
      hint: { type: String },
      /** label for the row of eras */
      erasLabel: { type: String, attribute: "eras-label" },
      /** label for the big button; the era is added after it */
      travelLabel: { type: String, attribute: "travel-label" },
      /** hide the row of eras under him */
      noEras: { type: Boolean, reflect: true, attribute: "no-eras" },
    };
  }
  static get haxProperties() {
    return new URL(`./${this.tag}.haxProperties.json`, import.meta.url).href;
  }
  constructor() {
    super();
    this.era = "now";
    this.tagline = "";
    this.hint = "";
    this.erasLabel = "Time periods";
    this.travelLabel = "Travel to another time";
    this.noEras = false;
    this._glitchTimer = null;
  }
  disconnectedCallback() {
    clearTimeout(this._glitchTimer);
    super.disconnectedCallback();
  }
  /** the era entry for the current era, today when it is not one */
  get current() {
    return (
      HAX_TRAVELER_ERAS.find((e) => e.id === this.era) || HAX_TRAVELER_ERAS[0]
    );
  }
  /**
   * Go to an era, tearing between the two like the network bar's traveler;
   * the swap lands halfway through the tear.
   */
  travel(era) {
    const ids = HAX_TRAVELER_ERAS.map((e) => e.id);
    const next =
      era && ids.includes(era)
        ? era
        : ids[(ids.indexOf(this.current.id) + 1) % ids.length];
    if (next === this.current.id) {
      return;
    }
    const still =
      globalThis.matchMedia &&
      globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stage = this.shadowRoot && this.shadowRoot.querySelector(".stage");
    clearTimeout(this._glitchTimer);
    if (still || !stage) {
      this.era = next;
      return;
    }
    stage.classList.remove("ft-glitch");
    // restart the tear if one is already running
    void stage.offsetWidth;
    stage.classList.add("ft-glitch");
    this._glitchTimer = setTimeout(() => {
      this.era = next;
      this._glitchTimer = setTimeout(() => {
        stage.classList.remove("ft-glitch");
      }, 160);
    }, 160);
    this.dispatchEvent(
      new CustomEvent("hax-future-goggles-travel", {
        bubbles: true,
        composed: true,
        detail: { era: next },
      }),
    );
  }
  static get styles() {
    return [
      super.styles,
      marketingTokens,
      HaxFutureTravelerStyles,
      css`
        :host {
          display: block;
          --hax-future-goggles-light: var(
            --hm-shade,
            var(--ddd-theme-default-keystoneYellow)
          );
          --hax-future-goggles-light-2: var(
            --hm-shade-2,
            var(--ddd-theme-default-skyBlue)
          );
        }
        figure {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--ddd-spacing-4);
          margin: var(--ddd-spacing-0);
        }
        .traveler {
          position: relative;
          display: grid;
          place-items: center;
          width: clamp(180px, 34vw, 280px);
          aspect-ratio: 1;
          padding: var(--ddd-spacing-0);
          border: none;
          border-radius: 50%;
          background-color: transparent;
          color: inherit;
          cursor: pointer;
        }
        .traveler:focus-visible,
        .eras button:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        /* the light from the lenses: two glows where his goggles sit */
        .light {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          pointer-events: none;
          background:
            radial-gradient(
              circle at 34% 69%,
              var(--hax-future-goggles-light) 0,
              transparent 22%
            ),
            radial-gradient(
              circle at 66% 69%,
              var(--hax-future-goggles-light) 0,
              transparent 22%
            ),
            radial-gradient(
              circle at 50% 60%,
              var(--hax-future-goggles-light-2) 0,
              transparent 62%
            );
          opacity: 0.55;
        }
        .stage {
          position: relative;
          display: block;
          --future-traveler-size: clamp(140px, 26vw, 220px);
        }
        /* the lenses lit from inside, over whatever the era drew in them */
        .shine {
          position: absolute;
          inset: 0;
          pointer-events: none;
          mix-blend-mode: screen;
          background:
            radial-gradient(
              circle at 34.2% 69.2%,
              var(--ddd-theme-default-white) 0,
              var(--hax-future-goggles-light) 5%,
              transparent 11%
            ),
            radial-gradient(
              circle at 65.8% 69.2%,
              var(--ddd-theme-default-white) 0,
              var(--hax-future-goggles-light) 5%,
              transparent 11%
            );
          opacity: 0.85;
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip-path: inset(50%);
          white-space: nowrap;
        }
        figcaption {
          text-align: center;
          max-width: 36ch;
        }
        .tagline {
          font-family: var(--ddd-font-heading, var(--ddd-font-primary));
          font-size: var(--ddd-font-size-s);
          font-weight: var(--ddd-font-weight-bold);
          line-height: var(--ddd-lh-120);
          margin: var(--ddd-spacing-0) var(--ddd-spacing-0) var(--ddd-spacing-2);
        }
        .era {
          display: inline-block;
          font-family: var(--ddd-font-navigation, var(--ddd-font-primary));
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin: var(--ddd-spacing-0);
          padding: var(--ddd-spacing-1) var(--ddd-spacing-3);
          border: var(--ddd-border-size-sm) solid var(--hm-edge, var(--hm-ink));
          border-radius: 999px;
          background-color: var(--hm-surface);
        }
        .hint {
          font-size: var(--ddd-font-size-4xs);
          margin: var(--ddd-spacing-2) var(--ddd-spacing-0) var(--ddd-spacing-0);
        }
        .eras {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: center;
          gap: var(--ddd-spacing-1);
          margin: var(--ddd-spacing-0);
          padding: var(--ddd-spacing-0);
          list-style: none;
          width: 100%;
          max-width: 420px;
        }
        .eras button {
          display: grid;
          place-items: center;
          width: var(--ddd-spacing-11);
          height: var(--ddd-spacing-11);
          padding: var(--ddd-spacing-0);
          border: var(--ddd-border-size-sm) solid transparent;
          border-radius: var(--ddd-radius-sm);
          /* a soft well, so the light-colored eras still show on white */
          background-color: var(--hm-soft);
          cursor: pointer;
          --future-traveler-size: var(--ddd-spacing-8);
        }
        .eras button:hover {
          border-color: var(--hm-line);
        }
        .eras button[aria-pressed="true"] {
          border-color: var(--hm-edge, var(--hm-ink));
          background-color: var(--hm-surface);
        }
        @media (prefers-reduced-motion: no-preference) {
          .stage {
            animation: hfg-float 4.2s ease-in-out infinite;
          }
          .light,
          .shine {
            animation: hfg-glow 2.6s ease-in-out infinite;
          }
          /* his lit goggles keep humming, not only on hover */
          .traveler .ft-glow {
            animation: ft-hum 1.3s ease-in-out infinite;
          }
          .traveler .ft-bulb {
            animation: ft-blink 2.2s ease-in-out infinite;
          }
        }
        @keyframes hfg-float {
          50% {
            transform: translateY(calc(-1 * var(--ddd-spacing-3)));
          }
        }
        @keyframes hfg-glow {
          50% {
            opacity: 1;
          }
        }
      `,
    ];
  }
  render() {
    const now = this.current;
    return html`
      <figure>
        <button
          type="button"
          class="traveler ft-host"
          title="${this.travelLabel}"
          @click="${() => this.travel()}"
        >
          <span class="light" aria-hidden="true"></span>
          <span class="stage" aria-hidden="true"
            >${futureTraveler(now.id)}<span class="shine"></span></span
          ><span class="sr-only">${this.travelLabel}: ${now.label}</span>
        </button>
        <figcaption>
          ${this.tagline ? html`<p class="tagline">${this.tagline}</p>` : ``}
          <p class="era" aria-live="polite">${now.label}</p>
          ${this.hint ? html`<p class="hint">${this.hint}</p>` : ``}
        </figcaption>
        ${
          this.noEras
            ? ``
            : html`<ul class="eras" aria-label="${this.erasLabel}">
                ${HAX_TRAVELER_ERAS.map(
                  (e) =>
                    html`<li>
                      <button
                        type="button"
                        class="ft-host"
                        title="${e.label}"
                        aria-pressed="${e.id === now.id ? "true" : "false"}"
                        @click="${() => this.travel(e.id)}"
                      >
                        <span aria-hidden="true">${futureTraveler(e.id)}</span
                        ><span class="sr-only">${e.label}</span>
                      </button>
                    </li>`,
                )}
              </ul>`
        }
      </figure>
    `;
  }
}
globalThis.customElements.define(HaxFutureGoggles.tag, HaxFutureGoggles);

export { HaxFutureGoggles };
