/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 *
 * DDD block anatomy: the shared frame and block header used by
 * instructional and content blocks (quizzes, notes, players, embeds,
 * references). One stylesheet and one header helper so every block looks
 * and reads the same; Lit adopts the same CSSStyleSheet into every shadow
 * root, so it is parsed and held in memory once however many blocks are on
 * the page.
 *
 * This file is standalone on purpose: it adds no exports to d-d-d.js or
 * DDDStyles.js, so nothing that imports those today changes. Import it
 * directly:
 *
 *   import {
 *     DDDBlockStyles,
 *     renderDDDBlockHeader,
 *   } from "@haxtheweb/d-d-d/lib/DDDBlock.js";
 *
 *   static get styles() { return [super.styles, DDDBlockStyles, css`...`]; }
 *
 *   render() {
 *     return html`<div class="ddd-block" role="group" aria-labelledby="hdr">
 *       ${renderDDDBlockHeader({
 *         id: "hdr",
 *         icon: "av:play-arrow",
 *         label: "Video · interactive",
 *         title: this.mediaTitle,
 *         actions: html`<button class="ddd-block-action" ...>...</button>`,
 *       })}
 *       <div class="ddd-block-body">...</div>
 *     </div>`;
 *   }
 *
 * CSS parts: the header is "block-header" (plus o.part), its chip
 * "block-chip" and its label / title column "block-text".
 *
 * Parts (see the anatomy): .ddd-block (frame), .ddd-block-header,
 * .ddd-block-chip, .ddd-block-text, .ddd-block-label, .ddd-block-title,
 * .ddd-block-actions, .ddd-block-action (round 40px icon button or link),
 * .ddd-block-body, .ddd-block-footer.
 *
 * Custom properties: --ddd-block-background (frame surface, transparent by
 * default so the block sits on the page colour), --ddd-block-chip-background,
 * --ddd-block-chip-color, --ddd-block-accent (optional top rule colour, shown with data-block-accent on the frame; not data-accent, which DDD already styles).
 *
 * Completion (haxtheweb/issues#3267): a block whose activity is done shows
 * it on its own header chip. Pass done (and doneLabel, spoken and shown on
 * hover) to renderDDDBlockHeader / renderDDDBlockChip and the chip swaps its
 * icon for a check box (data-done). The first time the learner finishes it
 * (never on a revisit, a reload or a wrong answer), call
 * celebrateDDDCompletion(chip) after the update: a short burst of sparks
 * radiates from the chip and its icon pops in. With reduced motion nothing
 * moves; the chip simply shows its done state. DDDCompletionTracker decides
 * "first time" for values watched over time (a page percent), and
 * DDDCompletionStyles carries the burst for surfaces that are not blocks
 * (DDDBlockStyles already includes it).
 *
 *   renderDDDBlockHeader({ icon: "av:play-arrow", label, title,
 *     done: this.watched, doneLabel: this.t.watched });
 *   // when the learner just finished it
 *   await this.updateComplete;
 *   celebrateDDDCompletion(this.shadowRoot.querySelector(".ddd-block-chip"));
 */
import { html, css, nothing } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";

/**
 * The completion burst: sparks (renderDDDBurst) that radiate once from the
 * element celebrateDDDCompletion marks, and the icon inside it popping in.
 * Colour: --ddd-component-burst-color (sky blue, keystone yellow in dark).
 * Nothing moves with prefers-reduced-motion.
 */
export const DDDCompletionStyles = css`
  .ddd-burst {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  .ddd-burst-spark {
    --ddd-burst-angle: 0deg;
    position: absolute;
    left: 50%;
    top: 50%;
    width: var(--ddd-spacing-1);
    height: var(--ddd-spacing-1);
    margin: calc(var(--ddd-spacing-1) / -2) 0 0 calc(var(--ddd-spacing-1) / -2);
    border-radius: var(--ddd-radius-circle);
    background-color: var(
      --ddd-component-burst-color,
      light-dark(
        var(--ddd-theme-default-skyBlue),
        var(--ddd-theme-default-keystoneYellow)
      )
    );
    opacity: 0;
    transform: rotate(var(--ddd-burst-angle));
  }
  .ddd-burst-spark:nth-child(2) {
    --ddd-burst-angle: 45deg;
  }
  .ddd-burst-spark:nth-child(3) {
    --ddd-burst-angle: 90deg;
  }
  .ddd-burst-spark:nth-child(4) {
    --ddd-burst-angle: 135deg;
  }
  .ddd-burst-spark:nth-child(5) {
    --ddd-burst-angle: 180deg;
  }
  .ddd-burst-spark:nth-child(6) {
    --ddd-burst-angle: 225deg;
  }
  .ddd-burst-spark:nth-child(7) {
    --ddd-burst-angle: 270deg;
  }
  .ddd-burst-spark:nth-child(8) {
    --ddd-burst-angle: 315deg;
  }
  [data-ddd-celebrate] .ddd-burst-spark {
    animation: ddd-burst-spark var(--ddd-duration-slow, 600ms)
      var(--ddd-timing-enter, ease-out) 1;
  }
  [data-ddd-celebrate] > simple-icon-lite,
  [data-ddd-celebrate] .ddd-burst-pop {
    animation: ddd-burst-pop var(--ddd-duration-normal, 300ms)
      var(--ddd-timing-enter, ease-out) 1;
  }
  @keyframes ddd-burst-spark {
    0% {
      opacity: 1;
      transform: rotate(var(--ddd-burst-angle)) translateY(0);
    }
    100% {
      opacity: 0;
      transform: rotate(var(--ddd-burst-angle))
        translateY(calc(-1 * var(--ddd-spacing-6)));
    }
  }
  @keyframes ddd-burst-pop {
    0% {
      transform: scale(0.4);
    }
    70% {
      transform: scale(1.15);
    }
    100% {
      transform: scale(1);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    [data-ddd-celebrate] .ddd-burst-spark,
    [data-ddd-celebrate] > simple-icon-lite,
    [data-ddd-celebrate] .ddd-burst-pop {
      animation: none;
    }
  }
  @media (forced-colors: active) {
    .ddd-burst-spark {
      background-color: Highlight;
    }
  }
`;

export const DDDBlockStyles = css`
  ${DDDCompletionStyles}
  .ddd-block {
    box-sizing: border-box;
    border: var(--ddd-border-xs);
    border-color: light-dark(
      var(--ddd-theme-default-limestoneLight),
      var(--ddd-theme-default-slateGray)
    );
    border-radius: var(--ddd-radius-md);
    background-color: var(--ddd-block-background, transparent);
    font-family: var(--ddd-font-primary);
    overflow: clip;
  }
  .ddd-block[data-block-accent] {
    border-top: var(--ddd-border-size-md) solid
      var(--ddd-block-accent, var(--ddd-theme-default-beaverBlue));
  }
  .ddd-block-header {
    display: flex;
    align-items: center;
    gap: var(--ddd-spacing-3);
    padding-block: var(--ddd-spacing-2);
    padding-inline: var(--ddd-spacing-4) var(--ddd-spacing-2);
    min-height: var(--ddd-control-height-sm);
    border-bottom: var(--ddd-border-xs);
    border-color: light-dark(
      var(--ddd-theme-default-limestoneLight),
      var(--ddd-theme-default-slateGray)
    );
  }
  .ddd-block-header:last-child {
    border-bottom: none;
  }
  .ddd-block-chip {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: none;
    width: var(--ddd-icon-xs);
    height: var(--ddd-icon-xs);
    border-radius: var(--ddd-radius-circle);
    background-color: var(
      --ddd-block-chip-background,
      light-dark(
        var(--ddd-theme-default-beaverBlue),
        var(--ddd-theme-default-skyBlue)
      )
    );
    color: var(
      --ddd-block-chip-color,
      light-dark(
        var(--ddd-theme-default-white),
        var(--ddd-theme-default-potentialMidnight)
      )
    );
    --simple-icon-color: currentColor;
    --simple-icon-width: var(--ddd-icon-3xs);
    --simple-icon-height: var(--ddd-icon-3xs);
  }
  .ddd-block-chip-label {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
    border: 0;
  }
  @media (forced-colors: active) {
    .ddd-block-chip[data-done] {
      background-color: CanvasText;
      color: Canvas;
    }
  }
  .ddd-block-text {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-width: 0;
  }
  .ddd-block-label {
    font-family: var(--ddd-font-navigation);
    font-size: var(--ddd-font-size-4xs);
    font-weight: var(--ddd-font-weight-medium);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    line-height: var(--ddd-lh-120);
    /* a long (translated) word breaks instead of spilling under the actions */
    overflow-wrap: anywhere;
    color: light-dark(
      var(--ddd-theme-default-slateGray),
      var(--ddd-theme-default-limestoneLight)
    );
  }
  :host(:lang(ar)) .ddd-block-label,
  :host(:lang(fa)) .ddd-block-label,
  :host(:lang(he)) .ddd-block-label,
  :host(:lang(ur)) .ddd-block-label {
    letter-spacing: 0;
  }
  :host(:lang(zh)) .ddd-block-label,
  :host(:lang(ja)) .ddd-block-label,
  :host(:lang(ko)) .ddd-block-label {
    letter-spacing: 0.02em;
  }
  .ddd-block-title {
    margin: 0;
    font-family: var(--ddd-font-primary);
    font-size: var(--ddd-font-size-xs);
    font-weight: var(--ddd-font-weight-bold);
    line-height: var(--ddd-lh-120);
    overflow-wrap: anywhere;
    color: light-dark(
      var(--ddd-theme-default-nittanyNavy),
      var(--ddd-theme-default-white)
    );
  }
  .ddd-block-actions {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: var(--ddd-spacing-1);
    flex: none;
  }
  .ddd-block-action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: none;
    box-sizing: border-box;
    min-width: var(--ddd-control-height-sm);
    height: var(--ddd-control-height-sm);
    margin: 0;
    padding: 0;
    border: var(--ddd-border-xs);
    border-color: light-dark(
      var(--ddd-theme-default-limestoneLight),
      var(--ddd-theme-default-slateGray)
    );
    border-radius: var(--ddd-radius-rounded);
    background-color: transparent;
    color: light-dark(
      var(--ddd-theme-default-nittanyNavy),
      var(--ddd-theme-default-linkLight)
    );
    font: inherit;
    text-decoration: none;
    cursor: pointer;
    --simple-icon-color: currentColor;
    --simple-icon-width: var(--ddd-icon-3xs);
    --simple-icon-height: var(--ddd-icon-3xs);
  }
  .ddd-block-action:hover {
    border-color: light-dark(
      var(--ddd-theme-default-nittanyNavy),
      var(--ddd-theme-default-linkLight)
    );
  }
  .ddd-block-action:focus-visible {
    outline: var(--ddd-focus-ring);
    outline-offset: var(--ddd-focus-offset);
  }
  .ddd-block-action[aria-pressed="true"],
  .ddd-block-action[aria-expanded="true"] {
    border-color: light-dark(
      var(--ddd-theme-default-nittanyNavy),
      var(--ddd-theme-default-linkLight)
    );
    background-color: light-dark(
      var(--ddd-theme-default-nittanyNavy),
      var(--ddd-theme-default-linkLight)
    );
    color: light-dark(
      var(--ddd-theme-default-white),
      var(--ddd-theme-default-potentialMidnight)
    );
  }
  .ddd-block-action[disabled],
  .ddd-block-action[aria-disabled="true"] {
    border-style: dashed;
    opacity: 0.6;
    cursor: default;
  }
  .ddd-block-action[disabled]:hover,
  .ddd-block-action[aria-disabled="true"]:hover {
    border-color: light-dark(
      var(--ddd-theme-default-limestoneLight),
      var(--ddd-theme-default-slateGray)
    );
  }
  .ddd-block-action.has-text {
    padding-inline: var(--ddd-spacing-3);
    gap: var(--ddd-spacing-1);
    font-family: var(--ddd-font-navigation);
    font-size: var(--ddd-font-size-4xs);
  }
  .ddd-block-body {
    display: block;
  }
  .ddd-block-footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--ddd-spacing-3);
    padding-block: var(--ddd-spacing-2);
    padding-inline: var(--ddd-spacing-4) var(--ddd-spacing-2);
    border-top: var(--ddd-border-xs);
    border-color: light-dark(
      var(--ddd-theme-default-limestoneLight),
      var(--ddd-theme-default-slateGray)
    );
    font-size: var(--ddd-font-size-4xs);
  }
  @media (prefers-reduced-motion: reduce) {
    .ddd-block,
    .ddd-block * {
      transition: none;
    }
  }
`;

/**
 * Render the block header (anatomy part 2).
 * @param {Object} o
 * @param {String} [o.id] id for the header text, so the frame can be
 *   aria-labelledby it
 * @param {String} [o.icon] simple-icon name for the chip; a template can be
 *   passed as o.chip instead
 * @param {*} [o.chip] custom chip content (overrides icon)
 * @param {*} o.label type label, e.g. "Quiz · Multiple choice"
 * @param {*} [o.title] optional title line
 * @param {String} [o.titleTag] "span" (default) or "h2"/"h3"/"h4" when the
 *   title must be a real heading
 * @param {*} [o.actions] header actions (buttons / links with class
 *   ddd-block-action)
 * @param {*} [o.after] anything else at the end of the text column
 * @param {Boolean} [o.done] the activity is done: the chip shows a check box
 *   (see renderDDDBlockChip)
 * @param {String} [o.doneIcon] icon for the done chip (icons:check-box)
 * @param {String} [o.doneLabel] what done means here ("Correct",
 *   "Watched"): the chip's hover text, and spoken after the label
 * @param {Boolean} [o.speakDone] false when the block already announces
 *   its state elsewhere (a feedback region), so the label is not repeated
 * @param {String} [o.part] extra space separated part names for the header,
 *   added after "block-header" so an element can keep a part it already
 *   exposed (e.g. "frame-header")
 * @returns {TemplateResult}
 */
export function renderDDDBlockHeader(o) {
  const opts = o || {};
  const tag = ["h2", "h3", "h4"].includes(opts.titleTag)
    ? opts.titleTag
    : "span";
  let title = nothing;
  if (opts.title) {
    if (tag === "h2") {
      title = html`<h2 class="ddd-block-title">${opts.title}</h2>`;
    } else if (tag === "h3") {
      title = html`<h3 class="ddd-block-title">${opts.title}</h3>`;
    } else if (tag === "h4") {
      title = html`<h4 class="ddd-block-title">${opts.title}</h4>`;
    } else {
      title = html`<span class="ddd-block-title">${opts.title}</span>`;
    }
  }
  return html`<div
    class="ddd-block-header"
    part="block-header${opts.part ? " " + opts.part : ""}"
  >
    ${renderDDDBlockChip(opts)}
    <span class="ddd-block-text" part="block-text" id="${opts.id || nothing}">
      <span class="ddd-block-label">${opts.label}</span
      >${renderDDDBlockChipLabel(opts)} ${title}${opts.after || nothing}
    </span>
    ${
      opts.actions
        ? html`<span class="ddd-block-actions">${opts.actions}</span>`
        : nothing
    }
  </div>`;
}

/**
 * The header chip on its own (for a header an element builds itself, like a
 * disclosure row). Done: the icon becomes o.doneIcon (icons:check-box), the
 * chip gets data-done and o.doneLabel as its hover text, and it holds the
 * burst celebrateDDDCompletion plays. The chip stays aria-hidden; speak the
 * state with renderDDDBlockChipLabel next to the block's label.
 * @param {Object} o same options as renderDDDBlockHeader (icon, chip, done,
 *   doneIcon, doneLabel)
 * @returns {TemplateResult}
 */
export function renderDDDBlockChip(o) {
  const opts = o || {};
  const done = Boolean(opts.done);
  let glyph = nothing;
  if (done) {
    glyph = html`<simple-icon-lite
      icon="${opts.doneIcon || "icons:check-box"}"
    ></simple-icon-lite>`;
  } else if (opts.chip) {
    glyph = opts.chip;
  } else if (opts.icon) {
    glyph = html`<simple-icon-lite icon="${opts.icon}"></simple-icon-lite>`;
  }
  return html`<span
    class="ddd-block-chip"
    part="block-chip"
    aria-hidden="true"
    ?data-done="${done}"
    title="${done && opts.doneLabel ? opts.doneLabel : nothing}"
    >${glyph}${done ? renderDDDBurst() : nothing}</span
  >`;
}

/**
 * Visually hidden ", <doneLabel>" for the end of a block label, so the done
 * state shown by the chip is also spoken; nothing when not done or when
 * speakDone is false.
 * @param {Object} o { done, doneLabel, speakDone }
 * @returns {TemplateResult}
 */
export function renderDDDBlockChipLabel(o) {
  const opts = o || {};
  return opts.done && opts.doneLabel && opts.speakDone !== false
    ? html`<span class="ddd-block-chip-label">, ${opts.doneLabel}</span>`
    : nothing;
}

/**
 * The sparks of the completion burst; put them in a positioned element
 * (the chip, a progress ring) and play them with celebrateDDDCompletion.
 * @returns {TemplateResult}
 */
export function renderDDDBurst() {
  return html`<span class="ddd-burst" aria-hidden="true"
    ><span class="ddd-burst-spark"></span><span class="ddd-burst-spark"></span
    ><span class="ddd-burst-spark"></span><span class="ddd-burst-spark"></span
    ><span class="ddd-burst-spark"></span><span class="ddd-burst-spark"></span
    ><span class="ddd-burst-spark"></span><span class="ddd-burst-spark"></span
  ></span>`;
}

/**
 * Whether the visitor asked for reduced motion
 * @returns {Boolean}
 */
export function prefersDDDReducedMotion() {
  try {
    return Boolean(
      globalThis.matchMedia &&
      globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  } catch {
    return false;
  }
}

// how long the burst stays marked; longer than the slowest animation in it
export const DDD_CELEBRATE_MS = 900;

/**
 * Play the completion burst once on target (a .ddd-block-chip, a progress
 * ring or anything holding renderDDDBurst): data-ddd-celebrate is set for a
 * moment and the styles in DDDCompletionStyles animate it. Does nothing,
 * and returns false, with reduced motion or without a target.
 * @param {Element} target
 * @returns {Boolean} true when the burst plays
 */
export function celebrateDDDCompletion(target) {
  if (!target || !target.setAttribute || prefersDDDReducedMotion()) {
    return false;
  }
  target.removeAttribute("data-ddd-celebrate");
  // restart the animation when it is already playing
  void target.getBoundingClientRect();
  target.setAttribute("data-ddd-celebrate", "");
  clearTimeout(target.__dddCelebrate);
  target.__dddCelebrate = setTimeout(() => {
    target.removeAttribute("data-ddd-celebrate");
  }, DDD_CELEBRATE_MS);
  return true;
}

/**
 * Decides when something watched over time (a page percent, an item) has
 * just been finished for the first time: update(key, done) is true only
 * when key was seen not done before and is done now, once per key. The
 * first value seen for a key never counts, so something already done when
 * it is shown (a revisit, a reload) does not celebrate.
 */
export class DDDCompletionTracker {
  constructor() {
    this._seen = new Map();
    this._played = new Set();
  }
  /**
   * @param {String} key
   * @param {Boolean} done
   * @returns {Boolean} true when key just became done for the first time
   */
  update(key, done) {
    const k = String(key);
    const was = this._seen.has(k) ? this._seen.get(k) : null;
    this._seen.set(k, Boolean(done));
    if (was === false && done && !this._played.has(k)) {
      this._played.add(k);
      return true;
    }
    return false;
  }
  /**
   * Stop watching key (it is no longer shown); the next value seen for it
   * is a first look again. Keys that already celebrated never do again.
   * @param {String} key
   */
  forget(key) {
    this._seen.delete(String(key));
  }
}

/*
 * Full screen helpers for blocks with a full screen header action. Plain
 * functions so Lit and plain HTMLElement blocks share them; each element
 * keeps its own state. opts { webkit: true } adds the webkit prefixed API
 * (support check, active element, exit, request, change event).
 */

// can the browser put an element in full screen
export function canDDDBlockFullscreen(opts) {
  const d = globalThis.document;
  if (opts && opts.webkit) {
    return !!(d && (d.fullscreenEnabled || d.webkitFullscreenEnabled));
  }
  return !!(
    d &&
    d.fullscreenEnabled &&
    globalThis.HTMLElement &&
    globalThis.HTMLElement.prototype.requestFullscreen
  );
}

// is target the full screen element of root (a document or shadow root)
export function isDDDBlockFullscreen(root, target, opts) {
  let current = root ? root.fullscreenElement : null;
  if (!current && root && opts && opts.webkit) {
    current = root.webkitFullscreenElement;
  }
  return !!(target && current && current === target);
}

function _quiet(promise) {
  if (promise && promise.catch) {
    promise.catch(() => {});
  }
}

// leave full screen when active, otherwise put target in full screen
export function toggleDDDBlockFullscreen(target, active, opts) {
  const d = globalThis.document;
  const webkit = !!(opts && opts.webkit);
  if (webkit && active) {
    if (d.exitFullscreen) {
      _quiet(d.exitFullscreen());
    } else if (d.webkitExitFullscreen) {
      d.webkitExitFullscreen();
    }
  } else if (!webkit && active && d.exitFullscreen) {
    d.exitFullscreen();
  } else if (target && target.requestFullscreen) {
    _quiet(target.requestFullscreen());
  } else if (webkit && target && target.webkitRequestFullscreen) {
    target.webkitRequestFullscreen();
  }
}

// add (on true) or remove the document full screen change listener
export function listenDDDBlockFullscreen(handler, on, opts) {
  const d = globalThis.document;
  if (!d) {
    return;
  }
  const method = on ? "addEventListener" : "removeEventListener";
  d[method]("fullscreenchange", handler);
  if (opts && opts.webkit) {
    d[method]("webkitfullscreenchange", handler);
  }
}
