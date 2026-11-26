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
 * Read is forgiving on purpose, like media that is done at 90% of its
 * seconds: the page is read once READ_ENOUGH (90%) of the content was
 * scrolled through, never "the last pixel was on screen".
 *
 * Checkpoints validate that position. Elements that declare
 * readingCheckpoint (a note, a card, a layout block; see
 * scripts/generate-xapi-vocabulary.mjs) send no statement of their own: the
 * tracker notes each one that stayed on screen for dwellMs. When the page
 * has checkpoints, it is only read once CHECKPOINT_GATE (80%) of the ones
 * laid out were seen, so flinging to the bottom does not read a page. One
 * hidden inside a closed collapse or tab is not laid out and is never
 * required; seen ones are remembered across visits (onCheckpoint / begin),
 * and scrolling back up to them completes the page from wherever it is.
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
 * (read, as above), once per visit each. The fourth argument is the
 * checkpoint evidence { seen, total, missed: [tag, ...] }, or null when the
 * page has none, so the one reading record of a page carries it.
 */
// shares that send a progressed statement as they are crossed
export const READING_THRESHOLDS = [0.25, 0.5, 0.75];
// share of the content scrolled through that counts as read to the end
export const READ_ENOUGH = 0.9;
// share of the checkpoints laid out that must have been seen to be read
export const CHECKPOINT_GATE = 0.8;
// checkpoints looked at per page, at most
const CHECKPOINT_LIMIT = 200;
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

/**
 * Whether a checkpoint is on screen enough to be looked at: half of it, or
 * a quarter of the viewport for one taller than that. null when it is not
 * laid out (display none, inside a closed collapse or tab).
 * @param {{top: number, bottom: number, width: number, height: number}} rect
 * @param {number} viewportHeight
 * @returns {boolean|null}
 */
export function checkpointInView(rect, viewportHeight) {
  if (!rect || !(rect.height > 0) || !(rect.width > 0)) {
    return null;
  }
  if (!(viewportHeight > 0)) {
    return false;
  }
  const visible = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
  return visible >= Math.min(rect.height / 2, viewportHeight / 4);
}

/**
 * Whether enough checkpoints were seen for the page to be read
 * @param {number} seen
 * @param {number} total
 * @returns {boolean}
 */
export function checkpointGateMet(seen, total) {
  return !(total > 0) || seen / total >= CHECKPOINT_GATE;
}

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
        "extensions.https://haxtheweb.org/xapi/extensions/checkpoints",
      ],
      countsTowardCompletion: false,
      done: "90% of the page content scrolled through and, when the page has reading checkpoints, 80% of them seen on screen (each page counts its reading toward being done on its own)",
    };
  }
  /**
   * @param {Object} o
   * @param {Function} o.report (verb, share, page, evidence) => void
   * @param {Function} [o.checkpoints] () => Element[]: the reading
   *   checkpoints of the page, in page order
   * @param {Function} [o.onCheckpoint] (indexes, page) => void: checkpoints
   *   (by their place in that list) seen just now, to remember them
   * @param {number} [o.dwellMs] how long a checkpoint must stay on screen
   * @param {Function} [o.enabled] () => boolean; false (edit mode) measures
   *   and reports nothing
   * @param {number} [o.throttleMs] at most one measurement per this long
   * @param {number} [o.settleMs] how long after ready() the end of the
   *   content must still be in view to call the page read
   */
  constructor({
    report,
    enabled,
    checkpoints,
    onCheckpoint,
    throttleMs = 200,
    settleMs = 1000,
    dwellMs = 1000,
  } = {}) {
    this.report = typeof report === "function" ? report : () => {};
    this.enabled = typeof enabled === "function" ? enabled : () => true;
    this.checkpoints = typeof checkpoints === "function" ? checkpoints : null;
    this.onCheckpoint =
      typeof onCheckpoint === "function" ? onCheckpoint : () => {};
    this.throttleMs = throttleMs;
    this.settleMs = settleMs;
    this.dwellMs = dwellMs;
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
    // checkpoints, by their place in the list: seen, and on screen since
    this._seen = new Set();
    this._since = new Map();
    clearTimeout(this._timer);
    clearTimeout(this._settleTimer);
    clearTimeout(this._dwellTimer);
    this._timer = null;
    this._settleTimer = null;
    this._dwellTimer = null;
  }
  /**
   * Start a visit: page is what report() gets back (the outline item id,
   * url, title), region a function returning the element whose box is the
   * page content. Ends (flushes) the visit before it. seen: the checkpoints
   * (places in the list) the learner saw on an earlier visit.
   */
  begin(page, region, { seen } = {}) {
    this.end();
    this.page = page || null;
    (Array.isArray(seen) ? seen : []).forEach((i) => {
      if (Number.isInteger(i) && i >= 0 && i < CHECKPOINT_LIMIT) {
        this._seen.add(i);
      }
    });
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
    // haxtheweb/issues#3428: measured on the next throttled tick, not here.
    // ready() runs right after the content was put in place, so reading its
    // size now made the browser lay out the whole page on the spot, before
    // the elements in it had upgraded, and again once they did.
    this.schedule();
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
      this._progress() > this.reported
    ) {
      this.reported = this._progress();
      this.report(
        "progressed",
        this.reported,
        this.page,
        this._evidence(this.checkpointStatus()),
      );
    }
  }
  // the share to report while the page is not read: never past READ_ENOUGH,
  // so a page scrolled through with its checkpoints skipped is not "100%"
  _progress() {
    return round(Math.min(this.share, READ_ENOUGH));
  }
  _evidence(status) {
    return status && status.total > 0
      ? { seen: status.seen, total: status.total, missed: status.missed }
      : null;
  }
  /**
   * Look at the checkpoints of the page now: note the ones that stayed on
   * screen for dwellMs, and say where that stands. Checkpoints not laid out
   * are left out unless they were seen before.
   * @returns {{seen: number, total: number, missed: string[], met: boolean,
   *   items: {el: Element, seen: boolean}[]}}
   */
  checkpointStatus() {
    let list = [];
    try {
      list = this.checkpoints ? Array.from(this.checkpoints() || []) : [];
    } catch {
      list = [];
    }
    list = list.slice(0, CHECKPOINT_LIMIT);
    const vh = globalThis.innerHeight || 0;
    const now = Date.now();
    const track = Boolean(this.page && this.isReady && !this.completed);
    const fresh = [];
    const items = [];
    let waiting = Infinity;
    list.forEach((el, i) => {
      let inView = null;
      try {
        inView = checkpointInView(el.getBoundingClientRect(), vh);
      } catch {
        inView = null;
      }
      if (track && !this._seen.has(i)) {
        if (inView) {
          if (!this._since.has(i)) {
            this._since.set(i, now);
          }
          const left = this._since.get(i) + this.dwellMs - now;
          if (left <= 0) {
            this._seen.add(i);
            this._since.delete(i);
            fresh.push(i);
          } else {
            waiting = Math.min(waiting, left);
          }
        } else {
          this._since.delete(i);
        }
      }
      const seen = this._seen.has(i);
      if (seen || inView !== null) {
        items.push({ el, seen });
      }
    });
    clearTimeout(this._dwellTimer);
    this._dwellTimer = null;
    if (track && waiting !== Infinity) {
      // nothing scrolls while a learner reads: look again once the dwell is up
      this._dwellTimer = setTimeout(() => this.measure(), waiting + 20);
    }
    if (fresh.length && this.page) {
      this.onCheckpoint(fresh, this.page);
    }
    const seen = items.filter((c) => c.seen).length;
    return {
      seen,
      total: items.length,
      missed: items
        .filter((c) => !c.seen)
        .slice(0, 20)
        .map((c) => String(c.el.tagName || "").toLowerCase()),
      met: checkpointGateMet(seen, items.length),
      items,
    };
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
    const status = this.checkpointStatus();
    if (Math.max(share, this.share) >= READ_ENOUGH) {
      const wait = this._readyAt + this.settleMs - Date.now();
      if (wait > 0) {
        // the end is in view but the content may still be loading: look
        // again once it settled
        clearTimeout(this._settleTimer);
        this._settleTimer = setTimeout(() => this.measure(), wait);
        this.share = Math.max(this.share, Math.min(share, READ_ENOUGH - 0.01));
        return this.share;
      }
      if (status.met) {
        this.share = 1;
        this.completed = true;
        this.reported = 1;
        this._unlisten();
        clearTimeout(this._dwellTimer);
        this._dwellTimer = null;
        this.report("completed", 1, this.page, this._evidence(status));
        return 1;
      }
      // scrolled through, but too few checkpoints were looked at: keep
      // watching, the page is read as soon as enough of them were seen
    }
    if (share > this.share) {
      this.share = share;
    }
    const crossed = READING_THRESHOLDS.filter(
      (t) => this.share >= t && t > this.reported,
    );
    if (crossed.length) {
      this.reported = this._progress();
      this.report(
        "progressed",
        this.reported,
        this.page,
        this._evidence(status),
      );
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
