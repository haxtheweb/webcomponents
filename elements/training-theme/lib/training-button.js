
// import stuff
import { LitElement, html, css } from "lit";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import { HAXCMSThemeParts } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/HAXCMSThemeParts.js";

export class TrainingButton extends HAXCMSThemeParts(LitElement) {
  // defaults
  constructor() {
    super();
    this.title = "";
    this.disabled = false;
    this.index = null;
    this.active = false;
    this.slug = null;
    autorun((reaction) => {
      this.editMode = toJS(store.editMode);
      this.__disposer.push(reaction);
    });
  }
  // convention I enjoy using to define the tag's name
  static get tag() {
    return "training-button";
  }
  // LitElement convention so we update render() when values change
  static get properties() {
    return {...super.properties,
      title: { type: String },
      index: { type: Number },
      slug: { type: String },
      editMode: { type: Boolean, reflect: true, attribute: 'edit-mode' },
      active: { type: Boolean, reflect: true },
      disabled: { type: Boolean, reflect: true },
    };
  }

  // LitElement convention for applying styles JUST to our element
  static get styles() {
    return [...super.styles, css`
      :host {
        display: block;
        margin: 8px 0px;
        border: 2px solid rgb(218, 220, 224);
        border-radius: 4px;
      }
      button {
        border: none;
        background-color: rgb(255, 255, 255);
        text-decoration: none;
        cursor: pointer;
        display: flex;
        -webkit-box-align: center;
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
      #title {
        font-size: 18px;
        text-align: left;
        font-weight: normal;
      }

      .dot div {
        font-size: 24px;
        align-items: center;
        margin: auto 0px;
        color: white;
        height: 32px;
        line-height: 32px;
        width: 32px;
      }

      .dot {
        height: 32px;
        width: 32px;
        margin: 16px;
        background-color: rgb(128 134 140);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      a,button {
        text-decoration: none;
      }

      :host([disabled]) {
        background-color: #dddddd;
        cursor: not-allowed;
        pointer-events: none;
        opacity: 0.8;
      }

      :host:hover,
      :host:focus-within,
      :host:focus,
      :host:active {
        border: 2px solid grey;
        color: black;
      }
      :host([active])  {
        border: 2px solid black;
      }
      :host([active]) .dot {
        background-color: black;
        color: white;
      }
      :host([active]) {
        color: white;
        background-color: #1a73e8;
      }
    `];
  }

  // LitElement rendering template of your element
  render() {
    return html`
    <a ?disabled="${this.disabled || this.editMode}" href="${this.slug}" tabindex="-1"
    @click="${this._editClick}"
        .part="${this.editMode ? `edit-mode-active` : ``}">
      <button ?disabled="${this.disabled}" class="wrapper">
        <span class="dot">
          <div>${this.index}</div>
        </span>
        <span id="title">${this.title}</span>
        <slot></slot>
      </button>
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
customElements.define(TrainingButton.tag, TrainingButton);