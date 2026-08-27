/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";

/**
 * `simple-pager`
 * `A reusable, presentational pager that mirrors a backend PageInfo shape and fires page-changed events.`
 *
 * @demo demo/index.html
 * @element simple-pager
 */
export class SimplePager extends I18NMixin(DDD) {
  static get tag() {
    return "simple-pager";
  }

  constructor() {
    super();
    this.limit = 25;
    this.offset = 0;
    this.total = 0;
    this.count = 0;
    this.mode = "mini";
    this.maxPageButtons = 10;
    this.forceVisible = false;
    this.label = "";
    this.t = this.t || {};
    this.t = {
      ...this.t,
      pagination: "Pagination",
      page: "Page",
      of: "of",
      first: "First page",
      previous: "Previous page",
      next: "Next page",
      last: "Last page",
      showing: "Showing",
      to: "to",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/simple-pager.ar.json", import.meta.url).href +
        "/../",
    });
  }

  static get properties() {
    return {
      ...super.properties,
      limit: { type: Number },
      offset: { type: Number },
      total: { type: Number },
      count: { type: Number },
      mode: { type: String, reflect: true },
      maxPageButtons: { type: Number, attribute: "max-page-buttons" },
      forceVisible: { type: Boolean, attribute: "force-visible" },
      label: { type: String },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-1);
          font-family: var(--ddd-font-navigation);
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
        }
        :host([hidden]) {
          display: none !important;
        }
        nav {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-1);
          width: 100%;
        }
        .ib {
          --simple-icon-button-border-radius: var(--ddd-radius-sm);
          --simple-icon-button-border: var(--ddd-border-xs) solid
            var(--ddd-theme-default-limestoneGray);
          --simple-icon-button-focus-border: var(--ddd-border-xs) solid
            var(--ddd-theme-default-navy);
          --simple-icon-height: var(--ddd-icon-xxs);
          --simple-icon-width: var(--ddd-icon-xxs);
          padding: var(--ddd-spacing-2);
          color: inherit;
        }
        .page-btn {
          min-width: var(--ddd-spacing-7);
          height: var(--ddd-spacing-7);
          box-sizing: border-box;
          border: var(--ddd-border-xs) solid
            var(--ddd-theme-default-limestoneGray);
          border-radius: var(--ddd-radius-sm);
          background: transparent;
          color: inherit;
          font-size: var(--ddd-font-size-4xs);
          font-family: var(--ddd-font-navigation);
          padding: 0 var(--ddd-spacing-1);
          cursor: pointer;
          line-height: 1;
        }
        .page-btn:hover,
        .page-btn:focus-visible {
          border-color: var(--ddd-theme-default-navy);
          color: var(--ddd-theme-default-navy);
          outline: none;
        }
        .page-btn[aria-current="page"] {
          background: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          color: var(--ddd-theme-default-navy);
          border-color: var(--ddd-theme-default-navy);
          font-weight: var(--ddd-font-weight-bold);
        }
        .ellipsis {
          min-width: var(--ddd-spacing-4);
          text-align: center;
          color: var(--ddd-theme-default-slateGray);
          font-size: var(--ddd-font-size-4xs);
          padding: 0 var(--ddd-spacing-1);
        }
        .status {
          font-size: var(--ddd-font-size-4xs);
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
          padding: 0 var(--ddd-spacing-1);
        }
      `,
    ];
  }

  get _totalPages() {
    if (this.total <= 0 || this.limit <= 0) {
      return 1;
    }
    return Math.max(1, Math.ceil(this.total / this.limit));
  }

  get _currentPage() {
    if (this.limit <= 0) {
      return 1;
    }
    const page = Math.floor(this.offset / this.limit) + 1;
    return Math.max(1, Math.min(page, this._totalPages));
  }

  get _shouldHide() {
    return !this.forceVisible && this.total <= this.limit;
  }

  get _navLabel() {
    return this.label || this.t.pagination;
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    const shouldHide = this._shouldHide;
    if (shouldHide && !this.hidden) {
      this.hidden = true;
    } else if (!shouldHide && this.hidden) {
      this.hidden = false;
    }
  }

  _pageTokens() {
    const totalPages = this._totalPages;
    const currentPage = this._currentPage;
    const max = Math.max(1, this.maxPageButtons);
    if (totalPages <= max) {
      const all = [];
      for (let i = 1; i <= totalPages; i++) {
        all.push(i);
      }
      return all;
    }
    const half = Math.floor(max / 2);
    let start = currentPage - half;
    let end = start + max - 1;
    if (start < 1) {
      start = 1;
      end = max;
    }
    if (end > totalPages) {
      end = totalPages;
      start = totalPages - max + 1;
    }
    const tokens = [];
    if (start > 1) {
      tokens.push(1);
      if (start > 2) {
        tokens.push("ellipsis");
      }
    }
    for (let i = start; i <= end; i++) {
      tokens.push(i);
    }
    if (end < totalPages) {
      if (end < totalPages - 1) {
        tokens.push("ellipsis");
      }
      tokens.push(totalPages);
    }
    return tokens;
  }

  _goToPage(page) {
    const totalPages = this._totalPages;
    const clamped = Math.max(1, Math.min(page, totalPages));
    const newOffset = (clamped - 1) * this.limit;
    this.dispatchEvent(
      new CustomEvent("page-changed", {
        detail: { limit: this.limit, offset: newOffset },
        bubbles: true,
        composed: true,
      }),
    );
  }

  _onFirst() {
    if (this._currentPage <= 1) {
      return;
    }
    this._goToPage(1);
  }

  _onPrev() {
    if (this._currentPage <= 1) {
      return;
    }
    this._goToPage(this._currentPage - 1);
  }

  _onNext() {
    if (this._currentPage >= this._totalPages) {
      return;
    }
    this._goToPage(this._currentPage + 1);
  }

  _onLast() {
    if (this._currentPage >= this._totalPages) {
      return;
    }
    this._goToPage(this._totalPages);
  }

  _onPageClick(e) {
    const target = e && e.currentTarget ? e.currentTarget : null;
    if (!target || !target.getAttribute) {
      return;
    }
    if (target.hasAttribute("disabled")) {
      return;
    }
    const pageValue = parseInt(target.getAttribute("data-page"), 10);
    if (Number.isNaN(pageValue) || pageValue < 1) {
      return;
    }
    this._goToPage(pageValue);
  }

  _statusText() {
    const totalPages = this._totalPages;
    const currentPage = this._currentPage;
    let text = `${this.t.page} ${currentPage} ${this.t.of} ${totalPages}`;
    if (this.count > 0 && this.total > 0) {
      const first = Math.min(this.offset + 1, this.total);
      const last = Math.min(this.offset + this.count, this.total);
      text += ` \u00b7 ${this.t.showing} ${first} ${this.t.to} ${last} ${this.t.of} ${this.total}`;
    }
    return text;
  }

  render() {
    if (this._shouldHide) {
      return html``;
    }
    const currentPage = this._currentPage;
    const totalPages = this._totalPages;
    const atFirst = currentPage <= 1;
    const atLast = currentPage >= totalPages;
    if (this.mode === "full") {
      return this._renderFull(currentPage, totalPages, atFirst, atLast);
    }
    return this._renderMini(currentPage, totalPages, atFirst, atLast);
  }

  _renderMini(currentPage, totalPages, atFirst, atLast) {
    return html`
      <nav aria-label="${this._navLabel}">
        <simple-icon-button-lite
          class="ib"
          icon="icons:chevron-left"
          label="${this.t.previous}"
          title="${this.t.previous}"
          ?disabled="${atFirst || totalPages <= 1}"
          @click="${this._onPrev}"
        ></simple-icon-button-lite>
        <span class="status" aria-live="polite">${this._statusText()}</span>
        <simple-icon-button-lite
          class="ib"
          icon="icons:chevron-right"
          label="${this.t.next}"
          title="${this.t.next}"
          ?disabled="${atLast || totalPages <= 1}"
          @click="${this._onNext}"
        ></simple-icon-button-lite>
      </nav>
    `;
  }

  _renderFull(currentPage, totalPages, atFirst, atLast) {
    const tokens = this._pageTokens();
    return html`
      <nav aria-label="${this._navLabel}">
        <simple-icon-button-lite
          class="ib"
          icon="icons:first-page"
          label="${this.t.first}"
          title="${this.t.first}"
          ?disabled="${atFirst || totalPages <= 1}"
          @click="${this._onFirst}"
        ></simple-icon-button-lite>
        <simple-icon-button-lite
          class="ib"
          icon="icons:chevron-left"
          label="${this.t.previous}"
          title="${this.t.previous}"
          ?disabled="${atFirst || totalPages <= 1}"
          @click="${this._onPrev}"
        ></simple-icon-button-lite>
        ${tokens.map((token) => {
          if (token === "ellipsis") {
            return html`<span class="ellipsis" aria-hidden="true">…</span>`;
          }
          const isCurrent = token === currentPage;
          return html`<button
            class="page-btn"
            type="button"
            data-page="${token}"
            aria-current="${isCurrent ? "page" : "false"}"
            aria-label="${this.t.page} ${token}"
            ?disabled="${isCurrent}"
            @click="${this._onPageClick}"
          >
            ${token}
          </button>`;
        })}
        <simple-icon-button-lite
          class="ib"
          icon="icons:chevron-right"
          label="${this.t.next}"
          title="${this.t.next}"
          ?disabled="${atLast || totalPages <= 1}"
          @click="${this._onNext}"
        ></simple-icon-button-lite>
        <simple-icon-button-lite
          class="ib"
          icon="icons:last-page"
          label="${this.t.last}"
          title="${this.t.last}"
          ?disabled="${atLast || totalPages <= 1}"
          @click="${this._onLast}"
        ></simple-icon-button-lite>
        <span class="status" aria-live="polite">${this._statusText()}</span>
      </nav>
    `;
  }
}

globalThis.customElements.define(SimplePager.tag, SimplePager);
