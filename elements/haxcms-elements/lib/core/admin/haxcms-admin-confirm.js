/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { HaxUiAdminStyles } from "@haxtheweb/d-d-d/lib/HaxUiAdminStyles.js";
import { HaxUiAdminIcons } from "@haxtheweb/d-d-d/lib/HaxUiAdminIcons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";

/**
 * `haxcms-admin-confirm`
 * The HAX UI confirm and prompt: the in-app replacement for the browser's
 * `confirm()` and `prompt()`. It draws the same card as the site admin
 * dialog's leave prompt (title, short message, actions at the bottom
 * right, the safe choice focused) on a native modal `<dialog>`, so it sits
 * above any open admin dialog, keeps focus inside, and Escape cancels.
 *
 * Use the helpers rather than the element:
 *
 *   if (await adminConfirm({ title, message, confirmLabel, danger: true })) …
 *   const name = await adminPrompt({ title, label, value });
 *
 * adminConfirm resolves true or false. adminPrompt resolves the trimmed text,
 * or null when cancelled (an empty answer is "" unless `required`, which
 * keeps the confirm button off until something is typed).
 *
 * @element haxcms-admin-confirm
 */
export class HAXCMSAdminConfirm extends I18NMixin(LitElement) {
  static get tag() {
    return "haxcms-admin-confirm";
  }

  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      confirm: "Confirm",
      cancel: "Cancel",
      ok: "OK",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../../../locales/", import.meta.url).href,
    });
    this.title = "";
    this.message = "";
    this.confirmLabel = "";
    this.cancelLabel = "";
    this.danger = false;
    this.mode = "confirm";
    this.label = "";
    this.value = "";
    this.placeholder = "";
    this.required = false;
    this._resolve = null;
  }

  static get properties() {
    return {
      title: { type: String },
      message: { type: String },
      confirmLabel: { type: String, attribute: "confirm-label" },
      cancelLabel: { type: String, attribute: "cancel-label" },
      danger: { type: Boolean, reflect: true },
      /** "confirm" or "prompt" */
      mode: { type: String, reflect: true },
      /** prompt: the field's label */
      label: { type: String },
      /** prompt: the field's value */
      value: { type: String },
      placeholder: { type: String },
      required: { type: Boolean },
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
          width: min(460px, calc(100vw - 32px));
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
        h3 {
          margin: 0;
          font-size: 15px;
          font-weight: var(--ddd-font-weight-bold, 700);
          line-height: 1.3;
          overflow-wrap: anywhere;
        }
        p {
          margin: var(--hax-ui-gap) 0 0;
          font-size: 13px;
          line-height: 1.4;
          color: var(--hax-ui-text-muted);
          white-space: pre-line;
          overflow-wrap: anywhere;
        }
        .field {
          display: flex;
          flex-direction: column;
          gap: var(--hax-ui-gap);
          margin-top: var(--hax-ui-gap-lg);
        }
        .field label {
          font-weight: var(--ddd-font-weight-medium, 500);
        }
        .field .hax-ui-input {
          width: 100%;
          box-sizing: border-box;
        }
        .acts {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: var(--hax-ui-gap-md);
          margin-top: var(--hax-ui-gap-lg);
        }
      `,
    ];
  }

  /**
   * Show it and wait for an answer.
   * @returns {Promise<boolean|string|null>}
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
        const first =
          this.mode === "prompt"
            ? this.shadowRoot.querySelector("input")
            : this.shadowRoot.querySelector(".cancel");
        if (first) {
          first.focus();
          if (this.mode === "prompt" && typeof first.select === "function") {
            first.select();
          }
        }
      });
    });
  }

  _input() {
    return this.shadowRoot ? this.shadowRoot.querySelector("input") : null;
  }

  _canConfirm() {
    return !(this.mode === "prompt" && this.required && !this.value.trim());
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
      if (this.mode === "prompt") {
        resolve(accepted ? this.value.trim() : null);
      } else {
        resolve(!!accepted);
      }
    }
    this.dispatchEvent(
      new CustomEvent("haxcms-admin-confirm-closed", {
        bubbles: true,
        composed: true,
        detail: { accepted: !!accepted },
      }),
    );
    if (this.parentNode) {
      this.remove();
    }
  }

  _confirm(e) {
    if (e) {
      e.preventDefault();
    }
    if (!this._canConfirm()) {
      return;
    }
    this._finish(true);
  }

  _cancel(e) {
    // Escape and the native close both arrive here
    if (e) {
      e.preventDefault();
    }
    this._finish(false);
  }

  _onInput(e) {
    this.value = e.target.value;
  }

  render() {
    const confirmLabel =
      this.confirmLabel ||
      (this.mode === "prompt" ? this.t.ok : this.t.confirm);
    const cancelLabel = this.cancelLabel || this.t.cancel;
    return html`
      <dialog
        role="${this.mode === "prompt" ? "dialog" : "alertdialog"}"
        aria-labelledby="title"
        aria-describedby="${this.message ? "message" : nothing}"
        @cancel="${this._cancel}"
      >
        <form method="dialog" @submit="${this._confirm}">
          <h3 id="title">${this.title}</h3>
          ${this.message ? html`<p id="message">${this.message}</p>` : nothing}
          ${
            this.mode === "prompt"
              ? html`<div class="field">
                  ${
                    this.label
                      ? html`<label for="answer">${this.label}</label>`
                      : nothing
                  }
                  <input
                    id="answer"
                    class="hax-ui-input"
                    type="text"
                    autocomplete="off"
                    aria-label="${this.label ? nothing : this.title}"
                    placeholder="${this.placeholder || nothing}"
                    .value="${this.value}"
                    ?required="${this.required}"
                    @input="${this._onInput}"
                  />
                </div>`
              : nothing
          }
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
              ${cancelLabel}
            </button>
            <button
              type="submit"
              class="hax-ui-btn ${this.danger ? "danger-fill" : "primary"} ok"
              ?disabled="${!this._canConfirm()}"
            >
              <simple-icon-lite
                icon="${this.danger ? HaxUiAdminIcons.delete : HaxUiAdminIcons.check}"
                aria-hidden="true"
              ></simple-icon-lite>
              ${confirmLabel}
            </button>
          </div>
        </form>
      </dialog>
    `;
  }
}

globalThis.customElements.define(HAXCMSAdminConfirm.tag, HAXCMSAdminConfirm);

function _open(options, mode) {
  const el = globalThis.document.createElement(HAXCMSAdminConfirm.tag);
  const opts = options || {};
  el.mode = mode;
  el.title = opts.title || "";
  el.message = opts.message || "";
  el.confirmLabel = opts.confirmLabel || "";
  el.cancelLabel = opts.cancelLabel || "";
  el.danger = !!opts.danger;
  if (mode === "prompt") {
    el.label = opts.label || "";
    el.value = typeof opts.value === "string" ? opts.value : "";
    el.placeholder = opts.placeholder || "";
    el.required = !!opts.required;
  }
  globalThis.document.body.appendChild(el);
  return el.ask();
}

/**
 * The HAX UI confirm, in place of the browser's confirm().
 * @param {Object} options { title, message, confirmLabel, cancelLabel, danger }
 * @returns {Promise<boolean>}
 */
export function adminConfirm(options) {
  return _open(options, "confirm");
}

/**
 * The HAX UI prompt, in place of the browser's prompt().
 * @param {Object} options { title, message, label, value, placeholder,
 *   required, confirmLabel, cancelLabel }
 * @returns {Promise<string|null>} the trimmed answer, or null when cancelled
 */
export function adminPrompt(options) {
  return _open(options, "prompt");
}
