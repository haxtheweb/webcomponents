import { LitElement, html, css } from "lit";
import { live } from "lit/directives/live.js";
import { SimpleFieldsContainerBehaviors } from "@haxtheweb/simple-fields/lib/simple-fields-container.js";
import { SimpleFieldsButtonStyles } from "@haxtheweb/simple-fields/lib/simple-fields-ui.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "./hax-upload-field.js";

/**
 * `simple-fields-srcset`
 * edits the standard `srcset` attribute as a repeatable list of
 * { url, descriptor } rows while exposing a single string value
 * (eg. `clock-small.jpg 480w, clock-medium.jpg 800w`).
 *
 * The value stays a string at both load and save time so the HAX tray
 * writes it back with `setAttribute("srcset", ...)` and never trips the
 * array/object property branch that would corrupt a native img.srcset.
 *
 * Each row's URL is a `hax-upload-field` limited to file-system search
 * (Merlin "Select media") and upload; camera / voice / screen recording
 * are disabled. The descriptor is a free-form text field (eg. 480w or 2x).
 *
 * @customElement
 * @group simple-fields
 * @element simple-fields-srcset
 * @class SimpleFieldsSrcset
 * @extends {SimpleFieldsContainerBehaviors(LitElement)}
 */
class SimpleFieldsSrcset extends SimpleFieldsContainerBehaviors(LitElement) {
  static get tag() {
    return "simple-fields-srcset";
  }
  static get styles() {
    return [
      super.styles,
      ...SimpleFieldsButtonStyles,
      css`
        :host {
          display: block;
        }
        .label-main {
          font-size: var(--ddd-font-size-6xs, 12px);
          font-weight: var(--ddd-font-weight-medium, 500);
          line-height: var(--ddd-lh-120);
          display: block;
          margin: 0 0 var(--ddd-spacing-1, 4px) 0;
        }
        #description {
          color: var(--simple-fields-meta-color, inherit);
          font-size: var(--ddd-font-size-6xs, 12px);
          margin: 0 0 var(--ddd-spacing-2, 8px) 0;
        }
        #rows {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-3, 12px);
          margin: 0 0 var(--ddd-spacing-2, 8px) 0;
        }
        .row {
          border: var(
            --ddd-border-xs,
            1px solid var(--ddd-theme-default-limestoneLight, #e4e5e7)
          );
          border-radius: var(--ddd-radius-xs, 4px);
          padding: var(--ddd-spacing-2, 8px);
          background-color: var(--simple-fields-background-color, transparent);
        }
        .row-url {
          display: block;
          margin: 0 0 var(--ddd-spacing-2, 8px) 0;
        }
        /* compact the embedded upload fieldset so rows stay scannable */
        .row-url hax-upload-field {
          display: block;
          margin: 0;
        }
        .row-meta {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: end;
          gap: var(--ddd-spacing-2, 8px);
        }
        .field-cell {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .field-cell label {
          font-size: var(--ddd-font-size-6xs, 12px);
          font-weight: var(--ddd-font-weight-medium, 500);
          margin: 0 0 var(--ddd-spacing-1, 4px) 0;
          color: light-dark(
            var(--ddd-theme-default-coalyGray, #262626),
            var(--ddd-theme-default-limestoneLight, #e4e5e7)
          );
        }
        .row-meta input {
          width: 100%;
          box-sizing: border-box;
          padding: var(--ddd-spacing-1, 4px) var(--ddd-spacing-2, 8px);
          border: var(
            --ddd-border-xs,
            1px solid var(--ddd-theme-default-limestoneLight, #e4e5e7)
          );
          border-radius: var(--ddd-radius-xs, 4px);
          background-color: var(--simple-fields-background-color, transparent);
          color: light-dark(
            var(--ddd-theme-default-coalyGray, #262626),
            var(--ddd-theme-default-limestoneLight, #e4e5e7)
          );
          font-size: var(--ddd-font-size-5xs, 14px);
          font-family: var(--ddd-font-primary, sans-serif);
        }
        .row-meta input:focus {
          outline: var(
            --ddd-focus-ring,
            2px solid var(--ddd-theme-default-link)
          );
          outline-offset: var(--ddd-focus-offset, 2px);
          border-color: var(--ddd-theme-default-link, #1e407c);
        }
        .row-meta input::placeholder {
          color: var(--ddd-theme-default-limestoneGray, #a2aaad);
          opacity: var(--ddd-opacity-60, 0.6);
        }
        .row-meta input:disabled {
          opacity: var(--ddd-opacity-60, 0.6);
          cursor: not-allowed;
        }
        .row-controls {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-1, 4px);
        }
        simple-icon-button-lite {
          --simple-icon-height: var(--ddd-icon-4xs, 16px);
          --simple-icon-width: var(--ddd-icon-4xs, 16px);
          color: light-dark(
            var(--ddd-theme-default-coalyGray, #262626),
            var(--ddd-theme-default-limestoneLight, #e4e5e7)
          );
        }
        simple-icon-button-lite:hover:not([disabled]) {
          color: var(--ddd-theme-default-link, #1e407c);
        }
        #add-row {
          margin-top: var(--ddd-spacing-1, 4px);
        }
        .add-btn {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-1, 4px);
          cursor: pointer;
        }
        .add-btn simple-icon-lite {
          --simple-icon-height: var(--ddd-icon-4xs, 16px);
          --simple-icon-width: var(--ddd-icon-4xs, 16px);
        }
        #error-message {
          color: var(--simple-fields-error-color, #b40000);
          font-size: var(--ddd-font-size-6xs, 12px);
          margin: var(--ddd-spacing-1, 4px) 0 0 0;
        }
        .empty-state {
          font-size: var(--ddd-font-size-6xs, 12px);
          color: var(--ddd-theme-default-limestoneGray, #a2aaad);
          margin: 0 0 var(--ddd-spacing-2, 8px) 0;
        }
        @media (max-width: 480px) {
          .row-meta {
            grid-template-columns: 1fr;
            gap: var(--ddd-spacing-1, 4px);
          }
          .row-controls {
            justify-content: flex-end;
          }
        }
      `,
    ];
  }
  static get properties() {
    return {
      ...super.properties,
      /**
       * the srcset attribute as a single string
       */
      value: {
        type: String,
      },
      /**
       * internal rows parsed from value
       */
      __rows: {
        type: Array,
        attribute: false,
      },
    };
  }
  constructor() {
    super();
    this.__rows = [];
  }
  /**
   * container base tries to read a slotted field; we render our own
   * fields in shadow DOM so there is nothing to read.
   */
  _updateField() {}
  /**
   * focus the first row's upload field (used when the tray focuses us).
   * We do NOT steal focus on internal clicks -- see firstUpdated where the
   * inherited host click->focus listener is removed.
   */
  focus() {
    let first =
      this.shadowRoot && this.shadowRoot.querySelector("hax-upload-field");
    if (first && typeof first.focus === "function") {
      first.focus();
    }
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) super.firstUpdated(changedProperties);
    // SimpleFieldsContainerBehaviors binds a host-level click->focus listener
    // (constructor + _observeAndListen) that would refocus the first row on
    // every internal click. Drop it so clicking into a later row keeps focus.
    this.removeEventListener("click", this.focus);
    let rows = this._parseSrcset(this.value);
    if (!this._rowsEqual(rows, this.__rows)) {
      this.__rows = rows;
    }
  }
  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    if (changedProperties.has("value")) {
      // Only re-parse rows when the value came from outside (eg. the tray
      // loading the element's srcset attribute). When we set value ourselves
      // from Add/Remove/Move/Input we already updated __rows, so skip this
      // round-trip -- otherwise a just-added row with an empty URL serializes
      // to "" and parses back to [], wiping the row on the very first click.
      if (this.value !== this._serializeSrcset(this.__rows)) {
        let rows = this._parseSrcset(this.value);
        if (!this._rowsEqual(rows, this.__rows)) {
          this.__rows = rows;
        }
      }
    }
  }
  render() {
    return html`
      <div class="field-main" part="field-main" ?hidden="${this.hidden}">
        <label
          id="${this.id}-label"
          class="label-main"
          part="label"
          ?hidden="${!this.label}"
        >
          ${this.label}${this.error || this.required ? "*" : ""}
        </label>
        <div id="description" part="field-desc" ?hidden="${!this.description}">
          ${this.description}
        </div>
        <div
          id="rows"
          part="rows"
          role="group"
          aria-labelledby="${this.id}-label"
          aria-live="polite"
        >
          ${this.__rows.length === 0
            ? html`<div class="empty-state" part="empty-state">
                No responsive sources yet. Add one below.
              </div>`
            : this.__rows.map((row, i) => this._rowTemplate(row, i))}
        </div>
        <div id="add-row" part="add-row">
          <button
            type="button"
            class="add-btn"
            part="add-btn"
            ?disabled="${this.disabled}"
            @click="${this._addRow}"
            aria-label="Add responsive source"
          >
            <simple-icon-lite icon="add"></simple-icon-lite>
            Add source
          </button>
        </div>
        <div
          id="error-message"
          ?hidden="${!this.error}"
          role="alert"
          part="error-msg"
        >
          ${this.errorMessage}
        </div>
      </div>
    `;
  }
  _rowTemplate(row, i) {
    let last = this.__rows.length - 1;
    return html`
      <div class="row" part="row">
        <div class="row-url" part="row-url">
          <hax-upload-field
            value="${live(row.url || "")}"
            ?disabled="${this.disabled}"
            ?readonly="${this.readonly}"
            no-camera
            no-voice-record
            no-screen-record
            show-sources
            autocomplete="off"
            @value-changed="${(e) => this._rowUrlChanged(i, e)}"
          ></hax-upload-field>
        </div>
        <div class="row-meta" part="row-meta">
          <div class="field-cell">
            <label for="${this.id}-desc-${i}">Descriptor</label>
            <input
              id="${this.id}-desc-${i}"
              class="row-desc"
              type="text"
              .value="${live(row.descriptor || "")}"
              ?disabled="${this.disabled}"
              ?readonly="${this.readonly}"
              placeholder="480w"
              @input="${(e) => this._rowInput(i, "descriptor", e)}"
            />
          </div>
          <div class="row-controls" part="row-controls">
            <simple-icon-button-lite
              icon="arrow-upward"
              label="Move up"
              ?disabled="${this.disabled || i === 0}"
              @click="${() => this._moveRow(i, -1)}"
            ></simple-icon-button-lite>
            <simple-icon-button-lite
              icon="arrow-downward"
              label="Move down"
              ?disabled="${this.disabled || i === last}"
              @click="${() => this._moveRow(i, 1)}"
            ></simple-icon-button-lite>
            <simple-icon-button-lite
              icon="delete"
              label="Remove source"
              ?disabled="${this.disabled}"
              @click="${() => this._removeRow(i)}"
            ></simple-icon-button-lite>
          </div>
        </div>
      </div>
    `;
  }
  /**
   * parse a srcset string into [{ url, descriptor }] rows
   */
  _parseSrcset(value) {
    if (!value || typeof value !== "string") {
      return [];
    }
    return value
      .split(",")
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0)
      .map((entry) => {
        let parts = entry.split(/\s+/);
        let url = parts[0] || "";
        let descriptor = parts.slice(1).join(" ").trim();
        return { url: url, descriptor: descriptor };
      })
      .filter((row) => row.url.length > 0);
  }
  /**
   * serialize rows back to a srcset string
   */
  _serializeSrcset(rows) {
    return (rows || [])
      .map((row) => {
        let url = (row.url || "").trim();
        let descriptor = (row.descriptor || "").trim();
        if (url.length === 0) {
          return "";
        }
        return descriptor.length > 0 ? `${url} ${descriptor}` : url;
      })
      .filter((entry) => entry.length > 0)
      .join(", ");
  }
  _rowsEqual(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
      return false;
    }
    return a.every(
      (row, i) => row.url === b[i].url && row.descriptor === b[i].descriptor,
    );
  }
  _addRow() {
    if (this.disabled) {
      return;
    }
    this.__rows = [...this.__rows, { url: "", descriptor: "" }];
    this.value = this._serializeSrcset(this.__rows);
    this.updateComplete.then(() => {
      let fields = this.shadowRoot.querySelectorAll("hax-upload-field");
      let last = fields[fields.length - 1];
      if (last && typeof last.focus === "function") last.focus();
    });
  }
  _removeRow(i) {
    if (this.disabled) {
      return;
    }
    this.__rows = this.__rows.filter((_, idx) => idx !== i);
    this.value = this._serializeSrcset(this.__rows);
    this._fireValueChanged();
  }
  _moveRow(i, dir) {
    if (this.disabled) {
      return;
    }
    let j = i + dir;
    if (j < 0 || j >= this.__rows.length) {
      return;
    }
    let rows = [...this.__rows];
    let tmp = rows[i];
    rows[i] = rows[j];
    rows[j] = tmp;
    this.__rows = rows;
    this.value = this._serializeSrcset(this.__rows);
    this._fireValueChanged();
  }
  /**
   * handle URL changes from the embedded hax-upload-field.
   * hax-upload-field dispatches value-changed with detail.value (string).
   * Ignore echoes of the value we just pushed in to avoid render loops.
   */
  _rowUrlChanged(i, e) {
    let v =
      e && e.detail && typeof e.detail.value === "string" ? e.detail.value : "";
    if (this.__rows[i] && this.__rows[i].url === v) {
      return;
    }
    this.__rows = this.__rows.map((row, idx) => {
      if (idx !== i) {
        return row;
      }
      return { url: v, descriptor: row.descriptor };
    });
    this.value = this._serializeSrcset(this.__rows);
    this._fireValueChanged();
  }
  _rowInput(i, field, e) {
    let v = e.target.value;
    this.__rows = this.__rows.map((row, idx) => {
      if (idx !== i) {
        return row;
      }
      let next = { url: row.url, descriptor: row.descriptor };
      if (field === "descriptor") {
        next.descriptor = v;
      }
      return next;
    });
    this.value = this._serializeSrcset(this.__rows);
    this._fireValueChanged();
  }
  /**
   * fires when value changes
   * @event value-changed
   */
  _fireValueChanged() {
    this.dispatchEvent(
      new CustomEvent("value-changed", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this,
      }),
    );
  }
}
globalThis.customElements.define(SimpleFieldsSrcset.tag, SimpleFieldsSrcset);
export { SimpleFieldsSrcset };
