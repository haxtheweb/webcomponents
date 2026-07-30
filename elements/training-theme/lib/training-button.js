// import stuff
import { LitElement, html, css } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import { HAXCMSThemeParts } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSThemeParts.js";

export class TrainingButton extends HAXCMSThemeParts(LitElement) {
  // defaults
  constructor() {
    super();
    this.title = "";
    this.disabled = false;
    this.index = null;
    this.active = false;
    this.slug = null;
    this.__disposer.push(
      autorun((reaction) => {
        const _mobx_val_0 = toJS(store.editMode);
        Promise.resolve().then(() => {
          this.editMode = _mobx_val_0;
        });
      }),
    );
  }
  // convention I enjoy using to define the tag's name
  static get tag() {
    return "training-button";
  }
  // LitElement convention so we update render() when values change
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      index: { type: Number },
      slug: { type: String },
      editMode: { type: Boolean, reflect: true, attribute: "edit-mode" },
      active: { type: Boolean, reflect: true },
      disabled: { type: Boolean, reflect: true },
    };
  }

  // LitElement convention for applying styles JUST to our element
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          margin: 8px 0px;
          border: 2px solid var(--ddd-theme-default-limestoneLight, #e4e5e7);
          border-radius: var(--ddd-radius-xs, 4px);
        }
        a.wrapper {
          border: none;
          text-decoration: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          background-color: transparent;
          min-height: 52px;
          font-weight: bold;
          line-height: 20px;
          box-sizing: content-box;
          width: 100%;
          position: relative;
          margin: 0;
          padding: 0;
          font-family: Roboto, Noto, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        a.wrapper:focus-visible {
          outline: 2px solid currentColor;
          outline-offset: 2px;
        }
        #title {
          font-size: 18px;
          text-align: left;
          font-weight: normal;
        }

        .dot div {
          font-size: 24px;
          align-items: center;
          margin: auto 0px;
          color: var(--ddd-theme-default-white, #ffffff);
          height: 32px;
          line-height: 32px;
          width: 32px;
        }

        .dot {
          height: 32px;
          width: 32px;
          margin: 16px;
          background-color: var(--ddd-theme-default-limestoneGray, #a2aaad);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        a {
          text-decoration: none;
        }

        :host([disabled]) {
          background-color: var(--ddd-theme-default-disabled, #f4f4f4);
          cursor: not-allowed;
          pointer-events: none;
          opacity: 0.8;
        }

        :host:hover,
        :host:focus-within,
        :host:focus-visible,
        :host:active {
          border: 2px solid var(--ddd-theme-default-limestoneGray, #a2aaad);
          color: var(--ddd-theme-default-coalyGray, #262626);
        }
        :host([active]) {
          border: 2px solid var(--ddd-theme-default-coalyGray, #262626);
        }
        :host([active]) .dot {
          background-color: var(--ddd-theme-default-coalyGray, #262626);
          color: var(--ddd-theme-default-white, #ffffff);
        }
        :host([active]) {
          color: var(--ddd-theme-default-white, #ffffff);
          background-color: #1b6fd6;
        }
      `,
    ];
  }

  // LitElement rendering template of your element
  render() {
    return html`
      <a
        href="${this.slug}"
        class="wrapper"
        @click="${this._editClick}"
        .part="${this.editMode ? `edit-mode-active` : ``}"
      >
        <span class="dot">
          <div>${this.index}</div>
        </span>
        <span id="title">${this.title}</span>
        <slot></slot>
      </a>
    `;
  }
  _editClick(e) {
    if (this.disabled || this.editMode) {
      e.preventDefault();
    }
  }
}

// tell the browser about our tag and class it should run when it sees it
globalThis.customElements.define(TrainingButton.tag, TrainingButton);
