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
    this.visited = false;
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
      visited: { type: Boolean, reflect: true },
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
          margin: var(--ddd-spacing-0, 0px);
        }
        a.wrapper {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-1, 4px);
          width: 100%;
          box-sizing: border-box;
          min-height: 44px;
          margin: var(--ddd-spacing-0, 0px);
          padding: var(--ddd-spacing-3, 12px);
          background-color: var(--ddd-theme-default-potential0, transparent);
          border: none;
          border-radius: var(--ddd-radius-sm, 8px);
          /* slateLight when on the theme navy sidebar, dark text otherwise */
          color: var(
            --training-theme-navText,
            var(--ddd-theme-default-coalyGray, #262626)
          );
          cursor: pointer;
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-5xs, 14px);
          font-weight: var(--ddd-font-weight-medium, 500);
          line-height: var(--ddd-lh-140, 140%);
          text-align: left;
          text-decoration: none;
          transition: background-color 0.12s ease;
          -webkit-font-smoothing: antialiased;
        }
        a.wrapper:focus-visible {
          outline: 2px solid currentColor;
          outline-offset: 2px;
        }
        .index {
          flex: none;
          width: var(--ddd-spacing-6, 24px);
          text-align: center;
          font-size: var(--ddd-font-size-6xs, 12px);
          font-weight: var(--ddd-font-weight-bold, 700);
          color: var(
            --training-theme-navText,
            var(--ddd-theme-default-coalyGray, #262626)
          );
          opacity: 0.8;
        }
        #title {
          flex: 1;
          font-size: var(--ddd-font-size-5xs, 14px);
          font-weight: var(--ddd-font-weight-medium, 500);
        }
        /* status dot: green once the page has been reached */
        .dot {
          flex: none;
          width: var(--ddd-spacing-2, 8px);
          height: var(--ddd-spacing-2, 8px);
          border-radius: var(--ddd-radius-circle, 100%);
          background-color: rgba(255, 255, 255, 0.22);
        }
        :host(:hover) a.wrapper,
        :host(:focus-within) a.wrapper {
          background-color: rgba(255, 255, 255, 0.08);
        }
        :host([active]) a.wrapper {
          background-color: rgba(255, 255, 255, 0.12);
          color: var(--ddd-theme-default-white, #ffffff);
        }
        :host([active]) .index {
          color: var(--ddd-theme-default-white, #ffffff);
          opacity: 1;
        }
        :host([visited]) .dot {
          background-color: var(
            --training-theme-forestGreenLight,
            var(--ddd-theme-default-forestGreen, #4a7729)
          );
        }

        :host([disabled]) {
          opacity: 0.5;
          cursor: not-allowed;
          pointer-events: none;
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
        aria-current="${this.active ? "page" : "false"}"
      >
        <span class="index">${this.index}</span>
        <span id="title">${this.title}</span>
        <span class="dot" aria-hidden="true"></span>
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
