/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * Page reading progress for HAXcms learner progress: how far through the
 * content of the page open now the learner has scrolled.
 *
 * Reading is one trackable item on every page (haxtheweb/issues#3269), so a
 * page of text alone can be done. The share read is how much of the content
 * region (the theme's content container) has been above the bottom of the
 * viewport, kept as the highest value seen during the visit. Content that is
 * shorter than the viewport counts as read once all of it is on screen.
 *
 * Cheap: one passive scroll listener on the window (capture, so a theme
 * that scrolls an inner element is seen too), a ResizeObserver on the region
 * (content growing as it loads) and an IntersectionObserver on the region's
 * light DOM children (scroll containers inside shadow DOM, whose scroll
 * events never reach the window); each only schedules one measurement,
 * throttled. Nothing is measured until the page content is in place
 * (ready()), and a page whose end is in view is only called read after it
 * settled (settleMs), so content still loading is not read in a blink.
 *
 * The tracker never builds statements: it calls report(verb, share, page)
 * with verb "progressed" (share crossed 25 / 50 / 75 %, coalesced into one
 * call however many it crossed, or the visit ended part way) or "completed"
 * (the end of the content was seen), once per visit each.
 */
// shares that send a progressed statement as they are crossed
export const READING_THRESHOLDS = [0.25, 0.5, 0.75];
// pixels of slack at the end of the content (bottom padding, rounding)
const END_SLACK = 8;

/**
 * Share of a region read, from its box and the viewport height: 0 to 1, or
 * null when the region is not laid out (no height). The end within
 * END_SLACK pixels of the bottom of the viewport is the end seen, so a
 * region no taller than the viewport is read once it is on screen.
 * @param {{top: number, bottom: number, height: number}} rect
 * @param {number} viewportHeight
 * @returns {number|null}
 */
export function readShare(rect, viewportHeight) {
  if (!rect || !(rect.height > 0) || !(viewportHeight > 0)) {
    return null;
  }
  // nothing of it reached the viewport yet
  if (rect.top >= viewportHeight) {
    return 0;
  }
  // the end is on screen (or scrolled past); for a region no taller than
  // the viewport that means all of it was visible
  if (rect.bottom <= viewportHeight + END_SLACK) {
    return 1;
  }
  const seen = (viewportHeight - rect.top) / rect.height;
  return Math.min(1, Math.max(0, seen));
}

const round = (n) => Math.round(n * 100) / 100;

export class HAXCMSReadingProgress {
  /**
   * xAPI statements HAXcms sends about a page (see
   * scripts/generate-xapi-vocabulary.mjs). The experienced statement is the
   * visit (haxcms-learner-progress.js); progressed / completed are reading.
   * Reading counts toward the page being done on every page by itself, not
   * as an element found on the page, so countsTowardCompletion is false here
   * (it would make the page read itself a scanned element).
   */
  static get xapiVocabulary() {
    return {
      tag: "haxcms-page",
      event: "user-engagement",
      verbs: ["experienced", "progressed", "completed"],
      objectType: "http://adlnet.gov/expapi/activities/lesson",
      result: [
        "completion",
        "duration",
        "extensions.https://haxtheweb.org/xapi/extensions/progress",
      ],
      countsTowardCompletion: false,
      done: "page content scrolled through to its end (each page counts its reading toward being done on its own)",
    };
  }
  /**
   * @param {Object} o
   * @param {Function} o.report (verb, share, page) => void
   * @param {Function} [o.enabled] () => boolean; false (edit mode) measures
   *   and reports nothing
   * @param {number} [o.throttleMs] at most one measurement per this long
   * @param {number} [o.settleMs] how long after ready() the end of the
   *   content must still be in view to call the page read
   */
  constructor({ report, enabled, throttleMs = 200, settleMs = 1000 } = {}) {
    this.report = typeof report === "function" ? report : () => {};
    this.enabled = typeof enabled === "function" ? enabled : () => true;
    this.throttleMs = throttleMs;
    this.settleMs = settleMs;
    this.page = null;
    this.region = null;
    this._reset();
    this._onScroll = () => this.schedule();
  }
  _reset() {
    this.share = 0;
    this.reported = 0;
    this.completed = false;
    this.isReady = false;
    this._readyAt = 0;
    clearTimeout(this._timer);
    clearTimeout(this._settleTimer);
    this._timer = null;
    this._settleTimer = null;
  }
  /**
   * Start a visit: page is what report() gets back (the outline item id,
   * url, title), region a function returning the element whose box is the
   * page content. Ends (flushes) the visit before it.
   */
  begin(page, region) {
    this.end();
    this.page = page || null;
    this.region = typeof region === "function" ? region : () => region;
    this._listen();
  }
  /**
   * The page content is in place: measuring may start
   */
  ready() {
    if (!this.page || this.completed) {
      return;
    }
    if (!this.isReady) {
      this.isReady = true;
      this._readyAt = Date.now();
    }
    this._observeChildren();
    this.measure();
  }
  /**
   * End the visit: a share read past the last one reported goes out as a
   * progressed statement, then everything stops
   */
  end() {
    this.flush();
    this.discard();
  }
  /**
   * Stop without reporting anything (progress was cleared)
   */
  discard() {
    this._unlisten();
    this._reset();
    this.page = null;
    this.region = null;
  }
  /**
   * Report a share read past the last one reported as progressed, and keep
   * tracking (the tab is going away, maybe to come back)
   */
  flush() {
    if (
      this.page &&
      !this.completed &&
      this.enabled() &&
      this.share > 0 &&
      round(this.share) > this.reported
    ) {
      this.reported = round(this.share);
      this.report("progressed", this.reported, this.page);
    }
  }
  /**
   * One measurement soon (throttled)
   */
  schedule() {
    if (this._timer || !this.isReady || this.completed) {
      return;
    }
    this._timer = setTimeout(() => {
      this._timer = null;
      this.measure();
    }, this.throttleMs);
  }
  _el() {
    let el = null;
    try {
      el = this.region ? this.region() : null;
    } catch {
      el = null;
    }
    return el && typeof el.getBoundingClientRect === "function" ? el : null;
  }
  /**
   * Measure now and report what changed. Returns the share read so far.
   */
  measure() {
    if (!this.page || !this.isReady || this.completed || !this.enabled()) {
      return this.share;
    }
    const el = this._el();
    const vh = globalThis.innerHeight || 0;
    const share = el ? readShare(el.getBoundingClientRect(), vh) : null;
    if (share === null) {
      return this.share;
    }
    if (share >= 1) {
      const wait = this._readyAt + this.settleMs - Date.now();
      if (wait > 0) {
        // the end is in view but the content may still be loading: look
        // again once it settled
        clearTimeout(this._settleTimer);
        this._settleTimer = setTimeout(() => this.measure(), wait);
        this.share = Math.max(this.share, Math.min(share, 0.99));
        return this.share;
      }
      this.share = 1;
      this.completed = true;
      this.reported = 1;
      this._unlisten();
      this.report("completed", 1, this.page);
      return 1;
    }
    if (share > this.share) {
      this.share = share;
    }
    const crossed = READING_THRESHOLDS.filter(
      (t) => this.share >= t && t > this.reported,
    );
    if (crossed.length) {
      this.reported = round(this.share);
      this.report("progressed", this.reported, this.page);
    }
    return this.share;
  }
  _listen() {
    globalThis.addEventListener("scroll", this._onScroll, {
      capture: true,
      passive: true,
    });
    globalThis.addEventListener("resize", this._onScroll, { passive: true });
    if (typeof globalThis.ResizeObserver === "function") {
      this._resize = new globalThis.ResizeObserver(() => this.schedule());
    }
    if (typeof globalThis.IntersectionObserver === "function") {
      this._io = new globalThis.IntersectionObserver(() => this.schedule(), {
        threshold: [0, 1],
      });
    }
  }
  // watch the region and its children; called each time content is ready,
  // since the children change with every page
  _observeChildren() {
    const el = this._el();
    if (this._resize) {
      this._resize.disconnect();
      if (el) {
        this._resize.observe(el);
      }
    }
    if (this._io) {
      this._io.disconnect();
      if (el) {
        this._io.observe(el);
        const host = el.getRootNode && el.getRootNode().host;
        // the region of a theme is in its shadow; the content is its light
        // DOM children
        const kids = host ? host.children : el.children;
        Array.from(kids || [])
          .slice(0, 200)
          .forEach((k) => this._io.observe(k));
      }
    }
  }
  _unlisten() {
    globalThis.removeEventListener("scroll", this._onScroll, {
      capture: true,
    });
    globalThis.removeEventListener("resize", this._onScroll);
    if (this._resize) {
      this._resize.disconnect();
      this._resize = null;
    }
    if (this._io) {
      this._io.disconnect();
      this._io = null;
    }
  }
}
