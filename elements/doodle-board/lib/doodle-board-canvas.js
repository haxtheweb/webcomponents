/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import {
  HaxUiAdminTokens,
  HaxUiAdminScheme,
} from "@haxtheweb/d-d-d/lib/HaxUiAdminTokens.js";
import { HaxUiAdminControls } from "@haxtheweb/d-d-d/lib/HaxUiAdminControls.js";
import { HaxUiAdminIcons } from "@haxtheweb/d-d-d/lib/HaxUiAdminIcons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";

/**
 * Tool glyphs. These are editing tools inside the drawing surface, not
 * admin chrome, so they are drawn here; actions in the toolbar (clear,
 * image, download) use the hax:admin-* icons.
 */
const TOOL_GLYPHS = {
  pen: "M3 21l3.75-1 11-11-2.75-2.75-11 11L3 21zM16.5 5.25l2.75 2.75 1.5-1.5a1 1 0 0 0 0-1.4l-1.35-1.35a1 1 0 0 0-1.4 0l-1.5 1.5z",
  highlighter:
    "M6 14l4 4-2 2H3v-1l3-5zm1.4-1.4l7.1-7.1 4 4-7.1 7.1-4-4zm8.5-8.5l1.4-1.4a1 1 0 0 1 1.4 0l2.6 2.6a1 1 0 0 1 0 1.4L19.9 8.1l-4-4z",
  eraser:
    "M16.24 3.56l4.95 4.94a1.5 1.5 0 0 1 0 2.13L12 19.82H21v1.5H9.06l-5.3-5.3a1.5 1.5 0 0 1 0-2.12l10.36-10.34a1.5 1.5 0 0 1 2.12 0zM5.88 14.95l3.81 3.8h.2l3.6-3.6-4.95-4.94-2.66 2.66v2.08z",
  line: "M4.3 18.3L18.3 4.3l1.4 1.4-14 14z",
  arrow: "M14 4h6v6l-2.3-2.3-11.3 11.3-1.4-1.4L16.3 6.3z",
  box: "M3 5h18v14H3z",
  circle: "M12 4a8 8 0 1 1 0 16 8 8 0 0 1 0-16z",
  text: "M5 4h14v3h-2V6h-4v12h2v2H9v-2h2V6H7v1H5z",
  fill: "M16.56 8.94L7.62 0 6.21 1.41l2.38 2.38-5.15 5.15a1.49 1.49 0 0 0 0 2.12l5.5 5.5c.29.29.68.44 1.06.44s.77-.15 1.06-.44l5.5-5.5c.59-.58.59-1.53 0-2.12zM5.21 10L10 5.21 14.79 10H5.21zM19 11.5s-2 2.17-2 3.5c0 1.1.9 2 2 2s2-.9 2-2c0-1.33-2-3.5-2-3.5z",
  undo: "M12.5 8c-2.65 0-5.05 1-6.9 2.6L2 7v9h9l-3.62-3.62A7.98 7.98 0 0 1 20.1 16l2.37-.78A10.48 10.48 0 0 0 12.5 8z",
  redo: "M18.4 10.6A10.46 10.46 0 0 0 11.5 8c-4.65 0-8.58 3.03-9.96 7.22l2.36.78A8 8 0 0 1 16.62 12.4L13 16h9V7l-3.6 3.6z",
};

/** tools each mode offers, in toolbar order */
const MODE_TOOLS = {
  draw: [
    "pen",
    "highlighter",
    "eraser",
    "line",
    "arrow",
    "box",
    "circle",
    "text",
    "fill",
  ],
  feedback: [
    "pen",
    "highlighter",
    "eraser",
    "line",
    "arrow",
    "box",
    "circle",
    "text",
  ],
  signature: ["pen", "eraser"],
};

/** per-mode starting state */
const MODE_DEFAULTS = {
  draw: { tool: "pen", color: "#1e407c", size: 6, width: 1200, height: 800 },
  feedback: {
    tool: "pen",
    color: "#bc204b",
    size: 4,
    width: 1200,
    height: 800,
  },
  signature: {
    tool: "pen",
    color: "#001e44",
    size: 3,
    width: 900,
    height: 300,
  },
};

/** DDD palette offered as swatches: [token name, fallback hex] */
const PALETTE = [
  ["coalyGray", "#262626"],
  ["nittanyNavy", "#001e44"],
  ["beaverBlue", "#1e407c"],
  ["skyBlue", "#009cde"],
  ["creekTeal", "#3ea39e"],
  ["opportunityGreen", "#008755"],
  ["keystoneYellow", "#ffd100"],
  ["inventOrange", "#e98300"],
  ["original87Pink", "#bc204b"],
  ["athertonViolet", "#ac8dce"],
  ["white", "#ffffff"],
];

/** tools that paint translucent by default */
const TRANSLUCENT_TOOLS = ["highlighter", "box", "circle"];
/** the longest side of a surface built from a background image */
const MAX_SIDE = 1600;
/** undo steps kept; each is a full copy of the drawing layer */
const HISTORY_LIMIT = 15;

/**
 * `doodle-board-canvas`
 * The drawing surface: pen, highlighter, eraser, line, arrow, filled
 * boxes and circles (translucent by default), text and fill, over an
 * optional background image. Three modes set the tools and defaults: draw,
 * feedback (mark up a submission) and signature (a signature pad).
 *
 * The drawing is kept as a transparent layer apart from the background,
 * so getValue() returns only the marks and the background can be any
 * image. download() saves the two combined.
 *
 * @element doodle-board-canvas
 * @fires doodle-board-change - after each completed mark, with `{ dirty }`
 * @fires doodle-board-download - cancelable, `{ blob, filename }`; when
 *   not cancelled the element saves the file with a download link
 * @fires doodle-board-background - a background image was picked, `{ src }`
 */
export class DoodleBoardCanvas extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "doodle-board-canvas";
  }

  constructor() {
    super();
    this.mode = "draw";
    this.src = "";
    this.value = "";
    this.width = 0;
    this.height = 0;
    this.filename = "doodle";
    this.backgroundUpload = false;
    this.downloadable = false;
    this.label = "";
    this.tool = "pen";
    this.color = MODE_DEFAULTS.draw.color;
    this.size = MODE_DEFAULTS.draw.size;
    this.opacity = 100;
    this.dirty = false;
    this._surfaceW = 1200;
    this._surfaceH = 800;
    this._undo = [];
    this._redo = [];
    this._text = null;
    this._confirmClear = false;
    this._status = "";
    this.t = this.t || {};
    this.t = {
      ...this.t,
      tools: "Drawing tools",
      pen: "Pen",
      highlighter: "Highlighter",
      eraser: "Eraser",
      line: "Line",
      arrow: "Arrow",
      box: "Box",
      circle: "Circle",
      text: "Text",
      fill: "Fill",
      size: "Size",
      opacity: "Opacity",
      color: "Color",
      customColor: "Custom color",
      undo: "Undo",
      redo: "Redo",
      clear: "Clear",
      clearConfirm: "Clear the whole drawing?",
      clearYes: "Clear drawing",
      cancel: "Cancel",
      cleared: "Drawing cleared",
      image: "Image",
      imageHelp: "Draw over an image",
      download: "Download",
      downloadLayerOnly:
        "The image could not be combined, so only the marks were saved",
      surface: "Drawing surface",
      signHere: "Sign above the line",
      textHint: "Type, then press Enter. Shift+Enter adds a line.",
      shapeHint: "Hold Shift for a square, circle or straight angle",
      coalyGray: "Coaly gray",
      nittanyNavy: "Nittany navy",
      beaverBlue: "Beaver blue",
      skyBlue: "Sky blue",
      creekTeal: "Creek teal",
      opportunityGreen: "Opportunity green",
      keystoneYellow: "Keystone yellow",
      inventOrange: "Invent orange",
      original87Pink: "Original 87 pink",
      athertonViolet: "Atherton violet",
      white: "White",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../locales/", import.meta.url).href,
    });
  }

  static get properties() {
    return {
      ...super.properties,
      /** draw, feedback or signature */
      mode: { type: String, reflect: true },
      /** background image drawn under the marks */
      src: { type: String },
      /** the marks: a transparent PNG data URL */
      value: { type: String },
      /** surface size when there is no background image */
      width: { type: Number },
      height: { type: Number },
      /** file name for download(), without the extension */
      filename: { type: String },
      /** show the Image button to pick a background */
      backgroundUpload: {
        type: Boolean,
        attribute: "background-upload",
      },
      /** show the Download button */
      downloadable: { type: Boolean },
      /** accessible name for the surface */
      label: { type: String },
      tool: { type: String },
      color: { type: String },
      size: { type: Number },
      opacity: { type: Number },
      dirty: { type: Boolean, reflect: true },
      _surfaceW: { state: true },
      _surfaceH: { state: true },
      _text: { state: true },
      _confirmClear: { state: true },
      _status: { state: true },
      _canUndo: { state: true },
      _canRedo: { state: true },
    };
  }

  static get styles() {
    return [
      super.styles,
      HaxUiAdminTokens,
      HaxUiAdminScheme,
      HaxUiAdminControls,
      css`
        :host {
          display: block;
          font-family: var(--hax-ui-admin-font-family);
          font-size: var(--hax-ui-admin-font-size);
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-surface);
          border: 1px solid var(--hax-ui-line);
          border-radius: var(--hax-ui-radius-lg);
          overflow: hidden;
        }
        :host([hidden]) {
          display: none;
        }
        .toolbar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          padding: var(--hax-ui-gap-md);
          border-bottom: 1px solid var(--hax-ui-line);
        }
        .group {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--hax-ui-gap);
        }
        .end {
          margin-inline-start: auto;
        }
        .divider {
          width: 1px;
          align-self: stretch;
          background-color: var(--hax-ui-line);
        }
        .hax-ui-seg button {
          padding: 0;
          width: var(--hax-ui-row-height);
          justify-content: center;
        }
        svg.glyph {
          width: var(--hax-ui-icon);
          height: var(--hax-ui-icon);
          fill: currentColor;
        }
        .swatch {
          all: unset;
          box-sizing: border-box;
          cursor: pointer;
          width: var(--hax-ui-target);
          height: var(--hax-ui-target);
          border-radius: var(--hax-ui-radius-pill);
          border: 1px solid var(--hax-ui-line-strong);
        }
        .swatch[aria-pressed="true"] {
          box-shadow:
            0 0 0 2px var(--hax-ui-surface),
            0 0 0 4px var(--hax-ui-text);
        }
        .custom-color {
          width: var(--hax-ui-target);
          height: var(--hax-ui-target);
          padding: 0;
          border: 0;
          background: none;
          cursor: pointer;
        }
        .hax-ui-tool-field input[type="range"] {
          all: revert;
          width: 88px;
          accent-color: var(--hax-ui-accent-strong);
        }
        .hax-ui-tool-field output {
          min-width: 4ch;
          font-variant-numeric: tabular-nums;
          color: var(--hax-ui-text);
        }
        button:focus-visible,
        input:focus-visible,
        .swatch:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 1px;
        }
        .stage {
          padding: var(--ddd-spacing-3, 12px);
          background-color: var(--hax-ui-sunken);
        }
        .paper {
          position: relative;
          width: 100%;
          margin: 0 auto;
          border-radius: var(--hax-ui-radius);
          box-shadow: var(--ddd-boxShadow-sm, 0 1px 3px rgba(0, 0, 0, 0.2));
          overflow: hidden;
          touch-action: none;
          background-color: var(--ddd-theme-default-white, #ffffff);
          /* the surface is paper in every theme: what is drawn on it is
             saved, so it keeps its colors */
          color-scheme: light;
        }
        :host([mode="signature"]) .paper {
          background-image: linear-gradient(
            to top,
            transparent 22%,
            var(--ddd-theme-default-limestoneGray, #a2aaad) 22%,
            var(--ddd-theme-default-limestoneGray, #a2aaad) calc(22% + 1px),
            transparent calc(22% + 1px)
          );
        }
        .paper img.bg,
        .paper canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
        }
        .paper img.bg {
          object-fit: fill;
          user-select: none;
          pointer-events: none;
        }
        canvas.live {
          cursor: crosshair;
        }
        canvas.live[data-tool="text"] {
          cursor: text;
        }
        .sign-hint {
          position: absolute;
          left: var(--ddd-spacing-4, 16px);
          bottom: calc(22% - 1.5em);
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--ddd-theme-default-slateGray, #314d64);
          pointer-events: none;
        }
        .sign-hint::before {
          content: "×";
          margin-inline-end: var(--hax-ui-gap-md);
          font-weight: var(--ddd-font-weight-bold, 700);
        }
        textarea.text-entry {
          position: absolute;
          z-index: 1;
          min-width: 6ch;
          margin: 0;
          padding: 0;
          border: 1px dashed var(--ddd-theme-default-link, #005fa9);
          background: transparent;
          font-family: var(--ddd-font-primary, sans-serif);
          font-weight: var(--ddd-font-weight-bold, 700);
          line-height: 1.25;
          resize: none;
          overflow: hidden;
          white-space: pre;
          field-sizing: content;
        }
        .status {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: var(--hax-ui-gap-md);
          min-height: var(--hax-ui-row-height);
          align-items: center;
          padding: 0 var(--hax-ui-gap-lg);
          border-top: 1px solid var(--hax-ui-line);
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
        }
        .status .dims {
          font-family: var(--ddd-font-mono, monospace);
          font-variant-numeric: tabular-nums;
        }
        .confirm {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          color: var(--hax-ui-text);
          font-size: var(--hax-ui-admin-font-size);
        }
        .file {
          display: none;
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            transition: none !important;
          }
        }
      `,
    ];
  }

  get tools() {
    return MODE_TOOLS[this.mode] || MODE_TOOLS.draw;
  }

  render() {
    const opacityTool = this.mode !== "signature";
    return html`
      <div
        class="toolbar"
        role="toolbar"
        aria-label="${this.t.tools}"
        @keydown="${this._toolbarKey}"
      >
        <div class="hax-ui-seg" role="group" aria-label="${this.t.tools}">
          ${this.tools.map(
            (tool) => html`
              <button
                type="button"
                aria-pressed="${this.tool === tool ? "true" : "false"}"
                aria-label="${this.t[tool]}"
                title="${this.t[tool]}"
                @click="${() => this.setTool(tool)}"
              >
                ${this._glyph(tool)}
              </button>
            `,
          )}
        </div>
        <label class="hax-ui-tool-field" for="size">
          ${this.t.size}
          <input
            id="size"
            type="range"
            min="1"
            max="48"
            .value="${String(this.size)}"
            @input="${(e) => (this.size = parseInt(e.target.value, 10))}"
          />
          <output for="size">${this.size}</output>
        </label>
        ${
          opacityTool
            ? html`
                <label class="hax-ui-tool-field" for="opacity">
                  ${this.t.opacity}
                  <input
                    id="opacity"
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    .value="${String(this.opacity)}"
                    @input="${(e) =>
                      (this.opacity = parseInt(e.target.value, 10))}"
                  />
                  <output for="opacity">${this.opacity}%</output>
                </label>
              `
            : nothing
        }
        <div class="group" role="group" aria-label="${this.t.color}">
          ${this._palette().map(
            (c) => html`
              <button
                type="button"
                class="swatch"
                style="background-color:${c.hex}"
                aria-pressed="${
                  this.color.toLowerCase() === c.hex ? "true" : "false"
                }"
                aria-label="${c.label}"
                title="${c.label}"
                @click="${() => this.setColor(c.hex)}"
              ></button>
            `,
          )}
          <input
            id="custom-color"
            class="custom-color"
            type="color"
            .value="${this.color}"
            aria-label="${this.t.customColor}"
            title="${this.t.customColor}"
            @input="${(e) => this.setColor(e.target.value)}"
          />
        </div>
        <div class="group end">
          <button
            type="button"
            class="hax-ui-icon-btn"
            aria-label="${this.t.undo}"
            title="${this.t.undo} (Ctrl+Z)"
            ?disabled="${!this._canUndo}"
            @click="${this.undo}"
          >
            ${this._glyph("undo")}
          </button>
          <button
            type="button"
            class="hax-ui-icon-btn"
            aria-label="${this.t.redo}"
            title="${this.t.redo} (Ctrl+Shift+Z)"
            ?disabled="${!this._canRedo}"
            @click="${this.redo}"
          >
            ${this._glyph("redo")}
          </button>
          <span class="divider"></span>
          ${
            this.backgroundUpload
              ? html`
                  <button
                    type="button"
                    class="hax-ui-btn"
                    title="${this.t.imageHelp}"
                    @click="${this._pickImage}"
                  >
                    <simple-icon-lite
                      icon="${HaxUiAdminIcons.upload}"
                    ></simple-icon-lite>
                    ${this.t.image}
                  </button>
                  <input
                    id="file"
                    class="file"
                    type="file"
                    accept="image/*"
                    @change="${this._imagePicked}"
                  />
                `
              : nothing
          }
          ${
            this.downloadable
              ? html`
                  <button
                    type="button"
                    class="hax-ui-btn"
                    @click="${() => this.download()}"
                  >
                    <simple-icon-lite
                      icon="${HaxUiAdminIcons.download}"
                    ></simple-icon-lite>
                    ${this.t.download}
                  </button>
                `
              : nothing
          }
          <button
            type="button"
            class="hax-ui-btn danger"
            ?disabled="${!this._canUndo && !this.value}"
            @click="${() => (this._confirmClear = true)}"
          >
            <simple-icon-lite
              icon="${HaxUiAdminIcons.delete}"
            ></simple-icon-lite>
            ${this.t.clear}
          </button>
        </div>
      </div>
      <div class="stage">
        <div
          class="paper"
          style="aspect-ratio:${this._surfaceW} / ${this._surfaceH}"
        >
          ${
            this.src
              ? html`<img class="bg" src="${this.src}" alt="" />`
              : nothing
          }
          <canvas
            class="layer"
            width="${this._surfaceW}"
            height="${this._surfaceH}"
          ></canvas>
          <canvas
            class="live"
            width="${this._surfaceW}"
            height="${this._surfaceH}"
            role="img"
            aria-label="${this.label || this.t.surface}"
            data-tool="${this.tool}"
            style="opacity:${this._liveOpacity()}"
            @pointerdown="${this._down}"
            @pointermove="${this._move}"
            @pointerup="${this._up}"
            @pointercancel="${this._up}"
          ></canvas>
          ${
            this.mode === "signature"
              ? html`<span class="sign-hint">${this.t.signHere}</span>`
              : nothing
          }
          ${this._text ? this._renderTextEntry() : nothing}
        </div>
      </div>
      <div class="status">
        ${
          this._confirmClear
            ? html`
                <span class="confirm" role="alert">
                  ${this.t.clearConfirm}
                  <button
                    type="button"
                    class="hax-ui-btn danger-fill"
                    @click="${this._clearYes}"
                  >
                    ${this.t.clearYes}
                  </button>
                  <button
                    type="button"
                    class="hax-ui-btn ghost"
                    @click="${() => (this._confirmClear = false)}"
                  >
                    ${this.t.cancel}
                  </button>
                </span>
              `
            : html`<span aria-live="polite">${this._hint()}</span>`
        }
        <span class="dims">${this._surfaceW} × ${this._surfaceH}</span>
      </div>
    `;
  }

  _glyph(name) {
    return html`<svg class="glyph" viewBox="0 0 24 24" aria-hidden="true">
      <path d="${TOOL_GLYPHS[name]}"></path>
    </svg>`;
  }

  _palette() {
    // signatures take ink colors only
    const list =
      this.mode === "signature"
        ? PALETTE.filter((p) =>
            ["coalyGray", "nittanyNavy", "beaverBlue"].includes(p[0]),
          )
        : PALETTE;
    return list.map((p) => ({ hex: p[1], label: this.t[p[0]] }));
  }

  _hint() {
    if (this._status) return this._status;
    if (this.tool === "text") return this.t.textHint;
    if (["line", "arrow", "box", "circle"].includes(this.tool))
      return this.t.shapeHint;
    return this.t[this.tool];
  }

  /** the in-progress mark previews at the opacity it will be saved at */
  _liveOpacity() {
    if (this.tool === "eraser" || this.mode === "signature") return 1;
    return this.opacity / 100;
  }

  _renderTextEntry() {
    const scale = this._displayScale();
    return html`<textarea
      class="text-entry"
      rows="1"
      aria-label="${this.t.text}"
      style="left:${(this._text.x / this._surfaceW) * 100}%;top:${
        (this._text.y / this._surfaceH) * 100
      }%;font-size:${this._fontPx() * scale}px;color:${
        this.color
      };opacity:${this.opacity / 100}"
      @keydown="${this._textKey}"
      @blur="${() => this._commitText()}"
    ></textarea>`;
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) super.firstUpdated(changedProperties);
    this._layer = this.shadowRoot.querySelector("canvas.layer");
    this._live = this.shadowRoot.querySelector("canvas.live");
    this._ready = true;
    this._applyModeDefaults();
    this._setupSurface();
  }

  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    if (!this._ready) return;
    if (changedProperties.has("mode") && changedProperties.get("mode")) {
      this._applyModeDefaults();
    }
    if (
      ["src", "value", "mode", "width", "height"].some(
        (p) =>
          changedProperties.has(p) && changedProperties.get(p) !== undefined,
      )
    ) {
      this._setupSurface();
    }
  }

  _applyModeDefaults() {
    const d = MODE_DEFAULTS[this.mode] || MODE_DEFAULTS.draw;
    if (!this.tools.includes(this.tool)) this.tool = d.tool;
    this.color = d.color;
    this.size = d.size;
    this.opacity = 100;
  }

  /**
   * size the surface (from the background image, or width/height) and
   * load the saved marks into the layer
   */
  async _setupSurface() {
    const run = (this._setupRun = (this._setupRun || 0) + 1);
    const d = MODE_DEFAULTS[this.mode] || MODE_DEFAULTS.draw;
    let w = this.width || d.width;
    let h = this.height || d.height;
    if (this.src) {
      const bg = await this._loadImage(this.src, false);
      if (bg && bg.naturalWidth) {
        const scale = Math.min(
          1,
          MAX_SIDE / Math.max(bg.naturalWidth, bg.naturalHeight),
        );
        w = Math.round(bg.naturalWidth * scale);
        h = Math.round(bg.naturalHeight * scale);
      }
    }
    if (run !== this._setupRun) return;
    this._surfaceW = w;
    this._surfaceH = h;
    await this.updateComplete;
    const ctx = this._layer.getContext("2d", { willReadFrequently: true });
    ctx.clearRect(0, 0, w, h);
    if (this.value) {
      const marks = await this._loadImage(this.value, false);
      if (run !== this._setupRun) return;
      if (marks) ctx.drawImage(marks, 0, 0, w, h);
    }
    this._undo = [ctx.getImageData(0, 0, w, h)];
    this._redo = [];
    this.dirty = false;
    this._syncHistory();
  }

  _loadImage(src, cors) {
    return new Promise((resolve) => {
      const img = new Image();
      if (cors) img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }

  setTool(tool) {
    this._commitText();
    const wasTranslucent = TRANSLUCENT_TOOLS.includes(this.tool);
    this.tool = tool;
    // a highlighter, box or circle that starts solid hides what it marks
    if (TRANSLUCENT_TOOLS.includes(tool) && this.opacity === 100) {
      this.opacity = 40;
    } else if (
      wasTranslucent &&
      !TRANSLUCENT_TOOLS.includes(tool) &&
      this.opacity === 40
    ) {
      this.opacity = 100;
    }
  }

  setColor(hex) {
    this.color = hex.toLowerCase();
    if (this.tool === "eraser") this.setTool("pen");
  }

  _toolbarKey(e) {
    // keep shortcuts from firing while typing in a toolbar field
    e.stopPropagation();
  }

  connectedCallback() {
    super.connectedCallback();
    this._keyHandler = this._key.bind(this);
    this.addEventListener("keydown", this._keyHandler);
  }

  disconnectedCallback() {
    this.removeEventListener("keydown", this._keyHandler);
    super.disconnectedCallback();
  }

  _key(e) {
    if (this._text) return;
    const k = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && k === "z") {
      e.preventDefault();
      if (e.shiftKey) this.redo();
      else this.undo();
      return;
    }
    if ((e.ctrlKey || e.metaKey) && k === "y") {
      e.preventDefault();
      this.redo();
      return;
    }
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (k === "[") this.size = Math.max(1, this.size - 1);
    if (k === "]") this.size = Math.min(48, this.size + 1);
  }

  _point(e) {
    const r = this._live.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) * this._surfaceW) / r.width,
      y: ((e.clientY - r.top) * this._surfaceH) / r.height,
      p: e.pressure && e.pointerType === "pen" ? e.pressure : 0.5,
    };
  }

  _displayScale() {
    if (!this._live) return 1;
    const r = this._live.getBoundingClientRect();
    return r.width ? r.width / this._surfaceW : 1;
  }

  _fontPx() {
    return 12 + this.size * 2;
  }

  _width() {
    return this.tool === "highlighter" ? this.size * 3 : this.size;
  }

  _style(ctx) {
    ctx.lineCap = this.tool === "highlighter" ? "square" : "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = this._width();
    ctx.strokeStyle = this.color;
    ctx.fillStyle = this.color;
  }

  _down(e) {
    if (e.button > 0) return;
    e.preventDefault();
    this._confirmClear = false;
    this._status = "";
    const pt = this._point(e);
    if (this.tool === "text") {
      this._commitText();
      this._openText(pt);
      return;
    }
    this._live.setPointerCapture(e.pointerId);
    if (this.tool === "fill") {
      this._flood(Math.floor(pt.x), Math.floor(pt.y));
      this._commit();
      return;
    }
    this._drawing = true;
    this._start = pt;
    this._last = pt;
    this._mid = pt;
    if (this.tool === "eraser") {
      const ctx = this._layer.getContext("2d");
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineCap = "round";
      ctx.lineWidth = this.size * 2;
      ctx.beginPath();
      ctx.moveTo(pt.x, pt.y);
      ctx.lineTo(pt.x + 0.01, pt.y);
      ctx.stroke();
      ctx.restore();
    } else if (this.tool === "pen" || this.tool === "highlighter") {
      const ctx = this._live.getContext("2d");
      this._style(ctx);
      ctx.lineWidth = this._penWidth(pt);
      ctx.beginPath();
      ctx.moveTo(pt.x, pt.y);
      ctx.lineTo(pt.x + 0.01, pt.y);
      ctx.stroke();
    }
  }

  /** signatures follow pen pressure; other modes keep an even line */
  _penWidth(pt) {
    if (this.mode !== "signature") return this._width();
    return Math.max(1, this.size * (0.6 + pt.p * 0.8));
  }

  _move(e) {
    if (!this._drawing) return;
    const events =
      e.getCoalescedEvents && e.getCoalescedEvents().length
        ? e.getCoalescedEvents()
        : [e];
    if (this.tool === "eraser") {
      const ctx = this._layer.getContext("2d");
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = this.size * 2;
      events.forEach((ev) => {
        const pt = this._point(ev);
        ctx.beginPath();
        ctx.moveTo(this._last.x, this._last.y);
        ctx.lineTo(pt.x, pt.y);
        ctx.stroke();
        this._last = pt;
      });
      ctx.restore();
    } else if (this.tool === "pen" || this.tool === "highlighter") {
      const ctx = this._live.getContext("2d");
      this._style(ctx);
      events.forEach((ev) => {
        const pt = this._point(ev);
        // smooth: a curve from the last midpoint to the next, through the
        // last real point
        const mid = {
          x: (this._last.x + pt.x) / 2,
          y: (this._last.y + pt.y) / 2,
        };
        ctx.lineWidth = this._penWidth(pt);
        ctx.beginPath();
        ctx.moveTo(this._mid.x, this._mid.y);
        ctx.quadraticCurveTo(this._last.x, this._last.y, mid.x, mid.y);
        ctx.stroke();
        this._last = pt;
        this._mid = mid;
      });
    } else {
      const ctx = this._live.getContext("2d");
      ctx.clearRect(0, 0, this._surfaceW, this._surfaceH);
      this._shape(ctx, this._start, this._point(e), e.shiftKey);
    }
  }

  _up(e) {
    if (!this._drawing) return;
    this._drawing = false;
    if (["line", "arrow", "box", "circle"].includes(this.tool)) {
      const ctx = this._live.getContext("2d");
      ctx.clearRect(0, 0, this._surfaceW, this._surfaceH);
      this._shape(ctx, this._start, this._point(e), e.shiftKey);
    }
    if (this.tool !== "eraser") this._flattenLive();
    this._commit();
  }

  /** move the in-progress mark onto the layer at the chosen opacity */
  _flattenLive() {
    const ctx = this._layer.getContext("2d");
    ctx.save();
    ctx.globalAlpha = this._liveOpacity();
    ctx.drawImage(this._live, 0, 0);
    ctx.restore();
    this._live.getContext("2d").clearRect(0, 0, this._surfaceW, this._surfaceH);
  }

  _shape(ctx, a, b, lock) {
    this._style(ctx);
    let w = b.x - a.x;
    let h = b.y - a.y;
    if (lock && (this.tool === "line" || this.tool === "arrow")) {
      // snap to 45 degree steps
      const ang = Math.round(Math.atan2(h, w) / (Math.PI / 4)) * (Math.PI / 4);
      const len = Math.hypot(w, h);
      w = Math.cos(ang) * len;
      h = Math.sin(ang) * len;
    } else if (lock) {
      const m = Math.max(Math.abs(w), Math.abs(h));
      w = (w < 0 ? -1 : 1) * m;
      h = (h < 0 ? -1 : 1) * m;
    }
    ctx.beginPath();
    if (this.tool === "line" || this.tool === "arrow") {
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(a.x + w, a.y + h);
      if (this.tool === "arrow") {
        const ang = Math.atan2(h, w);
        const head = Math.max(14, this.size * 4);
        const tipX = a.x + w;
        const tipY = a.y + h;
        ctx.moveTo(tipX, tipY);
        ctx.lineTo(
          tipX - head * Math.cos(ang - Math.PI / 7),
          tipY - head * Math.sin(ang - Math.PI / 7),
        );
        ctx.moveTo(tipX, tipY);
        ctx.lineTo(
          tipX - head * Math.cos(ang + Math.PI / 7),
          tipY - head * Math.sin(ang + Math.PI / 7),
        );
      }
      ctx.stroke();
    } else if (this.tool === "box") {
      ctx.fillRect(a.x, a.y, w, h);
    } else if (this.tool === "circle") {
      ctx.ellipse(
        a.x + w / 2,
        a.y + h / 2,
        Math.abs(w / 2),
        Math.abs(h / 2),
        0,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
  }

  async _openText(pt) {
    this._text = { x: pt.x, y: pt.y };
    await this.updateComplete;
    const entry = this.shadowRoot.querySelector("textarea.text-entry");
    if (entry) entry.focus();
  }

  _textKey(e) {
    e.stopPropagation();
    if (e.key === "Escape") {
      e.preventDefault();
      this._text = null;
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      this._commitText();
    }
  }

  _commitText() {
    if (!this._text) return;
    const entry = this.shadowRoot.querySelector("textarea.text-entry");
    const value = entry ? entry.value : "";
    const at = this._text;
    this._text = null;
    if (!value.trim()) return;
    const ctx = this._layer.getContext("2d");
    const px = this._fontPx();
    const family =
      getComputedStyle(this).getPropertyValue("--ddd-font-primary").trim() ||
      "Roboto, sans-serif";
    ctx.save();
    ctx.globalAlpha = this.opacity / 100;
    ctx.fillStyle = this.color;
    ctx.textBaseline = "top";
    ctx.font = `700 ${px}px ${family}`;
    value.split("\n").forEach((line, i) => {
      ctx.fillText(line, at.x, at.y + i * px * 1.25);
    });
    ctx.restore();
    this._commit();
  }

  _flood(x, y) {
    const W = this._surfaceW;
    const H = this._surfaceH;
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    const ctx = this._layer.getContext("2d", { willReadFrequently: true });
    const img = ctx.getImageData(0, 0, W, H);
    const d = img.data;
    const i0 = (y * W + x) * 4;
    const target = [d[i0], d[i0 + 1], d[i0 + 2], d[i0 + 3]];
    const hex = this.color.replace("#", "");
    const fill = [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16),
      Math.round((255 * this.opacity) / 100),
    ];
    const same = (i, c) =>
      Math.abs(d[i] - c[0]) +
        Math.abs(d[i + 1] - c[1]) +
        Math.abs(d[i + 2] - c[2]) +
        Math.abs(d[i + 3] - c[3]) <=
      48;
    if (same(i0, fill) && target[3] === fill[3]) return;
    const seen = new Uint8Array(W * H);
    const stack = [x, y];
    while (stack.length) {
      const cy = stack.pop();
      let lx = stack.pop();
      while (
        lx > 0 &&
        !seen[cy * W + lx - 1] &&
        same((cy * W + lx - 1) * 4, target)
      )
        lx--;
      let up = false;
      let down = false;
      for (let px = lx; px < W; px++) {
        const p = cy * W + px;
        const i = p * 4;
        if (seen[p] || !same(i, target)) break;
        seen[p] = 1;
        d[i] = fill[0];
        d[i + 1] = fill[1];
        d[i + 2] = fill[2];
        d[i + 3] = fill[3];
        if (cy > 0) {
          const u = p - W;
          if (!seen[u] && same(u * 4, target)) {
            if (!up) {
              stack.push(px, cy - 1);
              up = true;
            }
          } else up = false;
        }
        if (cy < H - 1) {
          const v = p + W;
          if (!seen[v] && same(v * 4, target)) {
            if (!down) {
              stack.push(px, cy + 1);
              down = true;
            }
          } else down = false;
        }
      }
    }
    ctx.putImageData(img, 0, 0);
  }

  _commit() {
    const ctx = this._layer.getContext("2d", { willReadFrequently: true });
    this._undo.push(ctx.getImageData(0, 0, this._surfaceW, this._surfaceH));
    if (this._undo.length > HISTORY_LIMIT + 1) this._undo.shift();
    this._redo = [];
    this.dirty = true;
    this._syncHistory();
    this._changed();
  }

  _syncHistory() {
    this._canUndo = this._undo.length > 1;
    this._canRedo = this._redo.length > 0;
  }

  _changed() {
    this.dispatchEvent(
      new CustomEvent("doodle-board-change", {
        bubbles: true,
        composed: true,
        detail: { dirty: this.dirty },
      }),
    );
  }

  undo() {
    if (this._undo.length < 2) return;
    this._redo.push(this._undo.pop());
    this._layer
      .getContext("2d")
      .putImageData(this._undo[this._undo.length - 1], 0, 0);
    this.dirty = true;
    this._syncHistory();
    this._changed();
  }

  redo() {
    if (!this._redo.length) return;
    const state = this._redo.pop();
    this._undo.push(state);
    this._layer.getContext("2d").putImageData(state, 0, 0);
    this.dirty = true;
    this._syncHistory();
    this._changed();
  }

  _clearYes() {
    this._confirmClear = false;
    this.clear();
    this._status = this.t.cleared;
  }

  /** remove every mark; undo brings them back */
  clear() {
    this._text = null;
    this._layer
      .getContext("2d")
      .clearRect(0, 0, this._surfaceW, this._surfaceH);
    this._commit();
  }

  /** true when the layer has no marks */
  isEmpty() {
    const d = this._layer
      .getContext("2d", { willReadFrequently: true })
      .getImageData(0, 0, this._surfaceW, this._surfaceH).data;
    for (let i = 3; i < d.length; i += 4) {
      if (d[i] !== 0) return false;
    }
    return true;
  }

  /** the marks as a transparent PNG data URL, or "" when empty */
  getValue() {
    this._commitText();
    return this.isEmpty() ? "" : this._layer.toDataURL("image/png");
  }

  /**
   * the background (white paper outside signature mode) with the marks
   * on top, as a PNG blob
   */
  async toBlob() {
    this._commitText();
    const out = document.createElement("canvas");
    out.width = this._surfaceW;
    out.height = this._surfaceH;
    const ctx = out.getContext("2d");
    let layerOnly = false;
    if (this.src) {
      const bg = await this._loadImage(this.src, !this.src.startsWith("data:"));
      if (bg) ctx.drawImage(bg, 0, 0, out.width, out.height);
      else layerOnly = true;
    } else if (this.mode !== "signature") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, out.width, out.height);
    }
    ctx.drawImage(this._layer, 0, 0);
    const blob = await new Promise((resolve) => {
      try {
        out.toBlob(resolve, "image/png");
      } catch {
        // the background came from a site that does not allow reuse
        resolve(null);
      }
    });
    if (blob) return { blob, layerOnly };
    const marks = await new Promise((resolve) =>
      this._layer.toBlob(resolve, "image/png"),
    );
    return { blob: marks, layerOnly: true };
  }

  /** save the picture as a PNG file */
  async download() {
    const result = await this.toBlob();
    if (!result.blob) return;
    if (result.layerOnly && this.src) this._status = this.t.downloadLayerOnly;
    const filename = `${this.filename || "doodle"}.png`;
    const evt = new CustomEvent("doodle-board-download", {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: { blob: result.blob, filename },
    });
    this.dispatchEvent(evt);
    if (evt.defaultPrevented) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  _pickImage() {
    this.shadowRoot.querySelector("#file").click();
  }

  _imagePicked(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      // keep what is drawn so far: it is reloaded onto the new surface
      this.value = this.getValue();
      this.src = reader.result;
      this.dispatchEvent(
        new CustomEvent("doodle-board-background", {
          bubbles: true,
          composed: true,
          detail: { src: this.src },
        }),
      );
    };
    reader.readAsDataURL(file);
  }
}

globalThis.customElements.define(DoodleBoardCanvas.tag, DoodleBoardCanvas);
