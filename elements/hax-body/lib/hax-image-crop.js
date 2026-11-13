/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { HaxUiAdminPrimitives } from "@haxtheweb/d-d-d/lib/HaxUiAdminTokens.js";
import { HaxUiAdminControls } from "@haxtheweb/d-d-d/lib/HaxUiAdminControls.js";

// Shapes offered for the crop box; null keeps it free, "original" follows
// the image's own ratio.
const ASPECTS = [
  { id: "free", ratio: null },
  { id: "original", ratio: "original" },
  { id: "1:1", ratio: 1 },
  { id: "4:3", ratio: 4 / 3 },
  { id: "16:9", ratio: 16 / 9 },
];
// Formats the browser encodes back out; anything else saves as PNG.
const OUTPUT_TYPES = ["image/jpeg", "image/png", "image/webp"];
// Largest canvas every current browser will draw (Safari caps the area).
const MAX_CANVAS_AREA = 16777216;
// Below this width the five aspect segments do not fit; use a select.
const NARROW_WIDTH = 300;
const MIN_SIZE = 8;

/**
 * The aspect choices, for hosts that offer them outside the editor (site
 * admin Files' crop-all). `ratio` is a number, "original" or null (free).
 */
export const CROP_ASPECTS = ASPECTS;

/** the type a crop is saved in: the source's own when a canvas can write it */
export function cropOutputType(mime) {
  const m = String(mime || "").toLowerCase();
  if (m === "image/jpg") return "image/jpeg";
  return OUTPUT_TYPES.indexOf(m) !== -1 ? m : "image/png";
}

/** whether a file of this type can be cropped and saved back in its format */
export function canCropMime(mime) {
  const m = String(mime || "").toLowerCase();
  return m === "image/jpg" || OUTPUT_TYPES.indexOf(m) !== -1;
}

/** <name>-cropped.<ext of the output type> */
export function croppedFileName(fileName, mime) {
  const ext = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
  const raw = String(fileName || "image")
    .split("/")
    .pop();
  const base = raw.replace(/\.[^.]+$/, "") || "image";
  return base + "-cropped." + ext[cropOutputType(mime)];
}

/** the largest box of `ratio` centered in a width x height image */
export function centeredCropRect(width, height, ratio) {
  if (!ratio || !width || !height) {
    return { x: 0, y: 0, width: width, height: height };
  }
  let w = width;
  let h = Math.round(width / ratio);
  if (h > height) {
    h = height;
    w = Math.round(height * ratio);
  }
  return {
    x: Math.round((width - w) / 2),
    y: Math.round((height - h) / 2),
    width: w,
    height: h,
  };
}

/** CORS only for images on another origin, so same-site files never need it */
function crossOriginFor(src) {
  try {
    const u = new URL(src, globalThis.location.href);
    return u.origin === globalThis.location.origin ? null : "anonymous";
  } catch {
    return null;
  }
}

/** load an image for cropping; rejects with Error("load-failed") */
export function loadCropImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const cors = crossOriginFor(src);
    if (cors) img.crossOrigin = cors;
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("load-failed"));
    img.src = src;
  });
}

/**
 * Draw `rect` of `img` and encode it as `type`. Rejects with
 * Error("too-large") past what browsers can draw, or Error("other-site")
 * when the canvas can't be read back.
 */
export function encodeCrop(img, rect, type, quality = 0.9) {
  if (!rect || !rect.width || !rect.height) {
    return Promise.reject(new Error("load-failed"));
  }
  if (rect.width * rect.height > MAX_CANVAS_AREA) {
    return Promise.reject(new Error("too-large"));
  }
  const canvas = globalThis.document.createElement("canvas");
  canvas.width = rect.width;
  canvas.height = rect.height;
  const g = canvas.getContext("2d");
  if (type === "image/jpeg") {
    // JPG has no transparency; flatten onto white like convert-jpg
    g.fillStyle = "#ffffff";
    g.fillRect(0, 0, rect.width, rect.height);
  }
  g.drawImage(
    img,
    rect.x,
    rect.y,
    rect.width,
    rect.height,
    0,
    0,
    rect.width,
    rect.height,
  );
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("too-large"))),
        type,
        quality,
      );
    } catch {
      // a canvas holding another site's image can't be read back
      reject(new Error("other-site"));
    }
  });
}

/**
 * `hax-image-crop`
 * Crop an image in the browser (haxtheweb/issues#1149). Shows the image with
 * a crop box (drag it, drag a handle, or use the arrow keys), an aspect
 * choice and X / Y / Width / Height in image pixels. It only edits; the host
 * puts its own buttons in the `actions` slot and calls `toBlob()` or
 * `download()`. Used by Image info in the HAX editor and by site admin Files.
 *
 * Styling: HAX UI admin layer. The host provides the `--hax-ui-*` tokens.
 *
 * @element hax-image-crop
 * @slot actions - the host's buttons, laid out at the end
 * @fires crop-changed - the crop box moved or the aspect changed; detail is
 *   {x, y, width, height} and `aspect` is current on the element
 */
class HaxImageCrop extends I18NMixin(LitElement) {
  static get tag() {
    return "hax-image-crop";
  }
  static get properties() {
    return {
      /** URL of the image to crop */
      src: { type: String },
      /** File name, used to name the cropped file */
      fileName: { type: String, attribute: "file-name" },
      /** MIME type of the image; the crop keeps it when the browser can */
      mimeType: { type: String, attribute: "mime-type" },
      /** Title over the editor, defaults to "Crop" */
      heading: { type: String },
      /** Text under the fields, such as where the crop will be saved */
      note: { type: String },
      /** Aspect id: free, original, 1:1, 4:3 or 16:9 */
      aspect: { type: String, reflect: true },
      /** The crop box in image pixels */
      cropRect: { type: Object, attribute: false },
      naturalWidth: { type: Number, attribute: false },
      naturalHeight: { type: Number, attribute: false },
      error: { type: String, attribute: false },
      __narrow: { type: Boolean, state: true },
      __loaded: { type: Boolean, state: true },
    };
  }
  constructor() {
    super();
    this.src = "";
    this.fileName = "";
    this.mimeType = "";
    this.heading = "";
    this.note = "";
    this.aspect = "free";
    this.cropRect = { x: 0, y: 0, width: 0, height: 0 };
    this.naturalWidth = 0;
    this.naturalHeight = 0;
    this.error = "";
    this.__narrow = false;
    this.__loaded = false;
    this.__drag = null;
    this.t = {
      crop: "Crop",
      cropArea:
        "Crop area. Arrow keys move it, Shift and arrow keys resize it, Alt moves one pixel.",
      aspect: "Aspect",
      free: "Free",
      original: "Original",
      x: "X",
      y: "Y",
      width: "Width",
      height: "Height",
      pixels: "px",
      inPixels: "{label} in pixels",
      cropSize: "{width} by {height} pixels at {x}, {y}",
      loadFailed: "This image could not be loaded.",
      tooLarge:
        "This crop is too large to make in the browser. Choose a smaller area.",
      otherSite: "This image is on another site, so the browser can't crop it.",
    };
    this.registerLocalization({
      context: this,
      namespace: "hax",
    });
  }
  static get styles() {
    return [
      ...HaxUiAdminPrimitives,
      ...HaxUiAdminControls,
      css`
        :host {
          display: block;
          font-family: var(--hax-ui-admin-font-family);
          font-size: var(--hax-ui-admin-font-size);
          color: var(--hax-ui-text);
        }
        :host([hidden]) {
          display: none;
        }
        .wrap {
          display: flex;
          flex-direction: column;
          gap: var(--hax-ui-gap-md);
        }
        .title {
          margin: 0;
          font-size: var(--hax-ui-admin-font-size);
          font-weight: var(--ddd-font-weight-bold);
        }
        .stage {
          padding: var(--hax-ui-gap-md);
          border: 1px solid var(--hax-ui-line);
          border-radius: var(--hax-ui-radius-lg);
          background-color: var(--hax-ui-hover);
          touch-action: none;
          user-select: none;
        }
        /* the box is exactly the drawn image, so the crop's percentages
           line up; hosts short on height cap it with
           --hax-image-crop-max-height */
        .box {
          position: relative;
          width: fit-content;
          max-width: 100%;
          margin: 0 auto;
        }
        .box img {
          display: block;
          max-width: 100%;
          max-height: var(--hax-image-crop-max-height, none);
          width: auto;
          height: auto;
          pointer-events: none;
        }
        .shade {
          position: absolute;
          pointer-events: none;
          background-color: color-mix(
            in srgb,
            var(--ddd-theme-default-black) 55%,
            transparent
          );
        }
        .area {
          position: absolute;
          cursor: move;
          outline: none;
          box-shadow:
            0 0 0 1px var(--ddd-theme-default-white),
            0 0 0 2px
              color-mix(
                in srgb,
                var(--ddd-theme-default-black) 40%,
                transparent
              );
        }
        .area:focus-visible {
          box-shadow: 0 0 0 var(--hax-ui-focus-width) var(--hax-ui-focus);
        }
        @media (forced-colors: active) {
          .area:focus-visible {
            outline: var(--hax-ui-focus-width) solid Highlight;
          }
        }
        .thirds {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image:
            linear-gradient(
              to right,
              transparent calc(33.333% - 1px),
              color-mix(
                  in srgb,
                  var(--ddd-theme-default-white) 50%,
                  transparent
                )
                0 33.333%,
              transparent 0 calc(66.666% - 1px),
              color-mix(
                  in srgb,
                  var(--ddd-theme-default-white) 50%,
                  transparent
                )
                0 66.666%,
              transparent 0
            ),
            linear-gradient(
              to bottom,
              transparent calc(33.333% - 1px),
              color-mix(
                  in srgb,
                  var(--ddd-theme-default-white) 50%,
                  transparent
                )
                0 33.333%,
              transparent 0 calc(66.666% - 1px),
              color-mix(
                  in srgb,
                  var(--ddd-theme-default-white) 50%,
                  transparent
                )
                0 66.666%,
              transparent 0
            );
        }
        .hdl {
          position: absolute;
          width: var(--hax-ui-target);
          height: var(--hax-ui-target);
          transform: translate(-50%, -50%);
          display: grid;
          place-items: center;
        }
        .hdl::after {
          content: "";
          width: var(--hax-ui-gap-md);
          height: var(--hax-ui-gap-md);
          background-color: var(--ddd-theme-default-white);
          border: 1px solid
            color-mix(in srgb, var(--ddd-theme-default-black) 50%, transparent);
          border-radius: 1px;
        }
        .hdl[data-h="nw"],
        .hdl[data-h="se"] {
          cursor: nwse-resize;
        }
        .hdl[data-h="ne"],
        .hdl[data-h="sw"] {
          cursor: nesw-resize;
        }
        .hdl[data-h="n"],
        .hdl[data-h="s"] {
          cursor: ns-resize;
        }
        .hdl[data-h="e"],
        .hdl[data-h="w"] {
          cursor: ew-resize;
        }
        .aspect select {
          flex: 1;
        }
        .nums {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(96px, 1fr));
          gap: var(--hax-ui-gap-md);
        }
        .num {
          display: flex;
          flex-direction: column;
          gap: var(--hax-ui-gap);
          min-width: 0;
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
        }
        .num .hax-ui-input-group {
          width: 100%;
        }
        .num .hax-ui-input-group input {
          width: 100%;
          min-width: 0;
        }
        .hax-ui-note {
          margin: 0;
        }
        .hax-ui-message {
          margin: 0;
        }
        .actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: var(--hax-ui-gap);
        }
      `,
    ];
  }
  connectedCallback() {
    super.connectedCallback();
    if (globalThis.ResizeObserver && !this.__resizer) {
      this.__resizer = new globalThis.ResizeObserver((entries) => {
        const w = entries[0] ? entries[0].contentRect.width : 0;
        if (w > 0) this.__narrow = w < NARROW_WIDTH;
      });
    }
    if (this.__resizer) this.__resizer.observe(this);
  }
  disconnectedCallback() {
    if (this.__resizer) this.__resizer.disconnect();
    super.disconnectedCallback();
  }
  updated(changed) {
    if (changed.has("src")) {
      this.__loaded = false;
      this.error = "";
    }
  }
  /** the ratio the aspect choice locks the box to, or null when free */
  get ratio() {
    const a = ASPECTS.find((item) => item.id === this.aspect);
    if (!a || a.ratio === null) return null;
    if (a.ratio === "original") {
      return this.naturalHeight ? this.naturalWidth / this.naturalHeight : null;
    }
    return a.ratio;
  }
  /** start over: the whole image, or the largest centered box of the ratio */
  reset() {
    this.cropRect = this._fit(
      { x: 0, y: 0, width: this.naturalWidth, height: this.naturalHeight },
      true,
    );
  }
  /** choose an aspect; the box keeps its center and fits the image */
  setAspect(id) {
    this.aspect = id;
    this._setRect(this._fit(this.cropRect, false));
  }
  /**
   * The largest box of the current ratio inside `rect`'s size, centered on
   * it, kept inside the image. With no ratio, `rect` clamped.
   */
  _fit(rect, grow) {
    const W = this.naturalWidth;
    const H = this.naturalHeight;
    const ratio = this.ratio;
    let { x, y, width, height } = rect;
    if (ratio) {
      const cx = x + width / 2;
      const cy = y + height / 2;
      if (grow) {
        width = W;
        height = W / ratio;
        if (height > H) {
          height = H;
          width = H * ratio;
        }
      } else {
        const area = Math.max(width * height, MIN_SIZE * MIN_SIZE);
        width = Math.sqrt(area * ratio);
        height = width / ratio;
        if (width > W) {
          width = W;
          height = W / ratio;
        }
        if (height > H) {
          height = H;
          width = H * ratio;
        }
      }
      x = cx - width / 2;
      y = cy - height / 2;
    }
    return this._clamp({ x, y, width, height });
  }
  _clamp(rect) {
    const W = this.naturalWidth;
    const H = this.naturalHeight;
    const min = Math.min(MIN_SIZE, W, H);
    const width = Math.round(Math.max(min, Math.min(rect.width, W)));
    const height = Math.round(Math.max(min, Math.min(rect.height, H)));
    return {
      x: Math.round(Math.max(0, Math.min(rect.x, W - width))),
      y: Math.round(Math.max(0, Math.min(rect.y, H - height))),
      width,
      height,
    };
  }
  _setRect(rect) {
    this.cropRect = this._clamp(rect);
    this.dispatchEvent(
      new CustomEvent("crop-changed", {
        bubbles: true,
        composed: true,
        detail: Object.assign({}, this.cropRect),
      }),
    );
  }
  _onImageLoad(e) {
    const img = e.target;
    this.naturalWidth = img.naturalWidth;
    this.naturalHeight = img.naturalHeight;
    this.__img = img;
    this.__loaded = true;
    this.reset();
  }
  _onImageError() {
    this.__loaded = false;
    this.error = this.t.loadFailed;
  }
  /** pointer position in image pixels */
  _imagePoint(e) {
    const box = this.shadowRoot.querySelector(".box").getBoundingClientRect();
    const k = box.width ? this.naturalWidth / box.width : 1;
    return { x: (e.clientX - box.left) * k, y: (e.clientY - box.top) * k };
  }
  _onPointerDown(e) {
    const handle = e.target.closest(".hdl");
    const inArea = e.target.closest(".area");
    if (!handle && !inArea) return;
    const p = this._imagePoint(e);
    this.__drag = {
      mode: handle ? handle.dataset.h : "move",
      x: p.x,
      y: p.y,
      start: Object.assign({}, this.cropRect),
    };
    e.currentTarget.setPointerCapture(e.pointerId);
    this.shadowRoot.querySelector(".area").focus({ preventScroll: true });
    e.preventDefault();
  }
  _onPointerMove(e) {
    const drag = this.__drag;
    if (!drag) return;
    const p = this._imagePoint(e);
    const dx = p.x - drag.x;
    const dy = p.y - drag.y;
    const o = drag.start;
    const m = drag.mode;
    if (m === "move") {
      this._setRect({
        x: o.x + dx,
        y: o.y + dy,
        width: o.width,
        height: o.height,
      });
      return;
    }
    const W = this.naturalWidth;
    const H = this.naturalHeight;
    let L = o.x;
    let T = o.y;
    let R = o.x + o.width;
    let B = o.y + o.height;
    if (m.indexOf("w") !== -1) L = Math.min(R - MIN_SIZE, Math.max(0, L + dx));
    if (m.indexOf("e") !== -1) R = Math.max(L + MIN_SIZE, Math.min(W, R + dx));
    if (m.indexOf("n") !== -1) T = Math.min(B - MIN_SIZE, Math.max(0, T + dy));
    if (m.indexOf("s") !== -1) B = Math.max(T + MIN_SIZE, Math.min(H, B + dy));
    let width = R - L;
    let height = B - T;
    const ratio = this.ratio;
    if (ratio) {
      if (m === "n" || m === "s") width = height * ratio;
      else if (m === "e" || m === "w") height = width / ratio;
      else if (width / height > ratio) height = width / ratio;
      else width = height * ratio;
      const maxW = m.indexOf("w") !== -1 ? R : W - L;
      const maxH = m.indexOf("n") !== -1 ? B : H - T;
      if (width > maxW) {
        width = maxW;
        height = width / ratio;
      }
      if (height > maxH) {
        height = maxH;
        width = height * ratio;
      }
      if (m.indexOf("w") !== -1) L = R - width;
      else if (m === "n" || m === "s") L = o.x + (o.width - width) / 2;
      if (m.indexOf("n") !== -1) T = B - height;
      else if (m === "e" || m === "w") T = o.y + (o.height - height) / 2;
    }
    this._setRect({ x: L, y: T, width, height });
  }
  _onPointerUp() {
    this.__drag = null;
  }
  _onAreaKeydown(e) {
    const dirs = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    };
    const d = dirs[e.key];
    if (!d) return;
    e.preventDefault();
    const step = e.altKey
      ? 1
      : Math.max(
          1,
          Math.round(Math.min(this.naturalWidth, this.naturalHeight) / 100),
        );
    const r = Object.assign({}, this.cropRect);
    const ratio = this.ratio;
    if (e.shiftKey) {
      r.width += d[0] * step;
      r.height += d[1] * step;
      if (ratio) {
        if (d[0]) r.height = r.width / ratio;
        else r.width = r.height * ratio;
      }
    } else {
      r.x += d[0] * step;
      r.y += d[1] * step;
    }
    this._setRect(r);
  }
  _onNumberChange(e) {
    const key = e.target.dataset.k;
    const v = parseInt(e.target.value, 10);
    if (Number.isNaN(v)) {
      this.requestUpdate();
      return;
    }
    const r = Object.assign({}, this.cropRect);
    r[key] = v;
    const ratio = this.ratio;
    if (ratio && key === "width") r.height = v / ratio;
    if (ratio && key === "height") r.width = v * ratio;
    this._setRect(r);
  }
  /** the output type: the source's own when the browser can encode it */
  get outputType() {
    return cropOutputType(this.mimeType);
  }
  /** name for the cropped file: <name>-cropped.<ext of the output type> */
  get croppedFileName() {
    return croppedFileName(this.fileName, this.mimeType);
  }
  /**
   * Draw the crop and encode it in the output type.
   * @param {number} [quality] JPG / WebP quality, 0 to 1 (default 0.9)
   * @returns {Promise<Blob>} rejects with an Error whose message is shown
   */
  async toBlob(quality = 0.9) {
    if (!this.__loaded || !this.__img) {
      throw new Error(this.t.loadFailed);
    }
    try {
      return await encodeCrop(
        this.__img,
        this.cropRect,
        this.outputType,
        quality,
      );
    } catch (e) {
      const messages = {
        "too-large": this.t.tooLarge,
        "other-site": this.t.otherSite,
      };
      throw new Error(messages[e && e.message] || this.t.loadFailed);
    }
  }
  /** save the crop to the user's computer as croppedFileName */
  async download() {
    const blob = await this.toBlob();
    const url = URL.createObjectURL(blob);
    const a = globalThis.document.createElement("a");
    a.href = url;
    a.download = this.croppedFileName;
    this.shadowRoot.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  /** load the image with CORS only when it lives on another origin */
  get _crossOrigin() {
    return crossOriginFor(this.src);
  }
  _pct(v, total) {
    return total ? (v / total) * 100 + "%" : "0";
  }
  render() {
    const r = this.cropRect;
    const W = this.naturalWidth;
    const H = this.naturalHeight;
    const L = this._pct(r.x, W);
    const T = this._pct(r.y, H);
    const RW = this._pct(r.width, W);
    const RH = this._pct(r.height, H);
    const bottom = this._pct(r.y + r.height, H);
    const right = this._pct(r.x + r.width, W);
    const handles = [
      ["nw", 0, 0],
      ["n", 50, 0],
      ["ne", 100, 0],
      ["e", 100, 50],
      ["se", 100, 100],
      ["s", 50, 100],
      ["sw", 0, 100],
      ["w", 0, 50],
    ];
    const label = (id) =>
      id === "free" ? this.t.free : id === "original" ? this.t.original : id;
    const num = (key, text) =>
      html`<label class="num"
        ><span>${text}</span
        ><span class="hax-ui-input-group"
          ><input
            type="number"
            min="0"
            data-k="${key}"
            .value="${String(r[key])}"
            aria-label="${this.t.inPixels.replace("{label}", () => text)}"
            ?disabled="${!this.__loaded}"
            @change="${this._onNumberChange}"
          /><span class="unit">${this.t.pixels}</span></span
        ></label
      >`;
    return html`<div class="wrap">
      <h3 class="title">${this.heading || this.t.crop}</h3>
      <div class="stage">
        <div
          class="box"
          @pointerdown="${this._onPointerDown}"
          @pointermove="${this._onPointerMove}"
          @pointerup="${this._onPointerUp}"
          @pointercancel="${this._onPointerUp}"
        >
          <img
            src="${this.src}"
            alt=""
            crossorigin="${ifDefined(this._crossOrigin || undefined)}"
            @load="${this._onImageLoad}"
            @error="${this._onImageError}"
          />
          ${
            this.__loaded
              ? html`<div
                    class="shade"
                    style="left:0;top:0;width:100%;height:${T}"
                  ></div>
                  <div
                    class="shade"
                    style="left:0;top:${bottom};width:100%;bottom:0"
                  ></div>
                  <div
                    class="shade"
                    style="left:0;top:${T};width:${L};height:${RH}"
                  ></div>
                  <div
                    class="shade"
                    style="left:${right};top:${T};right:0;height:${RH}"
                  ></div>
                  <div
                    class="area"
                    tabindex="0"
                    role="group"
                    aria-label="${this.t.cropArea}"
                    aria-description="${this.t.cropSize
                      .replace("{width}", () => r.width)
                      .replace("{height}", () => r.height)
                      .replace("{x}", () => r.x)
                      .replace("{y}", () => r.y)}"
                    style="left:${L};top:${T};width:${RW};height:${RH}"
                    @keydown="${this._onAreaKeydown}"
                  >
                    <div class="thirds"></div>
                    ${handles.map(
                      (h) =>
                        html`<span
                          class="hdl"
                          data-h="${h[0]}"
                          style="left:${h[1]}%;top:${h[2]}%"
                        ></span>`,
                    )}
                  </div>`
              : ""
          }
        </div>
      </div>
      ${
        this.__narrow
          ? html`<label class="hax-ui-tool-field aspect" for="aspect"
              ><span>${this.t.aspect}</span
              ><select
                id="aspect"
                .value="${this.aspect}"
                ?disabled="${!this.__loaded}"
                @change="${(e) => this.setAspect(e.target.value)}"
              >
                ${ASPECTS.map(
                  (a) =>
                    html`<option
                      value="${a.id}"
                      ?selected="${a.id === this.aspect}"
                    >
                      ${label(a.id)}
                    </option>`,
                )}
              </select></label
            >`
          : html`<div
              class="hax-ui-seg fill"
              role="group"
              aria-label="${this.t.aspect}"
            >
              ${ASPECTS.map(
                (a) =>
                  html`<button
                    type="button"
                    aria-pressed="${a.id === this.aspect ? "true" : "false"}"
                    ?disabled="${!this.__loaded}"
                    @click="${() => this.setAspect(a.id)}"
                  >
                    ${label(a.id)}
                  </button>`,
              )}
            </div>`
      }
      <div class="nums">
        ${num("x", this.t.x)}${num("y", this.t.y)}${num(
          "width",
          this.t.width,
        )}${num("height", this.t.height)}
      </div>
      ${
        this.error
          ? html`<p class="hax-ui-message" data-tone="danger" role="alert">
              ${this.error}
            </p>`
          : this.note
            ? html`<p class="hax-ui-note">${this.note}</p>`
            : ""
      }
      <div class="actions"><slot name="actions"></slot></div>
    </div>`;
  }
}
globalThis.customElements.define(HaxImageCrop.tag, HaxImageCrop);
export { HaxImageCrop };
