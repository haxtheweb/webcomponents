/**
 * Copyright 2023
 * @license , see License.md for full text.
 */
import { html, css } from "lit";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button-lite.js";
/**
 * `page-section`
 * `A well designed section of a page with many options for marketing purposes`
 * @demo demo/index.html
 * @element page-section
 */
class PageSection extends SimpleColors {
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.filter = false;
    this.fold = false;
    this.scroller = false;
    this.bg = null;
    this.image = null;
    this.accentColor = "blue";
  }

  static get properties() {
    return {
      ...super.properties,
      filter: { type: Boolean, reflect: true },
      fold: { type: Boolean, reflect: true },
      scroller: { type: Boolean, reflect: true },
      bg: { type: String },
      image: { type: String, reflect: true },
    }
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
          height: 100vh;
          position: relative;
          background-position: 50%;
          background-size: cover;
        }

        .content {
          padding: 0 15%;
          display: flex;
          flex-flow: column;
          justify-content: center;
          height: 100%;
          position: relative;
          z-index: 3;
          width: 70%;
          max-width: 1080px;
          margin: 0 auto;
        }

        :host([image]) .scroller {
          color: var(--simple-colors-default-theme-accent-1);
        }
        :host([image][dark]) .scroller {
          color: var(--simple-colors-default-theme-accent-12);
        }
        .scroller {
          position: relative;
          margin: 0px auto;
          --simple-icon-width: 64px;
          --simple-icon-height: 64px;
          color: var(--simple-colors-default-theme-accent-12);
          display: flex;
          margin-top: -64px;
          height: 64px;
          width: 64px;
          z-index: 11;
        }

        .fold {
          background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDBweCIgdmlld0JveD0iMCAwIDEyODAgMTQwIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnIGZpbGw9IiNGRkZGRkYiPjxwYXRoIGQ9Ik02NDAgMTM5TDAgMHYxNDBoMTI4MFYwTDY0MCAxMzl6Ii8+PC9nPjwvc3ZnPg==");
          background-size: 100% 100px;
          background-repeat: no-repeat;
          bottom: 0;
          height: 100px;
          z-index: 10;
          transform: scale(1,1);
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
        :host([image]) section div ::slotted(h1) {
          color: var(--simple-colors-default-theme-accent-1);
        }
        :host([image][dark]) section div ::slotted(h1) {
          color: var(--simple-colors-default-theme-accent-12);
        }
        section div ::slotted(h1) {
          font-family: 'Roboto',Helvetica,Arial,Lucida,sans-serif;
          font-weight: 700;
          font-size: 5rem;
          color: var(--simple-colors-default-theme-accent-12);
          font-style: normal;
          text-transform: none;
          text-decoration: none;
          letter-spacing: 1px;
          padding-bottom: 12px;
          margin: 0;
        }
      `,
    ];
  }
  bgStyle(bg, filter, image) {
    if (filter) {
      return `background-color: ${bg};background-image: linear-gradient(180deg, var(--simple-colors-default-theme-accent-11) 1%,rgba(0,30,68,0.73) 28%,rgba(0,30,68,0) 100%),url("${image}");`;
    }
    else {
      return `background-color: ${bg};background-image: url("${image}");`;
    }
  }
  /**
   * LitElement render callback
   */
  render() {
    return html`
      <section class="section" style="${this.bgStyle(this.bg, this.filter, this.image)}">
        <div class="content">
          <slot></slot>
          <div>
            <slot name="buttons"></slot>
          </div>
        </div>
        ${this.scroller ? html`<simple-icon-button-lite class="scroller" icon="icons:arrow-downward" label="Scroll down" @click="${this.scrollToNextTarget}"></simple-icon-button-lite>` : ``}
        ${this.fold ? html`<div class="fold"></div>` : ``}
      </section>
    `;
  }

  scrollToNextTarget(e) {
    const nextTarget = this.nextElementSibling;
    if (nextTarget && nextTarget.scrollIntoView) {
      nextTarget.scrollIntoView({ behavior: "smooth", block: "end" });
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
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url).href;
  }

}
customElements.define(PageSection.tag, PageSection);
export { PageSection };
