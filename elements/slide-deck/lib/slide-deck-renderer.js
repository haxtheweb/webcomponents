/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */

/**
 * Thin wrapper around the browser build of @aiden0z/pptx-renderer.
 *
 * Kept in its own module so `slide-deck` can dynamically import it only once a
 * deck is actually on screen; the renderer bundle is ~1.5MB and must never load
 * for a page that merely contains a deck further down.
 *
 * Only the low level API is used (parse -> build -> render a single slide) so
 * all navigation and chrome stays in slide-deck.
 */
export class DeckRenderer {
  /**
   * Parse a .pptx and prepare it for per slide rendering.
   * @param {string} pptxUrl absolute URL of the source presentation
   * @returns {Promise<DeckRenderer>}
   */
  static async load(pptxUrl) {
    const {
      parseZip,
      buildPresentation,
      materializeSlideNodes,
      renderSlide,
      RECOMMENDED_ZIP_LIMITS,
    } = await import("@aiden0z/pptx-renderer/browser");
    const response = await fetch(pptxUrl);
    if (!response.ok) {
      throw new Error(`unable to fetch ${pptxUrl} (${response.status})`);
    }
    const files = await parseZip(
      await response.arrayBuffer(),
      RECOMMENDED_ZIP_LIMITS,
    );
    return new DeckRenderer(buildPresentation(files), {
      materializeSlideNodes,
      renderSlide,
    });
  }

  constructor(presentation, api) {
    this.presentation = presentation;
    this.api = api;
    // blob URLs for embedded media are reused across slides
    this.mediaUrlCache = new Map();
    this.chartInstances = new Set();
    this.handles = new Map();
  }

  get slideCount() {
    return this.presentation.slides.length;
  }

  /** Height / width of the deck, used to size the stage before anything paints. */
  get aspectRatio() {
    const { width, height } = this.presentation;
    return width > 0 ? height / width : 0.5625;
  }

  /**
   * Paint a slide into `target`, scaled to fill it.
   * @param {HTMLElement} target
   * @param {number} index zero based slide index
   */
  async render(target, index) {
    const slide = this.presentation.slides[index];
    if (!slide) {
      return;
    }
    this.dispose(index);
    this.api.materializeSlideNodes(this.presentation, slide);
    // pdfjs is intentionally not configured: it is only used for EMF embedded
    // PDF fallbacks and wiring it would mean fetching a library at runtime.
    const handle = this.api.renderSlide(this.presentation, slide, {
      mediaUrlCache: this.mediaUrlCache,
      chartInstances: this.chartInstances,
    });
    this.handles.set(index, handle);
    target.replaceChildren(handle.element);
    handle.element.style.transformOrigin = "top left";
    handle.element.style.transform = `scale(${target.clientWidth / this.presentation.width})`;
    await handle.ready;
  }

  /** Release a single slide, or every slide when no index is given. */
  dispose(index) {
    if (index === undefined) {
      this.handles.forEach((handle) => handle.dispose());
      this.handles.clear();
      this.mediaUrlCache.forEach((url) => URL.revokeObjectURL(url));
      this.mediaUrlCache.clear();
      return;
    }
    const handle = this.handles.get(index);
    if (handle) {
      handle.dispose();
      this.handles.delete(index);
    }
  }
}
