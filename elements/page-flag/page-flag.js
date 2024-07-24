/**
 * Copyright 2023 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";
import "@haxtheweb/absolute-position-behavior/absolute-position-behavior.js";
import "./lib/page-flag-comment.js";

/**
 * `page-flag`
 * `visual flag for notes about a piece of content`
 * @demo demo/index.html
 * @element page-flag
 */
class PageFlag extends SimpleColors {
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.label = "note";
    this.opened = false;
    this.accentColor = "cyan";
    this.show = false;
    this._haxState = false;
  }

  static get properties() {
    return {
      ...super.properties,
      /**
       * Label for the flag
       */
      label: {
        type: String,
      },
      /**
       * Opened state
       */
      opened: {
        type: Boolean,
        reflect: true,
      },
      show: {
        type: Boolean,
        reflect: true,
      },
    };
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
      styles,
      css`
        :host {
          display: none;
          float: right;
          z-index: var(--simple-modal-z-index, 1000);
          margin-right: -80px;
          position: relative;
        }
        :host([show]) {
          display: block;
        }
        .arrow {
          border: 3px solid var(--simple-colors-default-theme-accent-4, #97d4e8);
          border-radius: 4px;
          background: var(--simple-colors-default-theme-accent-1, #c8e7f1);
          color: var(--simple-colors-default-theme-accent-8, #2d7187);
          padding: 8px;
          text-align: center;
          max-width: 100px;
          font-size: 11px;
          font-weight: bold;
          position: relative;
          cursor: pointer;
        }

        .arrow::after,
        .arrow::before {
          border: solid transparent;
          content: " ";
          display: block;
          height: 0;
          position: absolute;
          pointer-events: none;
          width: 0;
          right: 100%;
        }
        .arrow::before {
          border-color: rgba(255, 255, 255, 0);
          border-right-color: var(
            --simple-colors-default-theme-accent-4,
            #97d4e8
          );
          top: 50%;
          margin-top: -14px;
          border-width: 14px;
        }
        .arrow::after {
          border-color: rgba(255, 255, 255, 0);
          border-right-color: var(
            --simple-colors-default-theme-accent-1,
            #c8e7f1
          );
          top: 50%;
          margin-top: -10px;
          border-width: 10px;
        }
        absolute-position-behavior {
          z-index: var(--simple-modal-z-index, 1000);
          min-width: 280px;
        }
        absolute-position-behavior div {
          color: black;
          background-color: white;
          font-size: 12px;
          width: 300px;
          margin-left: 160px;
          padding-top: 8px;
        }
      `,
    ];
  }

  toggleOpen(e) {
    this.opened = !this.opened;
    this.dark = this.opened;
    this.querySelectorAll("page-flag-comment").forEach((comment) => {
      comment.testCanUpdate(pageFlagManager.activeUser);
      comment.readOnly = !this._haxState;
    });
  }
  /**
   * LitElement render callback
   */
  render() {
    return html` <button class="arrow" @click="${this.toggleOpen}">
        ${this.label}
      </button>
      <absolute-position-behavior
        justify
        position="bottom"
        allow-overlap
        auto
        ?hidden="${!this.opened}"
      >
        <div
          @page-flag-comment-edit="${this.handleEdit}"
          @page-flag-comment-delete="${this.handleDelete}"
          @page-flag-comment-reply="${this.handleReply}"
        >
          <slot></slot>
        </div>
      </absolute-position-behavior>`;
  }

  handleEdit(e) {
    e.detail.editMode = !e.detail.editMode;
  }
  handleDelete(e) {
    e.detail.remove();
    if (this.querySelectorAll("page-flag-comment").length === 0) {
      this.remove();
    }
  }
  handleReply(e) {
    const comment = globalThis.document.createElement("page-flag-comment");
    comment.seed = pageFlagManager.activeUser;
    comment.timestamp = Date.now() / 1000;
    comment.canEdit = true;
    comment.readOnly = false;
    comment.reply = e.detail.reply + 1 < 2 ? e.detail.reply + 1 : 2;
    e.detail.insertAdjacentElement("afterend", comment);
    setTimeout(() => {
      comment.editMode = true;
    }, 0);
  }
  /**
   * Convention we use
   */
  static get tag() {
    return "page-flag";
  }
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
  /**
   * ensure that when we flip states here that we are actively switching the original level var
   */
  haxeditModeChanged(value) {
    this.show = value;
    this._haxState = value;
  }
  /**
   * haxHooks
   */
  haxHooks() {
    return {
      editModeChanged: "haxeditModeChanged",
      inlineContextMenu: "haxinlineContextMenu",
    };
  }
  /**
   * add buttons when it is in context
   */
  haxinlineContextMenu(ceMenu) {
    ceMenu.ceButtons = [
      {
        icon: "lrn:discuss",
        callback: "haxResolveThread",
        label: "Resolve thread",
      },
    ];
  }
  haxResolveThread(e) {
    this.remove();
    return true;
  }
  /**
   * LitElement ready
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    pageFlagManager.allFlags.push(this);
    if (pageFlagManager.activeUser) {
      this.show = true;
    } else {
      this.remove();
    }
    // arrow node for pointing to w/ the tooltip container
    this.shadowRoot.querySelector("absolute-position-behavior").target =
      this.shadowRoot.querySelector(".arrow");
    // ensure we have content, if not let's add a boilerplate one to get writing
    if (!this.querySelector("page-flag-comment")) {
      const comment = globalThis.document.createElement("page-flag-comment");
      comment.seed = pageFlagManager.activeUser;
      comment.timestamp = Date.now() / 1000;
      comment.canEdit = true;
      comment.readOnly = false;
      this.appendChild(comment);
      setTimeout(() => {
        comment.editMode = true;
      }, 100);
    }
  }
}
customElements.define(PageFlag.tag, PageFlag);
export { PageFlag };

export class pageFlagManagerEl extends HTMLElement {
  static get tag() {
    return "page-flag-manager";
  }
  constructor() {
    super();
    this.windowControllers = new AbortController();
    this.activeUser = null;
    this.allFlags = [];
  }
  connectedCallback() {
    globalThis.addEventListener(
      "haxcms-user-data-updated",
      this.userDataUpdated.bind(this),
      { signal: this.windowControllers.signal },
    );
  }
  disconnectedCallback() {
    this.windowControllers.abort();
  }
  userDataUpdated(e) {
    this.activeUser = e.detail.userName;
    // ensure visibility of all flags
    this.allFlags.forEach((flag) => {
      flag.show = true;
    });
  }
}
customElements.define(pageFlagManagerEl.tag, pageFlagManagerEl);

// register globally so we can make sure there is only one
globalThis.pageFlagManager = globalThis.pageFlagManager || {};
globalThis.pageFlagManager.requestAvailability = () => {
  if (!globalThis.pageFlagManager.instance) {
    globalThis.pageFlagManager.instance = globalThis.document.createElement(
      pageFlagManagerEl.tag,
    );
    globalThis.document.body.appendChild(globalThis.pageFlagManager.instance);
  }
  return globalThis.pageFlagManager.instance;
};
// most common way to access registry
export const pageFlagManager = globalThis.pageFlagManager.requestAvailability();
