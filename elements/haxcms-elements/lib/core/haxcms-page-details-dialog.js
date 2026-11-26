/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css, nothing } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import {
  HaxUiAdminStyles,
  HaxUiAdminIcons,
} from "@haxtheweb/d-d-d/lib/HaxUiAdminStyles.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";

/**
 * `haxcms-page-details-dialog`
 * The active page's details (status, address, description, tags, last
 * change) in one modal, opened from the top bar's Page details button
 * (haxtheweb/issues#2952). It reads the page from the store and changes
 * nothing itself: each action runs the same handler as the page actions
 * menu on the page (page-break), so saves take the existing paths.
 */
class HAXCMSPageDetailsDialog extends I18NMixin(DDD) {
  static get tag() {
    return "haxcms-page-details-dialog";
  }

  static get properties() {
    return {
      item: { type: Object, attribute: false },
    };
  }

  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      noActivePage: "No page is open.",
      published: "Published",
      unpublished: "Unpublished",
      hiddenFromMenu: "Hidden from menu",
      locked: "Locked",
      address: "Address",
      description: "Description",
      tags: "Tags",
      updated: "Last changed",
      none: "None",
      editPage: "Edit page",
      renameTitle: "Rename",
      changeIcon: "Change icon",
      editTags: "Edit tags",
      viewRevisions: "Revisions",
      publish: "Publish",
      unpublish: "Unpublish",
      lock: "Lock",
      unlock: "Unlock",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL(
          "../../locales/haxcms-page-details-dialog.en.json",
          import.meta.url,
        ).href + "/../",
    });
    this.item = null;
    this.__disposer = null;
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.__disposer) {
      this.__disposer = autorun(() => {
        const item = toJS(store.activeItem);
        Promise.resolve().then(() => {
          this.item = item && item.id ? item : null;
        });
      });
    }
  }

  disconnectedCallback() {
    if (this.__disposer) {
      this.__disposer();
      this.__disposer = null;
    }
    super.disconnectedCallback();
  }

  static get styles() {
    return [
      super.styles,
      ...HaxUiAdminStyles,
      css`
        :host {
          display: block;
          padding: var(--ddd-spacing-5);
          font-family: var(--hax-ui-admin-font-family);
          font-size: var(--hax-ui-admin-font-size);
          color: var(--hax-ui-text);
        }
        .pills {
          display: flex;
          flex-wrap: wrap;
          gap: var(--hax-ui-gap);
          margin-bottom: var(--hax-ui-gap-lg);
        }
        /* the content admin's quiet fact list (DDD boxes a dl) */
        dl {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          gap: var(--hax-ui-gap) var(--hax-ui-gap-lg);
          margin: 0;
          padding: 0;
          border: 0;
          box-shadow: none;
        }
        dt,
        dd {
          margin: 0;
          padding: 0;
          border: 0;
          font-family: var(--hax-ui-admin-font-family);
          font-size: var(--hax-ui-admin-font-size);
          line-height: 1.4;
        }
        dt {
          color: var(--hax-ui-text-muted);
        }
        dd {
          min-width: 0;
          overflow-wrap: anywhere;
        }
        dd.mono {
          font-family: var(--ddd-font-mono, ui-monospace, monospace);
          font-size: var(--hax-ui-admin-font-size-xs);
        }
        .acts {
          display: flex;
          flex-wrap: wrap;
          gap: var(--hax-ui-gap-md);
          margin-top: var(--ddd-spacing-5);
          padding-top: var(--ddd-spacing-4);
          border-top: 1px solid var(--hax-ui-line);
        }
      `,
    ];
  }

  _tags(metadata) {
    if (Array.isArray(metadata.tags)) {
      return metadata.tags.join(", ");
    }
    return typeof metadata.tags === "string" ? metadata.tags.trim() : "";
  }

  _published(value) {
    return !(value === false || value === "0" || value === 0);
  }

  _hidden(value) {
    return value === true || value === "1" || value === 1 || value === "true";
  }

  _date(value) {
    const ts =
      typeof value === "number"
        ? value
        : typeof value === "string" && value !== ""
          ? parseInt(value, 10)
          : 0;
    if (!ts) {
      return "";
    }
    const date = new Date(ts < 1000000000000 ? ts * 1000 : ts);
    if (Number.isNaN(date.getTime())) {
      return "";
    }
    return date.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  render() {
    if (!this.item) {
      return html`<p class="hax-ui-empty">${this.t.noActivePage}</p>`;
    }
    const item = this.item;
    const metadata = item.metadata || {};
    const published = this._published(metadata.published);
    const locked = metadata.locked === true || metadata.locked === "true";
    const tags = this._tags(metadata);
    const updated = this._date(metadata.updated);
    return html`
      <div class="pills">
        <span
          class="hax-ui-pill"
          data-tone="${published ? "success" : "neutral"}"
          >${published ? this.t.published : this.t.unpublished}</span
        >
        ${
          this._hidden(metadata.hideInMenu)
            ? html`<span class="hax-ui-pill">${this.t.hiddenFromMenu}</span>`
            : nothing
        }
        ${
          locked
            ? html`<span class="hax-ui-pill">${this.t.locked}</span>`
            : nothing
        }
      </div>
      <dl>
        <dt>${this.t.address}</dt>
        <dd class="mono">${item.slug || ""}</dd>
        <dt>${this.t.description}</dt>
        <dd>${item.description || this.t.none}</dd>
        <dt>${this.t.tags}</dt>
        <dd>${tags || this.t.none}</dd>
        <dt>${this.t.updated}</dt>
        <dd>${updated || this.t.none}</dd>
      </dl>
      <div class="acts">
        ${this._action("_editPage", HaxUiAdminIcons.edit, this.t.editPage, locked, "primary")}
        ${this._action("_editTitle", HaxUiAdminIcons.text, this.t.renameTitle, locked)}
        ${this._action("_editIcon", HaxUiAdminIcons.image, this.t.changeIcon, locked)}
        ${this._action("_editTags", HaxUiAdminIcons.metadata, this.t.editTags, locked)}
        ${this._action("_openRevisions", HaxUiAdminIcons.history, this.t.viewRevisions, false)}
        ${this._action(
          "_togglePublished",
          published ? HaxUiAdminIcons.hide : HaxUiAdminIcons.preview,
          published ? this.t.unpublish : this.t.publish,
          locked,
        )}
        ${this._action(
          "_toggleLocked",
          locked ? HaxUiAdminIcons.unlock : HaxUiAdminIcons.lock,
          locked ? this.t.unlock : this.t.lock,
          false,
        )}
      </div>
    `;
  }

  _action(handler, icon, label, disabled, tone = "") {
    return html`<button
      type="button"
      class="hax-ui-btn ${tone}"
      data-action="${handler}"
      ?disabled="${disabled}"
      @click="${this._runAction}"
    >
      <simple-icon-lite icon="${icon}" aria-hidden="true"></simple-icon-lite>
      ${label}
    </button>`;
  }

  /**
   * Close the dialog, then run the page actions menu's own handler on the
   * active page's page-break, so the change saves exactly as it does from
   * that menu (Merlin programs, haxcms-save-node-details, revisions).
   */
  _runAction(e) {
    const handler = e.currentTarget.getAttribute("data-action");
    const pageBreak = this._activePageBreak();
    if (!pageBreak || typeof pageBreak[handler] !== "function") {
      return;
    }
    this.dispatchEvent(
      new CustomEvent("simple-modal-hide", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {},
      }),
    );
    pageBreak[handler](e);
  }

  _activePageBreak() {
    const id = this.item && this.item.id ? `${this.item.id}` : "";
    const all = Array.from(globalThis.document.querySelectorAll("page-break"));
    return all.find((el) => el.getAttribute("item-id") === id) || all[0];
  }
}
globalThis.customElements.define(
  HAXCMSPageDetailsDialog.tag,
  HAXCMSPageDetailsDialog,
);
export { HAXCMSPageDetailsDialog };
