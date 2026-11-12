/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import {
  HaxUiAdminTokens,
  HaxUiAdminPrimitives,
  HaxUiAdminScheme,
} from "@haxtheweb/d-d-d/lib/HaxUiAdminTokens.js";
import { HaxUiAdminControls } from "@haxtheweb/d-d-d/lib/HaxUiAdminControls.js";
import { HaxUiAdminIcons } from "@haxtheweb/d-d-d/lib/HaxUiAdminIcons.js";
import { HaxUiDialogTitlebarStyles } from "@haxtheweb/d-d-d/lib/HaxUiDialogFrame.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";

/**
 * `doodle-board-field`
 * The "doodle" input method: a field that shows a preview of a drawing in
 * the HAX settings panel, with Edit drawing opening a dialog that holds the
 * full doodle-board-canvas. Saving fires value-changed with the marks as a
 * transparent PNG data URL ("" when nothing is drawn).
 *
 * In a HAX settings form it reads the background image and the mode from
 * sibling settings, named by background-property and mode-property, so a
 * teacher marks up the submission the element already shows.
 *
 * @element doodle-board-field
 * @fires value-changed - `{ value }` after Save or Remove
 */
export class DoodleBoardField extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "doodle-board-field";
  }

  constructor() {
    super();
    this.label = "";
    this.description = "";
    this.value = "";
    this.src = "";
    this.mode = "draw";
    this.backgroundProperty = "";
    this.modeProperty = "";
    this.disabled = false;
    this._open = false;
    this._confirmDiscard = false;
    this.t = this.t || {};
    this.t = {
      ...this.t,
      drawing: "Drawing",
      edit: "Edit drawing",
      start: "Start drawing",
      remove: "Remove drawing",
      empty: "Nothing drawn yet",
      save: "Save",
      cancel: "Cancel",
      close: "Close",
      discard: "Discard changes",
      discardConfirm: "Discard your unsaved changes?",
      keepEditing: "Keep editing",
      draw: "Drawing",
      feedback: "Feedback",
      signature: "Signature",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../locales/", import.meta.url).href,
    });
  }

  static get properties() {
    return {
      ...super.properties,
      label: { type: String },
      description: { type: String },
      value: { type: String },
      /** background image; filled from background-property in a form */
      src: { type: String },
      /** draw, feedback or signature; filled from mode-property in a form */
      mode: { type: String },
      backgroundProperty: { type: String, attribute: "background-property" },
      modeProperty: { type: String, attribute: "mode-property" },
      disabled: { type: Boolean, reflect: true },
      _open: { state: true },
      _confirmDiscard: { state: true },
    };
  }

  static get styles() {
    return [
      super.styles,
      HaxUiAdminTokens,
      HaxUiAdminPrimitives,
      HaxUiAdminScheme,
      HaxUiAdminControls,
      HaxUiDialogTitlebarStyles,
      css`
        :host {
          display: block;
          font-family: var(--hax-ui-admin-font-family);
          font-size: var(--hax-ui-admin-font-size);
          color: var(--hax-ui-text);
        }
        .head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--hax-ui-gap-md);
          min-height: var(--hax-ui-row-height);
        }
        .label {
          font-weight: var(--ddd-font-weight-bold, 700);
        }
        .preview {
          all: unset;
          box-sizing: border-box;
          cursor: pointer;
          position: relative;
          display: grid;
          place-items: center;
          width: 100%;
          aspect-ratio: 3 / 2;
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius);
          overflow: hidden;
          background-color: var(--ddd-theme-default-white, #ffffff);
          color-scheme: light;
        }
        .preview:hover {
          border-color: var(--hax-ui-text-muted);
        }
        .preview:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 1px;
        }
        .preview img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .preview .empty {
          display: grid;
          justify-items: center;
          gap: var(--hax-ui-gap);
          padding: var(--hax-ui-gap-lg);
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--ddd-theme-default-slateGray, #314d64);
          text-align: center;
          --simple-icon-width: 24px;
          --simple-icon-height: 24px;
        }
        .preview.has-bg .empty {
          position: relative;
          padding: var(--hax-ui-gap) var(--hax-ui-gap-md);
          border-radius: var(--hax-ui-radius);
          background-color: var(--ddd-theme-default-white, #ffffff);
        }
        .actions {
          display: flex;
          gap: var(--hax-ui-gap-md);
          margin-top: var(--hax-ui-gap-md);
        }
        .actions .hax-ui-btn:first-child {
          flex: 1;
        }
        .desc {
          margin: var(--hax-ui-gap-md) 0 0;
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
        }
        dialog {
          box-sizing: border-box;
          width: min(1120px, calc(100vw - 32px));
          max-height: calc(100vh - 32px);
          padding: 0;
          border: 0;
          border-radius: var(--hax-ui-radius-lg);
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-surface);
          box-shadow: var(--hax-ui-shadow-popover);
          overflow: hidden;
        }
        dialog[open] {
          display: flex;
          flex-direction: column;
        }
        dialog::backdrop {
          background-color: rgba(0, 3, 33, 0.6);
        }
        .dialog-body {
          flex: 1;
          min-height: 0;
          overflow: auto;
          padding: var(--ddd-spacing-4, 16px);
        }
        .hax-ui-dialog-titlebar .hax-ui-dialog-title {
          flex: none;
        }
        /* the mode, on the dark bar */
        .hax-ui-dialog-titlebar .pill {
          color: var(--hax-ui-on-titlebar);
          background-color: transparent;
          box-shadow: inset 0 0 0 1px currentColor;
          opacity: 0.85;
        }
        .hax-ui-dialog-titlebar .spacer {
          flex: 1;
        }
        .dialog-actions {
          flex: none;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: flex-end;
          gap: var(--hax-ui-gap-md);
          min-height: var(--hax-ui-action-bar-height);
          padding: 0 var(--ddd-spacing-4, 16px);
          border-top: 1px solid var(--hax-ui-line);
        }
        .dialog-actions .question {
          margin-inline-end: auto;
          font-weight: var(--ddd-font-weight-bold, 700);
        }
      `,
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this._form = this._findForm();
    if (this._form) {
      // only the form's own changes, not a field's passing through
      this._formHandler = (e) => {
        if (e.target === this._form) this._readForm();
      };
      this._form.addEventListener("value-changed", this._formHandler);
      this._readForm();
    }
  }

  disconnectedCallback() {
    if (this._form && this._formHandler) {
      this._form.removeEventListener("value-changed", this._formHandler);
    }
    super.disconnectedCallback();
  }

  /** the simple-fields form this field sits in, across shadow roots */
  _findForm() {
    let node = this;
    while (node) {
      const form = node.closest
        ? node.closest("simple-fields, simple-fields-lite, simple-fields-form")
        : null;
      if (form) return form;
      const root = node.getRootNode ? node.getRootNode() : null;
      node = root && root.host ? root.host : null;
    }
    return null;
  }

  /** follow the background image and mode settings beside this one */
  _readForm() {
    const values = this._form && this._form.value ? this._form.value : null;
    if (!values) return;
    if (
      this.backgroundProperty &&
      values[this.backgroundProperty] !== undefined
    )
      this.src = values[this.backgroundProperty] || "";
    if (this.modeProperty && values[this.modeProperty])
      this.mode = values[this.modeProperty];
  }

  render() {
    const hasDrawing = !!this.value;
    return html`
      <div class="head">
        <span class="label" id="label">${this.label || this.t.drawing}</span>
        <span class="hax-ui-pill">${this.t[this.mode] || this.mode}</span>
      </div>
      <button
        type="button"
        class="preview ${this.src ? "has-bg" : ""}"
        aria-labelledby="${hasDrawing ? "label" : "label empty"}"
        aria-describedby="${this.description ? "desc" : nothing}"
        ?disabled="${this.disabled}"
        @click="${this.open}"
      >
        ${this.src ? html`<img src="${this.src}" alt="" />` : nothing}
        ${
          hasDrawing
            ? html`<img src="${this.value}" alt="" />`
            : html`<span class="empty" id="empty">
                <simple-icon-lite
                  icon="${HaxUiAdminIcons.edit}"
                ></simple-icon-lite>
                ${this.t.empty}
              </span>`
        }
      </button>
      <div class="actions">
        <button
          type="button"
          class="hax-ui-btn"
          ?disabled="${this.disabled}"
          @click="${this.open}"
        >
          <simple-icon-lite icon="${HaxUiAdminIcons.edit}"></simple-icon-lite>
          ${hasDrawing ? this.t.edit : this.t.start}
        </button>
        ${
          hasDrawing
            ? html`<button
                type="button"
                class="hax-ui-icon-btn danger"
                aria-label="${this.t.remove}"
                title="${this.t.remove}"
                ?disabled="${this.disabled}"
                @click="${this._remove}"
              >
                <simple-icon-lite
                  icon="${HaxUiAdminIcons.delete}"
                ></simple-icon-lite>
              </button>`
            : nothing
        }
      </div>
      ${
        this.description
          ? html`<p class="desc" id="desc">${this.description}</p>`
          : nothing
      }
      <dialog
        aria-labelledby="dialog-title"
        @cancel="${this._dialogCancel}"
        @close="${() => (this._open = false)}"
      >
        <div class="hax-ui-dialog-titlebar">
          <h2 class="hax-ui-dialog-title" id="dialog-title">
            ${this.label || this.t.drawing}
          </h2>
          <span class="hax-ui-pill pill"
            >${this.t[this.mode] || this.mode}</span
          >
          <span class="spacer"></span>
          <button
            type="button"
            class="hax-ui-dialog-close"
            aria-label="${this.t.close}"
            @click="${this._requestClose}"
          >
            <simple-icon-lite
              icon="${HaxUiAdminIcons.close}"
            ></simple-icon-lite>
          </button>
        </div>
        <div class="dialog-body">
          ${
            this._open
              ? html`<doodle-board-canvas
                  mode="${this.mode}"
                  .src="${this.src}"
                  .value="${this.value}"
                  label="${this.label || this.t.drawing}"
                  downloadable
                ></doodle-board-canvas>`
              : nothing
          }
        </div>
        <div class="dialog-actions">
          ${
            this._confirmDiscard
              ? html`
                  <span class="question" role="alert"
                    >${this.t.discardConfirm}</span
                  >
                  <button
                    type="button"
                    class="hax-ui-btn ghost"
                    @click="${() => (this._confirmDiscard = false)}"
                  >
                    ${this.t.keepEditing}
                  </button>
                  <button
                    type="button"
                    class="hax-ui-btn danger-fill"
                    @click="${this.close}"
                  >
                    ${this.t.discard}
                  </button>
                `
              : html`
                  <button
                    type="button"
                    class="hax-ui-btn ghost"
                    @click="${this._requestClose}"
                  >
                    ${this.t.cancel}
                  </button>
                  <button
                    type="button"
                    class="hax-ui-btn primary"
                    @click="${this._save}"
                  >
                    ${this.t.save}
                  </button>
                `
          }
        </div>
      </dialog>
    `;
  }

  /** open the editor dialog; the editor loads on first use */
  async open() {
    if (this.disabled) return;
    this._readForm();
    await import("./doodle-board-canvas.js");
    this._confirmDiscard = false;
    this._open = true;
    await this.updateComplete;
    const dialog = this.shadowRoot.querySelector("dialog");
    if (!dialog.open) dialog.showModal();
  }

  close() {
    this._confirmDiscard = false;
    const dialog = this.shadowRoot.querySelector("dialog");
    if (dialog.open) dialog.close();
    this._open = false;
  }

  get _canvas() {
    return this.shadowRoot.querySelector("doodle-board-canvas");
  }

  _requestClose() {
    const canvas = this._canvas;
    if (canvas && canvas.dirty) this._confirmDiscard = true;
    else this.close();
  }

  /** Escape asks before throwing work away */
  _dialogCancel(e) {
    const canvas = this._canvas;
    if (canvas && canvas.dirty) {
      e.preventDefault();
      this._confirmDiscard = true;
    }
  }

  _save() {
    const canvas = this._canvas;
    if (canvas) this._setValue(canvas.getValue());
    this.close();
  }

  _remove() {
    this._setValue("");
  }

  _setValue(value) {
    this.value = value;
    this.dispatchEvent(
      // does not bubble: simple-fields listens on the field itself, and a
      // bubbling event would reach the form as if it were the form's value
      new CustomEvent("value-changed", {
        detail: { value: this.value },
      }),
    );
  }
}

globalThis.customElements.define(DoodleBoardField.tag, DoodleBoardField);
