/**
 * Copyright 2023 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/absolute-position-behavior/absolute-position-behavior.js";
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
    this.show = true;
    this.delay = 1000;
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("resize", this.resizeEvent.bind(this));
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("resize", this.resizeEvent.bind(this));
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
      }
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
      ...styles,
      css`
        :host {
          display: none;
          position: absolute;
        }
        :host([show]) {
          display: block;
        }
        .arrow {
          border: 3px solid var(--simple-colors-default-theme-accent-4,#97d4e8);
          border-radius: 4px;
          background: var(--simple-colors-default-theme-accent-1,#c8e7f1);
          color: var(--simple-colors-default-theme-accent-8,#2d7187);
          padding: 8px;
          text-align: center;
          max-width: 100px;
          font-size: 11px;
          font-weight: bold;
          position: relative;
          cursor: pointer;
        }
        
        .arrow::after, .arrow::before {
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
          border-right-color: var(--simple-colors-default-theme-accent-4,#97d4e8);
          top: 50%;
          margin-top: -14px;
          border-width: 14px;
        }
        .arrow::after {
          border-color: rgba(255, 255, 255, 0);
          border-right-color: var(--simple-colors-default-theme-accent-1,#c8e7f1);
          top: 50%;
          margin-top: -10px;
          border-width: 10px;
        }
        absolute-position-behavior {
          z-index: var(--simple-modal-z-index, 1000);
          min-width: 180px;
        }
        absolute-position-behavior div {
          color: black;
          background-color: white;
          font-size: 12px;
          width: 200px;
          margin-left: 80px;
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
    });
  }
  /**
   * LitElement render callback
   */
  render() {
    return html`
      <button class="arrow" @click="${this.toggleOpen}">${this.label}</button>
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
  }
  handleReply(e) {
    const comment = document.createElement("page-flag-comment");
    comment.seed = pageFlagManager.activeUser;
    comment.timestamp = Date.now();
    comment.testCanUpdate(pageFlagManager.activeUser);
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
  }
  /**
   * haxHooks
   */
  haxHooks() {
    return {
      editModeChanged: "haxeditModeChanged",
    };
  }

  resizeEvent() {
    this.updateArrowPosition();      
  }

  updateArrowPosition() {
    setTimeout(() => {
    if (this.previousElementSibling) {
      try {
        let range = document.createRange();
        range.selectNode(this.previousElementSibling);
        range.setStart(this.previousElementSibling, 0);
        let textRect = range.getBoundingClientRect();
        range.detach();
        // height of the container
        //let height = this.previousElementSibling.getBoundingClientRect().height / 3;
        //this.style.top = textRect.y + textRect.top - height + "px";
        this.style.left = textRect.x + textRect.width + 30 + "px";
      }
      catch(e) {
        console.warn(e);
      }
    }
    }, this.delay);
  }
  /**
   * LitElement ready
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    // arrow node for pointing to w/ the tooltip container
    this.shadowRoot.querySelector('absolute-position-behavior').target = this.shadowRoot.querySelector(".arrow");
    // time for things to get loaded before we attempt to position a target
    this.updateArrowPosition();      
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
    this.activeUser = null;
  }
  connectedCallback() {
    window.addEventListener('haxcms-user-data-updated', this.userDataUpdated.bind(this));
  }
  disconnectedCallback() {
    window.removeEventListener('haxcms-user-data-updated', this.userDataUpdated.bind(this));
  }
  userDataUpdated(e) {
    this.activeUser = e.detail.userName;
  }
}
customElements.define(pageFlagManagerEl.tag, pageFlagManagerEl);


// register globally so we can make sure there is only one
window.pageFlagManager = window.pageFlagManager || {};
window.pageFlagManager.requestAvailability = () => {
  if (!window.pageFlagManager.instance) {
    window.pageFlagManager.instance = document.createElement(
      pageFlagManagerEl.tag
    );
    document.body.appendChild(window.pageFlagManager.instance);
  }
  return window.pageFlagManager.instance;
};
// most common way to access registry
export const pageFlagManager =
  window.pageFlagManager.requestAvailability();
