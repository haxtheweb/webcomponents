import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import "@haxtheweb/simple-fields/lib/simple-fields-field.js";

const SCALE_PRESETS = {
  xs: { width: 200, height: 150, label: "ddd-xs  200\u00d7150" },
  sm: { width: 320, height: 240, label: "ddd-sm  320\u00d7240" },
  md: { width: 400, height: 300, label: "ddd-md  400\u00d7300" },
  lg: { width: 800, height: 600, label: "ddd-lg  800\u00d7600" },
  xl: { width: 1200, height: 900, label: "ddd-xl  1200\u00d7900" },
};

const COMPRESS_PRESETS = {
  light: { quality: 90, label: "Light (90)" },
  medium: { quality: 70, label: "Medium (70)" },
  heavy: { quality: 50, label: "Heavy (50)" },
  maximum: { quality: 30, label: "Maximum (30)" },
};

/**
 * `hax-file-actions`
 * A bulk-action bar operating on a set of currently-selected files rather
 * than a single row. Consolidates all operations (transform, compress,
 * scale, rotate, duplicate, rename, insert into page, delete) into one
 * hierarchical `<select>` (group headers are non-selectable, leaves are
 * the actual actions), so the control takes minimal horizontal space and
 * can be reused wherever a "operate on a selection of files" bar is
 * needed (e.g. issue #3028).
 */
class HAXFileActions extends DDD {
  static get tag() {
    return "hax-file-actions";
  }

  static get properties() {
    return {
      selectedCount: { type: Number, attribute: "selected-count" },
      imageCount: { type: Number, attribute: "image-count" },
      canScale: { type: Boolean, attribute: "can-scale", reflect: true },
      busy: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();
    this.selectedCount = 0;
    this.imageCount = 0;
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
          gap: var(--ddd-spacing-2);
          align-items: center;
          flex-wrap: wrap;
        }
        .count {
          font-size: var(--ddd-font-size-5xs);
          color: var(--ddd-theme-default-slateGray);
          white-space: nowrap;
        }
        .acts simple-fields-field {
          --simple-fields-font-size: var(--ddd-font-size-5xs);
          --simple-fields-select-max-width: 220px;
          margin: 0;
        }
      `,
    ];
  }

  /**
   * Builds the full hierarchical option list for the single bulk-action
   * select. Options with a shared `group` render as an `<optgroup>` in
   * `simple-fields-field`'s select template; options without a `group`
   * render as flat top-level `<option>`s. Values are encoded as
   * `"action:value"` so `_onAction` can split on the first `:` to
   * recover the action name and its parameter.
   *
   * @readonly
   */
  get actionItems() {
    const items = [{ value: "", text: "Choose an action\u2026" }];
    if (this.canScale) {
      items.push(
        {
          group: "Transform",
          value: "transform:convert-jpg",
          text: "Convert to JPG",
        },
        { group: "Transform", value: "transform:sepia", text: "Sepia" },
        {
          group: "Transform",
          value: "transform:black-and-white",
          text: "Black and white",
        },
      );
      Object.keys(COMPRESS_PRESETS).forEach((key) => {
        items.push({
          group: "Compress",
          value: `compress:${key}`,
          text: COMPRESS_PRESETS[key].label,
        });
      });
      Object.keys(SCALE_PRESETS).forEach((key) => {
        items.push({
          group: "Scale",
          value: `scale:${key}`,
          text: SCALE_PRESETS[key].label,
        });
      });
      items.push({ value: "rotate:rotate-90", text: "Rotate 90\u00b0" });
    }
    items.push({ value: "duplicate:duplicate", text: "Duplicate" });
    items.push({ value: "rename:rename", text: "Rename" });
    if (this.selectedCount >= 2 && this.imageCount === this.selectedCount) {
      items.push(
        {
          group: "Insert into page",
          value: "insert:gallery",
          text: "Insert as gallery",
        },
        {
          group: "Insert into page",
          value: "insert:standalone",
          text: "Insert as standalone images",
        },
      );
    } else {
      items.push({ value: "insert:page", text: "Insert into page" });
    }
    items.push({ value: "delete:delete", text: "Delete" });
    return items;
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
        },
      }),
    );
  }

  _resetField(e) {
    const field = e && e.detail ? e.detail : null;
    if (field) field.value = "";
  }

  _onAction(e) {
    const raw =
      e && e.detail && typeof e.detail.value === "string"
        ? e.detail.value.trim()
        : "";
    if (!raw || this.busy || this.selectedCount < 1) {
      this._resetField(e);
      return;
    }
    const sep = raw.indexOf(":");
    const action = sep === -1 ? raw : raw.substring(0, sep);
    const value = sep === -1 ? "" : raw.substring(sep + 1);
    this._dispatchAction(action, value);
    this._resetField(e);
  }

  render() {
    return html`
      <div class="acts" role="group" aria-label="Bulk file actions">
        <span class="count"
          >${this.selectedCount} file${this.selectedCount === 1
            ? ""
            : "s"}
          selected</span
        >
        <simple-fields-field
          label="Action"
          type="select"
          .itemsList="${this.actionItems}"
          ?disabled="${this.busy || this.selectedCount < 1}"
          @value-changed="${this._onAction}"
        >
        </simple-fields-field>
      </div>
    `;
  }
}

globalThis.customElements.define(HAXFileActions.tag, HAXFileActions);
export { HAXFileActions };
