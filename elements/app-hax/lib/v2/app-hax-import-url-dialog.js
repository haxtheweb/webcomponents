/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { HaxUiAdminStyles } from "@haxtheweb/d-d-d/lib/HaxUiAdminStyles.js";
import { HaxUiAdminIcons } from "@haxtheweb/d-d-d/lib/HaxUiAdminIcons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";

/**
 * Whether text is an http(s) URL an importer can be handed.
 * @param {string} value
 * @returns {boolean}
 */
export function isImportUrl(value) {
  if (!value || typeof value !== "string") {
    return false;
  }
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

/**
 * `app-hax-import-url-dialog`
 * The From a URL import: one HAX UI dialog that takes the URL and asks
 * what kind of site it is, which picks the importer. Same card as the
 * HAX UI confirm (haxcms-admin-confirm) on a native modal dialog.
 *
 * Use the helper rather than the element:
 *
 *   const answer = await askImportUrl({ kinds, labels });
 *   // { url, importType } or null when cancelled
 *
 * @element app-hax-import-url-dialog
 */
export class AppHaxImportUrlDialog extends LitElement {
  static get tag() {
    return "app-hax-import-url-dialog";
  }
  constructor() {
    super();
    this.kinds = [];
    this.labels = {};
    this.url = "";
    this.importType = "";
    this._resolve = null;
  }
  static get properties() {
    return {
      /** [{ importType, title, description, icon }] */
      kinds: { type: Array },
      /** { title, url, kind, cancel, continue } (translated by the caller) */
      labels: { type: Object },
      url: { type: String },
      importType: { type: String, attribute: "import-type" },
    };
  }
  static get styles() {
    return [
      ...HaxUiAdminStyles,
      css`
        :host {
          display: contents;
        }
        dialog {
          width: min(640px, calc(100vw - 32px));
          max-height: calc(100dvh - 32px);
          box-sizing: border-box;
          margin: auto;
          padding: var(--ddd-spacing-4, 16px);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius-lg);
          background-color: var(--hax-ui-surface);
          color: var(--hax-ui-text);
          box-shadow: var(--hax-ui-shadow-popover);
          font-family: var(--hax-ui-admin-font-family);
          font-size: var(--hax-ui-admin-font-size);
          color-scheme: var(--hax-ui-color-scheme, inherit);
        }
        dialog::backdrop {
          background-color: rgba(0, 3, 33, 0.32);
        }
        form {
          display: flex;
          flex-direction: column;
          gap: var(--hax-ui-gap-lg);
        }
        h3 {
          margin: 0;
          font-size: 15px;
          font-weight: var(--ddd-font-weight-bold, 700);
          line-height: 1.3;
        }
        .field {
          display: flex;
          flex-direction: column;
          gap: var(--hax-ui-gap);
        }
        .field label,
        legend {
          font-weight: var(--ddd-font-weight-bold, 700);
          font-size: 13px;
        }
        .field .hax-ui-input {
          width: 100%;
          box-sizing: border-box;
        }
        fieldset {
          border: 0;
          margin: 0;
          padding: 0;
          min-width: 0;
        }
        legend {
          padding: 0;
          margin-bottom: var(--hax-ui-gap-md);
        }
        .kinds {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: var(--hax-ui-gap-sm, 6px);
        }
        @media (max-width: 600px) {
          .kinds {
            grid-template-columns: minmax(0, 1fr);
          }
        }
        /* a kind of site: icon, name and what its importer does; the
           picked one takes the selected fill and a strong border */
        .kind {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: var(--hax-ui-gap-md) 10px;
          border: 1px solid var(--hax-ui-line);
          border-radius: var(--hax-ui-radius);
          background-color: var(--hax-ui-surface);
          cursor: pointer;
        }
        .kind:hover {
          background-color: var(--hax-ui-hover);
        }
        .kind:has(input:checked) {
          border-color: var(--hax-ui-accent-strong);
          background-color: var(--hax-ui-accent-soft);
        }
        .kind:has(input:focus-visible) {
          outline: var(--hax-ui-focus-width, 2px) solid var(--hax-ui-focus);
          outline-offset: 2px;
        }
        .kind input {
          margin: 0;
          accent-color: var(--hax-ui-accent-strong);
        }
        .kind simple-icon-lite {
          flex: none;
          color: var(--hax-ui-accent-strong);
          --simple-icon-width: var(--hax-ui-icon, 18px);
          --simple-icon-height: var(--hax-ui-icon, 18px);
        }
        .kind-text {
          min-width: 0;
        }
        .kind-name {
          display: block;
          font-weight: var(--ddd-font-weight-bold, 700);
        }
        .kind-desc {
          display: block;
          font-size: var(--hax-ui-admin-font-size-xs, 12px);
          color: var(--hax-ui-text-muted);
        }
        .acts {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: var(--hax-ui-gap-md);
        }
      `,
    ];
  }

  /**
   * Show it and wait for an answer.
   * @returns {Promise<{url: string, importType: string}|null>}
   */
  ask() {
    return new Promise((resolve) => {
      this._resolve = resolve;
      this.updateComplete.then(() => {
        const dialog = this.shadowRoot.querySelector("dialog");
        if (!dialog || typeof dialog.showModal !== "function") {
          this._finish(false);
          return;
        }
        dialog.showModal();
        const input = this.shadowRoot.querySelector("#url");
        if (input) {
          input.focus();
        }
      });
    });
  }

  _canContinue() {
    return isImportUrl(this.url) && !!this.importType;
  }

  _finish(accepted) {
    const dialog = this.shadowRoot
      ? this.shadowRoot.querySelector("dialog")
      : null;
    if (dialog && dialog.open) {
      dialog.close();
    }
    const resolve = this._resolve;
    this._resolve = null;
    if (typeof resolve === "function") {
      resolve(
        accepted ? { url: this.url.trim(), importType: this.importType } : null,
      );
    }
    if (this.parentNode) {
      this.remove();
    }
  }

  _continue(e) {
    if (e) {
      e.preventDefault();
    }
    if (this._canContinue()) {
      this._finish(true);
    }
  }

  _cancel(e) {
    // Escape and the native close both arrive here
    if (e) {
      e.preventDefault();
    }
    this._finish(false);
  }

  render() {
    const l = this.labels || {};
    return html`
      <dialog aria-labelledby="title" @cancel="${this._cancel}">
        <form method="dialog" @submit="${this._continue}">
          <h3 id="title">${l.title}</h3>
          <div class="field">
            <label for="url">${l.url}</label>
            <input
              id="url"
              class="hax-ui-input"
              type="url"
              autocomplete="off"
              placeholder="https://"
              required
              .value="${this.url}"
              @input="${(e) => (this.url = e.target.value)}"
            />
          </div>
          <fieldset>
            <legend>${l.kind}</legend>
            <div class="kinds">
              ${(this.kinds || []).map(
                (kind) =>
                  html`<label class="kind">
                    <input
                      type="radio"
                      name="kind"
                      value="${kind.importType}"
                      .checked="${this.importType === kind.importType}"
                      @change="${() => (this.importType = kind.importType)}"
                    />
                    <simple-icon-lite
                      icon="${kind.icon}"
                      aria-hidden="true"
                    ></simple-icon-lite>
                    <span class="kind-text">
                      <span class="kind-name">${kind.title}</span>
                      ${
                        kind.description
                          ? html`<span class="kind-desc"
                              >${kind.description}</span
                            >`
                          : nothing
                      }
                    </span>
                  </label>`,
              )}
            </div>
          </fieldset>
          <div class="acts">
            <button
              type="button"
              class="hax-ui-btn ghost cancel"
              @click="${this._cancel}"
            >
              <simple-icon-lite
                icon="${HaxUiAdminIcons.close}"
                aria-hidden="true"
              ></simple-icon-lite>
              ${l.cancel}
            </button>
            <button
              type="submit"
              class="hax-ui-btn primary ok"
              ?disabled="${!this._canContinue()}"
            >
              <simple-icon-lite
                icon="${HaxUiAdminIcons.check}"
                aria-hidden="true"
              ></simple-icon-lite>
              ${l.continue}
            </button>
          </div>
        </form>
      </dialog>
    `;
  }
}

globalThis.customElements.define(
  AppHaxImportUrlDialog.tag,
  AppHaxImportUrlDialog,
);

/**
 * Ask for a URL and what kind of site it is.
 * @param {Object} options { kinds, labels, url }
 * @returns {Promise<{url: string, importType: string}|null>}
 */
export function askImportUrl(options) {
  const opts = options || {};
  const el = globalThis.document.createElement(AppHaxImportUrlDialog.tag);
  el.kinds = opts.kinds || [];
  el.labels = opts.labels || {};
  el.url = typeof opts.url === "string" ? opts.url : "";
  globalThis.document.body.appendChild(el);
  return el.ask();
}
