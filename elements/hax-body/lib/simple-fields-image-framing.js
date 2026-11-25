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
import {
  FRAMING_SIZES,
  parseFraming,
  autoFrame,
} from "@haxtheweb/d-d-d/lib/ImageFraming.js";

/**
 * `simple-fields-image-framing`
 * The "image-framing" input method (haxtheweb/issues#2976): how one photo
 * is framed at each screen size. Shows a thumbnail per size (an asterisk
 * marks one framed by hand) and Frame photo, which opens the framing
 * dialog. The value is the framing attribute: JSON of the custom sizes
 * only, "" when every size is automatic.
 *
 * Schema keys: sourceProperty (the photo's setting), focalXProperty and
 * focalYProperty (0-100). The frames come from the element being edited
 * (its framingFrames()) when it has one, else the DDD screen sizes.
 *
 * @element simple-fields-image-framing
 * @fires value-changed - `{ value }` after Done in the dialog
 */
export class SimpleFieldsImageFraming extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "simple-fields-image-framing";
  }

  constructor() {
    super();
    this.label = "";
    this.description = "";
    this.value = "";
    this.src = "";
    this.focalX = 50;
    this.focalY = 50;
    this.sourceProperty = "";
    this.focalXProperty = "";
    this.focalYProperty = "";
    this.disabled = false;
    this._aspect = 0;
    this.t = this.t || {};
    this.t = {
      ...this.t,
      framingTitle: "Framing",
      framingCustomMark: "* Custom",
      framePhoto: "Frame photo",
      framingCustom: "Custom",
      framingAutomatic: "Automatic",
    };
    this.registerLocalization({
      context: this,
      namespace: "hax",
      localesPath:
        new URL("../locales/hax.en.json", import.meta.url).href + "/../",
    });
  }

  static get properties() {
    return {
      ...super.properties,
      label: { type: String },
      description: { type: String },
      value: { type: String },
      src: { type: String },
      focalX: { type: Number },
      focalY: { type: Number },
      sourceProperty: { type: String, attribute: "source-property" },
      focalXProperty: { type: String, attribute: "focal-x-property" },
      focalYProperty: { type: String, attribute: "focal-y-property" },
      disabled: { type: Boolean, reflect: true },
      _aspect: { state: true },
    };
  }

  static get styles() {
    return [
      super.styles,
      HaxUiAdminTokens,
      HaxUiAdminPrimitives,
      HaxUiAdminScheme,
      HaxUiAdminControls,
      css`
        :host {
          display: grid;
          gap: var(--hax-ui-gap);
          font-family: var(--hax-ui-admin-font-family);
          font-size: var(--hax-ui-admin-font-size);
          color: var(--hax-ui-text);
        }
        .label {
          font-weight: var(--ddd-font-weight-bold, 700);
        }
        .desc {
          margin: 0;
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
        }
        .thumbs {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--hax-ui-gap);
        }
        .thumb {
          display: grid;
          justify-items: center;
          font-size: var(--hax-ui-admin-font-size-xs);
          line-height: 1.2;
          color: var(--hax-ui-text-muted);
        }
        .crop {
          position: relative;
          overflow: hidden;
          width: 100%;
          height: var(--ddd-spacing-8, 32px);
          border: 1px solid var(--hax-ui-line);
          border-radius: var(--hax-ui-radius);
          background-color: var(--hax-ui-sunken);
        }
        .crop img {
          position: absolute;
          max-width: none;
          object-fit: cover;
        }
        .hax-ui-btn {
          width: 100%;
          justify-content: center;
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

  /**
   * The object in the form's value that holds setting `key`. The HAX tray
   * nests settings (settings.configure / settings.advanced), a plain form
   * doesn't: look for the object that has the key.
   */
  _settings(values, key) {
    const find = (obj, depth) => {
      if (!obj || typeof obj !== "object" || Array.isArray(obj)) return null;
      if (key && Object.prototype.hasOwnProperty.call(obj, key)) return obj;
      if (depth >= 3) return null;
      for (const k of Object.keys(obj)) {
        const found = find(obj[k], depth + 1);
        if (found) return found;
      }
      return null;
    };
    return find(values, 0);
  }

  /** follow the photo and focal point settings beside this one */
  _readForm() {
    const all = this._form && this._form.value ? this._form.value : null;
    if (!all) return;
    const read = (key) => {
      const obj = key ? this._settings(all, key) : null;
      return obj ? obj[key] : undefined;
    };
    const src = read(this.sourceProperty);
    if (src !== undefined) this.src = src || "";
    const fx = read(this.focalXProperty);
    if (fx !== undefined && fx !== "") this.focalX = Number(fx);
    const fy = read(this.focalYProperty);
    if (fy !== undefined && fy !== "") this.focalY = Number(fy);
  }

  updated(changed) {
    if (super.updated) super.updated(changed);
    if (changed.has("src")) this._measure();
  }

  _measure() {
    if (!this.src) {
      this._aspect = 0;
      return;
    }
    const img = new Image();
    img.onload = () => {
      this._aspect =
        img.naturalWidth && img.naturalHeight
          ? img.naturalWidth / img.naturalHeight
          : 0;
    };
    img.src = this.src;
  }

  /** the element whose settings these are, when HAX is editing one */
  _element() {
    const store =
      globalThis.HaxStore && globalThis.HaxStore.requestAvailability
        ? globalThis.HaxStore.requestAvailability()
        : null;
    return store && store.activeNode ? store.activeNode : null;
  }

  _frames() {
    const el = this._element();
    if (el && typeof el.framingFrames === "function") {
      return el.framingFrames();
    }
    return FRAMING_SIZES.map((s) => ({ ...s, width: 1280, height: 540 }));
  }

  _thumb(frame, custom) {
    const rect =
      custom[frame.id] ||
      (this._aspect
        ? autoFrame(
            frame.width / frame.height,
            this._aspect,
            (Number(this.focalX) || 0) / 100,
            (Number(this.focalY) || 0) / 100,
          )
        : null);
    const label = custom[frame.id] ? `${frame.label} *` : frame.label;
    return html`<div class="thumb">
      <div
        class="crop"
        role="img"
        aria-label="${frame.label}: ${
          custom[frame.id] ? this.t.framingCustom : this.t.framingAutomatic
        }"
      >
        ${
          this.src && rect
            ? html`<img
                alt=""
                src="${this.src}"
                style="width: calc(100% / ${rect.w}); height: calc(100% / ${rect.h}); left: calc(-100% * ${rect.x} / ${rect.w}); top: calc(-100% * ${rect.y} / ${rect.h});"
              />`
            : nothing
        }
      </div>
      <span aria-hidden="true">${label}</span>
    </div>`;
  }

  render() {
    const custom = parseFraming(this.value);
    return html`<span class="label" id="label"
        >${this.label || this.t.framingTitle}</span
      >
      <p class="desc">
        ${this.description ? `${this.description}. ` : nothing}${
          this.t.framingCustomMark
        }
      </p>
      <div class="thumbs" role="group" aria-labelledby="label">
        ${this._frames().map((frame) => this._thumb(frame, custom))}
      </div>
      <button
        type="button"
        class="hax-ui-btn"
        ?disabled="${this.disabled || !this.src}"
        @click="${this.open}"
      >
        ${this.t.framePhoto}
      </button>`;
  }

  /** open the framing dialog; Done updates this value and the focal point */
  async open() {
    if (this.disabled) return;
    this._readForm();
    const { ImageFramingDialog } = await import("./image-framing-dialog.js");
    const el = this._element();
    if (!this.src && el && this.sourceProperty && el[this.sourceProperty]) {
      this.src = el[this.sourceProperty];
    }
    const result = await ImageFramingDialog.open({
      element: el,
      source: this.src,
      framing: this.value,
      focalX: this.focalX,
      focalY: this.focalY,
      frames: this._frames(),
      title: this._title(el),
      size:
        globalThis.matchMedia &&
        globalThis.matchMedia("(max-width: 599px)").matches
          ? "sm"
          : "lg",
    });
    if (!result) return;
    this.value = result.framing;
    this.dispatchEvent(
      // does not bubble: simple-fields listens on the field itself
      new CustomEvent("value-changed", {
        detail: { value: this.value },
      }),
    );
    // after the framing has gone into the form, so it isn't written over
    await this.updateComplete;
    this._applyFocal(result);
  }

  /** the focal point is its own setting; set it through the form */
  _applyFocal(result) {
    this.focalX = result.focalX;
    this.focalY = result.focalY;
    if (!this._form || !this.focalXProperty || !this.focalYProperty) return;
    // a copy of the whole value, with the settings object swapped for a copy
    const copy = (obj, depth) => {
      if (!obj || typeof obj !== "object" || Array.isArray(obj)) return obj;
      const out = { ...obj };
      if (depth < 3) {
        Object.keys(out).forEach((k) => {
          out[k] = copy(out[k], depth + 1);
        });
      }
      return out;
    };
    const values = copy(this._form.value || {}, 0);
    const xs = this._settings(values, this.focalXProperty) || values;
    const ys = this._settings(values, this.focalYProperty) || values;
    if (
      xs[this.focalXProperty] === result.focalX &&
      ys[this.focalYProperty] === result.focalY
    ) {
      return;
    }
    xs[this.focalXProperty] = result.focalX;
    ys[this.focalYProperty] = result.focalY;
    this._form.value = values;
  }

  _title(el) {
    const store =
      globalThis.HaxStore && globalThis.HaxStore.requestAvailability
        ? globalThis.HaxStore.requestAvailability()
        : null;
    if (store && el && store.activeGizmo && store.activeGizmo.title) {
      return store.activeGizmo.title;
    }
    return "";
  }
}

globalThis.customElements.define(
  SimpleFieldsImageFraming.tag,
  SimpleFieldsImageFraming,
);
