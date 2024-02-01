import { html, css } from "lit";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-fields/lib/simple-tags.js";
import { DDD } from "@lrnwebcomponents/d-d-d/d-d-d.js";
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
      ...super.styles,
      css`
        :host {
          display: inline-block;
          background-color: var(--simple-colors-default-theme-accent-1);
        }
        a {
          text-decoration: none;
          color: var(--icon-color);
          display: block;
          min-height: 300px;
          border: solid var(--ddd-border-xs) var(--ddd-theme-polaris-slateMaxLight);
          transition: 0.3s ease-in-out opacity, 0.3s ease-in-out filter;
          box-shadow: var(--ddd-boxShadow-xs);
        }
        :host([saturate]) a {
          -webkit-filter: saturate(30%);
          filter: saturate(30%);
        }
        a:focus-within,
        a:focus,
        a:hover {
          box-shadow: var(--ddd-boxShadow-sm);
        }
        :host([saturate]) a:focus-within,
        :host([saturate]) a:focus,
        :host([saturate]) a:hover {
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

        .line-1 {
          text-transform: uppercase;
          text-align: center;
          word-break: break-word;
          padding: 0 var(--ddd-spacing-2);
        }
        .line-2 {
          max-height: var(--ddd-spacing-13);
          overflow: hidden;
          text-align: center;
          word-break: break-word;
          padding: 0 var(--ddd-spacing-2);
        }
        .line-3 {
          max-height: var(--ddd-spacing-6);
          overflow: hidden;
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

        .no-icon {
          margin-bottom: var(--ddd-spacing-6);
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
          height: 150px;
          opacity: 0.9;
          transition: 0.3s ease-in-out opacity, 0.3s ease-in-out filter;
          border-bottom-style: solid;
          border-bottom-color: var(--icon-color);
          border-bottom-width: var(--ddd-border-md);
        }
      `,
    ];
  }

  render() {
    return html`
      <a href="${this.url}" title="${this.alt}" @click="${this._handleClick}">
        <div class="wrap">
          ${this.tags
            ? html`<simple-tags
                tags="${this.tags}"
                accent-color="${this.accentColor}"
                auto-accent-color
              ></simple-tags>`
            : ``}
          <div
            class="image bg-gradient-hero"
            style="${this.image ? `background-image:url("${this.image}")` : ``}"
          ></div>
          ${this.icon
            ? html`<div class="icon">
                <simple-icon
                  icon="${this.icon}"
                  accent-color="${this.accentColor}"
                ></simple-icon>
              </div>`
            : html`<div class="no-icon"></div>`}
          <div><slot></slot></div>
          <div class="line-1 fs-xxs lh-150">${this.line1}</div>
          <div class="line-2 fs-3xs lh-150">${this.line2}</div>
          <div class="line-3 fs-4xs lh-150">${this.line3}</div>
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
customElements.define(CollectionItem.tag, CollectionItem);
export { CollectionItem };
