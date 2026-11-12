/**
 * Copyright 2023 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css, nothing } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { DDDAccentStyles } from "@haxtheweb/d-d-d/lib/DDDAccent.js";

class CollectionItem extends DDD {
  static get properties() {
    return {
      ...super.properties,
      url: { type: String },
      image: { type: String },
      alt: { type: String },
      icon: { type: String },
      line1: { type: String },
      line2: { type: String },
      line3: { type: String },
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
    this.line3 = null;
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
          height: fit-content;
          min-width: calc(var(--ddd-spacing-30) * 2);
          --collection-item-accent: var(
            --ddd-accent-color,
            var(--ddd-theme-default-beaverBlue)
          );
          --collection-item-tint: var(
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
          --collection-item-surface: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
          --collection-item-line: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          --collection-item-heading: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-white)
          );
          --collection-item-muted: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
          --collection-item-focus: light-dark(
            var(--ddd-theme-default-link),
            var(--ddd-theme-default-linkLight)
          );
          /* kept for anything that styled through the old hook */
          --collection-row-accent-color: var(--collection-item-accent);
        }
        :host([dark]) {
          color-scheme: dark;
        }
        a.link,
        a.link:-webkit-any-link {
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          min-height: calc(var(--ddd-spacing-30) * 2.5);
          color: var(--collection-item-heading);
          text-decoration: none;
          background-color: var(--collection-item-surface);
          border: var(--ddd-border-xs);
          border-color: var(--collection-item-line);
          border-top: 4px solid var(--collection-item-accent);
          border-radius: var(--ddd-radius-md);
          box-shadow: var(--ddd-boxShadow-sm);
          overflow: hidden;
          transition:
            var(--ddd-duration-normal, 0.3s) ease-in-out box-shadow,
            var(--ddd-duration-normal, 0.3s) ease-in-out filter;
        }
        :host([saturate]) a.link {
          -webkit-filter: saturate(30%);
          filter: saturate(30%);
        }
        a.link:focus-within,
        a.link:focus,
        a.link:hover {
          box-shadow: var(--ddd-boxShadow-md);
        }
        a.link:focus-visible {
          outline: var(--ddd-border-md);
          outline-style: solid;
          outline-color: var(--collection-item-focus);
          outline-offset: var(--ddd-spacing-1);
        }
        :host([saturate]) a.link:focus-within,
        :host([saturate]) a.link:focus,
        :host([saturate]) a.link:hover {
          filter: saturate(200%);
        }

        a:focus-within .image,
        a:focus .image,
        a:hover .image {
          opacity: 1;
        }

        .wrap {
          display: flex;
          flex-direction: column;
          flex: 1 1 auto;
        }

        .image {
          box-sizing: border-box;
          background-color: var(--collection-item-tint);
          background-repeat: no-repeat;
          background-size: cover;
          background-position: right center;
          width: 100%;
          height: calc(var(--ddd-spacing-20) * 1.75);
          opacity: 0.95;
          transition: var(--ddd-duration-normal, 0.3s) ease-in-out opacity;
        }
        .image.placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 1;
          --simple-icon-color: var(--collection-item-accent);
          --simple-icon-width: var(--ddd-icon-md);
          --simple-icon-height: var(--ddd-icon-md);
        }

        .icon {
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          flex: none;
          width: var(--ddd-spacing-12);
          height: var(--ddd-spacing-12);
          aspect-ratio: 1;
          margin-block: calc(-1 * var(--ddd-spacing-6)) 0;
          margin-inline: var(--ddd-spacing-3) 0;
          position: relative;
          background-color: var(--collection-item-surface);
          border: var(--ddd-border-md);
          border-color: var(--collection-item-accent);
          border-radius: var(--ddd-radius-circle);
          --simple-icon-color: var(--collection-item-heading);
          --simple-icon-width: var(--ddd-icon-xs);
          --simple-icon-height: var(--ddd-icon-xs);
        }

        .text {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-1);
          padding: var(--ddd-spacing-3);
          font-family: var(--ddd-font-navigation);
          min-width: 0;
        }

        .line-1 {
          font-weight: var(--ddd-font-weight-bold);
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-120);
          color: var(--collection-item-heading);
          word-break: break-word;
        }
        .line-2 {
          max-height: var(--ddd-spacing-13);
          overflow: hidden;
          word-break: break-word;
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-150);
          font-weight: var(--ddd-font-weight-regular);
          color: var(--collection-item-muted);
        }
        .line-3 {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-150);
          font-weight: var(--ddd-font-weight-regular);
          color: var(--collection-item-muted);
        }
        .line-1:empty,
        .line-2:empty,
        .line-3:empty {
          display: none;
        }

        .tags {
          display: flex;
          flex-flow: row wrap;
          font-size: var(--ddd-font-size-4xs);
          gap: var(--ddd-spacing-1);
          margin: var(--ddd-spacing-1) 0 0;
          padding: 0;
          list-style: none;
        }
        .tags li {
          display: inline-flex;
          align-items: center;
          height: var(--ddd-spacing-6);
          padding: 0 var(--ddd-spacing-2);
          border: var(--ddd-border-xs);
          border-color: var(--collection-item-line);
          border-radius: var(--ddd-radius-rounded);
          background-color: var(--collection-item-tint);
          color: var(--collection-item-heading);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-medium);
          line-height: 1;
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
      <a
        class="link"
        href="${this.url}"
        part="link"
        @click="${this._handleClick}"
      >
        <div class="wrap">
          ${
            this.image
              ? html`<div
                  class="image"
                  part="image"
                  role="${this.alt ? "img" : "presentation"}"
                  aria-label="${this.alt ? this.alt : nothing}"
                  style="${`background-image:url("${this.image}")`}"
                ></div>`
              : html`<div
                  class="image placeholder"
                  part="image"
                  aria-hidden="true"
                >
                  <simple-icon-lite
                    icon="${this.icon ? this.icon : "icons:book"}"
                  ></simple-icon-lite>
                </div>`
          }
          ${
            this.icon && this.image
              ? html`<div class="icon" aria-hidden="true">
                  <simple-icon-lite icon="${this.icon}"></simple-icon-lite>
                </div>`
              : html`<div class="no-icon"></div>`
          }
          <div class="text">
            <div><slot></slot></div>
            <div class="line-1">${this.line1}</div>
            <div class="line-2">${this.line2}</div>
            <div class="line-3">${this.line3}</div>
            ${
              tags.length > 0
                ? html`<ul class="tags">
                    ${tags.map((tag) => html`<li>${tag}</li>`)}
                  </ul>`
                : html`<div class="no-tags"></div>`
            }
          </div>
        </div>
      </a>
    `;
  }

  _handleClick(e) {
    if (
      this._haxstate ||
      (this.parentNode && this.parentNode.getAttribute("lock-items") !== null)
    ) {
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
    return "collection-item";
  }
}
globalThis.customElements.define(CollectionItem.tag, CollectionItem);
export { CollectionItem };
