/**
 * Copyright 2023
 * @license , see License.md for full text.
 */
import { LitElement, html, css } from "lit";
/**
 * `polaris-story-card`
 * `A polaris PSU based branding styled theme`
 * @demo demo/index.html
 * @element polaris-story-card
 */
class PolarisStoryCard extends LitElement {
  static get properties() {
    return {
      image: { type: String },
      label: { type: String },
      pillar: { type: String },
      link: { type: String },
      backgroundSize: { type: String, attribute: "background-size" },
      backgroundAttachment: {
        type: String,
        attribute: "background-attachment",
      },
      editMode: { type: Boolean },
    };
  }

  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.image = "";
    this.label = "";
    this.pillar = "";
    this.link = "";
    this.backgroundSize = "cover";
    this.backgroundAttachment = "scroll";
    this.editMode = false;
  }
  /**
   * LitElement style callback
   */
  static get styles() {
    // support for using in other classes
    let styles = [];
    if (super.styles) {
      styles = super.styles;
    }
    return [
      styles,
      css`
        :host {
          display: inline-flex;
          flex: 1 1 var(--polaris-story-card-flex-basis, 260px);
          min-width: 0;
          max-width: 100%;
          color-scheme: light dark;
        }

        .link {
          display: flex;
          width: 100%;
          text-decoration: none;
          color: inherit;
        }
        .link:focus-visible {
          outline: 2px solid currentColor;
          outline-offset: 4px;
          border-radius: 12px;
        }

        .wrapper {
          text-align: center;
          min-height: 389px;
          border-radius: 12px;
          overflow: hidden;
          max-width: 100%;
          width: 100%;
          background-color: var(
            --polaris-story-card-background-color,
            light-dark(#0016e0, var(--ddd-theme-default-nittanyNavy, #001e44))
          );
          color: var(
            --polaris-story-card-color,
            var(--ddd-theme-default-white, #fff)
          );
          position: relative;
          min-width: var(--polaris-story-card-min-width, 255px);
          display: block;
        }
        .card-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-position: center;
          background-repeat: no-repeat;
          border-radius: 12px;
        }

        .body {
          position: absolute;
          bottom: 0.5rem;
          text-align: center;
          font-family: "Roboto", Arial, Helvetica, sans-serif;
          color: var(--ddd-theme-default-white, #fff);
          border: 3px solid var(--ddd-theme-default-white, #fff);
          background-color: rgba(0, 0, 0, 0.58);
          width: 195px;
          max-width: calc(100% - 3rem);
          left: 1.5rem;
          font-size: 1.5rem !important;
          line-height: 1.875rem !important;
        }

        .label {
          padding: 0;
          margin: 20px 10px;
        }

        .pillar {
          text-transform: uppercase;
          font-family: "Roboto", Arial, Helvetica, sans-serif;
          color: var(--ddd-theme-default-white, #fff);
          position: relative;
          top: 4px;
          padding: 4px 10px;
          background-color: var(--ddd-theme-default-nittanyNavy, #001e44);
          font-weight: 500;
        }
        /* Keep the pillar's layout box when empty so the relative offset
           is preserved and cards line up correctly when placed side by side. */
        .pillar.pillar-hidden {
          visibility: hidden;
        }
        @media (max-width: 360px) {
          .wrapper {
            min-width: 0;
            width: 100%;
          }
          .body {
            width: calc(100% - 3rem);
          }
        }
      `,
    ];
  }
  /**
   * LitElement render callback
   */
  render() {
    const card = html`
      <div class="wrapper">
        ${this.image
          ? html`<div
              class="card-image"
              role="img"
              aria-hidden="${this.link ? "true" : "false"}"
              aria-label="${this.label || this.pillar || "Story image"}"
              style="background-image: url(${this.image}); background-size: ${this.backgroundSize}; background-attachment: ${this.backgroundAttachment};"
            ></div>`
          : ``}
        <span class="pillar${this.pillar ? `` : ` pillar-hidden`}"
          >${this.pillar}</span
        >
        <div class="body">
          <div class="label">${this.label}</div>
        </div>
      </div>
    `;
    return this.link
      ? html`<a
          class="link"
          href="${this.link}"
          aria-label="${this.label || this.pillar || "Story card"}"
          @click="${this._clickLink}"
          >${card}</a
        >`
      : card;
  }
  /**
   * Implements haxHooks to tie into life-cycle if hax exists.
   * Keeps the card editable inside HAX while a link wraps it.
   */
  haxHooks() {
    return {
      editModeChanged: "haxeditModeChanged",
      activeElementChanged: "haxactiveElementChanged",
    };
  }
  /**
   * Set a flag to test if we should block link clicking while in edit mode.
   */
  haxeditModeChanged(val) {
    this.editMode = val;
  }
  /**
   * Prevent navigation while editing in HAX.
   */
  _clickLink(e) {
    if (this.editMode) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }
  /**
   * Ensure edit mode state is in sync with active element changes.
   */
  haxactiveElementChanged(el, val) {
    this.editMode = val;
    return false;
  }
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./${this.tag}.haxProperties.json`, import.meta.url).href;
  }
  /**
   * Convention we use
   */
  static get tag() {
    return "polaris-story-card";
  }
}
globalThis.customElements.define(PolarisStoryCard.tag, PolarisStoryCard);
export { PolarisStoryCard };
