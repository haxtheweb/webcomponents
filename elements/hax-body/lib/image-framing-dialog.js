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
import { HaxUiAdminShell } from "@haxtheweb/d-d-d/lib/HaxUiAdminShell.js";
import { HaxUiAdminIcons } from "@haxtheweb/d-d-d/lib/HaxUiAdminIcons.js";
import { HaxUiDialogTitlebarStyles } from "@haxtheweb/d-d-d/lib/HaxUiDialogFrame.js";
import {
  FRAMING_SIZES,
  FRAMING_MIN_SCALE,
  parseFraming,
  serializeFraming,
  autoFrame,
  placeFrame,
  frameZoom,
  roundFraming,
} from "@haxtheweb/d-d-d/lib/ImageFraming.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

/**
 * `image-framing-dialog`
 * Frame one photo for each screen size (haxtheweb/issues#2976). Laid out
 * like the site admin dialog: a rail of screen sizes, a page header, the
 * page at that size with the element live in it, and an action bar. The
 * author drags the photo inside the element and zooms; sizes they don't
 * touch stay automatic and follow the focal point.
 *
 * One dialog serves the page: the image-framing field and the element's
 * Frame button (block toolbar) both call `ImageFramingDialog.open()`.
 *
 * @element image-framing-dialog
 */
export class ImageFramingDialog extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "image-framing-dialog";
  }

  /**
   * Open the dialog. Resolves with { framing, focalX, focalY } on Done, or
   * null when discarded. Options:
   *  element: the framed element (live preview when it can draw one size)
   *  source: the photo; framing: the framing attribute
   *  focalX / focalY: 0-100; frames: [{ id, label, range, width, height }]
   *  title: the element's name, for the breadcrumb
   *  size: the screen size to open on
   */
  static open(options) {
    let dialog = globalThis.document.querySelector(ImageFramingDialog.tag);
    if (!dialog) {
      dialog = globalThis.document.createElement(ImageFramingDialog.tag);
      globalThis.document.body.appendChild(dialog);
    }
    return dialog.open(options);
  }

  constructor() {
    super();
    this.elementTitle = "";
    this.frames = [];
    this.current = "lg";
    this.framings = {};
    this.focal = { x: 0.5, y: 0.5 };
    this.focalMode = false;
    this.photoAspect = 1.5;
    this.source = "";
    this.t = this.t || {};
    this.t = {
      ...this.t,
      framingTitle: "Framing",
      framingScreenSizes: "Screen sizes",
      framingIntro:
        "Drag the photo inside the hero to move it. Zoom to get closer. Sizes you don't touch follow the focal point.",
      framingZoom: "Zoom",
      framingWidest: "Widest",
      framingSetFocalPoint: "Set focal point",
      framingBackToAutomatic: "Back to automatic",
      framingAutomatic: "Automatic",
      framingCustom: "Custom",
      framingDiscard: "Discard",
      framingDone: "Done",
      framingClose: "Close",
      framingAllAutomatic: "All sizes automatic",
      framingOneCustom: "1 size framed by hand",
      framingManyCustom: "{n} sizes framed by hand",
      framingFor:
        "Framing for {size}. Drag or use the arrow keys to move the photo; plus and minus zoom.",
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
      elementTitle: { type: String },
      frames: { type: Array },
      current: { type: String },
      framings: { type: Object },
      focal: { type: Object },
      focalMode: { type: Boolean },
      source: { type: String },
      photoAspect: { type: Number },
    };
  }

  static get styles() {
    return [
      super.styles,
      HaxUiAdminTokens,
      HaxUiAdminPrimitives,
      HaxUiAdminScheme,
      HaxUiAdminControls,
      HaxUiAdminShell,
      HaxUiDialogTitlebarStyles,
      css`
        :host {
          font-family: var(--hax-ui-admin-font-family);
          font-size: var(--hax-ui-font-size);
          color: var(--hax-ui-text);
        }
        dialog {
          box-sizing: border-box;
          width: calc(100vw - 36px);
          max-width: 1244px;
          height: calc(100vh - 100px);
          max-height: 800px;
          padding: var(--ddd-spacing-0);
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
          background-color: var(--ddd-theme-default-potentialMidnight);
          opacity: 0.6;
        }
        .hax-ui-dialog-titlebar .hax-ui-dialog-title,
        .hax-ui-dialog-titlebar .crumb {
          flex: 0 0 auto;
          font-size: var(--hax-ui-font-size-lg);
          font-weight: var(--ddd-font-weight-bold, 700);
        }
        .hax-ui-dialog-titlebar .sep {
          opacity: 0.7;
        }
        .hax-ui-dialog-titlebar .spacer {
          flex: 1;
        }
        .section {
          flex: 1;
          min-height: 0;
        }
        .rail-item {
          height: auto;
          min-height: var(--hax-ui-row-height);
          padding: var(--hax-ui-gap) var(--hax-ui-gap-md);
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 0 var(--hax-ui-gap-md);
        }
        .rail-item small {
          grid-column: 1 / -1;
          font-size: var(--hax-ui-admin-font-size-xs);
          font-weight: var(--ddd-font-weight-regular, 400);
          color: var(--hax-ui-text-muted);
        }
        .rail-badge[data-tone="custom"] {
          color: var(--hax-ui-on-accent);
          background-color: var(--hax-ui-accent-strong);
        }
        .ph h2 {
          margin: var(--ddd-spacing-0);
        }
        .tools {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--hax-ui-gap-md) var(--hax-ui-gap-lg);
          padding: var(--hax-ui-gap-md) var(--ddd-spacing-5, 20px);
        }
        .tools input[type="range"] {
          width: 150px;
          accent-color: var(--hax-ui-accent-strong);
        }
        .tools .spacer {
          flex: 1;
        }
        .tools [aria-pressed="true"] {
          background-color: var(--hax-ui-selected);
          box-shadow: inset 0 0 0 1px var(--hax-ui-accent-strong);
        }
        .viewport {
          flex: 1;
          min-height: 0;
          overflow: auto;
          padding: var(--ddd-spacing-4, 16px);
          background-color: var(--hax-ui-sunken);
          display: grid;
          justify-items: center;
          align-content: start;
        }
        .ftr .st {
          color: var(--hax-ui-text-muted);
        }
        /* phones: the rail becomes a row of sizes above the page */
        :host([narrow]) dialog {
          width: 100vw;
          max-width: none;
          height: 100vh;
          max-height: none;
          border-radius: 0;
        }
        :host([narrow]) .section {
          flex-direction: column;
        }
        :host([narrow]) .rail {
          width: auto;
          flex-direction: row;
          overflow-x: auto;
          border-right: 0;
          border-bottom: var(--ddd-border-xs);
          border-bottom-color: var(--hax-ui-line);
        }
        :host([narrow]) .rail-label,
        :host([narrow]) .rail-item small,
        :host([narrow]) .ph p,
        :host([narrow]) .tools .spacer {
          display: none;
        }
        :host([narrow]) .ph h2 {
          font-size: var(--hax-ui-font-size-lg);
        }
        :host([narrow]) .rail-item {
          width: auto;
          grid-template-columns: auto;
          justify-items: start;
        }
        :host([narrow]) .tools input[type="range"] {
          flex: 1;
          width: auto;
        }
      `,
    ];
  }

  /**
   * The stage lives in the light DOM (slotted), so the page's own DDD
   * styles reach the element drawn in it
   */
  render() {
    const frame = this._frame();
    const count = Object.keys(this.framings).length;
    const status = !count
      ? this.t.framingAllAutomatic
      : count === 1
        ? this.t.framingOneCustom
        : this.t.framingManyCustom.replace("{n}", count);
    const zoom = frame ? Math.round(this._zoom(frame) * 100) : 100;
    return html`<dialog
      aria-labelledby="dialog-title"
      @cancel="${this._cancel}"
      @close="${this._closed}"
    >
      <div class="hax-ui-dialog-titlebar">
        ${
          this.elementTitle
            ? html`<span class="hax-ui-dialog-title crumb"
                  >${this.elementTitle}</span
                ><span class="crumb sep" aria-hidden="true">/</span>`
            : nothing
        }
        <h2 class="hax-ui-dialog-title" id="dialog-title">
          ${this.t.framingTitle}
        </h2>
        <span class="spacer"></span>
        <button
          type="button"
          class="hax-ui-dialog-close"
          aria-label="${this.t.framingClose}"
          @click="${this._discard}"
        >
          <simple-icon-lite icon="${HaxUiAdminIcons.close}"></simple-icon-lite>
        </button>
      </div>
      <div class="section">
        <nav class="rail" aria-label="${this.t.framingScreenSizes}">
          <div class="rail-label">
            <span class="label">${this.t.framingScreenSizes}</span>
          </div>
          ${this.frames.map(
            (f) =>
              html`<button
                type="button"
                class="rail-item"
                aria-current="${f.id === this.current ? "page" : "false"}"
                @click="${() => this._pick(f.id)}"
              >
                <span class="label">${f.label}</span>
                <span
                  class="rail-badge"
                  data-tone="${this.framings[f.id] ? "custom" : "auto"}"
                  >${this.framings[f.id] ? this.t.framingCustom : this.t.framingAutomatic}</span
                >
                <small>${f.range}</small>
              </button>`,
          )}
        </nav>
        <div class="main">
          <div class="ph">
            <div class="ph-text">
              <h2>${frame ? `${frame.label} (${frame.range})` : ""}</h2>
              <p>${this.t.framingIntro}</p>
            </div>
          </div>
          <div class="tools">
            <label for="zoom">${this.t.framingZoom}</label>
            <input
              id="zoom"
              type="range"
              min="100"
              max="${Math.round(100 / FRAMING_MIN_SCALE)}"
              step="5"
              .value="${String(zoom)}"
              @input="${this._zoomInput}"
            />
            <span>${zoom === 100 ? this.t.framingWidest : `${zoom}%`}</span>
            <button
              type="button"
              class="hax-ui-btn"
              aria-pressed="${this.focalMode ? "true" : "false"}"
              @click="${() => (this.focalMode = !this.focalMode)}"
            >
              ${this.t.framingSetFocalPoint}
            </button>
            <span class="spacer"></span>
            <button
              type="button"
              class="hax-ui-btn ghost"
              ?disabled="${!this.framings[this.current]}"
              @click="${this._backToAuto}"
            >
              ${this.t.framingBackToAutomatic}
            </button>
          </div>
          <div class="viewport" id="viewport"><slot></slot></div>
        </div>
      </div>
      <div class="ftr">
        <div class="st" role="status" aria-live="polite">${status}</div>
        <button
          type="button"
          class="hax-ui-btn ghost"
          @click="${this._discard}"
        >
          ${this.t.framingDiscard}
        </button>
        <button type="button" class="hax-ui-btn primary" @click="${this._done}">
          ${this.t.framingDone}
        </button>
      </div>
    </dialog>`;
  }

  /**
   * Open on an element's framing; resolves on Done or Discard
   */
  async open(options = {}) {
    this._element = options.element || null;
    this.source = options.source || "";
    this.elementTitle = options.title || "";
    this.frames = (options.frames || []).length
      ? options.frames
      : FRAMING_SIZES.map((s) => ({ ...s, width: 1280, height: 540 }));
    this.framings = parseFraming(options.framing);
    const fx = Number(options.focalX);
    const fy = Number(options.focalY);
    this.focal = {
      x: Number.isFinite(fx) ? clamp(fx / 100, 0, 1) : 0.5,
      y: Number.isFinite(fy) ? clamp(fy / 100, 0, 1) : 0.5,
    };
    this.focalMode = false;
    this.current =
      options.size && this.frames.find((f) => f.id === options.size)
        ? options.size
        : this.frames[Math.min(2, this.frames.length - 1)].id;
    this.toggleAttribute(
      "narrow",
      !!(
        globalThis.matchMedia &&
        globalThis.matchMedia("(max-width: 599px)").matches
      ),
    );
    this.photoAspect = await this._loadAspect(this.source);
    await this.updateComplete;
    const dialog = this.shadowRoot.querySelector("dialog");
    if (!dialog.open) {
      dialog.showModal();
    }
    this._drawStage();
    return new Promise((resolve) => {
      this._resolve = resolve;
    });
  }

  _loadAspect(source) {
    return new Promise((resolve) => {
      if (!source) {
        resolve(1.5);
        return;
      }
      const img = new Image();
      img.onload = () =>
        resolve(
          img.naturalWidth && img.naturalHeight
            ? img.naturalWidth / img.naturalHeight
            : 1.5,
        );
      img.onerror = () => resolve(1.5);
      img.src = source;
    });
  }

  _frame(id) {
    const want = id || this.current;
    return this.frames.find((f) => f.id === want) || null;
  }

  /** the shape being framed: the element's real box at this size */
  _aspect(frame) {
    if (this._box && this._box.id === frame.id && this._box.h > 0) {
      return this._box.w / this._box.h;
    }
    return frame.width / frame.height;
  }

  rectFor(frame) {
    return (
      this.framings[frame.id] ||
      autoFrame(
        this._aspect(frame),
        this.photoAspect,
        this.focal.x,
        this.focal.y,
      )
    );
  }

  _zoom(frame) {
    return frameZoom(
      this.rectFor(frame),
      this._aspect(frame),
      this.photoAspect,
    );
  }

  _setCustom(rect) {
    const r = {
      x: roundFraming(clamp(rect.x, 0, 1 - rect.w)),
      y: roundFraming(clamp(rect.y, 0, 1 - rect.h)),
      w: roundFraming(rect.w),
      h: roundFraming(rect.h),
    };
    this.framings = { ...this.framings, [this.current]: r };
    this._updateStage();
  }

  _pick(id) {
    this.current = id;
    this._drawStage();
  }

  _zoomInput(e) {
    const frame = this._frame();
    const r = this.rectFor(frame);
    this._setCustom(
      placeFrame(
        this._aspect(frame),
        this.photoAspect,
        r.x + r.w / 2,
        r.y + r.h / 2,
        Number(e.target.value) / 100,
      ),
    );
  }

  _backToAuto() {
    const next = { ...this.framings };
    delete next[this.current];
    this.framings = next;
    this._updateStage();
  }

  /**
   * The page at this screen size: the blocks around the element, the
   * element drawn for this size, the rest of the photo faint behind it
   */
  async _drawStage() {
    await this.updateComplete;
    const frame = this._frame();
    if (!frame) return;
    this.replaceChildren();
    const viewport = this.shadowRoot.querySelector("#viewport");
    const availW = Math.max(200, viewport.clientWidth - 32);
    const k = Math.min(1, availW / frame.width);
    const outer = globalThis.document.createElement("div");
    outer.style.cssText = `position:relative;width:${frame.width * k}px;overflow:hidden;box-shadow:var(--hax-ui-shadow-popover);background-color:light-dark(var(--ddd-theme-default-white),var(--ddd-theme-default-coalyGray));`;
    const page = globalThis.document.createElement("div");
    page.style.cssText = `position:relative;width:${frame.width}px;transform:scale(${k});transform-origin:0 0;container-type:inline-size;padding:var(--ddd-spacing-6) var(--ddd-spacing-6);box-sizing:border-box;font-family:var(--ddd-font-primary);color:light-dark(var(--ddd-theme-default-coalyGray),var(--ddd-theme-default-white));`;
    const el = this._element;
    const near = (node) => {
      if (!node) return null;
      const copy = node.cloneNode(true);
      copy.removeAttribute("contenteditable");
      copy.removeAttribute("data-hax-active");
      copy.setAttribute("aria-hidden", "true");
      copy.setAttribute("inert", "");
      return copy;
    };
    const before = el ? near(el.previousElementSibling) : null;
    const after = el ? near(el.nextElementSibling) : null;
    const ghost = globalThis.document.createElement("img");
    ghost.alt = "";
    ghost.src = this.source;
    ghost.draggable = false;
    ghost.style.cssText =
      "position:absolute;opacity:0.32;pointer-events:none;max-width:none;";
    let preview;
    if (el && typeof el.framingFrames === "function") {
      preview = el.cloneNode(true);
      preview.removeAttribute("contenteditable");
      preview.removeAttribute("data-hax-active");
      preview.setAttribute("preview-size", frame.id);
    } else {
      // an element that can't draw one size: a plain box of the frame's shape
      preview = globalThis.document.createElement("div");
      preview.style.cssText = `position:relative;overflow:hidden;width:100%;aspect-ratio:${frame.width}/${frame.height};`;
      const img = globalThis.document.createElement("img");
      img.className = "photo";
      img.alt = "";
      img.src = this.source;
      img.style.cssText = "position:absolute;max-width:none;object-fit:cover;";
      preview.appendChild(img);
    }
    preview.setAttribute("aria-hidden", "true");
    preview.style.position = "relative";
    preview.style.zIndex = "1";
    const handle = globalThis.document.createElement("div");
    handle.tabIndex = 0;
    handle.setAttribute("role", "application");
    handle.setAttribute(
      "aria-label",
      this.t.framingFor.replace("{size}", frame.label),
    );
    handle.style.cssText =
      "position:absolute;z-index:3;cursor:grab;touch-action:none;outline:2px solid var(--hax-ui-accent-strong);";
    const dot = globalThis.document.createElement("span");
    dot.style.cssText =
      "position:absolute;z-index:4;width:20px;height:20px;margin:-10px 0 0 -10px;border:3px solid var(--ddd-theme-default-white);border-radius:50%;box-shadow:0 0 0 1px var(--ddd-theme-default-coalyGray);pointer-events:none;";
    if (before) page.appendChild(before);
    page.appendChild(ghost);
    page.appendChild(preview);
    if (after) page.appendChild(after);
    page.appendChild(handle);
    page.appendChild(dot);
    outer.appendChild(page);
    this.appendChild(outer);
    this._stage = { frame, k, outer, page, preview, ghost, handle, dot };
    this._wire(handle);
    // wait for the preview to lay out, then size the outer box and place
    // the photo
    await new Promise((r) =>
      requestAnimationFrame(() => requestAnimationFrame(r)),
    );
    if (preview.updateComplete) await preview.updateComplete;
    // fit the page to the viewport's height too, so the whole element and
    // the blocks around it show at once
    const availH = Math.max(160, viewport.clientHeight - 32);
    const fit = Math.min(k, availH / page.offsetHeight);
    if (fit < k) {
      this._stage.k = fit;
      outer.style.width = `${frame.width * fit}px`;
      page.style.transform = `scale(${fit})`;
    }
    outer.style.height = `${page.offsetHeight * this._stage.k}px`;
    this._updateStage();
    const top = preview.offsetTop * this._stage.k - 80;
    viewport.scrollTop = Math.max(0, top);
  }

  /** move the photo, ghost and focal dot for the current rect */
  _updateStage() {
    const s = this._stage;
    if (!s || !s.frame) return;
    const frame = this._frame();
    if (!frame || frame.id !== s.frame.id) return;
    const bx = s.preview.offsetLeft;
    const by = s.preview.offsetTop;
    const bw = s.preview.offsetWidth;
    const bh = s.preview.offsetHeight;
    this._box = { id: frame.id, w: bw, h: bh };
    const custom = this.framings[frame.id];
    const r = this.rectFor(frame);
    if (s.preview.hasAttribute("preview-size")) {
      s.preview.setAttribute("framing", serializeFraming(this.framings));
      s.preview.focalX = Math.round(this.focal.x * 100);
      s.preview.focalY = Math.round(this.focal.y * 100);
    } else {
      const img = s.preview.querySelector("img");
      img.style.width = `calc(100% / ${r.w})`;
      img.style.height = `calc(100% / ${r.h})`;
      img.style.left = `calc(-100% * ${r.x} / ${r.w})`;
      img.style.top = `calc(-100% * ${r.y} / ${r.h})`;
    }
    const pw = bw / r.w;
    const ph = bh / r.h;
    Object.assign(s.ghost.style, {
      width: `${pw}px`,
      height: `${ph}px`,
      left: `${bx - r.x * pw}px`,
      top: `${by - r.y * ph}px`,
    });
    Object.assign(s.handle.style, {
      left: `${bx}px`,
      top: `${by}px`,
      width: `${bw}px`,
      height: `${bh}px`,
      cursor: this.focalMode ? "crosshair" : "grab",
    });
    Object.assign(s.dot.style, {
      left: `${bx - r.x * pw + this.focal.x * pw}px`,
      top: `${by - r.y * ph + this.focal.y * ph}px`,
    });
    s.geom = { pw, ph, bx, by, bw, bh, custom: !!custom };
  }

  _wire(handle) {
    let drag = null;
    handle.addEventListener("pointerdown", (e) => {
      const s = this._stage;
      if (this.focalMode) {
        const rect = handle.getBoundingClientRect();
        const r = this.rectFor(s.frame);
        this.focal = {
          x: clamp(r.x + ((e.clientX - rect.left) / rect.width) * r.w, 0, 1),
          y: clamp(r.y + ((e.clientY - rect.top) / rect.height) * r.h, 0, 1),
        };
        this.focalMode = false;
        this._updateStage();
        return;
      }
      drag = { x: e.clientX, y: e.clientY };
      handle.setPointerCapture(e.pointerId);
      handle.style.cursor = "grabbing";
    });
    handle.addEventListener("pointermove", (e) => {
      if (!drag) return;
      const s = this._stage;
      const r = this.rectFor(s.frame);
      const dx = (e.clientX - drag.x) / s.k / s.geom.pw;
      const dy = (e.clientY - drag.y) / s.k / s.geom.ph;
      drag = { x: e.clientX, y: e.clientY };
      this._setCustom({ ...r, x: r.x - dx, y: r.y - dy });
    });
    const end = () => {
      drag = null;
      handle.style.cursor = "grab";
    };
    handle.addEventListener("pointerup", end);
    handle.addEventListener("pointercancel", end);
    handle.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        this._zoomBy(e.deltaY < 0 ? 1.05 : 1 / 1.05);
      },
      { passive: false },
    );
    handle.addEventListener("keydown", (e) => {
      const s = this._stage;
      const r = this.rectFor(s.frame);
      const step = e.shiftKey ? 0.05 : 0.01;
      const moves = {
        ArrowLeft: [-step, 0],
        ArrowRight: [step, 0],
        ArrowUp: [0, -step],
        ArrowDown: [0, step],
      };
      if (moves[e.key]) {
        this._setCustom({
          ...r,
          x: r.x + moves[e.key][0],
          y: r.y + moves[e.key][1],
        });
      } else if (e.key === "+" || e.key === "=") {
        this._zoomBy(1.1);
      } else if (e.key === "-") {
        this._zoomBy(1 / 1.1);
      } else {
        return;
      }
      e.preventDefault();
    });
  }

  _zoomBy(factor) {
    const frame = this._frame();
    const r = this.rectFor(frame);
    this._setCustom(
      placeFrame(
        this._aspect(frame),
        this.photoAspect,
        r.x + r.w / 2,
        r.y + r.h / 2,
        this._zoom(frame) * factor,
      ),
    );
  }

  _result() {
    return {
      framing: serializeFraming(this.framings),
      focalX: Math.round(this.focal.x * 100),
      focalY: Math.round(this.focal.y * 100),
    };
  }

  _finish(value) {
    const resolve = this._resolve;
    this._resolve = null;
    const dialog = this.shadowRoot.querySelector("dialog");
    if (dialog && dialog.open) dialog.close();
    this.replaceChildren();
    this._stage = null;
    if (resolve) resolve(value);
  }

  _done() {
    this._finish(this._result());
  }

  _discard() {
    this._finish(null);
  }

  _cancel(e) {
    e.preventDefault();
    this._discard();
  }

  _closed() {
    if (this._resolve) this._finish(null);
  }
}

globalThis.customElements.define(ImageFramingDialog.tag, ImageFramingDialog);
