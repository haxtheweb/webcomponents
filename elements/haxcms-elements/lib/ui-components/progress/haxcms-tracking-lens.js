/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import {
  DDDProgressRingStyles,
  dddProgressPercent,
  renderDDDProgressRing,
} from "@haxtheweb/d-d-d/lib/DDDProgressRing.js";
import { HaxUiAdminTokens } from "@haxtheweb/d-d-d/lib/HaxUiAdminTokens.js";
import { HaxUiDialogTitlebarStyles } from "@haxtheweb/d-d-d/lib/HaxUiDialogFrame.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { autorun, toJS } from "mobx";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { LearnerProgress } from "@haxtheweb/haxcms-elements/lib/core/haxcms-learner-progress.js";
import { UserScaffoldInstance } from "@haxtheweb/user-scaffold/user-scaffold.js";
import { UABroker } from "@haxtheweb/user-action/lib/UserActionBroker.js";
import { describeResponse } from "@haxtheweb/user-action/lib/xapi.js";
import {
  XAPI_VOCABULARY,
  XAPI_DECLARED_SILENT,
} from "@haxtheweb/user-action/lib/xapi-vocabulary.js";
import {
  LEARNER_ITEM_ICONS,
  learnerItemKind,
  learnerItemName,
  learnerTrackableElements,
  pairLearnerItems,
} from "@haxtheweb/haxcms-elements/lib/ui-components/progress/my-learning-panel.js";

// An element that sends nothing on purpose says so next to its code (an
// xapiVocabulary getter with tracks: false and a reason), and
// generate-xapi-vocabulary.mjs collects those as XAPI_DECLARED_SILENT, so
// "not declared" means nobody has decided yet.
const silentEntry = (tag) =>
  Object.prototype.hasOwnProperty.call(XAPI_DECLARED_SILENT, tag)
    ? XAPI_DECLARED_SILENT[tag]
    : null;
// never drawn: structure, not blocks
const SKIP = ["page-break", "replace-tag", "haxcms-site-builder"];
// an authorable block: a defined element HAX can edit (it has haxProperties)
function isBlockTag(tag) {
  if (tag.indexOf("-") === -1 || SKIP.indexOf(tag) !== -1) {
    return false;
  }
  const C = globalThis.customElements.get(tag);
  return Boolean(C && "haxProperties" in C);
}
// "a11y-tabs" -> "A11y tabs"
function tagLabel(tag) {
  const s = String(tag).replace(/-/g, " ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}
const STORAGE_KEY = "haxcms-tracking-lens";
const RAIL_GAP = 16;
const FLAG = 36;
const PANEL_H = 280;

/**
 * Which of the four groups an element is in
 * @param {HTMLElement} el
 * @returns {"counts"|"tracked"|"none"|"undeclared"}
 */
export function trackingCategory(el) {
  const tag = el.tagName.toLowerCase();
  const v = XAPI_VOCABULARY[tag];
  if (v) {
    const opted =
      typeof el.xapiCountsTowardCompletion === "function" &&
      el.xapiCountsTowardCompletion() === false;
    return v.countsTowardCompletion && !opted ? "counts" : "tracked";
  }
  if (silentEntry(tag)) {
    return "none";
  }
  return "undeclared";
}

const CATEGORY_ICON = {
  counts: "editor:insert-chart",
  tracked: "av:fiber-manual-record",
  undeclared: "icons:help-outline",
  none: "icons:remove-circle-outline",
  reading: "icons:subject",
};

const fill = (str, values) =>
  String(str).replace(/\{([a-zA-Z]+)\}/g, (m, k) =>
    Object.prototype.hasOwnProperty.call(values, k) ? String(values[k]) : m,
  );

/**
 * `haxcms-tracking-lens`
 * `Editor-only view of what a page can track`
 *
 * Flags in the margin beside every block on the page: what counts toward
 * the page being done (with its progress ring), what sends statements but
 * does not count, what was declared to send nothing and what nobody has
 * declared yet. A docked panel lists the statements as they are sent and
 * the page's completion math. Switched on from My learning (editors only),
 * or from Insights > Learning activity straight onto a page. Statements
 * are recorded as usual while it is on; it only shows them.
 *
 * @element haxcms-tracking-lens
 */
export class HAXCMSTrackingLens extends I18NMixin(DDDSuper(LitElement)) {
  static get tag() {
    return "haxcms-tracking-lens";
  }
  constructor() {
    super();
    this.on = false;
    this.panel = true;
    this.tab = "feed";
    this.showNone = false;
    this._blocks = [];
    this._feed = [];
    this._page = null;
    this._focus = null;
    this._detail = null;
    this._seq = 0;
    this.t = {
      ...this.t,
      lens: "What's tracked",
      lensLabel: "Editor view",
      turnOff: "Turn off What's tracked",
      collapse: "Collapse panel",
      expand: "Show the What's tracked panel",
      counts: "Counts toward page",
      tracked: "Tracked",
      undeclared: "Not declared",
      none: "Sends nothing (declared)",
      reading: "Reading this page",
      showNone: "Show blocks that send nothing",
      liveStatements: "Live statements",
      onThisPage: "On this page",
      pageSummary: "{percent}% · {done} of {total} done",
      shareOf: "1 of {total} items on this page",
      newestFirst: "Newest first. Saved to your learner record like any visit.",
      clear: "Clear list",
      nothingYet:
        "Nothing sent yet. Watch the video, open the collapse or answer the question.",
      noStatement: "No statement sent",
      interactedWith: "Used {name}: nothing was sent",
      verbs: "Verbs it can send",
      doneWhen: "Done when",
      resultFields: "Result fields",
      progressNow: "Progress now",
      whyFlagged: "Why it's flagged",
      undeclaredText:
        "This block isn't in the xAPI vocabulary and hasn't declared that it sends nothing, so no one has decided whether it should track. Using it sends no statement.",
      undeclaredFix:
        "Fix: add static get xapiVocabulary() to the element, or declare { tracks: false } if it should stay silent.",
      noneText: "Declared to send nothing: {reason}.",
      readingText:
        "Scrolling through the page's content counts as one item, the same as each block that counts. It is read at 90% scrolled, not the last pixel.",
      checkpointText:
        "It is a reading checkpoint: Reading this page notes when it stayed on screen, without a statement of its own.",
      checkpointSeen: "Seen on this visit or before.",
      checkpointNotSeen: "Not seen yet.",
      checkpointLine:
        "Reading checkpoints seen: {seen} of {total}. The page is read once 80% of them were on screen for a moment.",
      mathTitle: "How this page's percent works",
      mathLine: "{items} ÷ {total} items",
      copyJson: "Copy JSON",
      copied: "Copied",
      jumpTo: "Show {name} on the page",
      element: "Element",
      viewJson: "Show the statement",
      hideJson: "Hide the statement",
      notStarted: "Not started",
      done: "Done",
      editingPaused: "Paused while editing",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL(
          "../../../locales/haxcms-tracking-lens.en.json",
          import.meta.url,
        ).href + "/../",
    });
    this.__disposer = [];
    this._onScroll = () => this._schedule();
    this._onClickCapture = (e) => this._ghostCheck(e);
  }
  static get properties() {
    return {
      ...super.properties,
      on: { type: Boolean, reflect: true },
      panel: { type: Boolean, reflect: true },
      tab: { type: String },
      showNone: { type: Boolean, attribute: "show-none" },
      _blocks: { type: Array, state: true },
      _feed: { type: Array, state: true },
      _page: { type: Object, state: true },
      _focus: { type: String, state: true },
      _detail: { type: String, state: true },
      _editing: { type: Boolean, state: true },
      _openRow: { type: Number, state: true },
    };
  }
  /**
   * The one lens on the page
   */
  static get instance() {
    let el = globalThis.document.querySelector(HAXCMSTrackingLens.tag);
    if (!el) {
      el = globalThis.document.createElement(HAXCMSTrackingLens.tag);
      globalThis.document.body.appendChild(el);
    }
    return el;
  }
  static get remembered() {
    try {
      return globalThis.sessionStorage.getItem(STORAGE_KEY) === "on";
    } catch {
      return false;
    }
  }
  connectedCallback() {
    super.connectedCallback();
    LearnerProgress.start();
    this.__disposer.push(
      UABroker.subscribe((e) => this._onStatement(e)),
      autorun(() => {
        const page = LearnerProgress.pageProgress();
        const edit = Boolean(store.editMode);
        const logged = Boolean(store.isLoggedIn);
        toJS(store.activeItemContent);
        Promise.resolve().then(() => {
          this._page = page;
          this._editing = edit;
          if (!logged && this.on) {
            this.setOn(false);
          }
          this._scan();
        });
      }),
    );
    globalThis.addEventListener("scroll", this._onScroll, true);
    globalThis.addEventListener("resize", this._onScroll);
    globalThis.addEventListener("click", this._onClickCapture, true);
    globalThis.addEventListener(
      "json-outline-schema-active-body-changed",
      this._onScroll,
    );
  }
  disconnectedCallback() {
    this.__disposer.forEach((d) => d());
    this.__disposer = [];
    globalThis.removeEventListener("scroll", this._onScroll, true);
    globalThis.removeEventListener("resize", this._onScroll);
    globalThis.removeEventListener("click", this._onClickCapture, true);
    super.disconnectedCallback();
  }
  /**
   * Turn the lens on or off (remembered for this browser tab, so it stays
   * on from page to page)
   */
  setOn(value) {
    this.on = Boolean(value);
    try {
      if (this.on) {
        globalThis.sessionStorage.setItem(STORAGE_KEY, "on");
      } else {
        globalThis.sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // storage off: on for this page only
    }
    this._detail = null;
    this._focus = null;
    this.dispatchEvent(
      new CustomEvent("haxcms-tracking-lens-changed", {
        bubbles: true,
        composed: true,
        detail: { on: this.on },
      }),
    );
    this._scan();
  }
  updated(changed) {
    if (super.updated) {
      super.updated(changed);
    }
    if (changed.has("panel") || changed.has("on")) {
      this._schedule();
    }
  }
  // ---------- what is on the page ----------
  _content() {
    return store.themeElement || null;
  }
  _scan() {
    const theme = this._content();
    if (!theme) {
      this._blocks = [];
      return;
    }
    const all = Array.from(theme.querySelectorAll("*")).filter((el) => {
      const tag = el.tagName.toLowerCase();
      if (!isBlockTag(tag)) {
        return false;
      }
      // a block inside another block is part of it (a11y-tab in a11y-tabs)
      let p = el.parentElement;
      while (p && p !== theme) {
        if (isBlockTag(p.tagName.toLowerCase())) {
          return false;
        }
        p = p.parentElement;
      }
      return true;
    });
    const page = this._page || LearnerProgress.pageProgress();
    const items = page && Array.isArray(page.items) ? page.items : [];
    const key = LearnerProgress.siteKey;
    const recordOf = (id) =>
      key && UserScaffoldInstance
        ? UserScaffoldInstance.readActivity(key, id)
        : null;
    const paired = pairLearnerItems(
      items,
      learnerTrackableElements(),
      recordOf,
      learnerTrackableElements(null, true),
    );
    const total = items.length || 1;
    const prev = new Map(this._blocks.map((b) => [b.el, b]));
    const before = (el) => prev.get(el) || {};
    const blocks = [
      {
        id: "reading",
        el: null,
        tag: "haxcms-page",
        cat: "counts",
        kind: "reading",
        name: this.t.reading,
        item: page ? page.reading : null,
        total,
        fired: before(null).fired,
      },
    ];
    all.forEach((el) => {
      const tag = el.tagName.toLowerCase();
      const cat = trackingCategory(el);
      const at = paired.indexOf(el);
      const item = at !== -1 ? items[at] : null;
      blocks.push({
        id: before(el).id || `b${++this._seq}`,
        fired: before(el).fired,
        el,
        tag,
        cat,
        kind: item ? learnerItemKind(item) : learnerItemKind({ tag }),
        name: learnerItemName(el) || tagLabel(tag),
        item,
        total,
      });
    });
    this._blocks = blocks;
    this._schedule();
  }
  _schedule() {
    if (this._raf) {
      return;
    }
    this._raf = globalThis.requestAnimationFrame(() => {
      this._raf = null;
      this.requestUpdate();
    });
  }
  // ---------- statements ----------
  _blockOf(element) {
    let node = element;
    while (node) {
      const b = this._blocks.find((x) => x.el === node);
      if (b) {
        return b;
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
  _onStatement({ statement, element }) {
    if (!statement || !statement.verb) {
      return;
    }
    const verb =
      (statement.verb.display && statement.verb.display["en-US"]) ||
      String(statement.verb.id).split("/").pop();
    const tagExt =
      statement.context &&
      statement.context.extensions &&
      statement.context.extensions[
        "https://haxtheweb.org/xapi/extensions/element"
      ];
    const tag =
      tagExt ||
      (element && element.tagName ? element.tagName.toLowerCase() : "");
    const reading = tag === "haxcms-page";
    const block = reading
      ? { id: "reading", name: this.t.reading }
      : element
        ? this._blockOf(element)
        : null;
    let summary = "";
    try {
      summary = describeResponse(statement) || "";
    } catch {
      summary = "";
    }
    const r = statement.result || {};
    const bits = [];
    if (typeof r.success === "boolean") {
      bits.push(r.success ? "correct" : "incorrect");
    }
    if (r.completion === true) {
      bits.push("completed");
    }
    const ext = r.extensions || {};
    Object.keys(ext).forEach((k) => {
      if (/\/progress$/.test(k)) {
        bits.push(`progress ${Math.round(Number(ext[k]) * 100)}%`);
      }
    });
    if (summary) {
      bits.push(summary);
    }
    this._feed = [
      {
        n: ++this._seq,
        ghost: false,
        verb,
        tag,
        blockId: block ? block.id : "",
        name: block
          ? block.name
          : (statement.object &&
              statement.object.definition &&
              statement.object.definition.name &&
              statement.object.definition.name["en-US"]) ||
            tag,
        summary: bits.join(" · "),
        time: new Date(),
        statement,
        saved: !store.editMode,
      },
      ...this._feed,
    ].slice(0, 200);
    const real = block ? this._blocks.find((b) => b.id === block.id) : null;
    if (real) {
      real.fired = real.fired || {};
      real.fired[verb] = true;
      this._pulse(real.id);
    }
    // the page's numbers move after the store records it
    setTimeout(() => this._scan(), 50);
  }
  // a click inside a block nobody has declared: say nothing was sent
  _ghostCheck(e) {
    if (!this.on) {
      return;
    }
    const path = e.composedPath ? e.composedPath() : [];
    if (path.indexOf(this) !== -1) {
      return;
    }
    const block = this._blocks.find(
      (b) => b.el && b.cat === "undeclared" && path.indexOf(b.el) !== -1,
    );
    if (!block) {
      return;
    }
    const last = this._feed[0];
    if (
      last &&
      last.ghost &&
      last.blockId === block.id &&
      Date.now() - last.time < 1200
    ) {
      return;
    }
    // give a real statement the chance to arrive first
    setTimeout(() => {
      this._feed = [
        {
          n: ++this._seq,
          ghost: true,
          verb: "",
          tag: block.tag,
          blockId: block.id,
          name: block.name,
          summary: fill(this.t.interactedWith, { name: tagLabel(block.tag) }),
          time: new Date(),
        },
        ...this._feed,
      ].slice(0, 200);
      this._pulse(block.id);
    }, 120);
  }
  _pulse(id) {
    this._pulsing = id;
    clearTimeout(this._pulseTimer);
    this._pulseTimer = setTimeout(() => {
      this._pulsing = null;
      this.requestUpdate();
    }, 900);
    this.requestUpdate();
  }
  // ---------- geometry ----------
  _rail() {
    const region = LearnerProgress.contentRegion();
    const theme = this._content();
    const box = (region || theme).getBoundingClientRect();
    return { x: box.right + RAIL_GAP, top: box.top, bottom: box.bottom };
  }
  _topInset() {
    const bar = globalThis.document.querySelector("haxcms-site-editor-ui");
    if (bar && bar.getBoundingClientRect) {
      const r = bar.getBoundingClientRect();
      if (r.height > 0 && r.top <= 1) {
        return Math.round(r.bottom);
      }
    }
    return 0;
  }
  static get styles() {
    return [
      super.styles,
      HaxUiAdminTokens,
      ...HaxUiDialogTitlebarStyles,
      ...DDDProgressRingStyles,
      css`
        :host {
          --lens-counts: light-dark(
            var(--ddd-theme-default-beaverBlue),
            var(--ddd-theme-default-skyBlue)
          );
          --lens-on-counts: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
          --lens-tracked: light-dark(
            var(--ddd-theme-default-link),
            var(--ddd-theme-default-linkLight)
          );
          --lens-tracked-soft: light-dark(
            #e3f0fa,
            color-mix(
              in srgb,
              var(--ddd-theme-default-linkLight) 14%,
              transparent
            )
          );
          --lens-undeclared: var(--ddd-theme-default-inventOrange);
          --lens-on-undeclared: var(--ddd-theme-default-potentialMidnight);
          --lens-none: light-dark(
            var(--ddd-theme-default-limestoneGray),
            var(--ddd-theme-default-slateGray)
          );
          --lens-stripes: repeating-linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.3) 0 4px,
            transparent 4px 8px
          );
          font-family: var(--ddd-font-navigation);
          color: var(--hax-ui-text);
        }
        :host(:not([on])) {
          display: none;
        }
        .layer {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 900;
        }
        /* ---------- margin flags ---------- */
        .flag {
          pointer-events: auto;
          position: absolute;
          box-sizing: border-box;
          width: ${FLAG}px;
          height: ${FLAG}px;
          margin: 0;
          padding: 0;
          display: grid;
          place-items: center;
          border: var(--ddd-border-sm);
          border-radius: 0 var(--ddd-radius-sm) var(--ddd-radius-sm) 0;
          cursor: pointer;
          --simple-icon-width: 18px;
          --simple-icon-height: 18px;
          box-shadow: var(--ddd-boxShadow-sm);
          transition: transform var(--hax-ui-duration, 150ms) ease;
        }
        .flag::before {
          content: "";
          position: absolute;
          left: -9px;
          top: -2px;
          width: 8px;
          height: ${FLAG}px;
          clip-path: polygon(100% 0, 100% 100%, 0 50%);
          background: inherit;
          border-left: 0;
        }
        .flag:hover,
        .flag:focus-visible,
        .flag[aria-expanded="true"] {
          transform: translateX(3px);
        }
        .flag:focus-visible {
          outline: var(
            --ddd-focus-ring,
            3px solid var(--ddd-theme-default-keystoneYellow)
          );
          outline-offset: 2px;
        }
        .flag[data-cat="counts"] {
          background: var(--hax-ui-surface);
          border-color: var(--lens-counts);
          color: var(--lens-counts);
          --ddd-component-progress-ring-size: 28px;
          --ddd-component-progress-ring-icon-size: 14px;
        }
        .flag[data-cat="counts"]::before {
          background: var(--lens-counts);
        }
        .flag[data-cat="tracked"] {
          background: var(--lens-tracked-soft);
          border-style: dashed;
          border-color: var(--lens-tracked);
          color: var(--lens-tracked);
        }
        .flag[data-cat="tracked"]::before {
          background: var(--lens-tracked);
        }
        .flag[data-cat="undeclared"] {
          background-color: var(--lens-undeclared);
          background-image: var(--lens-stripes);
          border-style: dotted;
          border-color: var(--lens-on-undeclared);
          color: var(--lens-on-undeclared);
        }
        .flag[data-cat="undeclared"]::before {
          background: var(--lens-undeclared);
        }
        .flag[data-cat="none"] {
          background: var(--hax-ui-surface);
          border-color: var(--lens-none);
          color: var(--hax-ui-text-muted);
        }
        .flag[data-cat="none"]::before {
          background: var(--lens-none);
        }
        .flag[data-pulse] {
          animation: lens-pulse 0.9s ease-out 1;
        }
        @keyframes lens-pulse {
          0% {
            box-shadow: 0 0 0 0
              color-mix(
                in srgb,
                var(--ddd-theme-default-skyBlue) 70%,
                transparent
              );
          }
          100% {
            box-shadow: 0 0 0 14px transparent;
          }
        }
        .box {
          position: absolute;
          box-sizing: border-box;
          border-radius: var(--ddd-radius-sm);
          outline-offset: 4px;
        }
        .box[data-cat="counts"] {
          outline: 3px solid var(--lens-counts);
        }
        .box[data-cat="tracked"] {
          outline: 3px dashed var(--lens-tracked);
        }
        .box[data-cat="undeclared"] {
          outline: 3px dotted var(--lens-undeclared);
          background: repeating-linear-gradient(
            135deg,
            color-mix(
                in srgb,
                var(--ddd-theme-default-inventOrange) 10%,
                transparent
              )
              0 8px,
            transparent 8px 16px
          );
        }
        .box[data-cat="none"] {
          outline: 2px dashed var(--lens-none);
        }
        .box[data-pulse] {
          animation: lens-pulse 0.9s ease-out 1;
        }
        @media (prefers-reduced-motion: reduce) {
          .flag,
          .flag[data-pulse],
          .box[data-pulse] {
            animation: none;
            transition: none;
          }
          .flag:hover,
          .flag:focus-visible,
          .flag[aria-expanded="true"] {
            transform: none;
          }
        }
        /* ---------- category chip ---------- */
        .chip {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-1);
          box-sizing: border-box;
          padding: 2px var(--ddd-spacing-2) 2px var(--ddd-spacing-1);
          border: var(--ddd-border-xs);
          border-radius: var(--ddd-radius-xs);
          font-size: 12px;
          font-weight: var(--ddd-font-weight-bold);
          line-height: 18px;
          white-space: nowrap;
          --simple-icon-width: 14px;
          --simple-icon-height: 14px;
        }
        .chip[data-cat="counts"] {
          background: var(--lens-counts);
          border-color: var(--lens-counts);
          color: var(--lens-on-counts);
        }
        .chip[data-cat="tracked"] {
          background: var(--lens-tracked-soft);
          border-style: dashed;
          border-color: var(--lens-tracked);
          color: var(--lens-tracked);
        }
        .chip[data-cat="undeclared"] {
          background-color: var(--lens-undeclared);
          background-image: var(--lens-stripes);
          border-style: dotted;
          border-color: var(--lens-on-undeclared);
          color: var(--lens-on-undeclared);
        }
        .chip[data-cat="none"] {
          background: var(--hax-ui-hover);
          border-color: var(--lens-none);
          color: var(--hax-ui-text-muted);
        }
        .verb {
          font-family:
            ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
          font-size: 12px;
          padding: 1px var(--ddd-spacing-2);
          border-radius: var(--ddd-radius-xs);
          background: var(--hax-ui-hover);
          border: var(--ddd-border-xs);
          border-color: var(--hax-ui-line);
          white-space: nowrap;
        }
        .verb[data-fired] {
          background: var(--hax-ui-accent);
          border-color: var(--hax-ui-accent);
          color: var(--hax-ui-on-accent);
        }
        /* ---------- details card ---------- */
        .card {
          pointer-events: auto;
          position: absolute;
          box-sizing: border-box;
          width: 340px;
          max-width: calc(100vw - 24px);
          background: var(--hax-ui-surface);
          color: var(--hax-ui-text);
          border: var(--ddd-border-xs);
          border-color: var(--hax-ui-line-strong);
          border-radius: var(--ddd-radius-sm);
          box-shadow: var(--ddd-boxShadow-md);
          font-size: 14px;
          line-height: 1.4;
          overflow: hidden;
        }
        .card .hax-ui-dialog-titlebar {
          height: 40px;
        }
        .card .hax-ui-dialog-title {
          font-size: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .card-body {
          padding: var(--ddd-spacing-3) var(--ddd-spacing-4)
            var(--ddd-spacing-4);
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-3);
        }
        .tagname {
          font-family:
            ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
          font-size: 12px;
          color: var(--hax-ui-text-muted);
        }
        .lbl {
          display: block;
          font-size: 11px;
          font-weight: var(--ddd-font-weight-bold);
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--hax-ui-text-muted);
          margin-bottom: 4px;
        }
        .row {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          align-items: center;
        }
        .progress-line {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
        }
        /* ---------- docked panel ---------- */
        .panel {
          pointer-events: auto;
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          height: var(--haxcms-tracking-lens-height, ${PANEL_H}px);
          display: grid;
          grid-template-columns: 300px minmax(0, 1fr);
          grid-template-rows: auto minmax(0, 1fr);
          box-sizing: border-box;
          background: var(--hax-ui-surface);
          border-top: var(--ddd-border-xs);
          border-color: var(--hax-ui-line-strong);
          box-shadow: 0 -4px 16px rgba(0, 3, 33, 0.12);
          z-index: 901;
          font-size: 14px;
        }
        .panel > .hax-ui-dialog-titlebar {
          grid-column: 1 / -1;
          height: 40px;
        }
        .side {
          overflow: auto;
          border-right: var(--ddd-border-xs);
          border-color: var(--hax-ui-line);
        }
        .main {
          display: flex;
          flex-direction: column;
          min-height: 0;
        }
        .panel .hax-ui-dialog-title {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          --simple-icon-width: 18px;
          --simple-icon-height: 18px;
        }
        .panel .hax-ui-dialog-title small {
          font-weight: var(--ddd-font-weight-regular);
          font-size: 12px;
          opacity: 0.8;
        }
        .summary {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-3);
          padding: var(--ddd-spacing-3) var(--ddd-spacing-4);
          border-bottom: var(--ddd-border-xs);
          border-color: var(--hax-ui-line);
          --ddd-component-progress-ring-size: var(--ddd-icon-lg, 40px);
          --ddd-component-progress-ring-icon-size: var(--ddd-icon-xxs, 18px);
        }
        .summary b {
          display: block;
          font-size: 14px;
        }
        .summary span {
          font-size: 12px;
          color: var(--hax-ui-text-muted);
        }
        .legend {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding: var(--ddd-spacing-2) var(--ddd-spacing-4)
            var(--ddd-spacing-3);
          border-bottom: var(--ddd-border-xs);
          border-color: var(--hax-ui-line);
        }
        .legend label {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--hax-ui-text-muted);
          cursor: pointer;
          min-height: 28px;
        }
        .tabs {
          display: flex;
          gap: var(--ddd-spacing-1);
          padding: 0 var(--ddd-spacing-4);
          border-bottom: var(--ddd-border-xs);
          border-color: var(--hax-ui-line);
        }
        .tabs button {
          margin: 0;
          padding: var(--ddd-spacing-2) var(--ddd-spacing-2);
          border: none;
          border-bottom: var(--ddd-border-size-md, 3px) solid transparent;
          background: transparent;
          color: inherit;
          font-family: var(--ddd-font-navigation);
          font-size: 13px;
          cursor: pointer;
          min-height: 40px;
        }
        .tabs button[aria-selected="true"] {
          border-bottom-color: var(--lens-counts);
          font-weight: var(--ddd-font-weight-bold);
        }
        .tabs button:focus-visible,
        .ev > button:focus-visible,
        .inv button:focus-visible,
        .small:focus-visible,
        .legend input:focus-visible {
          outline: var(
            --ddd-focus-ring,
            3px solid var(--ddd-theme-default-keystoneYellow)
          );
          outline-offset: -2px;
        }
        .pane[id="pane-page"] {
          display: grid;
          grid-template-columns: minmax(220px, 300px) minmax(0, 1fr);
          gap: 0 var(--ddd-spacing-4);
          align-content: start;
        }
        .pane[id="pane-page"] .math {
          grid-column: 1;
          grid-row: 1 / span 4;
        }
        .pane[id="pane-page"] .grp {
          grid-column: 2;
        }
        .grp h3:first-child {
          margin-top: 0;
        }
        @media (max-width: 760px) {
          .pane[id="pane-page"] {
            display: block;
          }
        }
        .pane {
          flex: 1 1 auto;
          min-height: 0;
          overflow: auto;
          padding: var(--ddd-spacing-3) var(--ddd-spacing-3);
        }
        .pane[hidden] {
          display: none;
        }
        .tools {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--ddd-spacing-2);
          font-size: 12px;
          color: var(--hax-ui-text-muted);
          margin: 0 var(--ddd-spacing-1) var(--ddd-spacing-2);
        }
        .small {
          flex: none;
          margin: 0;
          border: var(--ddd-border-xs);
          border-color: var(--hax-ui-line-strong);
          border-radius: var(--ddd-radius-xs);
          background: var(--hax-ui-surface);
          color: inherit;
          font: inherit;
          font-size: 12px;
          padding: 2px var(--ddd-spacing-2);
          min-height: 28px;
          cursor: pointer;
        }
        .small:hover {
          background: var(--hax-ui-hover);
        }
        .ev {
          border: var(--ddd-border-xs);
          border-color: var(--hax-ui-line);
          border-radius: var(--ddd-radius-sm);
          margin-bottom: 6px;
          background: var(--hax-ui-surface);
          overflow: hidden;
        }
        .ev > button {
          all: unset;
          box-sizing: border-box;
          width: 100%;
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 2px var(--ddd-spacing-2);
          align-items: center;
          padding: var(--ddd-spacing-2);
          cursor: pointer;
        }
        .ev > button:hover {
          background: var(--hax-ui-hover);
        }
        .ev .who {
          font-weight: var(--ddd-font-weight-medium, 500);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .ev time {
          font-size: 12px;
          color: var(--hax-ui-text-muted);
          font-variant-numeric: tabular-nums;
        }
        .ev .res {
          grid-column: 2 / 4;
          font-size: 12px;
          color: var(--hax-ui-text-muted);
        }
        .ev[data-ghost] {
          border-style: dashed;
          border-color: var(--lens-undeclared);
          background: repeating-linear-gradient(
            135deg,
            color-mix(
                in srgb,
                var(--ddd-theme-default-inventOrange) 9%,
                transparent
              )
              0 8px,
            transparent 8px 16px
          );
        }
        .ev[data-new] {
          animation: lens-new 1.2s ease-out 1;
        }
        @keyframes lens-new {
          from {
            background-color: var(--hax-ui-selected);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .ev[data-new] {
            animation: none;
          }
        }
        .ev pre {
          margin: 0;
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          border-top: var(--ddd-border-xs);
          border-color: var(--hax-ui-line);
          font-family:
            ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
          font-size: 11px;
          line-height: 1.45;
          white-space: pre-wrap;
          word-break: break-all;
          max-height: 260px;
          overflow: auto;
          background: var(--hax-ui-hover);
        }
        .ev .json-bar {
          display: flex;
          justify-content: flex-end;
          padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
          border-top: var(--ddd-border-xs);
          border-color: var(--hax-ui-line);
        }
        .empty {
          color: var(--hax-ui-text-muted);
          text-align: center;
          padding: var(--ddd-spacing-6) var(--ddd-spacing-3);
          font-size: 13px;
        }
        .math {
          border: var(--ddd-border-xs);
          border-color: var(--hax-ui-line);
          border-radius: var(--ddd-radius-sm);
          padding: var(--ddd-spacing-3);
          margin-bottom: var(--ddd-spacing-3);
          font-size: 13px;
        }
        .math code {
          display: block;
          margin-top: 6px;
          padding: 0;
          border: 0;
          background: none;
          color: inherit;
          font-family:
            ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
          font-size: 12px;
          line-height: 1.6;
        }
        .inv h3 {
          display: flex;
          align-items: center;
          gap: 6px;
          margin: var(--ddd-spacing-3) var(--ddd-spacing-1) var(--ddd-spacing-2);
          font-size: 12px;
          color: var(--hax-ui-text-muted);
        }
        .inv ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .inv li {
          margin: 0;
          padding: 0;
          font-size: 14px;
          line-height: 1.3;
        }
        .inv button {
          all: unset;
          font-size: 14px;
          line-height: 1.3;
          box-sizing: border-box;
          width: 100%;
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          padding: var(--ddd-spacing-2);
          border-radius: var(--ddd-radius-sm);
          cursor: pointer;
          --ddd-component-progress-ring-size: 28px;
          --ddd-component-progress-ring-icon-size: 14px;
        }
        .inv button:hover {
          background: var(--hax-ui-hover);
        }
        .inv .txt {
          flex: 1 1 auto;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }
        .inv .nm {
          font-weight: var(--ddd-font-weight-medium, 500);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .inv .st {
          flex: none;
          font-size: 12px;
          color: var(--hax-ui-text-muted);
          font-variant-numeric: tabular-nums;
        }
        .collapsed {
          pointer-events: auto;
          position: fixed;
          right: var(--ddd-spacing-4);
          bottom: var(--ddd-spacing-4);
          z-index: 901;
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          height: var(--ddd-control-height-sm, 40px);
          padding: 0 var(--ddd-spacing-3) 0 var(--ddd-spacing-1);
          border: 0;
          border-radius: var(--ddd-radius-rounded);
          background: var(
            --hax-ui-titlebar,
            light-dark(
              var(--ddd-theme-default-coalyGray),
              var(--ddd-theme-default-potentialMidnight)
            )
          );
          color: var(--ddd-theme-default-white);
          font-family: var(--ddd-font-navigation);
          font-size: 13px;
          font-weight: var(--ddd-font-weight-bold);
          box-shadow: var(--ddd-boxShadow-md);
          cursor: pointer;
          --ddd-component-progress-ring-size: 32px;
          --ddd-component-progress-ring-icon-size: 14px;
          --ddd-component-progress-ring-color: var(--ddd-theme-default-skyBlue);
          --ddd-component-progress-ring-track: var(
            --ddd-theme-default-limestoneGray
          );
          --ddd-component-progress-ring-on-color: var(
            --ddd-theme-default-potentialMidnight
          );
        }
        .collapsed:focus-visible {
          outline: var(
            --ddd-focus-ring,
            3px solid var(--ddd-theme-default-keystoneYellow)
          );
          outline-offset: 2px;
        }
        .paused {
          margin: var(--ddd-spacing-2) var(--ddd-spacing-4) 0;
          font-size: 12px;
          color: var(--hax-ui-text-muted);
        }
        @media (max-width: 760px) {
          .panel {
            height: 50vh;
            grid-template-columns: 1fr;
            grid-template-rows: auto auto minmax(0, 1fr);
          }
          .side {
            border-right: 0;
            border-bottom: var(--ddd-border-xs);
            border-color: var(--hax-ui-line);
          }
          .side .legend {
            display: none;
          }
        }
      `,
    ];
  }
  render() {
    if (!this.on) {
      return nothing;
    }
    if (this._editing) {
      return html`<button
        type="button"
        class="collapsed"
        @click="${() => this.setOn(false)}"
        title="${this.t.turnOff}"
      >
        <simple-icon-lite icon="icons:visibility"></simple-icon-lite>
        ${this.t.lens}: ${this.t.editingPaused}
      </button>`;
    }
    return html`<div class="layer">
        ${this.renderBox()} ${this.renderFlags()} ${this.renderCard()}
      </div>
      ${this.panel ? this.renderPanel() : this.renderCollapsed()}`;
  }
  // ---------- flags ----------
  _visible() {
    return this._blocks.filter((b) => this.showNone || b.cat !== "none");
  }
  _rect(b) {
    if (b.el) {
      const r = b.el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) {
        return null;
      }
      return r;
    }
    const region = LearnerProgress.contentRegion();
    return region ? region.getBoundingClientRect() : null;
  }
  renderFlags() {
    const rail = this._rail();
    const vh = globalThis.innerHeight;
    let last = -Infinity;
    return this._visible().map((b) => {
      const r = this._rect(b);
      if (!r) {
        return nothing;
      }
      let y = b.el ? r.top : rail.top + 8;
      if (y < last + FLAG + 4) {
        y = last + FLAG + 4;
      }
      last = y;
      const floor = this.panel ? vh - PANEL_H : vh;
      if (y < this._topInset() - 4 || y > floor - FLAG - 4) {
        return nothing;
      }
      const label = `${b.name}: ${this.t[b.cat]}`;
      const ring =
        b.cat === "counts"
          ? renderDDDProgressRing({
              percent: b.item ? (b.item.done ? 1 : b.item.progress) : 0,
              icon: LEARNER_ITEM_ICONS[b.kind] || CATEGORY_ICON.counts,
            })
          : html`<simple-icon-lite
              icon="${CATEGORY_ICON[b.cat]}"
            ></simple-icon-lite>`;
      return html`<button
        type="button"
        class="flag"
        data-cat="${b.cat}"
        ?data-pulse="${this._pulsing === b.id}"
        style="left:${Math.round(rail.x)}px;top:${Math.round(y)}px"
        aria-label="${label}"
        title="${label}"
        aria-expanded="${this._detail === b.id ? "true" : "false"}"
        data-id="${b.id}"
        @mouseenter="${() => (this._focus = b.id)}"
        @mouseleave="${() => (this._focus = null)}"
        @focus="${() => (this._focus = b.id)}"
        @blur="${() => (this._focus = null)}"
        @click="${(e) => this._toggleDetail(e, b.id)}"
      >
        ${ring}
      </button>`;
    });
  }
  renderBox() {
    const id = this._focus || this._detail || this._pulsing;
    const b = this._blocks.find((x) => x.id === id);
    if (!b || !b.el) {
      return nothing;
    }
    const r = this._rect(b);
    if (!r) {
      return nothing;
    }
    return html`<div
      class="box"
      data-cat="${b.cat}"
      ?data-pulse="${this._pulsing === b.id && !this._focus}"
      style="left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px"
    ></div>`;
  }
  _toggleDetail(e, id) {
    e.stopPropagation();
    this._detail = this._detail === id ? null : id;
  }
  renderCard() {
    const b = this._blocks.find((x) => x.id === this._detail);
    if (!b) {
      return nothing;
    }
    const flag =
      this.shadowRoot &&
      this.shadowRoot.querySelector(`.flag[data-id="${b.id}"]`);
    if (!flag) {
      return nothing;
    }
    const fr = flag.getBoundingClientRect();
    const w = 340;
    const left = Math.max(12, fr.left - w - 12);
    const floor = globalThis.innerHeight - (this.panel ? PANEL_H : 0);
    const top = Math.max(
      this._topInset() + 8,
      Math.min(fr.top - 8, floor - 360),
    );
    const v = XAPI_VOCABULARY[b.tag];
    const fired = b.fired || {};
    const pct = b.item ? (b.item.done ? 1 : b.item.progress) : 0;
    let body = nothing;
    if (b.cat === "undeclared") {
      body = html`<div>
          <span class="lbl">${this.t.whyFlagged}</span>${this.t.undeclaredText}
        </div>
        <div class="tagname">${this.t.undeclaredFix}</div>`;
    } else if (b.cat === "none") {
      const silent = silentEntry(b.tag) || {};
      const seen = this._checkpointSeen(b.el);
      body = html`<div>
          ${fill(this.t.noneText, { reason: silent.reason || "" })}
        </div>
        ${
          silent.readingCheckpoint
            ? html`<div>
                ${this.t.checkpointText}
                ${
                  seen === null
                    ? nothing
                    : html`<strong
                        >${
                          seen
                            ? this.t.checkpointSeen
                            : this.t.checkpointNotSeen
                        }</strong
                      >`
                }
              </div>`
            : nothing
        }`;
    } else if (v) {
      body = html`${
          b.cat === "counts"
            ? html`<div>
                <span class="lbl">${this.t.progressNow}</span>
                <div class="progress-line">
                  ${renderDDDProgressRing({
                    percent: pct,
                    icon: LEARNER_ITEM_ICONS[b.kind] || CATEGORY_ICON.counts,
                  })}
                  <span
                    >${
                      pct >= 1
                        ? this.t.done
                        : pct > 0
                          ? `${dddProgressPercent(pct)}%`
                          : this.t.notStarted
                    }
                    · ${fill(this.t.shareOf, { total: b.total })}</span
                  >
                </div>
              </div>`
            : nothing
        }
        ${
          b.id === "reading"
            ? html`<div>${this.t.readingText}</div>
                ${this.renderCheckpointLine()}`
            : nothing
        }
        <div>
          <span class="lbl">${this.t.verbs}</span>
          <div class="row">
            ${v.verbs.map(
              (vb) =>
                html`<span class="verb" ?data-fired="${fired[vb]}"
                  >${fired[vb] ? "✓ " : ""}${vb}</span
                >`,
            )}
          </div>
        </div>
        <div><span class="lbl">${this.t.doneWhen}</span>${v.done}</div>
        ${
          v.result && v.result.length
            ? html`<div>
                <span class="lbl">${this.t.resultFields}</span
                ><span class="tagname">${v.result.join(", ")}</span>
              </div>`
            : nothing
        }`;
    }
    return html`<div
      class="card"
      role="dialog"
      aria-label="${b.name}"
      style="left:${left}px;top:${top}px"
      @click="${(e) => e.stopPropagation()}"
    >
      <div class="hax-ui-dialog-titlebar">
        <h2 class="hax-ui-dialog-title">${b.name}</h2>
        <button
          type="button"
          class="hax-ui-dialog-close"
          aria-label="Close"
          @click="${() => {
            this._detail = null;
            if (flag) {
              flag.focus();
            }
          }}"
        >
          <simple-icon-lite icon="hax:admin-close"></simple-icon-lite>
        </button>
      </div>
      <div class="card-body">
        <div class="row">
          ${this.renderChip(b.cat)}
          <span class="tagname">&lt;${b.tag}&gt;</span>
        </div>
        ${body}
      </div>
    </div>`;
  }
  renderChip(cat) {
    return html`<span class="chip" data-cat="${cat}"
      ><simple-icon-lite icon="${CATEGORY_ICON[cat]}"></simple-icon-lite
      >${this.t[cat]}</span
    >`;
  }
  // ---------- panel ----------
  renderCollapsed() {
    const page = this._page || { percent: 0 };
    return html`<button
      type="button"
      class="collapsed"
      aria-label="${this.t.expand}"
      title="${this.t.expand}"
      @click="${() => (this.panel = true)}"
    >
      ${renderDDDProgressRing({ percent: page.percent, icon: "icons:visibility" })}
      ${this.t.lens} · ${this._feed.filter((f) => !f.ghost).length}
    </button>`;
  }
  // where page reading stands with its checkpoints (it stops looking once
  // the page is read, so a read page has nothing to show here)
  _checkpoints() {
    const reading = LearnerProgress.reading;
    return reading && reading.page && !reading.completed
      ? reading.checkpointStatus()
      : null;
  }
  // true / false for a checkpoint element, null when reading is not looking
  _checkpointSeen(el) {
    const status = this._checkpoints();
    const item = status ? status.items.find((c) => c.el === el) : null;
    return item ? item.seen : null;
  }
  renderCheckpointLine() {
    const status = this._checkpoints();
    return status && status.total
      ? html`<div>
          ${fill(this.t.checkpointLine, {
            seen: status.seen,
            total: status.total,
          })}
        </div>`
      : nothing;
  }
  renderPanel() {
    const page = this._page || { percent: 0, itemsDone: 0, itemsTotal: 0 };
    const feedTab = this.tab !== "page";
    const sent = this._feed.filter((f) => !f.ghost).length;
    return html`<aside class="panel" aria-labelledby="lens-title">
      <div class="hax-ui-dialog-titlebar">
        <h2 class="hax-ui-dialog-title" id="lens-title">
          <simple-icon-lite icon="icons:visibility"></simple-icon-lite>
          ${this.t.lens} <small>${this.t.lensLabel}</small>
        </h2>
        <button
          type="button"
          class="hax-ui-dialog-close"
          aria-label="${this.t.collapse}"
          title="${this.t.collapse}"
          @click="${() => (this.panel = false)}"
        >
          <simple-icon-lite icon="icons:expand-more"></simple-icon-lite>
        </button>
        <button
          type="button"
          class="hax-ui-dialog-close"
          aria-label="${this.t.turnOff}"
          title="${this.t.turnOff}"
          @click="${() => this.setOn(false)}"
        >
          <simple-icon-lite icon="hax:admin-close"></simple-icon-lite>
        </button>
      </div>
      <div class="side">
        <div class="summary">
          ${renderDDDProgressRing({
            percent: page.percent,
            icon: "editor:insert-chart",
          })}
          <div>
            <b>${store.activeTitle || ""}</b>
            <span
              >${fill(this.t.pageSummary, {
                percent: dddProgressPercent(page.percent),
                done: page.itemsDone || 0,
                total: page.itemsTotal || 0,
              })}</span
            >
          </div>
        </div>
        <div class="legend" aria-label="Key">
          ${this.renderChip("counts")} ${this.renderChip("tracked")}
          ${this.renderChip("undeclared")}
          <label
            ><input
              type="checkbox"
              .checked="${this.showNone}"
              @change="${(e) => (this.showNone = e.target.checked)}"
            />${this.renderChip("none")}</label
          >
        </div>
      </div>
      <div class="main">
        <div class="tabs" role="tablist" aria-label="${this.t.lens}">
          <button
            type="button"
            role="tab"
            id="tab-feed"
            aria-controls="pane-feed"
            aria-selected="${feedTab ? "true" : "false"}"
            tabindex="${feedTab ? "0" : "-1"}"
            @click="${() => (this.tab = "feed")}"
            @keydown="${this._tabKey}"
          >
            ${this.t.liveStatements} (${sent})
          </button>
          <button
            type="button"
            role="tab"
            id="tab-page"
            aria-controls="pane-page"
            aria-selected="${feedTab ? "false" : "true"}"
            tabindex="${feedTab ? "-1" : "0"}"
            @click="${() => (this.tab = "page")}"
            @keydown="${this._tabKey}"
          >
            ${this.t.onThisPage}
          </button>
        </div>
        <div
          class="pane"
          role="tabpanel"
          id="pane-feed"
          aria-labelledby="tab-feed"
          ?hidden="${!feedTab}"
        >
          ${this.renderFeed()}
        </div>
        <div
          class="pane inv"
          role="tabpanel"
          id="pane-page"
          aria-labelledby="tab-page"
          ?hidden="${feedTab}"
        >
          ${this.renderInventory(page)}
        </div>
      </div>
    </aside>`;
  }
  _tabKey(e) {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      this.tab = this.tab === "page" ? "feed" : "page";
      this.updateComplete.then(() => {
        const t = this.shadowRoot.querySelector(
          this.tab === "page" ? "#tab-page" : "#tab-feed",
        );
        if (t) {
          t.focus();
        }
      });
    }
  }
  renderFeed() {
    const head = html`<div class="tools">
      <span>${this.t.newestFirst}</span>
      <button type="button" class="small" @click="${() => (this._feed = [])}">
        ${this.t.clear}
      </button>
    </div>`;
    if (!this._feed.length) {
      return html`${head}
        <p class="empty">${this.t.nothingYet}</p>`;
    }
    const newest = this._feed[0].n;
    return html`${head}
      <div aria-live="polite" aria-relevant="additions">
        ${this._feed.map((f) => {
          const open = this._openRow === f.n;
          if (f.ghost) {
            return html`<div
              class="ev"
              data-ghost
              ?data-new="${f.n === newest}"
            >
              <button type="button" @click="${() => this._show(f.blockId)}">
                ${this.renderChip("undeclared")}
                <span class="who">${f.name}</span>
                <time>${f.time.toLocaleTimeString()}</time>
                <span class="res"
                  ><b>${this.t.noStatement}.</b> ${f.summary}</span
                >
              </button>
            </div>`;
          }
          return html`<div class="ev" ?data-new="${f.n === newest}">
            <button
              type="button"
              aria-expanded="${open ? "true" : "false"}"
              title="${open ? this.t.hideJson : this.t.viewJson}"
              @click="${() => {
                this._openRow = open ? 0 : f.n;
                this._show(f.blockId);
              }}"
            >
              <span class="verb" data-fired>${f.verb}</span>
              <span class="who">${f.name}</span>
              <time>${f.time.toLocaleTimeString()}</time>
              <span class="res"
                ><span class="tagname">${f.tag}</span>${
                  f.summary ? html` · ${f.summary}` : nothing
                }</span
              >
            </button>
            ${
              open
                ? html`<pre>${JSON.stringify(f.statement, null, 2)}</pre>
                    <div class="json-bar">
                      <button
                        type="button"
                        class="small"
                        @click="${(e) => this._copy(e, f.statement)}"
                      >
                        ${this.t.copyJson}
                      </button>
                    </div>`
                : nothing
            }
          </div>`;
        })}
      </div>`;
  }
  async _copy(e, statement) {
    const btn = e.currentTarget;
    try {
      await globalThis.navigator.clipboard.writeText(
        JSON.stringify(statement, null, 2),
      );
      btn.textContent = this.t.copied;
    } catch {
      btn.textContent = "Copy blocked";
    }
  }
  // scroll a block into view and outline it
  _show(id) {
    const b = this._blocks.find((x) => x.id === id);
    if (!b || !b.el) {
      return;
    }
    const reduce =
      globalThis.matchMedia &&
      globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
    b.el.scrollIntoView({
      block: "center",
      inline: "nearest",
      behavior: reduce ? "auto" : "smooth",
    });
    this._pulse(id);
  }
  renderInventory(page) {
    const counting = this._blocks.filter((b) => b.cat === "counts");
    const total = page.itemsTotal || counting.length || 1;
    const terms = counting
      .map((b) => {
        const p = b.item ? (b.item.done ? 1 : b.item.progress) : 0;
        return `${dddProgressPercent(p)}%`;
      })
      .join(" + ");
    const groups = ["counts", "tracked", "undeclared", "none"];
    return html`<div class="math">
        <b>${this.t.mathTitle}</b>
        <code
          >(${terms}) ÷ ${total} = ${dddProgressPercent(page.percent)}%</code
        >
      </div>
      ${groups.map((cat) => {
        const list = this._blocks.filter((b) => b.cat === cat);
        if (!list.length) {
          return nothing;
        }
        return html`<div class="grp">
          <h3>${this.renderChip(cat)} <span>(${list.length})</span></h3>
          <ul>
            ${list.map((b) => {
              const p = b.item ? (b.item.done ? 1 : b.item.progress) : 0;
              const status =
                cat === "counts"
                  ? p >= 1
                    ? this.t.done
                    : p > 0
                      ? `${dddProgressPercent(p)}%`
                      : this.t.notStarted
                  : cat === "tracked"
                    ? Object.keys(b.fired || {}).join(", ") || "—"
                    : "";
              return html`<li>
                <button
                  type="button"
                  title="${fill(this.t.jumpTo, { name: b.name })}"
                  @mouseenter="${() => (this._focus = b.id)}"
                  @mouseleave="${() => (this._focus = null)}"
                  @focus="${() => (this._focus = b.id)}"
                  @blur="${() => (this._focus = null)}"
                  @click="${() => {
                    this._show(b.id);
                    this._detail = b.id;
                  }}"
                >
                  ${
                    cat === "counts"
                      ? renderDDDProgressRing({
                          percent: p,
                          icon:
                            LEARNER_ITEM_ICONS[b.kind] || CATEGORY_ICON.counts,
                        })
                      : html`<simple-icon-lite
                          icon="${CATEGORY_ICON[cat]}"
                        ></simple-icon-lite>`
                  }
                  <span class="txt"
                    ><span class="nm">${b.name}</span
                    ><span class="tagname">${b.tag}</span></span
                  >
                  <span class="st">${status}</span>
                </button>
              </li>`;
            })}
          </ul>
        </div>`;
      })}`;
  }
}
globalThis.customElements.define(HAXCMSTrackingLens.tag, HAXCMSTrackingLens);

/**
 * Switch the lens on or off from anywhere (My learning, Insights, Merlin)
 */
export const TrackingLens = {
  get on() {
    const el = globalThis.document.querySelector(HAXCMSTrackingLens.tag);
    return Boolean(el && el.on);
  },
  set(value) {
    HAXCMSTrackingLens.instance.setOn(value);
  },
  toggle() {
    this.set(!this.on);
  },
};
globalThis.HAXCMSTrackingLens = TrackingLens;
// listen from the start, so the statements list has the whole visit
if (globalThis.document.body) {
  HAXCMSTrackingLens.instance;
} else if (globalThis.addEventListener) {
  // no global event target when the module is loaded on a server
  globalThis.addEventListener(
    "DOMContentLoaded",
    () => HAXCMSTrackingLens.instance,
  );
}
// on again after a page load when it was on in this tab
if (HAXCMSTrackingLens.remembered) {
  const go = () => {
    if (store.isLoggedIn) {
      TrackingLens.set(true);
    }
  };
  globalThis.addEventListener("haxcms-ready", go, { once: true });
  setTimeout(go, 2500);
}
