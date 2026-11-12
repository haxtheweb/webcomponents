/**
 * Copyright 2024 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { DDDAccentStyles } from "@haxtheweb/d-d-d/lib/DDDAccent.js";
class CollectionRow extends DDD {
  static get properties() {
    return {
      ...super.properties,
      url: { type: String },
      image: { type: String },
      alt: { type: String },
      icon: { type: String },
      line1: { type: String },
      line2: { type: String },
      saturate: { type: Boolean, reflect: true },
      tags: { type: String },
    };
  }
  constructor() {
    super();
    this._haxstate = false;
    this.tags = null;
    this.saturate = false;
    this.url = null;
    this.image = null;
    this.alt = null;
    this.icon = null;
    this.line1 = null;
    this.line2 = null;
    this.accentColor = null;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./${this.tag}.haxProperties.json`, import.meta.url).href;
  }

  static get styles() {
    return [
      super.styles,
      DDDAccentStyles,
      css`
        :host {
          display: block;
          padding: var(--ddd-spacing-6) 0 var(--ddd-spacing-5);
          --collection-row-accent: var(
            --ddd-accent-color,
            var(--ddd-theme-default-beaverBlue)
          );
          --collection-row-line: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          --collection-row-tint: var(
            --ddd-accent-color-tint,
            light-dark(
              var(--ddd-theme-default-skyMaxLight),
              color-mix(
                in srgb,
                var(--ddd-theme-default-pughBlue) 22%,
                var(--ddd-theme-default-potentialMidnight)
              )
            )
          );
          --collection-row-text: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          --collection-row-heading: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-white)
          );
          --collection-row-link: light-dark(
            var(--ddd-theme-default-link),
            var(--ddd-theme-default-linkLight)
          );
          /* kept for anything that styled through the old hook */
          --collection-row-accent-color: var(--collection-row-accent);
          border-top: var(--ddd-border-xs);
          border-top-color: var(--collection-row-line);
          color: var(--collection-row-text);
        }
        :host([dark]) {
          color-scheme: dark;
        }

        /* the title link sits inline with the description text, so it needs
           something besides color to set it apart (WCAG 1.4.1); axe flags it
           in Firefox */
        a {
          color: var(--collection-row-link);
          font-weight: var(--ddd-font-weight-bold);
          text-decoration: underline;
          text-underline-offset: 0.15em;
          border-radius: var(--ddd-radius-xs);
        }
        a:focus-visible {
          outline: var(--ddd-border-sm);
          outline-style: solid;
          outline-color: var(--collection-row-link);
          outline-offset: var(--ddd-spacing-1);
        }
        :host([saturate]) .image-wrap {
          -webkit-filter: saturate(30%);
          filter: saturate(30%);
        }

        :host([saturate]:focus-within) .image-wrap,
        :host([saturate]:hover) .image-wrap {
          filter: saturate(200%);
        }

        .image-wrap {
          max-width: 250px;
          width: 100%;
          transition:
            var(--ddd-duration-normal, 0.3s) ease-in-out opacity,
            var(--ddd-duration-normal, 0.3s) ease-in-out filter;
        }

        p {
          margin: 0;
          padding: 0;
        }

        .wrap {
          display: flex;
          flex-direction: row;
          gap: var(--ddd-spacing-4);
          padding: var(--ddd-spacing-4) var(--ddd-spacing-8);
          align-items: center;
        }

        .text {
          height: auto;
          font-size: var(--ddd-font-size-3xs);
          font-family: var(--ddd-font-navigation);
        }
        .text ::slotted(*) {
          font-size: var(--ddd-font-size-3xs);
          font-family: var(--ddd-font-navigation) !important;
        }

        .line-2 {
          max-height: var(--ddd-spacing-13);
          overflow: hidden;
          text-align: center;
          word-break: break-word;
          padding: 0 var(--ddd-spacing-2);
        }

        .footer {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--ddd-spacing-2);
          margin-inline-start: var(--ddd-spacing-8);
          --simple-icon-color: var(--collection-row-accent);
          --simple-icon-width: var(--ddd-icon-xs);
          --simple-icon-height: var(--ddd-icon-xs);
        }
        .footer simple-icon-lite {
          display: inline-flex;
          flex: none;
        }

        .tags {
          display: flex;
          flex-flow: row wrap;
          font-size: var(--ddd-font-size-4xs);
          gap: var(--ddd-spacing-1);
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .tags li {
          display: inline-flex;
          align-items: center;
          height: var(--ddd-spacing-6);
          padding: 0 var(--ddd-spacing-2);
          border: var(--ddd-border-xs);
          border-color: var(--collection-row-line);
          border-radius: var(--ddd-radius-rounded);
          background-color: var(--collection-row-tint);
          color: var(--collection-row-heading);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-medium);
          line-height: 1;
        }

        .image {
          background-color: var(--collection-row-tint);
          width: 100%;
          opacity: 0.95;
          transition:
            var(--ddd-duration-normal, 0.3s) ease-in-out opacity,
            var(--ddd-duration-normal, 0.3s) ease-in-out filter;
          border-radius: var(--ddd-radius-sm);
          border-bottom: 4px solid var(--collection-row-accent);
          max-width: 100%;
          height: auto;
          vertical-align: middle;
        }

        @media (max-width: 768px) {
          .footer {
            margin-inline-start: var(--ddd-spacing-5);
          }
          .wrap {
            display: block;
          }
          .image {
            display: block;
          }
          .image-wrap {
            max-width: unset;
          }
        }
      `,
    ];
  }

  /**
   * Tags string split into trimmed, non-empty labels
   * @returns {Array}
   */
  _tagList() {
    if (!this.tags || typeof this.tags !== "string") {
      return [];
    }
    return this.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");
  }

  render() {
    const tags = this._tagList();
    return html`
      <div class="wrap">
        <div class="image-wrap">
          ${
            this.image
              ? html`<img
                  class="image"
                  src="${this.image}"
                  alt="${this.alt ? this.alt : ""}"
                />`
              : ``
          }
        </div>
        <div>
          <p class="text">
            <a href="${this.url}" @click="${this._handleClick}"
              >${this.line1}</a
            >
            ${this.line2}
            <slot></slot>
          </p>
        </div>
      </div>
      <div class="footer">
        ${
          this.icon
            ? html`<simple-icon-lite
                icon="${this.icon}"
                aria-hidden="true"
              ></simple-icon-lite>`
            : ``
        }
        ${
          tags.length > 0
            ? html`<ul class="tags">
                ${tags.map((tag) => html`<li>${tag}</li>`)}
              </ul>`
            : ``
        }
      </div>
    `;
  }

  _handleClick(e) {
    if (this._haxstate) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }

  haxHooks() {
    return {
      editModeChanged: "haxeditModeChanged",
      activeElementChanged: "haxactiveElementChanged",
    };
  }

  haxactiveElementChanged(element, value) {
    if (value) {
      this._haxstate = value;
    }
  }
  haxeditModeChanged(value) {
    this._haxstate = value;
  }

  static get tag() {
    return "collection-row";
  }
}
globalThis.customElements.define(CollectionRow.tag, CollectionRow);
export { CollectionRow };
