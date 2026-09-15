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
    this.handle = null;
    this.target = null;
    // the stage follows the host's width, including in full screen
    this.resizeObserver = new ResizeObserver(() => this.fit());
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
    // only one slide is ever on stage, so release the previous one first
    this.clear();
    this.api.materializeSlideNodes(this.presentation, slide);
    // pdfjs is intentionally not configured: it is only used for EMF embedded
    // PDF fallbacks and wiring it would mean fetching a library at runtime.
    this.handle = this.api.renderSlide(this.presentation, slide, {
      mediaUrlCache: this.mediaUrlCache,
      chartInstances: this.chartInstances,
    });
    this.target = target;
    target.replaceChildren(this.handle.element);
    this.handle.element.style.transformOrigin = "top left";
    this.fit();
    this.resizeObserver.observe(target);
    await this.handle.ready;
  }

  /** Scale the painted slide to the current width of its stage. */
  fit() {
    if (this.handle && this.target) {
      this.handle.element.style.transform = `scale(${this.target.clientWidth / this.presentation.width})`;
    }
  }

  /** Release the painted slide and stop following its stage. */
  clear() {
    this.resizeObserver.disconnect();
    if (this.handle) {
      this.handle.dispose();
      this.handle = null;
    }
    this.target = null;
  }

  /** Release everything, including media shared across slides. */
  dispose() {
    this.clear();
    this.mediaUrlCache.forEach((url) => URL.revokeObjectURL(url));
    this.mediaUrlCache.clear();
  }
}
