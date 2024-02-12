import { html, css } from "lit";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-fields/lib/simple-tags.js";
import { DDD } from "@lrnwebcomponents/d-d-d/d-d-d.js";
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
      ...super.styles,
      css`
        :host {
          display: block;
          border-top: 1px solid black;
          padding: var(--ddd-spacing-6) 0 var(--ddd-spacing-5);
        }

        a {
          text-decoration: none;
          color: var(--icon-color);
        }
        :host([saturate]) .image-wrapper {
          -webkit-filter: saturate(200%);
          filter: saturate(200%);
        }

        .wrap {
          display: flex;
          flex-direction: row;
          gap: var(--ddd-spacing-4);
          padding: var(--ddd-spacing-4) var(--ddd-spacing-8);
          align-items: center;
        }

        simple-tags {
          margin-left: var(--ddd-spacing-1);
          margin-bottom: calc(-1 * var(--ddd-spacing-11));
          padding: var(--ddd-spacing-0);
          width: 100%;
          z-index: 1;
          display: flex;
          overflow: hidden;
        }

        .text {
          padding: 0 var(--ddd-spacing-2);
          height: var(--ddd-spacing-38);
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

        .icon {
          background-color: rgb(255, 255, 255);
          border-radius: var(--ddd-radius-circle);
          position: relative;
          bottom: var(--ddd-spacing-8);
          border-style: solid;
          border-image: initial;
          border-color: var(--icon-color);
          border-width: var(--ddd-border-md);
          margin: 0 0 calc(-1 * var(--ddd-icon-xs)) 0;
          height: var(--ddd-spacing-12);
          width: var(--ddd-spacing-12);
        }

        simple-icon {
          fill: var(--icon-color);
          --simple-icon-width: var(--ddd-icon-xs);
          --simple-icon-height: var(--ddd-icon-xs);
          margin: var(--ddd-spacing-2);
        }

        .image {
          background-color: white;
          background-repeat: no-repeat;
          background-size: cover;
          background-position: right center;
          width: 100%;
          opacity: 0.9;
          transition: 0.3s ease-in-out opacity, 0.3s ease-in-out filter;
          border-bottom-style: solid;
          border-bottom-color: var(--icon-color);
          border-bottom-width: var(--ddd-border-md);
          max-width: 100%;
          height: auto;
          vertical-align: middle;
        }

        @media (max-width: 768px) {
          .wrap {
            display: block;
          }
          .image {
            display: block;
          }
        }
      `,
    ];
  }

  render() {
    return html`
    <div class="wrap">
      <div class="image-wrap">
        ${this.tags
          ? html`<simple-tags
              tags="${this.tags}"
              accent-color="${this.accentColor}"
              auto-accent-color
            ></simple-tags>`
          : ``}
        <img
          class="image bg-gradient-hero"
          src="${this.image}" alt="${this.alt}" />
      </div>
      <div>
        <p class="text">
          <a href="${this.url}" @click="${this._handleClick}">${this.line1}</a> 
          ${this.line2}
          <slot></slot>
        </p>
      </div>
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
customElements.define(CollectionRow.tag, CollectionRow);
export { CollectionRow };
