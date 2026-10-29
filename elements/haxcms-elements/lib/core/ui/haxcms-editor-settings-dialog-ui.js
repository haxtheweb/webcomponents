import { html, css, nothing } from "lit";
import { autorun, toJS } from "mobx";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { HAXStore } from "@haxtheweb/hax-body/lib/hax-store.js";
import { HAXCMSI18NMixin } from "../utils/HAXCMSI18NMixin.js";
import {
  HaxUiAdminTokens,
  HaxUiAdminPrimitives,
} from "@haxtheweb/hax-body/lib/hax-ui-styles.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";

const AUDIENCES = ["novice", "expert"];

/**
 * `haxcms-editor-settings-dialog-ui`
 * The Editor admin section: the editor experience level (novice or
 * expert) with a toolbar preview. Renders inside the one admin dialog
 * (haxcms-site-admin) and implements its section contract: it stages the
 * choice, reports it with `haxcms-admin-section-state`, and its `save()`
 * fires the same `haxcms-save-editor-settings` event and payload as before.
 */
class HAXCMSEditorSettingsDialogUI extends HAXCMSI18NMixin(DDD) {
  static get tag() {
    return "haxcms-editor-settings-dialog-ui";
  }

  static get properties() {
    return {
      audience: { type: String },
      busy: { type: Boolean, reflect: true },
      /** set by haxcms-site-admin: the shell owns the Save button */
      inShell: { type: Boolean, attribute: "in-shell", reflect: true },
    };
  }

  constructor() {
    super();
    this.audience = "expert";
    this.busy = false;
    this.inShell = false;
    this.__baseline = "expert";
    this.__disposer = [];
    this.audienceOptions = [
      { value: "novice", label: "Novice" },
      { value: "expert", label: "Expert" },
    ];

    this.t = this.t || {};
    this.t = {
      ...this.t,
      title: "Editor Settings",
      experienceLevel: "Experience Level",
      experienceLevelDescription:
        "Select the editor experience and preview the toolbar layout.",
      buttons: "Buttons",
      futureButtonConfiguration:
        "Custom editor button configuration is coming soon.",
      save: "Save",
      saving: "Saving…",
      novice: "Novice",
      expert: "Expert",
      toolbarPreviewAlt: "{audience} editing toolbar preview",
      savingEditorSettingsFailed: "Saving editor settings failed: {error}",
      changed: "changed",
    };

    this.registerLocalization({
      context: this,
      localesPath: new URL("../../../locales/", import.meta.url).href,
    });
  }

  static get styles() {
    return [
      super.styles,
      ...HaxUiAdminTokens,
      ...HaxUiAdminPrimitives,
      css`
        :host {
          display: block;
          box-sizing: border-box;
          padding: var(--hax-ui-gap) var(--ddd-spacing-6, 24px)
            var(--ddd-spacing-8, 32px);
          font-family: var(--hax-ui-admin-font-family);
          font-size: var(--hax-ui-admin-font-size);
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-surface);
        }
        :host([busy]) {
          pointer-events: none;
          opacity: var(--ddd-opacity-80, 0.8);
        }
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }
        h2 {
          margin: var(--hax-ui-gap-lg) 0 0;
          font-size: var(--ddd-font-size-xs, 16px);
          font-weight: var(--ddd-font-weight-bold, 700);
        }
        /* admin fieldset (contract-admin-fieldset), not DDD's content-scale
           details: no +/- marker, no 650px cap, no tinted bar */
        details {
          margin: 0;
          padding: 0;
          max-width: none;
          overflow: visible;
        }
        details > summary::after,
        details[open] > summary::after {
          content: none;
        }
        summary,
        details[open] > summary {
          background-color: transparent;
          color: inherit;
          filter: none;
          font-size: var(--hax-ui-admin-font-size);
          text-wrap: nowrap;
          user-select: none;
          transition: none;
        }
        summary {
          list-style: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          height: var(--hax-ui-row-height);
          margin-top: var(--ddd-spacing-4, 16px);
          padding: 0 var(--hax-ui-gap-md);
          border-radius: var(--hax-ui-radius);
          font-weight: var(--ddd-font-weight-bold, 700);
        }
        summary::-webkit-details-marker {
          display: none;
        }
        details > summary:hover,
        details[open] > summary:hover {
          background-color: var(--hax-ui-hover);
        }
        summary:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 2px;
        }
        summary simple-icon-lite {
          --simple-icon-width: var(--hax-ui-icon);
          --simple-icon-height: var(--hax-ui-icon);
          transition: transform var(--hax-ui-duration) var(--hax-ui-easing);
        }
        details[open] > summary simple-icon-lite {
          transform: rotate(90deg);
        }
        summary h3 {
          margin: 0;
          font-size: var(--hax-ui-admin-font-size);
          font-weight: inherit;
        }
        .fr {
          display: grid;
          grid-template-columns: minmax(160px, 240px) minmax(0, 480px);
          gap: var(--ddd-spacing-6, 24px);
          align-items: start;
          padding: var(--hax-ui-gap-lg) var(--hax-ui-gap-md);
          border-bottom: 1px solid var(--hax-ui-line);
        }
        .lab {
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          font-weight: var(--ddd-font-weight-bold, 700);
        }
        .help {
          display: block;
          margin-top: 2px;
          font-size: var(--hax-ui-admin-font-size-xs);
          line-height: 1.35;
          color: var(--hax-ui-text-muted);
        }
        .dot {
          width: 8px;
          height: 8px;
          flex: none;
          border-radius: 50%;
          background-color: var(--hax-ui-accent-strong);
        }
        select {
          width: 100%;
          height: var(--ddd-textfield-height-sm, 40px);
          padding: 0 var(--hax-ui-gap-lg);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius);
          font-family: var(--ddd-font-primary, sans-serif);
          font-size: var(--hax-ui-admin-font-size);
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-surface);
        }
        select:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 1px;
        }
        .toolbar-preview {
          display: block;
          width: 100%;
          max-width: 320px;
          margin-top: var(--hax-ui-gap-lg);
          border: 1px solid var(--hax-ui-line);
          border-radius: var(--hax-ui-radius);
          background-color: var(--hax-ui-hover);
        }
        .status {
          margin: var(--hax-ui-gap-md) var(--hax-ui-gap-md) 0;
          padding: var(--hax-ui-gap-md) var(--hax-ui-gap-lg);
          border-radius: var(--hax-ui-radius);
          color: var(--hax-ui-text-muted);
          background-color: var(--hax-ui-hover);
        }
        .standalone-actions {
          display: flex;
          justify-content: flex-end;
          padding-top: var(--ddd-spacing-4, 16px);
        }
        .standalone-actions button {
          height: var(--hax-ui-row-height);
          padding: 0 var(--hax-ui-gap-lg);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius);
          font: inherit;
          font-weight: var(--ddd-font-weight-bold, 700);
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-surface);
          cursor: pointer;
        }
        .standalone-actions button:hover {
          background-color: var(--hax-ui-hover);
        }
        .standalone-actions button:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 2px;
        }
        @media (max-width: 768px) {
          :host {
            padding: var(--hax-ui-gap) var(--ddd-spacing-4, 16px)
              var(--ddd-spacing-6, 24px);
          }
          .fr {
            grid-template-columns: minmax(0, 1fr);
            gap: var(--hax-ui-gap-md);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          summary simple-icon-lite {
            transition: none;
          }
        }
      `,
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.__disposer.push(
      autorun((_reaction) => {
        const _mobx_val_0 = toJS(HAXStore.platformConfig);
        Promise.resolve().then(() => {
          const platformConfig = _mobx_val_0;
          if (
            platformConfig &&
            platformConfig.audience &&
            (platformConfig.audience === "novice" ||
              platformConfig.audience === "expert")
          ) {
            this.audience = platformConfig.audience;
          } else {
            this.audience = "expert";
          }
          this.__baseline = this.audience;
          this._emitState();
        });
      }),
    );
  }

  disconnectedCallback() {
    while (this.__disposer.length) {
      const d = this.__disposer.pop();
      if (d && typeof d.dispose === "function") {
        d.dispose();
      }
    }
    super.disconnectedCallback();
  }

  /** labels of the fields whose value differs from what was loaded */
  get changedFields() {
    return this.audience !== this.__baseline ? [this.t.experienceLevel] : [];
  }

  /** mirrors the save handler: only "novice" or "expert" is accepted */
  get canSave() {
    return AUDIENCES.indexOf(this.audience) !== -1;
  }

  _emitState() {
    const changed = this.changedFields;
    this.dispatchEvent(
      new CustomEvent("haxcms-admin-section-state", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: {
          dirty: changed.length > 0,
          changes: changed,
          canSave: this.canSave,
        },
      }),
    );
  }

  /** section contract: restore the value that was loaded */
  discard() {
    this.audience = this.__baseline;
    this._emitState();
  }

  render() {
    const toolbarImgPath = new URL(
      `./assets/${this.audience.toLowerCase()}.png`,
      import.meta.url,
    ).href;
    const changed = this.audience !== this.__baseline;
    return html`
      ${!this.inShell ? html`<h2>${this.t.title}</h2>` : nothing}
      <details open data-group="audience">
        <summary>
          <simple-icon-lite
            icon="icons:chevron-right"
            aria-hidden="true"
          ></simple-icon-lite>
          <h3>${this.t.experienceLevel}</h3>
        </summary>
        <div class="fr">
          <div>
            <label class="lab" for="audience" id="audience-label"
              >${changed
                ? html`<span
                    class="dot"
                    role="img"
                    aria-label="${this.t.changed}"
                  ></span>`
                : nothing}${this.t.experienceLevel}</label
            ><span class="help" id="audience-help"
              >${this.t.experienceLevelDescription}</span
            >
          </div>
          <div>
            <select
              id="audience"
              name="audience"
              aria-describedby="audience-help"
              @change="${this._audienceChanged}"
            >
              ${AUDIENCES.map(
                (value) =>
                  html`<option
                    value="${value}"
                    ?selected="${this.audience === value}"
                  >
                    ${this.t[value]}
                  </option>`,
              )}
            </select>
            <img
              class="toolbar-preview"
              src="${toolbarImgPath}"
              alt="${this.t.toolbarPreviewAlt.replace(
                "{audience}",
                () => this.audience,
              )}"
            />
          </div>
        </div>
      </details>
      <details data-group="buttons">
        <summary>
          <simple-icon-lite
            icon="icons:chevron-right"
            aria-hidden="true"
          ></simple-icon-lite>
          <h3>${this.t.buttons}</h3>
        </summary>
        <p class="status">${this.t.futureButtonConfiguration}</p>
      </details>
      ${!this.inShell
        ? html`<div class="standalone-actions">
            <button type="button" class="save" @click="${this.save}">
              ${this.busy ? this.t.saving : this.t.save}
            </button>
          </div>`
        : nothing}
    `;
  }

  _audienceChanged(e) {
    let value = "expert";
    if (e && e.target && typeof e.target.value === "string" && !e.detail) {
      value = e.target.value;
    } else if (e && e.detail && e.detail.value && e.detail.value.audience) {
      value = e.detail.value.audience;
    }
    this.audience = AUDIENCES.indexOf(value) !== -1 ? value : "expert";
    this._emitState();
  }

  /**
   * section contract: send the save. Fires the same
   * haxcms-save-editor-settings event and payload as before; the shell
   * waits for haxcms-admin-save-result.
   * @returns {boolean} true when a save was sent
   */
  save() {
    if (!this.canSave) {
      return false;
    }
    let sent = false;
    try {
      this.busy = true;
      this.dispatchEvent(
        new CustomEvent("haxcms-save-editor-settings", {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: {
            audience: this.audience,
          },
        }),
      );
      sent = true;
      if (!this.inShell) {
        this.dispatchEvent(
          new CustomEvent("simple-modal-hide", {
            bubbles: true,
            composed: true,
            cancelable: false,
            detail: false,
          }),
        );
      }
    } catch (error) {
      console.error("Saving editor settings failed:", error);
      HAXStore.toast(
        this.t.savingEditorSettingsFailed.replace(
          "{error}",
          () => error.message,
        ),
        5000,
        {},
        "fit-bottom",
      );
    }
    this.busy = false;
    return sent;
  }

  /** kept for callers of the old Save tap */
  _saveEditorSettings() {
    return this.save();
  }
}

globalThis.customElements.define(
  HAXCMSEditorSettingsDialogUI.tag,
  HAXCMSEditorSettingsDialogUI,
);
export { HAXCMSEditorSettingsDialogUI };
