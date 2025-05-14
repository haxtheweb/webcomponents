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
    this.t = {
      explore: "Explore",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL(`../locales/${this.tag}.es.json`, import.meta.url).href +
        "/../",
      locales: ["es"],
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
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          --ddd-card-border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-limestoneGray)
          );
          display: inline-block;
          width: 400px;
          background-color: light-dark(
            white,
            var(--ddd-theme-default-coalyGray)
          );
          color: light-dark(var(--ddd-theme-default-coalyGray), white);
          border: var(--ddd-border-sm);
          border-color: var(--ddd-card-border-color);
          border-radius: var(--ddd-radius-xl);
          font-family: var(--ddd-font-primary);
          box-shadow: var(--ddd-boxShadow-sm);
          margin: var(--ddd-spacing-2);
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
          border-bottom: var(--ddd-spacing-3)
            var(--ddd-theme-primary, var(--ddd-primary-1)) solid;
          border-radius: var(--ddd-spacing-4) var(--ddd-spacing-4) 0 0;
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
          border-radius: var(--ddd-spacing-5) var(--ddd-spacing-5) 0 0;
          object-fit: cover;
          display: block;
        }

        .title {
          padding: var(--ddd-spacing-4) var(--ddd-spacing-4)
            var(--ddd-spacing-0) var(--ddd-spacing-4);
          font-size: var(--ddd-font-size-s);
          font-weight: var(--ddd-font-weight-bold);
          color: light-dark(var(--ddd-theme-default-nittanyNavy), white);
        }

        .description {
          flex-grow: 1;
          padding: var(--ddd-spacing-4) var(--ddd-spacing-4);
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
          padding: var(--ddd-spacing-4);
          text-align: center;
          height: 44px;
        }

        .button-wrapper:hover button,
        .button-wrapper:focus-within button {
          background-color: var(--ddd-theme-primary, var(--ddd-primary-1));
          color: var(
            --lowContrast-override,
            var(--ddd-card-button-color, white)
          );
        }

        .button-wrapper a {
          display: block;
          border-radius: var(--ddd-radius-xl);
          text-decoration: none;
          outline-color: var(--ddd-button-outline-color, black);
          outline-width: var(--ddd-button-outline-width, 2px);
        }

        button {
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
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="card">
        <div class="image" part="image">
          ${this.src
            ? html`<img
                src="${this.src}"
                alt="${this.alt}"
                part="img"
                loading="lazy"
                decoding="async"
                fetchpriority="low"
              />`
            : nothing}
        </div>
        <div class="title" part="title">${this.title}</div>
        <div class="description" part="description">
          <slot></slot>
        </div>
        <div class="button-wrapper" part="button-wrapper">
          ${this.href
            ? html`
                <a
                  @click="${this._clickCard}"
                  href="${this.href}"
                  role="button"
                  rel="${this.rel}"
                  target="${this.target}"
                  part="a"
                >
                  <button part="button" tabindex="-1">
                    ${this.label || this.t.explore}
                    ${!this.noArrow ? `>` : nothing}
                  </button>
                </a>
              `
            : nothing}
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
