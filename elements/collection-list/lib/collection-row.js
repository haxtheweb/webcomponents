import { html, css } from "lit";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-fields/lib/simple-tags.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
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
      css`
        :host {
          display: block;
          border-top: 1px solid black;
          padding: var(--ddd-spacing-6) 0 var(--ddd-spacing-5);
          --collection-row-accent-color: var(
            --simple-colors-default-theme-accent-10
          );
        }

        a {
          text-decoration: none;
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
            0.3s ease-in-out opacity,
            0.3s ease-in-out filter;
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

        simple-tags {
          margin: var(--ddd-spacing-1);
          padding: 0;
          display: inline-flex;
          overflow: hidden;
        }

        .text {
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
          border-color: var(--collection-row-accent-color);
          border-width: var(--ddd-border-md);
          margin: 0 0 calc(-1 * var(--ddd-icon-xs)) 0;
          height: var(--ddd-spacing-12);
          width: var(--ddd-spacing-12);
        }

        simple-icon {
          fill: var(--collection-row-accent-color);
          --simple-icon-width: var(--ddd-icon-xs);
          --simple-icon-height: var(--ddd-icon-xs);
          margin: var(--ddd-spacing-2);
        }
        .footer {
          margin-left: var(--ddd-spacing-6);
        }
        .footer simple-icon {
          display: inline-flex;
        }

        .image {
          background-color: white;
          background-repeat: no-repeat;
          background-size: cover;
          background-position: right center;
          width: 100%;
          opacity: 0.9;
          transition:
            0.3s ease-in-out opacity,
            0.3s ease-in-out filter;
          border-bottom-style: solid;
          border-bottom-color: var(--collection-row-accent-color);
          border-bottom-width: var(--ddd-border-md);
          max-width: 100%;
          height: auto;
          vertical-align: middle;
        }

        @media (max-width: 768px) {
          .footer {
            display: flex;
            margin-left: var(--ddd-spacing-5);
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

  render() {
    return html`
      <div class="wrap">
        <div class="image-wrap">
          ${this.image
            ? html`<img
                class="image bg-gradient-hero"
                src="${this.image}"
                alt="${this.alt}"
              />`
            : ``}
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
        ${this.icon
          ? html`<simple-icon
              icon="${this.icon}"
              accent-color="${this.accentColor}"
            ></simple-icon>`
          : ``}
        ${this.tags
          ? html`<simple-tags
              tags="${this.tags}"
              accent-color="${this.accentColor}"
              auto-accent-color
            ></simple-tags>`
          : ``}
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
