import { html, css } from "lit";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/simple-fields/lib/simple-tags.js";

class CollectionItem extends SimpleColors {
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
      autoAccentColor: {
        type: Boolean,
        attribute: "auto-accent-color",
      },
      editable: { type: Boolean },
    };
  }
  constructor() {
    super();
    this.editable = true; // always editable unless something dictates we are not like a smart list..
    this.tags = null;
    this.saturate = false;
    this.url = null;
    this.image = null;
    this.alt = null;
    this.icon = null;
    this.line1 = null;
    this.line2 = null;
    this.line3 = null;
    this.autoAccentColor = false;
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
          font-family: "Roboto", sans-serif;
          background-color: var(--simple-colors-default-theme-accent-1);
        }
        a {
          text-decoration: none;
          color: var(--icon-color);
          display: block;
          min-height: 300px;
          border: solid 1px #dcdcdc;
          transition: 0.3s ease-in-out opacity, 0.3s ease-in-out filter;
        }
        :host([saturate]) a {
          -webkit-filter: saturate(30%);
          filter: saturate(30%);
        }
        a:focus-within,
        a:focus,
        a:hover {
          box-shadow: 1px 1px 5px #dcdcdc;
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
          margin-left: 2px;
          margin-bottom: -32px;
          padding: 0;
          height: 32px;
          line-height: 32px;
          width: 100%;
          z-index: 1;
          display: flex;
          overflow: hidden;
        }

        .line-1 {
          font-size: 28px;
          text-transform: uppercase;
          text-align: center;
          line-height: 1.4;
          padding: 0;
          margin: 0;
        }

        .line-2 {
          font-size: 18px;
          max-height: 38px;
          overflow: hidden;
          text-align: center;
          margin: 0px;
          line-height: 1.2;
          padding: 4px 4px 4px;
          letter-spacing: -0.5px;
        }

        .line-3 {
          max-height: 24px;
          line-height: 24px;
          font-size: 14px;
          letter-spacing: -0.5px;
          overflow: hidden;
          word-break: break-all;
        }

        .icon {
          background-color: #fff;
          border-radius: 50%;
          position: relative;
          bottom: 50px;
          border: solid;
          border-color: var(--icon-color);
          border-width: 5px;
          margin: 0 0 -40px 0;
          height: 70px;
          width: 70px;
        }

        simple-icon {
          fill: var(--icon-color);
          --simple-icon-width: 50px;
          --simple-icon-height: 50px;
          margin: 10px;
        }

        .image {
          background-color: grey;
          background-repeat: no-repeat;
          background-size: cover;
          background-position: right center;
          width: 100%;
          height: 150px;
          opacity: 0.9;
          transition: 0.3s ease-in-out opacity, 0.3s ease-in-out filter;
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
                ?auto-accent-color="${this.autoAccentColor}"
              ></simple-tags>`
            : ``}
          <div
            class="image"
            style="${this.image ? `background-image:url("${this.image}")` : ``}"
          ></div>
          ${this.icon
            ? html`<div class="icon">
                <simple-icon
                  icon="${this.icon}"
                  accent-color="${this.accentColor}"
                ></simple-icon>
              </div>`
            : ``}
          <div><slot></slot></div>
          <div class="line-1">${this.line1}</div>
          <div class="line-2">${this.line2}</div>
          <div class="line-3">${this.line3}</div>
        </div>
      </a>
    `;
  }

  _handleClick(e) {
    if (
      (this._haxstate && this.url) ||
      (this.parentNode && this.parentNode.getAttribute("lock-items"))
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
