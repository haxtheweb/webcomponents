import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/simple-fields/lib/simple-fields-field.js";

const SCALE_PRESETS = {
  xs: { width: 200, height: 150, label: "ddd-xs  200\u00d7150" },
  sm: { width: 320, height: 240, label: "ddd-sm  320\u00d7240" },
  md: { width: 400, height: 300, label: "ddd-md  400\u00d7300" },
  lg: { width: 800, height: 600, label: "ddd-lg  800\u00d7600" },
  xl: { width: 1200, height: 900, label: "ddd-xl  1200\u00d7900" },
};

const TRANSFORM_ITEMS = [
  { value: "", text: "Choose\u2026" },
  { value: "convert-jpg", text: "Convert to JPG" },
  { value: "sepia", text: "Sepia" },
  { value: "black-and-white", text: "Black and white" },
];

class HAXFileActions extends DDD {
  static get tag() {
    return "hax-file-actions";
  }

  static get properties() {
    return {
      rowIndex: { type: Number, attribute: "row-index" },
      path: { type: String },
      scalePreset: { type: String, attribute: "scale-preset" },
      canScale: { type: Boolean, attribute: "can-scale", reflect: true },
      busy: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();
    this.rowIndex = -1;
    this.path = "";
    this.scalePreset = "md";
    this.canScale = false;
    this.busy = false;
  }

  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
        }
        .acts {
          display: flex;
          gap: var(--ddd-spacing-1);
          align-items: center;
          flex-wrap: wrap;
        }
        .acts simple-fields-field {
          --simple-fields-font-size: var(--ddd-font-size-5xs);
          --simple-fields-select-max-width: 100px;
          margin: 0;
        }
        .ib {
          --simple-icon-button-border-radius: var(--ddd-radius-xs);
          --simple-icon-button-border: var(--ddd-border-xs) solid
            var(--ddd-theme-default-limestoneGray);
          --simple-icon-button-focus-border: var(--ddd-border-xs) solid
            var(--ddd-theme-default-navy);
          --simple-icon-height: var(--ddd-icon-4xs);
          --simple-icon-width: var(--ddd-icon-4xs);
          padding: 0;
          margin: 0;
        }
      `,
    ];
  }

  get scaleItems() {
    const out = [{ value: "", text: "Choose\u2026" }];
    Object.keys(SCALE_PRESETS).forEach((key) => {
      out.push({ value: key, text: SCALE_PRESETS[key].label });
    });
    return out;
  }

  _dispatchAction(action, value) {
    this.dispatchEvent(
      new CustomEvent("hax-file-action", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          action,
          value,
          rowIndex: this.rowIndex,
          path: this.path,
        },
      }),
    );
  }

  _resetField(e) {
    const field = e && e.detail ? e.detail : null;
    if (field) field.value = "";
  }

  _onTransformAction(e) {
    const value =
      e && e.detail && typeof e.detail.value === "string"
        ? e.detail.value.trim()
        : "";
    if (!value || this.busy || !this.canScale) {
      this._resetField(e);
      return;
    }
    this._dispatchAction("transform", value);
    this._resetField(e);
  }

  _onScaleAction(e) {
    const value =
      e && e.detail && typeof e.detail.value === "string"
        ? e.detail.value.trim()
        : "";
    if (!value || this.busy || !this.canScale) {
      this._resetField(e);
      return;
    }
    this._dispatchAction("scale", value);
    this._resetField(e);
  }

  _onDelete() {
    if (this.busy) return;
    this._dispatchAction("delete", "delete");
  }
  _onRotate() {
    if (this.busy || !this.canScale) return;
    this._dispatchAction("rotate", "rotate-90");
  }
  _onRename() {
    if (this.busy) return;
    this._dispatchAction("rename", "rename");
  }

  render() {
    return html`
      <div class="acts" role="group" aria-label="File actions">
        <simple-fields-field
          label="Transform"
          type="select"
          .itemsList="${TRANSFORM_ITEMS}"
          ?disabled="${this.busy || !this.canScale}"
          @value-changed="${this._onTransformAction}"
        >
        </simple-fields-field>
        <simple-fields-field
          label="Scale"
          type="select"
          .itemsList="${this.scaleItems}"
          ?disabled="${this.busy || !this.canScale}"
          @value-changed="${this._onScaleAction}"
        >
        </simple-fields-field>
        <simple-icon-button-lite
          class="ib"
          icon="image:rotate-right"
          label="Rotate 90 degrees"
          title="Rotate image 90 degrees clockwise"
          ?disabled="${this.busy || !this.canScale}"
          @click="${this._onRotate}"
        >
        </simple-icon-button-lite>
        <simple-icon-button-lite
          class="ib"
          icon="icons:create"
          label="Rename"
          title="Rename file"
          ?disabled="${this.busy}"
          @click="${this._onRename}"
        >
        </simple-icon-button-lite>
        <simple-icon-button-lite
          class="ib"
          icon="icons:delete"
          label="Delete"
          title="Delete file"
          ?disabled="${this.busy}"
          @click="${this._onDelete}"
        >
        </simple-icon-button-lite>
      </div>
    `;
  }
}

globalThis.customElements.define(HAXFileActions.tag, HAXFileActions);
export { HAXFileActions };
