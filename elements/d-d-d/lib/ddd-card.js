/**
 * Copyright 2025 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

export class DddCard extends I18NMixin(DDDSuper(LitElement)) {
  static get tag() {
    return "ddd-card";
  }

  constructor() {
    super();
    this.title = null;
    this.src = null;
    this.href = null;
    this.target = "";
    this.rel = "noopener nofollow noreferrer";
    this.alt = "";
    this.label = null;
    this.noArrow = false;
    this.horizontal = false;
    this.clickable = false;
    this.t = {
      explore: "Explore",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL(`../locales/${this.tag}.es.json`, import.meta.url).href +
        "/../",
    });
  }

  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      alt: { type: String },
      src: { type: String },
      href: { type: String },
      rel: { type: String },
      target: { type: String },
      label: { type: String },
      noArrow: { type: Boolean, attribute: "no-arrow" },
      // image beside the text instead of above it
      horizontal: { type: Boolean, reflect: true },
      // the whole card is the link (needs href); the button is not drawn
      clickable: { type: Boolean, reflect: true },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        /* image rule and button hover, last match wins: DDD primary 1, theme
           primary, the palette accent (data-palette), a data-primary on the
           card itself */
        :host {
          --ddd-card-accent: var(
            --ddd-palette-accent,
            var(--ddd-theme-primary, var(--ddd-primary-1))
          );
          --ddd-card-accent-ink: var(
            --ddd-palette-accent-ink,
            var(--lowContrast-override, var(--ddd-card-button-color, white))
          );
          --ddd-card-border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-limestoneGray)
          );
          display: inline-block;
          width: 400px;
          background-color: var(
            --ddd-card-background,
            light-dark(white, var(--ddd-theme-default-coalyGray))
          );
          color: light-dark(var(--ddd-theme-default-coalyGray), white);
          border: var(--ddd-border-sm);
          border-width: var(--ddd-card-border-width, var(--ddd-border-size-sm));
          border-color: var(--ddd-card-border-color);
          border-radius: var(--ddd-card-radius, var(--ddd-radius-xl));
          font-family: var(--ddd-font-primary);
          box-shadow: var(--ddd-card-shadow, var(--ddd-boxShadow-sm));
          --ddd-card-pad: var(
            --ddd-card-padding,
            var(--ddd-surface-padding, var(--ddd-spacing-4))
          );
          margin: var(--ddd-spacing-2);
        }

        :host([data-primary]) {
          --ddd-card-accent: var(--ddd-theme-primary, var(--ddd-primary-1));
          --ddd-card-accent-ink: var(
            --lowContrast-override,
            var(--ddd-card-button-color, white)
          );
        }

        @media (max-width: 600px) {
          :host {
            width: auto;
          }
        }

        .card {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .image {
          border-bottom: var(--ddd-spacing-3) var(--ddd-card-accent) solid;
          /* follows a squarer card, never rounder than before */
          border-radius: min(
              var(--ddd-spacing-4),
              var(--ddd-card-radius, var(--ddd-radius-xl))
            )
            min(
              var(--ddd-spacing-4),
              var(--ddd-card-radius, var(--ddd-radius-xl))
            )
            0 0;
          overflow: hidden;
          height: var(--ddd-card-img-height, 260px);
          background-color: var(
            --ddd-card-border-color,
            var(--ddd-theme-default-limestoneLight)
          );
        }

        .image img {
          width: 100%;
          height: var(--ddd-card-img-height, 260px);
          border-radius: min(
              var(--ddd-spacing-5),
              var(--ddd-card-radius, var(--ddd-radius-xl))
            )
            min(
              var(--ddd-spacing-5),
              var(--ddd-card-radius, var(--ddd-radius-xl))
            )
            0 0;
          object-fit: cover;
          display: block;
        }
        /* no image: no empty image area, only the accent rule */
        .image.empty {
          height: 0;
        }

        .body {
          display: flex;
          flex-direction: column;
          flex: 1 1 auto;
          min-width: 0;
        }

        /* image beside the text, for lists of lessons */
        :host([horizontal]) {
          display: block;
          width: auto;
        }
        @media (min-width: 601px) {
          :host([horizontal]) .card {
            flex-direction: row;
          }
          :host([horizontal]) .image:not(.empty) {
            flex: 0 0 34%;
            height: auto;
            min-height: var(--ddd-spacing-28, 112px);
            border-bottom: none;
            border-inline-end: var(--ddd-spacing-3) var(--ddd-card-accent) solid;
            border-radius: 0;
          }
          :host([horizontal]) .image.empty {
            flex: none;
            height: auto;
            width: 0;
            border-bottom: none;
            border-inline-end: var(--ddd-spacing-3) var(--ddd-card-accent) solid;
          }
          :host([horizontal]) .image img {
            height: 100%;
            border-radius: 0;
          }
          :host([horizontal]) .card {
            border-radius: inherit;
            overflow: hidden;
          }
          :host([horizontal]) .description {
            height: auto;
          }
        }

        /* the whole card is the link: the anchor covers the card and the
           button is not drawn */
        :host([clickable]) .card {
          position: relative;
        }
        :host([clickable]) .button-wrapper {
          height: 0;
          padding: 0;
        }
        :host([clickable]) .button {
          height: 0;
          padding: 0;
          overflow: hidden;
          opacity: 0;
        }
        :host([clickable]) .button-wrapper a::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
        }
        :host([clickable]) .button-wrapper a {
          outline: none;
        }
        :host([clickable]:hover) {
          border-color: var(--ddd-card-accent);
        }
        :host([clickable]:focus-within) {
          outline: var(--ddd-focus-ring, 2px solid currentColor);
          outline-offset: var(--ddd-focus-offset, 2px);
        }

        .title {
          padding: var(--ddd-card-pad) var(--ddd-card-pad) var(--ddd-spacing-0)
            var(--ddd-card-pad);
          font-size: var(--ddd-font-size-s);
          font-weight: var(--ddd-font-weight-bold);
          color: light-dark(var(--ddd-theme-default-nittanyNavy), white);
        }

        .description {
          flex-grow: 1;
          padding: var(--ddd-card-pad);
          font-size: var(--ddd-font-size-4xs);
          height: var(--ddd-card-height, var(--ddd-spacing-22));
          overflow-y: auto;
        }
        /** helps normalize global ddd p spacing */
        :host .description ::slotted(p) {
          margin: var(--ddd-card-content-p-margin, 0) !important;
          line-height: normal;
          text-align: start;
        }

        .button-wrapper {
          padding: var(--ddd-card-pad);
          text-align: center;
          height: 44px;
        }

        .button-wrapper:hover .button,
        .button-wrapper:focus-within .button {
          background-color: var(--ddd-card-accent);
          color: var(--ddd-card-accent-ink);
        }

        .button-wrapper a {
          display: block;
          border-radius: var(--ddd-radius-xl);
          text-decoration: none;
          outline-color: var(--ddd-button-outline-color, black);
          outline-width: var(--ddd-button-outline-width, 2px);
        }

        .button {
          transition: var(--ddd-card-button-transition, 0.3s all ease-in-out);
          color: var(--ddd-card-button-color, white);
          background-color: var(--ddd-theme-default-nittanyNavy);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          font-family: var(--ddd-font-navigation);
          padding: var(--ddd-spacing-3) var(--ddd-spacing-5);
          border-radius: var(--ddd-radius-xl);
          border: none;
          cursor: pointer;
          width: 100%;
          display: block;
          box-sizing: border-box;
          line-height: normal;
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="card">
        <div class="image ${this.src ? "" : "empty"}" part="image">
          ${
            this.src
              ? html`<img
                  src="${this.src}"
                  alt="${this.alt}"
                  part="img"
                  loading="lazy"
                  decoding="async"
                  fetchpriority="low"
                />`
              : nothing
          }
        </div>
        <div class="body">
          <div class="title" part="title">${this.title}</div>
          <div class="description" part="description">
            <slot></slot>
          </div>
          <div class="button-wrapper" part="button-wrapper">
            ${
              this.href
                ? html`
                    <a
                      @click="${this._clickCard}"
                      href="${this.href}"
                      rel="${this.rel}"
                      target="${this.target}"
                      part="a"
                    >
                      <span class="button" part="button">
                        ${this.label || this.t.explore}
                        ${
                          !this.noArrow
                            ? html`<span aria-hidden="true">&gt;</span>`
                            : nothing
                        }
                      </span>
                    </a>
                  `
                : nothing
            }
          </div>
        </div>
      </div>
    `;
  }

  // haxProperties definition
  static get haxProperties() {
    return new URL(`./${this.tag}.haxProperties.json`, import.meta.url).href;
  }
  /**
   * Implements haxHooks to tie into life-cycle if hax exists.
   */
  haxHooks() {
    return {
      editModeChanged: "haxeditModeChanged",
      activeElementChanged: "haxactiveElementChanged",
    };
  }
  /**
   * Set a flag to test if we should block link clicking on the entire card
   * otherwise when editing in hax you can't actually edit it bc its all clickable.
   * if editMode goes off this helps ensure we also become clickable again
   */
  haxeditModeChanged(val) {
    this.editMode = val;
  }
  /**
   * special support for HAX since the whole card is selectable
   */
  _clickCard(e) {
    if (this.editMode) {
      // do not do default
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }
  /**
   * double-check that we are set to inactivate click handlers
   * this is for when activated in a duplicate / adding new content state
   */
  haxactiveElementChanged(el, val) {
    // flag for HAX to not trigger active on changes
    this.editMode = val;
    return false;
  }
}

globalThis.customElements.define(DddCard.tag, DddCard);
