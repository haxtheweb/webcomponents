import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import "@haxtheweb/simple-fields/lib/simple-fields-field.js";

const SCALE_PRESETS = {
  xs: { width: 200, height: 150, label: "200\u00d7150" },
  sm: { width: 320, height: 240, label: "320\u00d7240" },
  md: { width: 400, height: 300, label: "400\u00d7300" },
  lg: { width: 800, height: 600, label: "800\u00d7600" },
  xl: { width: 1200, height: 900, label: "1200\u00d7900" },
};

const COMPRESS_PRESETS = {
  light: { quality: 90, label: "Light (90)" },
  medium: { quality: 70, label: "Medium (70)" },
  heavy: { quality: 50, label: "Heavy (50)" },
  maximum: { quality: 30, label: "Maximum (30)" },
};

/**
 * `hax-file-actions`
 * A file-action bar that consolidates all operations (transform, compress,
 * scale, rotate, duplicate, rename, insert into page, delete) into one
 * hierarchical `<select>` (group headers are non-selectable, leaves are
 * the actual actions), so the control takes minimal horizontal space and
 * can be reused wherever a "operate on a file selection" bar is needed.
 *
 * Two presentation modes (issue #3028):
 * - `mode="bulk"` (default): full action set including Operations
 *   (insert/duplicate/rename/delete), used by the haxcms file-admin dialog
 *   to act on a set of selected files.
 * - `mode="field"`: transformations only (Transform/Compress/Scale), used
 *   inline under a single haxupload schema field so destructive / insert
 *   operations are never offered in a single-field context.
 *
 * SCALE_PRESETS / COMPRESS_PRESETS are exported so callers (e.g.
 * hax-upload-field's post-upload recommendation logic) share this single
 * source of truth instead of duplicating the preset table.
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
      /**
       * Presentation mode.
       * - "bulk" (default): full action set including Operations
       *   (insert/duplicate/rename/delete) for the file-admin dialog.
       * - "field": transformations only (Transform/Compress/Scale),
       *   used inline under a single haxupload schema field so the
       *   destructive / insert operations are never offered in a
       *   single-field context. See issue #3028.
       */
      mode: { type: String, reflect: true },
    };
  }

  constructor() {
    super();
    this.selectedCount = 0;
    this.imageCount = 0;
    this.canScale = false;
    this.busy = false;
    this.mode = "bulk";
  }

  /**
   * In "field" mode the Operations group (insert/duplicate/rename/delete)
   * is omitted entirely; only image transformations remain. "bulk" keeps
   * the full set for the file-admin dialog.
   */
  get _isFieldMode() {
    return String(this.mode || "").toLowerCase() === "field";
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
          gap: var(--ddd-spacing-4);
          align-items: center;
          flex-wrap: wrap;
        }
        .count {
          font-size: var(--ddd-font-size-xs);
          white-space: nowrap;
        }
        .acts simple-fields-field {
          --simple-fields-font-size: var(--ddd-font-size-xs);
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
    // In field mode we only surface image transformations; the Operations
    // group (insert/duplicate/rename/delete) is intentionally omitted so a
    // single haxupload field never offers destructive or insert actions.
    if (!this._isFieldMode) {
      if (this.selectedCount >= 2 && this.imageCount === this.selectedCount) {
        items.push(
          {
            group: "Operations",
            value: "insert:gallery",
            text: "Insert Gallery",
          },
          {
            group: "Operations",
            value: "insert:standalone",
            text: "Insert Image",
          },
        );
      } else {
        items.push({group: "Operations", value: "insert:standalone", text: "Insert Image" });
      }
      items.push(
        { group: "Operations", value: "duplicate:duplicate", text: "Duplicate" },
        { group: "Operations", value: "rename:rename", text: "Rename" },
        { group: "Operations", value: "delete:delete", text: "Delete" },
      );
    }
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
        {
          group: "Transform",
          value: "rotate:rotate-90",
          text: "Rotate 90\u00b0",
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
    }
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
    // In field mode we operate on a single uploaded image; the
    // "N files selected" count is noise there, so only render it in bulk mode.
    return html`
      <div
        class="acts"
        role="group"
        aria-label="${this._isFieldMode
          ? "Image actions"
          : "Bulk file actions"}"
      >
        ${this._isFieldMode
          ? ""
          : html`<span class="count"
              >${this.selectedCount} file${this.selectedCount === 1
                ? ""
                : "s"}
              selected</span
            >`}
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
export { HAXFileActions, SCALE_PRESETS, COMPRESS_PRESETS };
