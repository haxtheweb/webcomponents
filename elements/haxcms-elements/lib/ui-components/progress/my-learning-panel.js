/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import {
  DDDBlockStyles,
  renderDDDBlockHeader,
  prefersDDDReducedMotion,
} from "@haxtheweb/d-d-d/lib/DDDBlock.js";
import {
  DDDProgressRingStyles,
  dddProgressPercent,
  dddProgressValue,
  renderDDDProgressRing,
} from "@haxtheweb/d-d-d/lib/DDDProgressRing.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { autorun, toJS } from "mobx";
import {
  store,
  iconFromPageType,
} from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { LearnerProgress } from "@haxtheweb/haxcms-elements/lib/core/haxcms-learner-progress.js";
import { UserScaffoldInstance } from "@haxtheweb/user-scaffold/user-scaffold.js";
import {
  activityId,
  legacyActivityId,
} from "@haxtheweb/user-action/lib/xapi.js";
import {
  XAPI_VOCABULARY,
  XAPI_TRACKABLE_TAGS,
} from "@haxtheweb/user-action/lib/xapi-vocabulary.js";

// wrappers that report learner data for a player authored inside them (as
// in haxcms-learner-progress.js)
const MEDIA_WRAPPERS = "video-player, audio-player";
const NAME_MAX = 120;

/**
 * What kind of item a page progress item is, from its tag: reading, video,
 * audio, collapse, quiz, checklist, game, cards or activity
 * @param {{ kind: string, tag: string }} item from pageProgress().items
 * @returns {string}
 */
export function learnerItemKind(item) {
  const i = item || {};
  if (i.kind === "reading") {
    return "reading";
  }
  const tag = String(i.tag || "");
  if (tag === "a11y-collapse") {
    return "collapse";
  }
  if (tag.indexOf("flash-card") === 0) {
    return "cards";
  }
  const v = Object.prototype.hasOwnProperty.call(XAPI_VOCABULARY, tag)
    ? XAPI_VOCABULARY[tag]
    : null;
  const type = v && v.objectType ? String(v.objectType) : "";
  if (type.endsWith("/media")) {
    return tag.indexOf("audio") !== -1 ? "audio" : "video";
  }
  if (type.endsWith("/cmi.interaction")) {
    return "quiz";
  }
  if (type.endsWith("/objective")) {
    return "checklist";
  }
  if (type.endsWith("/simulation")) {
    return "game";
  }
  return "activity";
}

// type icon of each kind of item; a unique icon per kind
export const LEARNER_ITEM_ICONS = {
  reading: "icons:subject",
  video: "av:play-arrow",
  audio: "av:volume-up",
  collapse: "icons:expand-more",
  quiz: "icons:help-outline",
  checklist: "icons:assignment-turned-in",
  game: "hardware:videogame-asset",
  cards: "icons:view-carousel",
  activity: "icons:extension",
};

/**
 * The name an author gave an element: its media title, question, heading
 * or title (slotted heading for a collapse), else ""
 * @param {HTMLElement} el
 * @returns {string}
 */
export function learnerItemName(el) {
  if (!el || !el.getAttribute) {
    return "";
  }
  const slotted = el.querySelector
    ? el.querySelector('[slot="heading"], [slot="title"]')
    : null;
  const picks = [
    el.mediaTitle,
    el.getAttribute("media-title"),
    el.question,
    el.heading,
    el.getAttribute("heading"),
    slotted ? slotted.textContent : "",
    typeof el.title === "string" ? el.title : "",
    el.getAttribute("title"),
  ];
  for (let i = 0; i < picks.length; i++) {
    const v = typeof picks[i] === "string" ? picks[i].trim() : "";
    if (v) {
      return v.replace(/\s+/g, " ").slice(0, NAME_MAX);
    }
  }
  return "";
}

/**
 * The trackable elements of the content shown now, in page order, as the
 * page is counted (a player inside video-player / audio-player is its
 * wrapper; an element that cannot be tracked as authored is left out)
 * @param {ParentNode} [root] defaults to the theme
 * @returns {HTMLElement[]}
 */
export function learnerTrackableElements(root, all) {
  const scope = root || store.themeElement || globalThis.document;
  if (!scope || !scope.querySelectorAll || !XAPI_TRACKABLE_TAGS.length) {
    return [];
  }
  return Array.from(
    scope.querySelectorAll(XAPI_TRACKABLE_TAGS.join(",")),
  ).filter(
    (el) =>
      !(el.parentElement && el.parentElement.closest(MEDIA_WRAPPERS)) &&
      (all ||
        !(
          typeof el.xapiCountsTowardCompletion === "function" &&
          el.xapiCountsTowardCompletion() === false
        )),
  );
}

// the element of list that is el or holds it (across shadow roots)
function holderIn(el, list) {
  let node = el;
  while (node) {
    if (list.indexOf(node) !== -1) {
      return node;
    }
    if (node.parentElement) {
      node = node.parentElement;
    } else {
      const root = node.getRootNode ? node.getRootNode() : null;
      node = root && root.host ? root.host : null;
    }
  }
  return null;
}

/**
 * Pair the items of a page (pageProgress().items) with the elements they
 * are about: an item engaged during this visit by the element that sent
 * it, else by activity id (now or as it was keyed before), else by the
 * name saved with it; an item not engaged yet ("<tag>#<n>") by the next
 * element of its tag not paired yet. Reading has no element.
 * @param {Object[]} items
 * @param {HTMLElement[]} els learnerTrackableElements()
 * @param {Function} [recordOf] key -> saved activity record (name, status)
 * @param {HTMLElement[]} [rest] elements to fall back on for an item not
 *   engaged yet when els has none left of its tag (the page was counted
 *   before one of them stopped counting itself)
 * @returns {Array<HTMLElement|null>} one per item
 */
export function pairLearnerItems(items, els, recordOf, rest) {
  const list = Array.isArray(els) ? els : [];
  const more = Array.isArray(rest) ? rest : [];
  const used = new Set();
  const free = (el) => el && !used.has(el);
  const out = (items || []).map(() => null);
  const take = (i, el) => {
    if (free(el)) {
      used.add(el);
      out[i] = el;
    }
  };
  // engaged items first, so pending ones get what is left
  (items || []).forEach((item, i) => {
    if (!item || item.kind === "reading" || !item.key) {
      return;
    }
    if (item.key.indexOf("#") === -1 || /^[^:]*#\d+$/.test(item.key)) {
      return;
    }
    const live = LearnerProgress.engagedElement
      ? LearnerProgress.engagedElement(item.key)
      : null;
    let el = live ? holderIn(live, list) : null;
    if (!free(el)) {
      el = list.find(
        (e) =>
          free(e) &&
          (!item.tag || e.tagName.toLowerCase() === item.tag) &&
          (activityId(e) === item.key || legacyActivityId(e) === item.key),
      );
    }
    if (!free(el) && recordOf) {
      const rec = recordOf(item.key);
      const name = rec && rec.name ? String(rec.name).trim() : "";
      if (name) {
        el = list.find(
          (e) =>
            free(e) &&
            (!item.tag || e.tagName.toLowerCase() === item.tag) &&
            learnerItemName(e) === name.slice(0, NAME_MAX),
        );
      }
    }
    take(i, el);
  });
  (items || []).forEach((item, i) => {
    if (!item || item.kind === "reading" || out[i] || item.done) {
      return;
    }
    if (!/^[^:]*#\d+$/.test(item.key || "")) {
      return;
    }
    const fits = (e) =>
      free(e) && (!item.tag || e.tagName.toLowerCase() === item.tag);
    take(i, list.find(fits) || more.find(fits));
  });
  return out;
}

/**
 * Where the learner stopped reading: the first block of the content whose
 * bottom is past the share read so far
 * @param {Number} share 0 to 1
 * @returns {HTMLElement|null}
 */
export function learnerReadingTarget(share) {
  const theme = store.themeElement;
  const region = LearnerProgress.contentRegion();
  if (!theme || !region) {
    return null;
  }
  const blocks = Array.from(theme.children).filter(
    (c) =>
      c.tagName !== "PAGE-BREAK" &&
      c.getBoundingClientRect &&
      c.getBoundingClientRect().height > 0,
  );
  if (!blocks.length) {
    return null;
  }
  const box = region.getBoundingClientRect();
  const y = box.top + dddProgressValue(share) * box.height;
  return blocks.find((c) => c.getBoundingClientRect().bottom > y) || blocks[0];
}

const JUMP_ATTR = "data-my-learning-jump";
const JUMP_STYLE_ID = "my-learning-jump-style";
const JUMP_STYLE = [
  `[${JUMP_ATTR}] {`,
  "  outline: var(--ddd-border-size-md, 3px) solid light-dark(var(--ddd-theme-default-skyBlue), var(--ddd-theme-default-keystoneYellow));",
  "  outline-offset: var(--ddd-spacing-1, 4px);",
  "  animation: my-learning-jump var(--ddd-duration-slow, 600ms) ease-out 2;",
  "}",
  "@keyframes my-learning-jump {",
  "  0% { outline-offset: var(--ddd-spacing-4, 16px); outline-color: transparent; }",
  "}",
  "@media (prefers-reduced-motion: reduce) {",
  `  [${JUMP_ATTR}] { animation: none; }`,
  "}",
  "@media (forced-colors: active) {",
  `  [${JUMP_ATTR}] { outline-color: Highlight; }`,
  "}",
].join("\n");
// how long the outline stays
export const MY_LEARNING_JUMP_MS = 2400;

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// what takes focus when the learner is taken to el: the header of its DDD
// block, else the first thing in it that takes focus, else el itself
function focusTargetOf(el) {
  const root = el.shadowRoot;
  if (root) {
    const header = root.querySelector(".ddd-block-header");
    if (header) {
      return header;
    }
    const first = root.querySelector(FOCUSABLE);
    if (first) {
      return first;
    }
  }
  return el;
}

/**
 * Take the learner to an element on the page: scroll the content container
 * the element is in (smooth unless reduced motion), move focus to its
 * header (or what takes focus in it) and outline it for a moment (no
 * animation with reduced motion).
 * @param {HTMLElement} el
 * @returns {HTMLElement} what got focus
 */
export function jumpToLearnerItem(el) {
  if (!el) {
    return null;
  }
  const doc = globalThis.document;
  if (doc && doc.head && !doc.getElementById(JUMP_STYLE_ID)) {
    const style = doc.createElement("style");
    style.id = JUMP_STYLE_ID;
    style.textContent = JUMP_STYLE;
    doc.head.appendChild(style);
  }
  const reduce = prefersDDDReducedMotion();
  if (typeof el.scrollIntoView === "function") {
    el.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "center",
    });
  }
  const target = focusTargetOf(el);
  if (target.tabIndex < 0 && !target.hasAttribute("tabindex")) {
    target.setAttribute("tabindex", "-1");
    target.addEventListener("blur", () => target.removeAttribute("tabindex"), {
      once: true,
    });
  }
  target.focus({ preventScroll: true });
  el.setAttribute(JUMP_ATTR, "");
  clearTimeout(el.__myLearningJump);
  el.__myLearningJump = setTimeout(
    () => el.removeAttribute(JUMP_ATTR),
    MY_LEARNING_JUMP_MS,
  );
  return target;
}

/**
 * How the panel opens the full My learning dialog (my-learning.js, loaded
 * when asked for). Tests replace open.
 */
export const MyLearningLauncher = {
  async open(origin, options) {
    const mod =
      await import("@haxtheweb/haxcms-elements/lib/ui-components/progress/my-learning.js");
    return mod.openMyLearning(origin, options);
  },
};

const fill = (str, values) =>
  String(str).replace(/\{([a-zA-Z]+)\}/g, (m, k) =>
    Object.prototype.hasOwnProperty.call(values, k) ? String(values[k]) : m,
  );

/**
 * `my-learning-panel`
 * `This page and All pages: what the visitor has done, from this device`
 *
 * The panel the My learning button opens (haxtheweb/issues#3267, #3269),
 * built on the DDD block anatomy: a dialog with two tabs.
 * - This page: the page's ring and "49% · 1 of 4 done", then one row per
 *   item of pageProgress() (reading, video, collapse, quiz, ...) with its
 *   type icon in its own ring, kind, name and status. A row not done yet is
 *   a button that closes the panel and takes the learner to that item
 *   (scrolls the content to it, focuses it, outlines it); a done row shows
 *   a check.
 * - All pages: the site ring and percent, "N of M pages done" and each top
 *   level outline item with its page icon in its ring and percent.
 * The footer says progress stays on this device and opens the full My
 * learning dialog (openMyLearning, scope site).
 *
 * Tabs follow the tabs pattern: arrow keys, Home and End move between them
 * (roving tabindex). Opened by my-learning-button as a popover; works on
 * its own too.
 *
 * @element my-learning-panel
 * @fires my-learning-panel-close - when it asks to be closed (Close,
 *   Escape, a row taken, Open My learning); detail { returnFocus }
 */
export class MyLearningPanel extends I18NMixin(DDDSuper(LitElement)) {
  static get tag() {
    return "my-learning-panel";
  }
  constructor() {
    super();
    this.tab = "page";
    this._page = null;
    this._site = null;
    this._rows = [];
    this._outline = [];
    this._pageTitle = "";
    this.t = {
      ...this.t,
      myLearning: "My learning",
      close: "Close",
      thisPage: "This page",
      allPages: "All pages",
      pageSummary: "{percent}% · {done} of {total} done",
      pagesDone: "{done} of {total} pages done",
      pagesCount: "{count} pages",
      percent: "{percent}%",
      goTo: "Go to {name}",
      openMyLearning: "Open My learning",
      savedOnDevice:
        "Saved on this device only. Your instructor can't see it unless your course connects a learning record store.",
      reading: "Reading",
      video: "Video",
      audio: "Audio",
      collapse: "Expand / collapse",
      quiz: "Quiz",
      checklist: "Checklist",
      game: "Game",
      cards: "Cards",
      activity: "Activity",
      notStarted: "Not started",
      percentRead: "{percent}% read",
      read: "Read",
      watchedPercent: "Watched {percent}%",
      watched: "Watched",
      listenedPercent: "Listened {percent}%",
      listened: "Listened",
      opened: "Opened",
      correct: "Correct",
      incorrect: "Incorrect",
      answered: "Answered",
      done: "Done",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../../../locales/", import.meta.url).href,
    });
    this.__disposer = [];
    this.addEventListener("keydown", this._onKeydown.bind(this));
  }
  static get properties() {
    return {
      ...super.properties,
      /**
       * Tab shown: "page" (This page) or "site" (All pages)
       */
      tab: { type: String, reflect: true },
      _page: { type: Object, state: true },
      _site: { type: Object, state: true },
      _rows: { type: Array, state: true },
      _outline: { type: Array, state: true },
      _pageTitle: { type: String, state: true },
    };
  }
  connectedCallback() {
    super.connectedCallback();
    LearnerProgress.start();
    this.__disposer.push(
      autorun(() => {
        const page = LearnerProgress.pageProgress();
        const site = LearnerProgress.siteProgress();
        const manifest = toJS(store.manifest);
        const title = store.activeTitle || "";
        Promise.resolve().then(() => {
          this._page = page;
          this._site = site;
          this._pageTitle = title;
          this._outline = this._outlineRows(manifest, site);
          this.refresh();
        });
      }),
    );
  }
  disconnectedCallback() {
    this.__disposer.forEach((d) => d());
    this.__disposer = [];
    super.disconnectedCallback();
  }
  /**
   * Pair the page items with the elements on the page again (the button
   * calls it as the panel opens)
   */
  refresh() {
    const page = this._page || LearnerProgress.pageProgress();
    const items = page && Array.isArray(page.items) ? page.items : [];
    const key = LearnerProgress.siteKey;
    const recordOf = (id) =>
      key && UserScaffoldInstance
        ? UserScaffoldInstance.readActivity(key, id)
        : null;
    const els = pairLearnerItems(
      items,
      learnerTrackableElements(),
      recordOf,
      learnerTrackableElements(null, true),
    );
    const rows = items.map((item, i) => {
      const kind = learnerItemKind(item);
      const rec =
        item.kind !== "reading" && item.key ? recordOf(item.key) : null;
      let name = "";
      if (kind === "reading") {
        name = this._pageTitle || store.activeTitle || "";
      } else {
        name =
          learnerItemName(els[i]) ||
          (rec && rec.name ? String(rec.name).slice(0, NAME_MAX) : "") ||
          this.t[kind] ||
          "";
      }
      return {
        key: item.key || `${kind}-${i}`,
        kind,
        name,
        progress: dddProgressValue(item.progress),
        done: Boolean(item.done),
        status: this._statusText(kind, item, rec),
        el: els[i],
      };
    });
    // reading first, then in the order the items sit on the page; items
    // not found on it keep their order at the end
    this._rows = rows
      .map((r, i) => ({ r, i }))
      .sort((a, b) => {
        const rank = (x) => (x.r.kind === "reading" ? 0 : x.r.el ? 1 : 2);
        if (rank(a) !== rank(b)) {
          return rank(a) - rank(b);
        }
        if (rank(a) === 1 && a.r.el !== b.r.el) {
          const pos = a.r.el.compareDocumentPosition(b.r.el);
          if (pos & globalThis.Node.DOCUMENT_POSITION_FOLLOWING) {
            return -1;
          }
          if (pos & globalThis.Node.DOCUMENT_POSITION_PRECEDING) {
            return 1;
          }
        }
        return a.i - b.i;
      })
      .map((x) => x.r);
  }
  // top level outline items with their page percent (the average over the
  // pages they hold that count)
  _outlineRows(manifest, site) {
    const items =
      manifest && Array.isArray(manifest.items) ? manifest.items : [];
    const visible = (i) =>
      i &&
      i.id &&
      !(
        i.metadata &&
        (i.metadata.hideInMenu || i.metadata.published === false)
      );
    const counted = new Set(LearnerProgress.pageIds());
    const byPage = site && site.percentByPage ? site.percentByPage : {};
    const kids = {};
    items.forEach((i) => {
      if (i && i.parent) {
        (kids[i.parent] = kids[i.parent] || []).push(i);
      }
    });
    const subtree = (item, out, depth) => {
      out.push(item);
      if (depth < 50) {
        (kids[item.id] || []).forEach((c) => subtree(c, out, depth + 1));
      }
      return out;
    };
    return items
      .filter((i) => visible(i) && !i.parent)
      .map((i) => {
        const pages = subtree(i, [], 0).filter((p) => counted.has(p.id));
        const sum = pages.reduce((t, p) => t + (Number(byPage[p.id]) || 0), 0);
        const hasKids = (kids[i.id] || []).some(visible);
        const meta = i.metadata || {};
        return {
          id: i.id,
          title: i.title || "",
          count: pages.length,
          hasKids,
          icon:
            meta.icon ||
            (meta.pageType ? iconFromPageType(meta.pageType) : "") ||
            (hasKids ? "icons:folder-open" : "icons:description"),
          percent: pages.length ? sum / pages.length : 0,
        };
      });
  }
  _statusText(kind, item, rec) {
    const p = dddProgressPercent(item.progress);
    const t = this.t;
    if (kind === "reading") {
      return item.done
        ? t.read
        : p
          ? fill(t.percentRead, { percent: p })
          : t.notStarted;
    }
    if (kind === "video") {
      return item.done
        ? t.watched
        : p
          ? fill(t.watchedPercent, { percent: p })
          : t.notStarted;
    }
    if (kind === "audio") {
      return item.done
        ? t.listened
        : p
          ? fill(t.listenedPercent, { percent: p })
          : t.notStarted;
    }
    if (kind === "collapse") {
      return item.done ? t.opened : t.notStarted;
    }
    if (kind === "quiz") {
      const status = rec && rec.status ? rec.status : "";
      if (item.done) {
        return status === "incorrect" ? t.answered : t.correct;
      }
      return status === "incorrect" ? t.incorrect : t.notStarted;
    }
    if (item.done) {
      return t.done;
    }
    return p ? fill(t.percent, { percent: p }) : t.notStarted;
  }
  static get styles() {
    return [
      super.styles,
      DDDBlockStyles,
      ...DDDProgressRingStyles,
      css`
        :host {
          display: block;
          box-sizing: border-box;
          width: min(calc(100vw - var(--ddd-spacing-4)), 420px);
          line-height: var(--ddd-lh-120);
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          font-family: var(--ddd-font-navigation);
          --ddd-block-background: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
        }
        :host([popover]) {
          margin: 0;
          padding: 0;
          border: none;
          background: transparent;
          overflow: visible;
          inset: auto;
        }
        :host([popover]:not(:popover-open)) {
          display: none;
        }
        .lp {
          display: flex;
          flex-direction: column;
          max-height: var(--my-learning-panel-max-height, 80vh);
          box-shadow: var(--ddd-boxShadow-md);
        }
        .ddd-block-title {
          font-size: var(--ddd-font-size-xs);
        }
        .ddd-block-label:empty {
          display: none;
        }
        .lp-tabs {
          display: flex;
          gap: var(--ddd-spacing-1);
          padding: var(--ddd-spacing-2) var(--ddd-spacing-4) 0;
          border-bottom: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
        }
        .lp-tab {
          margin: 0;
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          border: none;
          border-bottom: var(--ddd-border-size-md) solid transparent;
          background: transparent;
          color: inherit;
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          cursor: pointer;
        }
        .lp-tab[aria-selected="true"] {
          border-bottom-color: light-dark(
            var(--ddd-theme-default-beaverBlue),
            var(--ddd-theme-default-skyBlue)
          );
          font-weight: var(--ddd-font-weight-bold);
        }
        .lp-tab:hover {
          border-bottom-color: light-dark(
            var(--ddd-theme-default-limestoneGray),
            var(--ddd-theme-default-limestoneLight)
          );
        }
        .lp-tab[aria-selected="true"]:hover {
          border-bottom-color: light-dark(
            var(--ddd-theme-default-beaverBlue),
            var(--ddd-theme-default-skyBlue)
          );
        }
        .lp-tab:focus-visible,
        .lp-go:focus-visible,
        .lp-open:focus-visible,
        .lp-pane:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: calc(-1 * var(--ddd-focus-offset));
        }
        .lp-pane {
          overflow-y: auto;
          min-height: 0;
          flex: 1 1 auto;
        }
        .lp-pane[hidden] {
          display: none;
        }
        .lp-summary {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-3);
          padding: var(--ddd-spacing-3) var(--ddd-spacing-4);
        }
        .lp-summary .ddd-ring {
          --ddd-component-progress-ring-size: var(--ddd-icon-lg);
          --ddd-component-progress-ring-icon-size: var(--ddd-icon-xxs);
        }
        .lp-text {
          display: flex;
          flex-direction: column;
          flex: 1 1 auto;
          min-width: 0;
        }
        .lp-name {
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .lp-kind,
        .lp-status {
          font-size: var(--ddd-font-size-4xs);
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
        }
        .lp-status {
          flex: none;
          font-variant-numeric: tabular-nums;
        }
        .lp-list {
          list-style: none;
          margin: 0;
          padding: 0 var(--ddd-spacing-2) var(--ddd-spacing-2);
        }
        .lp-row,
        .lp-go {
          margin: 0;
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-3);
          padding: var(--ddd-spacing-2);
          border-radius: var(--ddd-radius-sm);
        }
        .lp-row.has-go {
          padding: 0;
        }
        .lp-go {
          box-sizing: border-box;
          width: 100%;
          margin: 0;
          border: none;
          background: transparent;
          color: inherit;
          font: inherit;
          text-align: start;
          cursor: pointer;
          --simple-icon-color: currentColor;
        }
        .lp-go:hover,
        .lp-go:focus-visible {
          background-color: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-theme-default-slateGray)
          );
        }
        .lp-arrow {
          flex: none;
          --simple-icon-width: var(--ddd-icon-4xs);
          --simple-icon-height: var(--ddd-icon-4xs);
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
        }
        .lp-foot {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--ddd-spacing-2);
        }
        .lp-foot p {
          margin: 0;
          flex: 1 1 60%;
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
        }
        .lp-open {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          min-height: var(--ddd-control-height-sm);
          margin: 0;
          padding: 0 var(--ddd-spacing-3);
          border: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-linkLight)
          );
          border-radius: var(--ddd-radius-rounded);
          background: transparent;
          color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-linkLight)
          );
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          cursor: pointer;
          --simple-icon-color: currentColor;
          --simple-icon-width: var(--ddd-icon-4xs);
          --simple-icon-height: var(--ddd-icon-4xs);
        }
        .lp-open:hover {
          background-color: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-theme-default-slateGray)
          );
        }
        .sr-only {
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
          .lp-tab[aria-selected="true"] {
            border-bottom-color: Highlight;
          }
        }
      `,
    ];
  }
  render() {
    const page = this._page || { percent: 0, itemsDone: 0, itemsTotal: 0 };
    const site = this._site || { percent: 0, done: 0, total: 0 };
    const t = this.t;
    const pagePct = dddProgressPercent(page.percent);
    const sitePct = dddProgressPercent(site.percent);
    const pageTab = this.tab !== "site";
    const hasGo = this._rows.some((r) => !r.done && r.el);
    return html`<section
      class="lp ddd-block"
      role="dialog"
      aria-labelledby="heading"
      part="panel"
    >
      ${renderDDDBlockHeader({
        id: "heading",
        icon: "editor:insert-chart",
        label: "",
        title: t.myLearning,
        titleTag: "h2",
        actions: html`<button
          type="button"
          class="ddd-block-action"
          id="close"
          aria-label="${t.close}"
          title="${t.close}"
          @click="${this._closeClicked}"
        >
          <simple-icon-lite icon="icons:close"></simple-icon-lite>
        </button>`,
      })}
      <div class="lp-tabs" role="tablist" aria-label="${t.myLearning}">
        <button
          type="button"
          role="tab"
          class="lp-tab"
          id="tab-page"
          data-tab="page"
          aria-controls="pane-page"
          aria-selected="${pageTab ? "true" : "false"}"
          tabindex="${pageTab ? "0" : "-1"}"
          @click="${this._tabClicked}"
        >
          ${t.thisPage}
        </button>
        <button
          type="button"
          role="tab"
          class="lp-tab"
          id="tab-site"
          data-tab="site"
          aria-controls="pane-site"
          aria-selected="${pageTab ? "false" : "true"}"
          tabindex="${pageTab ? "-1" : "0"}"
          @click="${this._tabClicked}"
        >
          ${t.allPages}
        </button>
      </div>
      <div
        class="lp-pane"
        role="tabpanel"
        id="pane-page"
        aria-labelledby="tab-page"
        tabindex="${hasGo ? nothing : "0"}"
        ?hidden="${!pageTab}"
      >
        <div class="lp-summary">
          ${renderDDDProgressRing({
            percent: page.percent,
            icon: "editor:insert-chart",
          })}
          <span class="lp-text">
            <span class="lp-name">${this._pageTitle}</span>
            <span class="lp-kind"
              >${fill(t.pageSummary, {
                percent: pagePct,
                done: page.itemsDone || 0,
                total: page.itemsTotal || 0,
              })}</span
            >
          </span>
        </div>
        <ol class="lp-list" part="page-items">
          ${this._rows.map((r) => this.renderRow(r))}
        </ol>
      </div>
      <div
        class="lp-pane"
        role="tabpanel"
        id="pane-site"
        aria-labelledby="tab-site"
        tabindex="0"
        ?hidden="${pageTab}"
      >
        <div class="lp-summary">
          ${renderDDDProgressRing({
            percent: site.percent,
            glyph: html`<span>${fill(t.percent, { percent: sitePct })}</span>`,
          })}
          <span class="lp-text">
            <span class="lp-name">${t.allPages}</span>
            <span class="lp-kind"
              >${fill(t.pagesDone, {
                done: site.done || 0,
                total: site.total || 0,
              })}</span
            >
          </span>
        </div>
        <ol class="lp-list" part="site-items">
          ${this._outline.map((o) => this.renderOutlineRow(o))}
        </ol>
      </div>
      <div class="ddd-block-footer lp-foot">
        <p>${t.savedOnDevice}</p>
        <button
          type="button"
          class="lp-open"
          id="open"
          @click="${this._openClicked}"
        >
          <simple-icon-lite icon="editor:insert-chart"></simple-icon-lite>
          <span>${t.openMyLearning}</span>
        </button>
      </div>
    </section>`;
  }
  renderRow(r) {
    const icon = LEARNER_ITEM_ICONS[r.kind] || LEARNER_ITEM_ICONS.activity;
    const inner = html`${renderDDDProgressRing({
        percent: r.done ? 1 : r.progress,
        icon,
      })}<span class="lp-text"
        ><span class="lp-kind">${this.t[r.kind] || this.t.activity}</span
        ><span class="lp-name">${r.name}</span></span
      ><span class="lp-status">${r.status}</span>`;
    if (!r.done && (r.el || r.kind === "reading")) {
      const label = fill(this.t.goTo, { name: r.name });
      return html`<li
        class="lp-row has-go"
        data-kind="${r.kind}"
        data-state="todo"
      >
        <button
          type="button"
          class="lp-go"
          title="${label}"
          data-key="${r.key}"
          @click="${(e) => this._go(e, r)}"
        >
          ${inner}
          <simple-icon-lite
            class="lp-arrow"
            icon="icons:arrow-downward"
            aria-hidden="true"
          ></simple-icon-lite>
        </button>
      </li>`;
    }
    return html`<li
      class="lp-row"
      data-kind="${r.kind}"
      data-state="${r.done ? "done" : "todo"}"
    >
      ${inner}
    </li>`;
  }
  renderOutlineRow(o) {
    const pct = fill(this.t.percent, {
      percent: dddProgressPercent(o.percent),
    });
    return html`<li class="lp-row" data-id="${o.id}">
      ${renderDDDProgressRing({ percent: o.percent, icon: o.icon })}
      <span class="lp-text"
        ><span class="lp-name">${o.title}</span>${
          o.hasKids
            ? html`<span class="lp-kind"
                >${fill(this.t.pagesCount, { count: o.count })}</span
              >`
            : nothing
        }</span
      >
      <span class="lp-status">${pct}</span>
    </li>`;
  }
  /**
   * Move focus into the panel: the selected tab
   */
  focusFirst() {
    const tab =
      this.shadowRoot &&
      this.shadowRoot.querySelector('.lp-tab[aria-selected="true"]');
    if (tab) {
      tab.focus();
    }
  }
  /**
   * Ask to be closed (the button hides the popover and, when returnFocus,
   * puts focus back on itself)
   */
  close(returnFocus = true) {
    this.dispatchEvent(
      new CustomEvent("my-learning-panel-close", {
        bubbles: true,
        composed: true,
        detail: { returnFocus },
      }),
    );
  }
  _closeClicked() {
    this.close(true);
  }
  _tabClicked(e) {
    this._selectTab(e.currentTarget.getAttribute("data-tab"), false);
  }
  async _selectTab(tab, focus) {
    this.tab = tab === "site" ? "site" : "page";
    if (focus) {
      await this.updateComplete;
      this.focusFirst();
    }
  }
  _onKeydown(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      this.close(true);
      return;
    }
    const path = e.composedPath ? e.composedPath() : [];
    const onTab = path.some(
      (n) => n && n.getAttribute && n.getAttribute("role") === "tab",
    );
    if (!onTab) {
      return;
    }
    const order = ["page", "site"];
    const at = order.indexOf(this.tab === "site" ? "site" : "page");
    let next = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      next = order[(at + 1) % order.length];
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      next = order[(at + order.length - 1) % order.length];
    } else if (e.key === "Home") {
      next = order[0];
    } else if (e.key === "End") {
      next = order[order.length - 1];
    }
    if (next) {
      e.preventDefault();
      this._selectTab(next, true);
    }
  }
  _go(e, r) {
    e.preventDefault();
    let el = r.el;
    if (r.kind === "reading") {
      el = learnerReadingTarget(r.progress);
    }
    this.close(false);
    if (el) {
      // after the panel is gone, so focus lands on the item
      Promise.resolve().then(() => jumpToLearnerItem(el));
    }
  }
  async _openClicked() {
    const origin = this.getRootNode().host || this;
    this.close(false);
    return MyLearningLauncher.open(origin, {
      title: this.t.myLearning,
      scope: "site",
    });
  }
}
globalThis.customElements.define(MyLearningPanel.tag, MyLearningPanel);
