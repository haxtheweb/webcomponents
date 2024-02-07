/**
 * Copyright 2023
 * @license , see License.md for full text.
 */
import { html, css } from "lit";
import { DDD } from "@lrnwebcomponents/d-d-d/d-d-d.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button-lite.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
/**
 * `page-section`
 * `A well designed section of a page with many options for marketing purposes`
 * @demo demo/index.html
 * @element page-section
 */
class PageSection extends DDD {
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.filter = false;
    this.fold = false;
    this.full = false;
    this.scroller = false;
    this.bg = null;
    this.image = null;
    this.accentColor = "blue";
    this.scrollerLabel = "Scroll to reveal content";
  }

  static get properties() {
    return {
      ...super.properties,
      scrollerLabel: { type: String, attribute: "scroller-label" },
      filter: { type: Boolean, reflect: true },
      fold: { type: Boolean, reflect: true },
      full: { type: Boolean, reflect: true },
      scroller: { type: Boolean, reflect: true },
      bg: { type: String },
      image: { type: String, reflect: true },
    };
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
      ...styles,
      css`
        :host {
          display: block;
        }

        .section {
          width: 100%;
          height: var(--page-section-height, 100%);
          padding: var(--page-section-padding, 0);
          position: relative;
          background-position: 50%;
          background-size: cover;
        }
        :host([full]) .section {
          height: 100vh;
        }

        .content {
          display: flex;
          flex-flow: column;
          justify-content: center;
          height: 100%;
          position: relative;
          z-index: 3;
          padding: var(--page-section-content-padding, 0 15%);
          width: var(--page-section-content-width, 70%);
          max-width: var(--page-section-content-max-width, 1080px);
          margin: 0 auto;
        }

        :host([image]) .scroller {
          color: var(--simple-colors-default-theme-accent-1);
        }
        :host([image][dark]) .scroller {
          color: var(--simple-colors-default-theme-accent-12);
        }
        :host([fold]) .scroller {
          margin-top: -100px;
        }
        .scroller {
          position: relative;
          margin: 0px auto;
          --simple-icon-width: 64px;
          --simple-icon-height: 64px;
          color: var(--simple-colors-default-theme-accent-12);
          display: flex;
          height: 64px;
          margin-top: -32px;
          width: 64px;
          z-index: 11;
        }

        simple-tooltip {
          --simple-tooltip-font-size: var(
            --page-section-tooltip-font-size,
            16px
          );
          --simple-tooltip-background: var(
            --page-section-tooltip-background,
            #000000
          );
          --simple-tooltip-opacity: var(--page-section-tooltip-opacity, 0.8);
          --simple-tooltip-text-color: var(
            --page-section-tooltip-text-color,
            white
          );
          --simple-tooltip-delay-in: var(--page-section-tooltip-delay-in, 300);
          --simple-tooltip-delay-out: var(--page-section-tooltip-delay-out, 0);
          --simple-tooltip-duration-in: var(
            --page-section-tooltip-duration-in,
            300
          );
          --simple-tooltip-duration-out: var(
            --page-section-tooltip-duration-out,
            0
          );
        }

        .fold {
          background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDBweCIgdmlld0JveD0iMCAwIDEyODAgMTQwIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnIGZpbGw9IiNGRkZGRkYiPjxwYXRoIGQ9Ik02NDAgMTM5TDAgMHYxNDBoMTI4MFYwTDY0MCAxMzl6Ii8+PC9nPjwvc3ZnPg==");
          background-size: 100% 100px;
          background-repeat: no-repeat;
          bottom: 0;
          height: 100px;
          z-index: 10;
          transform: scale(1, 1);
          display: block;
          position: absolute;
          pointer-events: none;
          width: 100%;
          left: 0;
          right: 0;
          margin: 0;
          padding: 0;
          border: 0;
          outline: 0;
          background-color: transparent;
        }
        :host section div ::slotted(p) {
          font-size: var(--ddd-font-size-m) !important;
        }
        :host section div ::slotted(hr) {
          border-top-color: var(--ddd-theme-polaris-skyBlue) !important;
          width: var(--ddd-spacing-21) !important;
        }
        :host section div ::slotted(h1) {
          font-size: var(--ddd-font-size-xxl) !important;
        }
        :host([image]) section div ::slotted(p),
        :host([image]) section div ::slotted(h1) {
          color: var(--simple-colors-default-theme-accent-1);
        }
        :host([image][dark]) section div ::slotted(p),
        :host([image][dark]) section div ::slotted(h1) {
          color: var(--simple-colors-default-theme-accent-12);
        }
        section div ::slotted(h1) {
          font-style: normal;
          text-transform: none;
          text-decoration: none;
          padding-bottom: var(--ddd-spacing-3);
          margin: 0;
        }
      `,
    ];
  }
  bgStyle(bg, filter, image) {
    if (filter) {
      return `background-color: ${bg};background-image:var(--ddd-theme-polaris-gradient-antihero),url("${image}");`;
    } else {
      return `background-color: ${bg};background-image: url("${image}");`;
    }
  }
  /**
   * LitElement render callback
   */
  render() {
    return html`
      <section
        class="section"
        style="${this.bgStyle(this.bg, this.filter, this.image)}"
      >
        <div class="content" part="content">
          <slot></slot>
          <div>
            <slot name="buttons"></slot>
          </div>
        </div>
        ${this.scroller
          ? html`<simple-icon-button-lite
                class="scroller"
                icon="icons:arrow-downward"
                id="scroller"
                @click="${this.scrollToNextTarget}"
                label="${this.scrollerLabel}"
              ></simple-icon-button-lite
              ><simple-tooltip for="scroller" position="top"
                >${this.scrollerLabel}</simple-tooltip
              >`
          : ``}
        ${this.fold ? html`<div class="fold"></div>` : ``}
      </section>
    `;
  }

  scrollToNextTarget(e) {
    const nextTarget = this.nextElementSibling;
    if (nextTarget && nextTarget.scrollIntoView) {
      nextTarget.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
  /**
   * Convention we use
   */
  static get tag() {
    return "page-section";
  }
  /**
   * LitElement ready
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
  }
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}
customElements.define(PageSection.tag, PageSection);
export { PageSection };
