/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 *
 * DDD pan and zoom viewport: move around a large SVG (a graph, a map, a
 * diagram) by changing its viewBox, plus the corner zoom controls that go
 * with it. One helper so every block that needs it pans, zooms and fits the
 * same way.
 *
 * Input it handles, on the svg element:
 *   - drag (mouse, pen or one finger) pans
 *   - two finger pinch zooms around the fingers
 *   - Ctrl + wheel (Cmd + wheel on macOS, and trackpad pinch, which
 *     browsers report as Ctrl + wheel) zooms around the pointer. A plain
 *     wheel is left alone so the page still scrolls past the block.
 *   - keyboard, when the svg has focus (give it tabindex="0", a role and an
 *     accessible name): arrow keys pan, + and - zoom, 0 fits
 * The zoom buttons (+, -, fit) are always there too, so nothing depends on
 * a gesture.
 *
 * Standalone on purpose, like DDDBlock.js and DDDChart.js: it adds no
 * exports to d-d-d.js or DDDStyles.js. Import it directly:
 *
 *   import {
 *     DDDViewport,
 *     DDDViewportStyles,
 *     renderDDDZoomControls,
 *   } from "@haxtheweb/d-d-d/lib/DDDViewport.js";
 *
 *   static get styles() { return [super.styles, DDDViewportStyles]; }
 *   constructor() {
 *     super();
 *     // a Lit reactive controller: it attaches when the host connects and
 *     // removes its listeners when the host disconnects
 *     this.viewport = new DDDViewport(this, {
 *       target: () => this.shadowRoot.querySelector("svg"),
 *       fit: { x: 0, y: 0, width: 800, height: 600 },
 *     });
 *   }
 *   firstUpdated() { this.viewport.attach(); }
 *   render() {
 *     return html`<div class="ddd-viewport">
 *       <svg viewBox="0 0 800 600" tabindex="0" role="img"
 *         aria-label="${this.t.graph}">...</svg>
 *       ${renderDDDZoomControls({
 *         onZoomIn: () => this.viewport.zoomIn(),
 *         onZoomOut: () => this.viewport.zoomOut(),
 *         onFit: () => this.viewport.fit(),
 *         labels: { zoomIn: this.t.zoomIn, zoomOut: this.t.zoomOut,
 *           fit: this.t.fit, group: this.t.zoom },
 *       })}
 *     </div>`;
 *   }
 *
 * Without Lit: new DDDViewport(null, { target: svgElement }).attach(), and
 * call detach() when done.
 *
 * Options: target (an svg element or a function returning one), fit (the
 * viewBox fit() returns to; defaults to the svg viewBox when attached),
 * minScale (0.5) and maxScale (8) relative to fit, step (1.25, the factor
 * for one button press or key), panStep (0.1 of the view per arrow key),
 * onChange(view) called after every change.
 *
 * Every change also fires ddd-viewport-change on the svg (bubbles, composed)
 * with detail { x, y, width, height, scale }.
 *
 * CSS: .ddd-viewport (the positioned frame), its svg (touch-action: none so
 * the helper gets touch gestures; grab and grabbing cursors), and
 * .ddd-viewport-controls (a column of .ddd-block-action buttons in the
 * corner). DDDViewportStyles includes DDDBlockStyles for the buttons.
 */
import { html, css } from "lit";
import { DDDBlockStyles } from "./DDDBlock.js";

// pixels a pointer moves before a press becomes a pan
const DRAG_THRESHOLD = 4;

const DEFAULT_LABELS = {
  group: "Zoom",
  zoomIn: "Zoom in",
  zoomOut: "Zoom out",
  fit: "Fit to view",
};

function parseViewBox(value) {
  if (!value) {
    return null;
  }
  const parts = String(value)
    .trim()
    .split(/[\s,]+/)
    .map(Number);
  if (parts.length !== 4 || parts.some((p) => !Number.isFinite(p))) {
    return null;
  }
  if (parts[2] <= 0 || parts[3] <= 0) {
    return null;
  }
  return { x: parts[0], y: parts[1], width: parts[2], height: parts[3] };
}

function validBox(b) {
  return !!(
    b &&
    Number.isFinite(b.x) &&
    Number.isFinite(b.y) &&
    Number.isFinite(b.width) &&
    Number.isFinite(b.height) &&
    b.width > 0 &&
    b.height > 0
  );
}

export class DDDViewport {
  /**
   * @param {ReactiveControllerHost|null} host a Lit host, or null
   * @param {Object} [options] see the file header
   */
  constructor(host, options) {
    const o = options || {};
    this.host = host || null;
    this.options = {
      target: o.target || null,
      fit: validBox(o.fit) ? { ...o.fit } : null,
      minScale: Number(o.minScale) > 0 ? Number(o.minScale) : 0.5,
      maxScale: Number(o.maxScale) > 0 ? Number(o.maxScale) : 8,
      step: Number(o.step) > 1 ? Number(o.step) : 1.25,
      panStep: Number(o.panStep) > 0 ? Number(o.panStep) : 0.1,
      onChange: typeof o.onChange === "function" ? o.onChange : null,
    };
    this.svg = null;
    this.view = null;
    this._pointers = new Map();
    this._pinch = null;
    this._dragging = false;
    this._abort = null;
    if (this.host && typeof this.host.addController === "function") {
      this.host.addController(this);
    }
  }

  hostConnected() {
    // the svg usually renders after connect; the host calls attach() in
    // firstUpdated. Reattach when the host comes back into the page.
    if (this.svg) {
      this.attach(this.svg);
    }
  }

  hostDisconnected() {
    this._removeListeners();
  }

  _resolveTarget(target) {
    let t = target || this.options.target;
    if (typeof t === "function") {
      t = t();
    }
    return t && typeof t.setAttribute === "function" ? t : null;
  }

  /**
   * Start handling input on the svg (the target option when none is given).
   * Safe to call again; it never adds listeners twice.
   * @param {SVGSVGElement} [target]
   * @returns {Boolean} whether there was an svg to attach to
   */
  attach(target) {
    const svg = this._resolveTarget(target);
    if (!svg) {
      return false;
    }
    this._removeListeners();
    this.svg = svg;
    const current = parseViewBox(svg.getAttribute("viewBox"));
    if (!this.options.fit) {
      this.options.fit = current || this._contentBox();
    }
    this.view = current || (this.options.fit ? { ...this.options.fit } : null);
    if (this.view) {
      this._apply(false);
    }
    this._abort = new AbortController();
    const signal = this._abort.signal;
    svg.addEventListener("pointerdown", (e) => this._down(e), { signal });
    svg.addEventListener("pointermove", (e) => this._move(e), { signal });
    svg.addEventListener("pointerup", (e) => this._up(e), { signal });
    svg.addEventListener("pointercancel", (e) => this._up(e), { signal });
    svg.addEventListener("wheel", (e) => this._wheel(e), {
      signal,
      passive: false,
    });
    svg.addEventListener("keydown", (e) => this._key(e), { signal });
    return true;
  }

  /** stop handling input; the current viewBox stays */
  detach() {
    this._removeListeners();
    this.svg = null;
  }

  _removeListeners() {
    if (this._abort) {
      this._abort.abort();
      this._abort = null;
    }
    this._pointers.clear();
    this._pinch = null;
    this._dragging = false;
    if (this.svg) {
      this.svg.removeAttribute("data-panning");
    }
  }

  _contentBox() {
    if (!this.svg || typeof this.svg.getBBox !== "function") {
      return null;
    }
    try {
      const b = this.svg.getBBox();
      return validBox(b)
        ? { x: b.x, y: b.y, width: b.width, height: b.height }
        : null;
    } catch {
      return null;
    }
  }

  /** current zoom relative to the fit box (1 is fitted) */
  get scale() {
    if (!this.view || !this.options.fit) {
      return 1;
    }
    return this.options.fit.width / this.view.width;
  }

  // client (screen) point to svg user units
  _toSvg(clientX, clientY) {
    const svg = this.svg;
    const m =
      svg && typeof svg.getScreenCTM === "function" ? svg.getScreenCTM() : null;
    if (m && globalThis.DOMPoint) {
      const p = new globalThis.DOMPoint(clientX, clientY).matrixTransform(
        m.inverse(),
      );
      return { x: p.x, y: p.y };
    }
    const r = svg.getBoundingClientRect();
    const v = this.view;
    return {
      x: v.x + ((clientX - r.left) / (r.width || 1)) * v.width,
      y: v.y + ((clientY - r.top) / (r.height || 1)) * v.height,
    };
  }

  // svg user units per screen pixel
  _unitsPerPixel() {
    const svg = this.svg;
    const m =
      svg && typeof svg.getScreenCTM === "function" ? svg.getScreenCTM() : null;
    if (m && m.a) {
      return 1 / m.a;
    }
    const r = svg.getBoundingClientRect();
    return this.view.width / (r.width || 1);
  }

  _apply(notify) {
    if (!this.svg || !this.view) {
      return;
    }
    const v = this.view;
    const round = (n) => Math.round(n * 1000) / 1000;
    this.svg.setAttribute(
      "viewBox",
      `${round(v.x)} ${round(v.y)} ${round(v.width)} ${round(v.height)}`,
    );
    if (notify === false) {
      return;
    }
    const detail = { ...v, scale: this.scale };
    if (this.options.onChange) {
      this.options.onChange(detail);
    }
    this.svg.dispatchEvent(
      new CustomEvent("ddd-viewport-change", {
        bubbles: true,
        composed: true,
        detail,
      }),
    );
  }

  /**
   * Zoom by a factor (above 1 zooms in) around a point in svg units, the
   * middle of the view by default. Clamped to minScale and maxScale.
   * @param {Number} factor
   * @param {{x: Number, y: Number}} [point]
   */
  zoomBy(factor, point) {
    if (!this.view || !(Number(factor) > 0)) {
      return;
    }
    const v = this.view;
    const fit = this.options.fit || v;
    const minW = fit.width / this.options.maxScale;
    const maxW = fit.width / this.options.minScale;
    const width = Math.min(maxW, Math.max(minW, v.width / factor));
    const k = v.width / width;
    if (k === 1) {
      return;
    }
    const p = point || { x: v.x + v.width / 2, y: v.y + v.height / 2 };
    this.view = {
      x: p.x - (p.x - v.x) / k,
      y: p.y - (p.y - v.y) / k,
      width,
      height: v.height / k,
    };
    this._apply();
  }

  zoomIn() {
    this.zoomBy(this.options.step);
  }

  zoomOut() {
    this.zoomBy(1 / this.options.step);
  }

  /**
   * Pan by an amount in svg user units.
   * @param {Number} dx
   * @param {Number} dy
   */
  panBy(dx, dy) {
    if (!this.view) {
      return;
    }
    this.view = {
      ...this.view,
      x: this.view.x + (Number(dx) || 0),
      y: this.view.y + (Number(dy) || 0),
    };
    this._apply();
  }

  /** go back to the fit box */
  fit() {
    const box = this.options.fit || this._contentBox();
    if (!validBox(box)) {
      return;
    }
    this.view = { x: box.x, y: box.y, width: box.width, height: box.height };
    this._apply();
  }

  /**
   * Set the viewBox directly (for example to centre a selected node).
   * @param {{x: Number, y: Number, width: Number, height: Number}} box
   */
  setView(box) {
    if (!validBox(box)) {
      return;
    }
    this.view = { x: box.x, y: box.y, width: box.width, height: box.height };
    this._apply();
  }

  _down(e) {
    if (e.pointerType === "mouse" && e.button !== 0) {
      return;
    }
    this._pointers.set(e.pointerId, {
      x: e.clientX,
      y: e.clientY,
      startX: e.clientX,
      startY: e.clientY,
    });
    if (this._pointers.size === 2) {
      this._pinch = this._pinchState();
      this._startDrag(e.pointerId);
    }
  }

  // capture the pointer only once it really drags, so a click on a node
  // inside the svg still reaches that node
  _startDrag(pointerId) {
    if (!this._dragging) {
      this._dragging = true;
      this.svg.setAttribute("data-panning", "");
    }
    if (typeof this.svg.setPointerCapture === "function") {
      try {
        this.svg.setPointerCapture(pointerId);
      } catch {
        // the pointer may already be gone; panning still works without it
      }
    }
  }

  _pinchState() {
    const pts = Array.from(this._pointers.values());
    const dx = pts[0].x - pts[1].x;
    const dy = pts[0].y - pts[1].y;
    return {
      distance: Math.hypot(dx, dy),
      cx: (pts[0].x + pts[1].x) / 2,
      cy: (pts[0].y + pts[1].y) / 2,
    };
  }

  _move(e) {
    const last = this._pointers.get(e.pointerId);
    if (!last || !this.view) {
      return;
    }
    this._pointers.set(e.pointerId, {
      ...last,
      x: e.clientX,
      y: e.clientY,
    });
    if (this._pointers.size >= 2 && this._pinch) {
      const next = this._pinchState();
      if (this._pinch.distance > 0 && next.distance > 0) {
        const upp = this._unitsPerPixel();
        this.panBy(
          (this._pinch.cx - next.cx) * upp,
          (this._pinch.cy - next.cy) * upp,
        );
        this.zoomBy(
          next.distance / this._pinch.distance,
          this._toSvg(next.cx, next.cy),
        );
      }
      this._pinch = next;
      e.preventDefault();
      return;
    }
    if (!this._dragging) {
      const moved = Math.hypot(
        e.clientX - last.startX,
        e.clientY - last.startY,
      );
      if (moved < DRAG_THRESHOLD) {
        return;
      }
      this._startDrag(e.pointerId);
    }
    const upp = this._unitsPerPixel();
    this.panBy((last.x - e.clientX) * upp, (last.y - e.clientY) * upp);
    e.preventDefault();
  }

  _up(e) {
    this._pointers.delete(e.pointerId);
    this._pinch = this._pointers.size === 2 ? this._pinchState() : null;
    if (this._pointers.size === 0) {
      this._dragging = false;
      if (this.svg) {
        this.svg.removeAttribute("data-panning");
      }
    }
  }

  _wheel(e) {
    if (!(e.ctrlKey || e.metaKey) || !this.view) {
      return;
    }
    e.preventDefault();
    // deltaMode 1 is lines, 2 is pages; normalise to pixels
    const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 400 : 1;
    const delta = Math.max(-100, Math.min(100, e.deltaY * unit));
    this.zoomBy(Math.exp(-delta / 200), this._toSvg(e.clientX, e.clientY));
  }

  _key(e) {
    // only when the svg itself has focus, so a focused node inside it can
    // use the arrow keys for its own navigation
    if (e.target !== this.svg || !this.view) {
      return;
    }
    if (e.altKey || e.ctrlKey || e.metaKey) {
      return;
    }
    const sx = this.view.width * this.options.panStep;
    const sy = this.view.height * this.options.panStep;
    let handled = true;
    switch (e.key) {
      case "ArrowLeft":
        this.panBy(-sx, 0);
        break;
      case "ArrowRight":
        this.panBy(sx, 0);
        break;
      case "ArrowUp":
        this.panBy(0, -sy);
        break;
      case "ArrowDown":
        this.panBy(0, sy);
        break;
      case "+":
      case "=":
        this.zoomIn();
        break;
      case "-":
      case "_":
        this.zoomOut();
        break;
      case "0":
        this.fit();
        break;
      default:
        handled = false;
    }
    if (handled) {
      e.preventDefault();
    }
  }
}

/**
 * The corner zoom controls: zoom in, zoom out and fit, as .ddd-block-action
 * buttons in a labelled group. Put it inside .ddd-viewport after the svg.
 * @param {Object} o
 * @param {Function} o.onZoomIn
 * @param {Function} o.onZoomOut
 * @param {Function} o.onFit
 * @param {Object} [o.labels] { group, zoomIn, zoomOut, fit }, translated
 * @returns {TemplateResult}
 */
export function renderDDDZoomControls(o) {
  const opts = o || {};
  const labels = { ...DEFAULT_LABELS, ...(opts.labels || {}) };
  const noop = () => {};
  return html`<div
    class="ddd-viewport-controls"
    role="group"
    aria-label="${labels.group}"
  >
    <button
      type="button"
      class="ddd-block-action"
      aria-label="${labels.zoomIn}"
      title="${labels.zoomIn}"
      @click="${opts.onZoomIn || noop}"
    >
      <simple-icon-lite icon="icons:add" aria-hidden="true"></simple-icon-lite>
    </button>
    <button
      type="button"
      class="ddd-block-action"
      aria-label="${labels.zoomOut}"
      title="${labels.zoomOut}"
      @click="${opts.onZoomOut || noop}"
    >
      <simple-icon-lite
        icon="icons:remove"
        aria-hidden="true"
      ></simple-icon-lite>
    </button>
    <button
      type="button"
      class="ddd-block-action"
      aria-label="${labels.fit}"
      title="${labels.fit}"
      @click="${opts.onFit || noop}"
    >
      <simple-icon-lite
        icon="maps:zoom-out-map"
        aria-hidden="true"
      ></simple-icon-lite>
    </button>
  </div>`;
}

export const DDDViewportStyles = [
  DDDBlockStyles,
  css`
    .ddd-viewport {
      position: relative;
      overflow: hidden;
      min-height: 0;
    }
    .ddd-viewport > svg {
      display: block;
      width: 100%;
      height: 100%;
      touch-action: none;
      cursor: grab;
      user-select: none;
    }
    .ddd-viewport > svg[data-panning] {
      cursor: grabbing;
    }
    .ddd-viewport > svg:focus-visible {
      outline: var(--ddd-focus-ring);
      outline-offset: calc(-1 * var(--ddd-focus-offset));
    }
    .ddd-viewport-controls {
      position: absolute;
      inset-block-end: var(--ddd-spacing-3);
      inset-inline-end: var(--ddd-spacing-3);
      z-index: 1;
      display: flex;
      flex-direction: column;
      gap: var(--ddd-spacing-1);
    }
    .ddd-viewport-controls .ddd-block-action {
      background-color: light-dark(
        var(--ddd-theme-default-white),
        var(--ddd-theme-default-coalyGray)
      );
      box-shadow: var(--ddd-boxShadow-sm);
    }
    @media print {
      .ddd-viewport-controls {
        display: none;
      }
    }
  `,
];
