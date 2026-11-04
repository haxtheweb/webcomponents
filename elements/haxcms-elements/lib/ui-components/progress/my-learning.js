/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import {
  DDDBlockStyles,
  renderDDDBlockHeader,
} from "@haxtheweb/d-d-d/lib/DDDBlock.js";
import { DDDChartStyles } from "@haxtheweb/d-d-d/lib/DDDChart.js";
import { DDDTableStyles } from "@haxtheweb/d-d-d/lib/DDDTable.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { HaxUiAdminIcons } from "@haxtheweb/d-d-d/lib/HaxUiAdminIcons.js";
import {
  mapMenuProgressStyles,
  renderProgressMark,
} from "@haxtheweb/map-menu/lib/map-menu-progress.js";
import { autorun, toJS } from "mobx";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import {
  LearnerProgress,
  PAGE_ELEMENT,
} from "@haxtheweb/haxcms-elements/lib/core/haxcms-learner-progress.js";
import { UserScaffoldInstance } from "@haxtheweb/user-scaffold/user-scaffold.js";
import {
  describeResponse,
  XAPI_EXTENSIONS,
  XAPI_ITEM_DELIMITER,
} from "@haxtheweb/user-action/lib/xapi.js";
import { XAPI_VOCABULARY } from "@haxtheweb/user-action/lib/xapi-vocabulary.js";
import {
  SITE_ADMIN_TITLEBAR_STYLES,
  SITE_ADMIN_MODAL_SIZE,
} from "@haxtheweb/haxcms-elements/lib/core/admin/site-admin-sections.js";

export const MY_LEARNING_SCOPES = [
  "page",
  "parent",
  "branch",
  "children",
  "site",
];
export const MY_LEARNING_VIEWS = ["tags", "sections", "activity", "element"];
// order the Activity view lists its rows in
export const MY_LEARNING_KINDS = [
  "pages",
  "videos",
  "audio",
  "questions",
  "cards",
  "checklists",
  "games",
  "other",
];
const UNTAGGED = "(untagged)";
const RECENT_LIMIT = 10;
const RADAR_MIN_WIDTH = 520;

const visible = (i) =>
  i &&
  i.id &&
  !(i.metadata && (i.metadata.hideInMenu || i.metadata.published === false));

/**
 * Outline items in reading order (parents before children, siblings by
 * order), leaving out pages hidden from the menu or unpublished.
 * @param {Array} items site manifest items
 * @returns {Array}
 */
export function outlineInOrder(items) {
  const list = (Array.isArray(items) ? items : []).filter(visible);
  const ids = new Set(list.map((i) => i.id));
  const kids = new Map();
  list.forEach((i) => {
    const p = i.parent && ids.has(i.parent) ? i.parent : "";
    if (!kids.has(p)) {
      kids.set(p, []);
    }
    kids.get(p).push(i);
  });
  kids.forEach((l) =>
    l.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0)),
  );
  const out = [];
  const seen = new Set();
  const walk = (p) =>
    (kids.get(p) || []).forEach((i) => {
      if (!seen.has(i.id)) {
        seen.add(i.id);
        out.push(i);
        walk(i.id);
      }
    });
  walk("");
  return out;
}

/**
 * Which pages a scope covers, relative to a page.
 *   page      the page
 *   parent    the page's parent and the parent's direct children (this
 *             level of the outline)
 *   branch    the page's parent and everything under it
 *   children  every page below the page
 *   site      every page
 * A top level page acts as its own parent. An unknown page falls back to
 * the whole site.
 * @returns {{ scope: string, root: (string|null), pages: string[] }}
 */
export function scopePages(items, scope, pageId) {
  const ordered = outlineInOrder(items);
  const byId = new Map(ordered.map((i) => [i.id, i]));
  const all = ordered.map((i) => i.id);
  const known = byId.has(pageId);
  const want = MY_LEARNING_SCOPES.includes(scope) ? scope : "site";
  if (want === "site" || !known) {
    return { scope: "site", root: null, pages: all };
  }
  const parentOf = (id) => {
    const p = byId.get(id).parent;
    return p && byId.has(p) ? p : null;
  };
  const below = (id) => {
    const out = new Set();
    const walk = (pid) =>
      ordered.forEach((i) => {
        if (i.parent === pid && !out.has(i.id)) {
          out.add(i.id);
          walk(i.id);
        }
      });
    walk(id);
    return out;
  };
  let root = pageId;
  let set = new Set([pageId]);
  if (want === "parent") {
    root = parentOf(pageId) || pageId;
    set = new Set([
      root,
      ...ordered.filter((i) => i.parent === root).map((i) => i.id),
    ]);
  } else if (want === "branch") {
    root = parentOf(pageId) || pageId;
    set = new Set([root, ...below(root)]);
  } else if (want === "children") {
    set = below(pageId);
  }
  return { scope: want, root, pages: all.filter((id) => set.has(id)) };
}

/**
 * Plain activity kind of an element tag, from the xAPI vocabulary: pages,
 * videos, audio, questions, cards, checklists, games or other
 */
export function activityKindOf(tag) {
  const t = String(tag || "");
  if (t === PAGE_ELEMENT) {
    return "pages";
  }
  if (t.indexOf("flash-card") === 0) {
    return "cards";
  }
  const v = Object.prototype.hasOwnProperty.call(XAPI_VOCABULARY, t)
    ? XAPI_VOCABULARY[t]
    : null;
  const type = v && v.objectType ? String(v.objectType) : "";
  if (type.endsWith("/media")) {
    return t.indexOf("audio") !== -1 ? "audio" : "videos";
  }
  if (type.endsWith("/cmi.interaction")) {
    return "questions";
  }
  if (type.endsWith("/objective")) {
    return "checklists";
  }
  if (type.endsWith("/simulation")) {
    return "games";
  }
  return "other";
}

const firstText = (map) => {
  if (!map || typeof map !== "object") {
    return "";
  }
  const k = Object.keys(map)[0];
  return k ? String(map[k]) : "";
};

const titleCache = new Map();
/**
 * Human title of an element: its HAX gizmo title when the element is
 * defined and carries one, else the tag in words ("multiple choice")
 */
export function elementTitle(tag) {
  const t = String(tag || "");
  if (titleCache.has(t)) {
    return titleCache.get(t);
  }
  let title = "";
  try {
    const C = globalThis.customElements ? customElements.get(t) : null;
    const hp = C ? C.haxProperties : null;
    if (hp && typeof hp === "object" && hp.gizmo && hp.gizmo.title) {
      title = String(hp.gizmo.title);
    }
  } catch {
    title = "";
  }
  if (!title) {
    const words = t.replace(/-/g, " ").trim();
    title = words ? words.charAt(0).toUpperCase() + words.slice(1) : t;
  }
  titleCache.set(t, title);
  return title;
}

/**
 * File name for a download of a site's statements:
 * <site>-xapi-statements.json, the site part lower case letters, digits and
 * dashes only
 */
export function statementsFileName(site) {
  // runs of anything else become one dash; dashes at the ends are dropped
  // without a regex anchored on repeats (linear on any input)
  const parts = String(site || "site")
    .toLowerCase()
    .slice(0, 200)
    .split(/[^a-z0-9]/)
    .filter(Boolean);
  const base = parts.join("-").slice(0, 60);
  return `${base || "site"}-xapi-statements.json`;
}

const pct = (part, whole) =>
  whole > 0 ? Math.round((Math.min(part, whole) / whole) * 100) : 0;
// replace {key} placeholders with plain text (a function replacer, so a
// "$" in learner or author text is never read as a pattern)
const fill = (str, values) =>
  String(str).replace(/\{([a-zA-Z]+)\}/g, (m, k) =>
    Object.prototype.hasOwnProperty.call(values, k) ? String(values[k]) : m,
  );
const boolConverter = {
  fromAttribute: (value) => value !== null && value !== "false",
  // true is the default: no attribute; false is written so HAX keeps it
  toAttribute: (value) => (value ? null : "false"),
};

/**
 * Open my-learning for the whole site in a simple-modal dialog, with the
 * site admin titlebar (the user menu "My learning" item).
 * @param {HTMLElement} origin element the modal events dispatch from
 * @param {Object} [options] { title, scope }
 * @returns {HTMLElement} the my-learning element
 */
export async function openMyLearning(origin, options = {}) {
  await import("@haxtheweb/simple-modal/simple-modal.js");
  const el = globalThis.document.createElement("my-learning");
  el.setAttribute("scope", options.scope || "site");
  el.recent = true;
  el.preferences = true;
  el.setAttribute("in-dialog", "");
  const gap = "clamp(0px, 2vw - 8px, 32px)";
  (origin || globalThis).dispatchEvent(
    new CustomEvent("simple-modal-show", {
      bubbles: true,
      composed: true,
      cancelable: false,
      detail: {
        title: options.title || el.t.myLearning,
        titleIcon: HaxUiAdminIcons.author,
        elements: { content: el },
        invokedBy: origin,
        clone: false,
        modal: true,
        styles: {
          ...SITE_ADMIN_TITLEBAR_STYLES,
          ...SITE_ADMIN_MODAL_SIZE,
          "--simple-modal-width": `min(1200px, calc(100vw - 2 * ${gap}))`,
          "--simple-modal-max-width": "1200px",
          "--simple-modal-content-padding": "0",
          "--simple-modal-content-container-background":
            "light-dark(var(--ddd-theme-default-white), var(--ddd-theme-default-coalyGray))",
          "--simple-modal-z-index": "100000000",
        },
      },
    }),
  );
  return el;
}

/**
 * `my-learning`
 * `What the visitor has done on this site, from the learner profile on this device`
 *
 * A dashboard of the learner profile kept by user-scaffold on this device
 * (nothing is sent anywhere): summary tiles (pages done, activities done,
 * first-try accuracy, visits), a chart grouped by page tags, outline
 * sections, kind of activity or element (a radar-chart for 3 to 8 tag or
 * section groups, otherwise bars with the numbers written out and a data
 * table), the pages in scope with their progress, recent activity in plain
 * words and the preferences the profile remembers. Download my data saves
 * this site's xAPI statements as JSON; Clear removes this site's learner
 * data (or everything on this device) after a confirm step. Updates live as
 * statements are recorded.
 *
 * Scope is relative to the page it sits on: "page", "parent" (the parent
 * page and its direct children), "branch" (the parent and every page under
 * it, the default: dropped on the last page of a chapter it covers the
 * chapter), "children" (every page below this one) or "site". The user
 * menu opens it in a dialog with scope "site" and every panel on.
 *
 * @element my-learning
 * @fires learner-progress-cleared - on window, after Clear (from the learner progress bridge)
 */
export class MyLearning extends I18NMixin(DDDSuper(LitElement)) {
  static get tag() {
    return "my-learning";
  }
  constructor() {
    super();
    this.scope = "branch";
    this.view = "tags";
    this.tiles = true;
    this.chart = true;
    this.pages = true;
    this.recent = false;
    this.preferences = false;
    this.inDialog = false;
    this._view = "tags";
    this._data = null;
    this._statements = [];
    this._confirming = false;
    this._clearChoice = "site";
    this._message = "";
    this._radarReady = false;
    this._radarFailed = false;
    this.t = {
      ...this.t,
      myLearning: "My learning",
      downloadMyData: "Download my data (xAPI JSON)",
      clear: "Clear",
      clearMyData: "Clear my learning data",
      nothingYet:
        "Nothing recorded yet. Answer a question or watch a video and it shows up here.",
      pagesDone: "Pages done",
      pagesDoneDetail: "{percent}% done",
      activitiesDone: "Activities done",
      inProgress: "{count} in progress",
      firstTryAccuracy: "First-try accuracy",
      questionsAnswered: "{count} questions answered",
      visits: "Visits",
      lastVisit: "last: {when}",
      noValue: "None yet",
      groupBy: "Group by",
      viewTags: "Tags",
      viewSections: "Sections",
      viewActivity: "Activity",
      viewElement: "Element",
      chartTags: "Progress by tag",
      chartSections: "Progress by section",
      chartActivity: "Progress by activity",
      chartElement: "Progress by element",
      accuracy: "First-try accuracy",
      radarFirstTryDone: "{firstTry}% first try · {done}% done",
      radarDone: "{done}% done",
      done: "Done",
      doneOf: "{done} / {total}",
      percentCorrect: "{percent}% right first time",
      showTable: "Show data as a table",
      group: "Group",
      total: "Total",
      answered: "Answered",
      correct: "Right first time",
      untagged: "Untagged",
      pagesHeading: "Pages",
      stateDone: "Done",
      stateInProgress: "In progress",
      stateVisited: "Visited",
      stateNotStarted: "Not started",
      activitiesOnPage: "{done} of {total} activities done",
      kindPages: "Pages read",
      kindVideos: "Videos watched",
      kindAudio: "Audio listened to",
      kindQuestions: "Questions answered",
      kindCards: "Flash cards answered",
      kindChecklists: "Checklists finished",
      kindGames: "Games completed",
      kindOther: "Other activities",
      page: "Page",
      recentActivity: "Recent activity",
      verbAnswered: "Answered “{name}”",
      verbCompleted: "Finished “{name}”",
      verbWatched: "Watched “{name}” to the end",
      verbRead: "Read “{name}”",
      verbExperienced: "Viewed “{name}”",
      verbProgressed: "Made progress on “{name}”",
      verbAttempted: "Started “{name}”",
      verbPassed: "Passed “{name}”",
      verbFailed: "Did not pass “{name}”",
      verbInteracted: "Used “{name}”",
      resultCorrect: "correct",
      resultIncorrect: "not correct",
      scoreOf: "{raw} of {max}",
      yourAnswer: "Your answer: {answer}",
      attemptN: "attempt {count}",
      untitled: "untitled",
      preferencesHeading: "Preferences on this device",
      colorScheme: "Colour scheme",
      dark: "Dark",
      light: "Light",
      systemDefault: "System default",
      audioDescription: "Audio description",
      onFor: "On ({count} videos)",
      on: "On",
      off: "Off",
      soundEffects: "Sound effects",
      lastVisitLabel: "Last visit",
      savedOnDevice:
        "Saved on this device only. Your instructor can't see it unless your course connects a learning record store.",
      confirmTitle: "Clear your learning data?",
      confirmText:
        "This removes progress, answers and activity saved in this browser. It cannot be undone.",
      clearThisSite: "Clear this site",
      clearThisSiteDetail: "Only {site}",
      clearDevice: "Clear everything on this device",
      clearDeviceDetail:
        "Every site, plus preferences such as colour scheme and audio description",
      cancel: "Cancel",
      clearedSite: "Your learning data for {site} was cleared.",
      clearedDevice: "All learning data on this device was cleared.",
      thisSite: "this site",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../../../locales/", import.meta.url).href,
    });
    this.__disposer = [];
    this.__refreshTimer = null;
    this.__refreshes = 0;
    this._onWindowChange = this._onWindowChange.bind(this);
    this._onKeydown = this._onKeydown.bind(this);
  }
  static get properties() {
    return {
      ...super.properties,
      /**
       * Pages covered, relative to the page this sits on: page, parent,
       * branch (default), children or site
       */
      scope: { type: String, reflect: true },
      /**
       * Grouping the chart starts in: tags (default), sections, activity
       * or element. Visitors can switch.
       */
      view: { type: String, reflect: true },
      /**
       * Summary tiles (on by default; tiles="false" hides them)
       */
      tiles: { type: Boolean, reflect: true, converter: boolConverter },
      /**
       * Chart with the group by switch (on by default)
       */
      chart: { type: Boolean, reflect: true, converter: boolConverter },
      /**
       * Pages list with progress (on by default)
       */
      pages: { type: Boolean, reflect: true, converter: boolConverter },
      /**
       * Recent activity in plain words (off by default)
       */
      recent: { type: Boolean, reflect: true },
      /**
       * Preferences the profile remembers (off by default)
       */
      preferences: { type: Boolean, reflect: true },
      /**
       * Shown in the user menu dialog (no outer frame)
       */
      inDialog: { type: Boolean, reflect: true, attribute: "in-dialog" },
      _view: { type: String, state: true },
      _data: { type: Object, state: true },
      _statements: { type: Array, state: true },
      _confirming: { type: Boolean, state: true },
      _clearChoice: { type: String, state: true },
      _message: { type: String, state: true },
      _radarReady: { type: Boolean, state: true },
    };
  }
  connectedCallback() {
    super.connectedCallback();
    LearnerProgress.start();
    // live: any change to the learner profile, the outline or the page
    this.__disposer.push(
      autorun(() => {
        toJS(UserScaffoldInstance.ltMemory);
        toJS(store.manifest);
        store.activeId;
        this._scheduleRefresh();
      }),
    );
    ["learner-progress-cleared", "learner-progress-ready"].forEach((n) =>
      globalThis.addEventListener(n, this._onWindowChange),
    );
    this._scheduleRefresh();
    // radar or bars depends on the room there is
    if (globalThis.ResizeObserver && !this.__resize) {
      this.__wide = null;
      this.__resize = new ResizeObserver(() => {
        const wide = this.clientWidth >= RADAR_MIN_WIDTH;
        if (wide !== this.__wide) {
          this.__wide = wide;
          if (this._wantsRadar(this._data) && !this._radarReady) {
            this._loadRadar();
          }
          this.requestUpdate();
        }
      });
      this.__resize.observe(this);
    }
  }
  disconnectedCallback() {
    if (this.__resize) {
      this.__resize.disconnect();
      this.__resize = null;
    }
    this.__disposer.forEach((d) => d());
    this.__disposer = [];
    ["learner-progress-cleared", "learner-progress-ready"].forEach((n) =>
      globalThis.removeEventListener(n, this._onWindowChange),
    );
    clearTimeout(this.__refreshTimer);
    super.disconnectedCallback();
  }
  willUpdate(changed) {
    if (super.willUpdate) {
      super.willUpdate(changed);
    }
    if (changed.has("view")) {
      this._view = MY_LEARNING_VIEWS.includes(this.view) ? this.view : "tags";
    }
    if (changed.has("scope") || changed.has("view")) {
      this._scheduleRefresh();
    }
  }
  _onWindowChange() {
    this._scheduleRefresh();
  }
  _scheduleRefresh() {
    clearTimeout(this.__refreshTimer);
    this.__refreshTimer = setTimeout(() => this.refresh(), 60);
  }
  get siteKey() {
    return LearnerProgress.siteKey;
  }
  get siteName() {
    return store.siteTitle || this.t.thisSite;
  }
  /**
   * Recompute from the profile and reload the statements list (async).
   * Resolves once both are current.
   */
  async refresh() {
    clearTimeout(this.__refreshTimer);
    const ticket = ++this.__refreshes;
    this._data = this.compute();
    const list = await this.exportStatements();
    if (ticket === this.__refreshes) {
      this._statements = list;
    }
    if (this._wantsRadar(this._data) && !this._radarReady) {
      this._loadRadar();
    }
  }
  _loadRadar() {
    if (this._radarFailed || this.__radarLoading) {
      return;
    }
    this.__radarLoading = true;
    import("@haxtheweb/radar-chart/radar-chart.js")
      .then(() => {
        this._radarReady = true;
      })
      .catch(() => {
        // no radar-chart: bars and the table show the same numbers
        this._radarFailed = true;
      });
  }
  /**
   * Everything the dashboard shows, computed from the profile (sync)
   */
  compute() {
    const m = toJS(store.manifest);
    const items = m && Array.isArray(m.items) ? m.items : [];
    const key = this.siteKey;
    const siteRec = key ? UserScaffoldInstance.readSite(key) : null;
    const profile = UserScaffoldInstance.readProfile();
    const sc = scopePages(items, this.scope, store.activeId);
    const byId = new Map(items.map((i) => [i.id, i]));
    const recPages = siteRec && siteRec.pages ? siteRec.pages : {};
    const recPage = (id) =>
      Object.prototype.hasOwnProperty.call(recPages, id) ? recPages[id] : null;
    const view = MY_LEARNING_VIEWS.includes(this._view) ? this._view : "tags";
    const groupBy = {
      tags: "tag",
      sections: "section",
      activity: "activity",
      element: "element",
    }[view];
    const summary = key
      ? LearnerProgress.summarize({
          pages: sc.pages,
          groupBy,
          sectionRoot: sc.root || undefined,
          kindOf: (a) => activityKindOf(a.tag),
          trackableOnly: true,
        })
      : null;
    const totals = summary ? summary.totals : null;
    // pages in scope
    const pageRows = sc.pages.map((id, i) => {
      const item = byId.get(id) || {};
      const p = key
        ? LearnerProgress.pageProgress(id)
        : { status: "not-started", done: 0, trackable: 0 };
      return {
        id,
        n: i + 1,
        title: item.title || id,
        status: p.status,
        done: Math.min(p.done, p.trackable),
        trackable: p.trackable,
      };
    });
    let visits = 0;
    let last = "";
    sc.pages.forEach((id) => {
      const p = recPage(id);
      if (p) {
        visits += p.visits || 0;
        if (p.lastVisit && String(p.lastVisit) > last) {
          last = String(p.lastVisit);
        }
      }
    });
    const engaged = totals ? totals.engaged : 0;
    const tiles = {
      pagesDone: pageRows.filter((r) => r.status === "done").length,
      pagesTotal: pageRows.length,
      activitiesDone: totals ? totals.engagedDone : 0,
      activitiesTotal: totals ? Math.max(totals.trackable, engaged) : 0,
      inProgress: totals ? engaged - totals.engagedDone : 0,
      answered: totals ? totals.answered : 0,
      firstTry: totals ? totals.firstTryAccuracy : null,
      visits,
      lastVisit: last,
    };
    return {
      key,
      scope: sc.scope,
      root: sc.root,
      rootTitle: sc.root && byId.has(sc.root) ? byId.get(sc.root).title : "",
      view,
      empty: !engaged,
      hasRecord: Boolean(siteRec),
      tiles,
      groups: summary
        ? this._withData(this._groups(view, summary, sc, byId, recPage))
        : [],
      pageRows,
      preferences: profile.preferences || {},
      session: profile.session || {},
    };
  }
  // rows for the chart: { key, label, done, total, answered, correct
  // (right first time), accuracy (first-try) }
  _groups(view, summary, sc, byId, recPage) {
    const g = summary.groups;
    const has = (k) => Object.prototype.hasOwnProperty.call(g, k);
    const row = (k, label, total) => {
      const s = has(k) ? g[k] : null;
      const done = s ? s.engagedDone : 0;
      const engaged = s ? s.engaged : 0;
      return {
        key: k,
        label,
        done,
        total: Math.max(total == null ? (s ? s.trackable : 0) : total, engaged),
        answered: s ? s.answered : 0,
        correct: s ? s.firstTryCorrect : 0,
        // first-try accuracy, like the tile
        accuracy: s ? s.firstTryAccuracy : null,
      };
    };
    // trackable elements the scanned pages in scope hold, per tag
    const byTag = new Map();
    sc.pages.forEach((id) => {
      const p = recPage(id);
      const t = p && p.trackableByTag ? p.trackableByTag : {};
      Object.keys(t).forEach((tag) =>
        byTag.set(tag, (byTag.get(tag) || 0) + (Number(t[tag]) || 0)),
      );
    });
    if (view === "tags") {
      const keys = new Set();
      sc.pages.forEach((id) => {
        const item = byId.get(id);
        const raw = item && item.metadata ? item.metadata.tags : "";
        const list = (Array.isArray(raw) ? raw : String(raw || "").split(","))
          .map((x) => String(x).trim())
          .filter(Boolean);
        (list.length ? list : [UNTAGGED]).forEach((k) => keys.add(k));
      });
      Object.keys(g).forEach((k) => keys.add(k));
      return [...keys]
        .sort((a, b) =>
          a === UNTAGGED ? 1 : b === UNTAGGED ? -1 : a.localeCompare(b),
        )
        .map((k) => row(k, k === UNTAGGED ? this.t.untagged : k));
    }
    if (view === "sections") {
      const order = [];
      sc.pages.forEach((id) => {
        const item = byId.get(id);
        // the section of a page: the scope root itself, or the ancestor
        // that sits right under the root (top level for the whole site)
        let cur = item;
        let guard = 0;
        if (id !== sc.root) {
          while (
            cur &&
            cur.parent &&
            byId.has(cur.parent) &&
            cur.parent !== sc.root &&
            guard++ < 50
          ) {
            cur = byId.get(cur.parent);
          }
        }
        const k = cur ? cur.id : id;
        if (!order.includes(k)) {
          order.push(k);
        }
      });
      return order.map((k) => row(k, byId.has(k) ? byId.get(k).title || k : k));
    }
    if (view === "activity") {
      const kindTotals = new Map();
      byTag.forEach((n, tag) => {
        const k = activityKindOf(tag);
        kindTotals.set(k, (kindTotals.get(k) || 0) + n);
      });
      const rows = [];
      const label = (k) =>
        this.t[`kind${k.charAt(0).toUpperCase()}${k.slice(1)}`];
      // pages read: pages opened out of the pages in scope
      const opened = sc.pages.filter((id) => {
        const p = recPage(id);
        return p && p.visits > 0;
      }).length;
      rows.push({
        key: "pages",
        label: label("pages"),
        done: opened,
        total: sc.pages.length,
        answered: 0,
        correct: 0,
        accuracy: null,
      });
      MY_LEARNING_KINDS.forEach((k) => {
        if (k !== "pages" && (has(k) || kindTotals.get(k))) {
          rows.push(row(k, label(k), kindTotals.get(k) || 0));
        }
      });
      return rows;
    }
    // element
    const tags = new Set([...Object.keys(g), ...byTag.keys()]);
    tags.delete(PAGE_ELEMENT);
    return [...tags]
      .map((tag) => row(tag, elementTitle(tag), byTag.get(tag) || 0))
      .sort((a, b) => b.total - a.total || a.label.localeCompare(b.label));
  }
  // groups with nothing to show (no trackable activity on a visited page,
  // nothing answered) are left out, unless every group is empty; the pages
  // read row of the Activity view always stays
  _withData(rows) {
    const some = rows.filter(
      (r) => r.key === "pages" || r.total > 0 || r.done > 0 || r.answered > 0,
    );
    return some.length ? some : rows;
  }
  _wantsRadar(data) {
    // a radar needs room for its labels: bars on a narrow container
    const width = this.clientWidth;
    return (
      Boolean(data) &&
      this.chart &&
      !data.empty &&
      (width === 0 || width >= RADAR_MIN_WIDTH) &&
      (data.view === "tags" || data.view === "sections") &&
      data.groups.length >= 3 &&
      data.groups.length <= 8
    );
  }
  /**
   * Whether the chart draws as a radar (3 to 8 tag or section groups and
   * radar-chart available) rather than bars
   */
  get chartType() {
    return this._wantsRadar(this._data) && this._radarReady ? "radar" : "bars";
  }
  /**
   * This site's xAPI statements on this device (async)
   * @returns {Promise<Object[]>}
   */
  async exportStatements() {
    const key = this.siteKey;
    if (!key) {
      return [];
    }
    let list = [];
    try {
      list = await UserScaffoldInstance.statements(key);
    } catch {
      list = [];
    }
    return Array.isArray(list)
      ? list.filter((s) => s && typeof s === "object")
      : [];
  }
  /**
   * Save this site's statements as an xAPI JSON file
   * (<site>-xapi-statements.json)
   */
  async downloadData() {
    const list = await this.exportStatements();
    const blob = new Blob([JSON.stringify(list, null, 2)], {
      type: "application/json",
    });
    const url = globalThis.URL.createObjectURL(blob);
    const a = globalThis.document.createElement("a");
    a.href = url;
    a.download = statementsFileName(
      (store.manifest &&
        store.manifest.metadata &&
        store.manifest.metadata.site &&
        store.manifest.metadata.site.name) ||
        this.siteKey,
    );
    a.hidden = true;
    this.shadowRoot.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => globalThis.URL.revokeObjectURL(url), 1000);
    return a.download;
  }
  _openConfirm() {
    this._message = "";
    this._clearChoice = "site";
    this._confirming = true;
    this.updateComplete.then(() => {
      const first = this.shadowRoot.querySelector(
        '.confirm input[type="radio"]',
      );
      if (first) {
        first.focus();
      }
    });
  }
  _toggleConfirm() {
    if (this._confirming) {
      this._closeConfirm();
    } else {
      this._openConfirm();
    }
  }
  _closeConfirm() {
    this._confirming = false;
    this.updateComplete.then(() => {
      const btn = this.shadowRoot.querySelector("#clear");
      if (btn) {
        btn.focus();
      }
    });
  }
  _onKeydown(e) {
    if (e.key === "Escape" && this._confirming) {
      e.stopPropagation();
      this._closeConfirm();
    }
  }
  /**
   * Clear learner data: "site" (this site on this device) or "device"
   * (every site and the whole profile). Announced politely.
   */
  async clearData(choice = "site") {
    const site = this.siteName;
    if (choice === "device") {
      await LearnerProgress.clearDevice();
      this._message = this.t.clearedDevice;
    } else {
      await LearnerProgress.clear();
      this._message = fill(this.t.clearedSite, { site });
    }
    this._confirming = false;
    await this.refresh();
    this.updateComplete.then(() => {
      const btn = this.shadowRoot.querySelector("#clear");
      if (btn) {
        btn.focus();
      }
    });
  }
  static get styles() {
    return [
      super.styles,
      DDDBlockStyles,
      DDDChartStyles,
      DDDTableStyles,
      mapMenuProgressStyles,
      css`
        :host {
          display: block;
          container-type: inline-size;
          font-family: var(--ddd-font-primary);
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          --my-learning-line: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          --my-learning-muted: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
          --my-learning-heading: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-white)
          );
          --my-learning-track: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-theme-default-coalyGray)
          );
          --my-learning-done: light-dark(
            var(--ddd-theme-default-opportunityGreen),
            var(--ddd-theme-default-futureLime)
          );
          --my-learning-partial: light-dark(
            var(--ddd-theme-default-inventOrange),
            var(--ddd-theme-default-keystoneYellow)
          );
          --my-learning-none: light-dark(
            var(--ddd-theme-default-limestoneGray),
            var(--ddd-theme-default-slateGray)
          );
          --my-learning-danger: light-dark(
            var(--ddd-theme-default-original87Pink),
            var(--ddd-theme-default-discoveryCoral)
          );
        }
        :host([hidden]) {
          display: none;
        }
        :host([in-dialog]) .ddd-block {
          border: none;
          border-radius: 0;
        }
        .body {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-4);
          padding: var(--ddd-spacing-4);
        }
        .panel {
          box-sizing: border-box;
          min-width: 0;
          border: var(--ddd-border-xs);
          border-color: var(--my-learning-line);
          border-radius: var(--ddd-radius-md);
          padding: var(--ddd-spacing-3);
        }
        h3 {
          margin: 0 0 var(--ddd-spacing-2);
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          color: var(--my-learning-heading);
        }
        .tiles {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: var(--ddd-spacing-3);
          margin: 0;
          padding: 0;
          border: 0;
        }
        .stack {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-4);
          min-width: 0;
        }
        .tile {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-1);
          margin: 0;
        }
        .tile dt {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-medium);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--my-learning-muted);
        }
        .tile dd {
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-1);
        }
        .tile .big {
          font-size: var(--ddd-font-size-m);
          font-weight: var(--ddd-font-weight-bold);
          line-height: var(--ddd-lh-120);
          color: var(--my-learning-heading);
          font-variant-numeric: tabular-nums;
        }
        .tile .small,
        .meta,
        .note {
          font-size: var(--ddd-font-size-4xs);
          color: var(--my-learning-muted);
        }
        .grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: var(--ddd-spacing-4);
          align-items: start;
        }
        .chips {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-1);
          margin: 0 0 var(--ddd-spacing-3);
          padding: 0;
          border: 0;
        }
        .chips legend {
          padding: 0;
          margin-bottom: var(--ddd-spacing-1);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          color: var(--my-learning-muted);
          width: 100%;
        }
        .chip {
          position: relative;
          display: inline-flex;
        }
        .chip input {
          position: absolute;
          inset: 0;
          margin: 0;
          opacity: 0;
          cursor: pointer;
        }
        .chip span {
          display: inline-flex;
          align-items: center;
          min-height: var(--ddd-spacing-7);
          padding: 0 var(--ddd-spacing-3);
          border: var(--ddd-border-xs);
          border-color: var(--my-learning-line);
          border-radius: var(--ddd-radius-rounded);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-medium);
        }
        .chip input:checked + span {
          background-color: var(--my-learning-heading);
          border-color: var(--my-learning-heading);
          color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
        }
        .chip input:focus-visible + span {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        .bars,
        .pages,
        .recent {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .bars li {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: var(--ddd-spacing-1) var(--ddd-spacing-2);
          align-items: center;
          padding: var(--ddd-spacing-1) 0;
          font-size: var(--ddd-font-size-4xs);
        }
        .bars .label {
          overflow-wrap: anywhere;
        }
        .num {
          text-align: end;
          font-variant-numeric: tabular-nums;
          color: var(--my-learning-muted);
        }
        .track {
          grid-column: 1 / -1;
          display: block;
          height: var(--ddd-spacing-3);
          border-radius: var(--ddd-radius-xs);
          background-color: var(--my-learning-track);
          overflow: hidden;
        }
        .fill {
          display: block;
          height: 100%;
          background-color: var(--ddd-chart-1);
        }
        .pages li {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          gap: var(--ddd-spacing-1) var(--ddd-spacing-2);
          align-items: center;
          padding: var(--ddd-spacing-2) 0;
          border-bottom: var(--ddd-border-xs);
          border-color: var(--my-learning-line);
          font-size: var(--ddd-font-size-4xs);
        }
        .pages li:last-child,
        .recent li:last-child {
          border-bottom: none;
        }
        .pages .progress-mark {
          margin: 0;
        }
        .pages .title {
          overflow-wrap: anywhere;
        }
        .pages .track {
          grid-column: 2 / -1;
          height: var(--ddd-spacing-2);
          border-radius: var(--ddd-radius-rounded);
        }
        .pages .fill[data-status="done"] {
          background-color: var(--my-learning-done);
        }
        .pages .fill[data-status="in-progress"] {
          background-color: var(--my-learning-partial);
        }
        .pages .fill[data-status="visited"],
        .pages .fill[data-status="not-started"] {
          background-color: var(--my-learning-none);
        }
        .recent li {
          display: flex;
          gap: var(--ddd-spacing-2);
          padding: var(--ddd-spacing-2) 0;
          border-bottom: var(--ddd-border-xs);
          border-color: var(--my-learning-line);
          font-size: var(--ddd-font-size-4xs);
        }
        .recent .glyph {
          flex: none;
          width: var(--ddd-spacing-4);
          text-align: center;
          color: var(--my-learning-muted);
        }
        .recent .what {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-1);
          min-width: 0;
          overflow-wrap: anywhere;
        }
        .prefs {
          margin: 0;
          padding: 0;
          border: 0;
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          gap: var(--ddd-spacing-1) var(--ddd-spacing-3);
          font-size: var(--ddd-font-size-4xs);
        }
        .prefs dt {
          margin: 0;
          font-size: inherit;
          font-weight: var(--ddd-font-weight-regular);
          color: var(--my-learning-muted);
        }
        .prefs dd {
          margin: 0;
          font-weight: var(--ddd-font-weight-bold);
        }
        .note {
          margin: var(--ddd-spacing-3) 0 0;
        }
        details summary {
          cursor: pointer;
          margin-top: var(--ddd-spacing-2);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-medium);
          color: light-dark(
            var(--ddd-theme-default-link),
            var(--ddd-theme-default-linkLight)
          );
        }
        details summary:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        details table {
          margin-top: var(--ddd-spacing-2);
        }
        .empty {
          margin: 0;
          padding: var(--ddd-spacing-4);
          border: var(--ddd-border-xs);
          border-style: dashed;
          border-color: var(--my-learning-line);
          border-radius: var(--ddd-radius-md);
          font-size: var(--ddd-font-size-3xs);
          text-align: center;
        }
        .status {
          margin: 0;
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
        }
        .status:empty {
          display: none;
        }
        .confirm {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-3);
          padding: var(--ddd-spacing-4);
          border: var(--ddd-border-sm);
          border-color: var(--my-learning-danger);
          border-radius: var(--ddd-radius-md);
        }
        .confirm h3 {
          margin: 0;
          font-size: var(--ddd-font-size-xs);
        }
        .confirm p {
          margin: 0;
          font-size: var(--ddd-font-size-4xs);
        }
        .confirm fieldset {
          margin: 0;
          padding: 0;
          border: 0;
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-2);
        }
        .confirm label {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          gap: 0 var(--ddd-spacing-2);
          align-items: start;
          font-size: var(--ddd-font-size-4xs);
          cursor: pointer;
        }
        .confirm label strong {
          display: block;
        }
        .confirm label .meta {
          grid-column: 2;
        }
        .confirm input {
          margin: var(--ddd-spacing-1) 0 0;
          accent-color: var(--my-learning-heading);
        }
        .buttons {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-2);
        }
        .buttons button {
          min-height: var(--ddd-control-height-sm);
          padding: 0 var(--ddd-spacing-4);
          border: var(--ddd-border-xs);
          border-radius: var(--ddd-radius-rounded);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          cursor: pointer;
          border-color: var(--my-learning-line);
          background-color: transparent;
          color: inherit;
        }
        .buttons button.danger {
          border-color: var(--my-learning-danger);
          background-color: var(--my-learning-danger);
          color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
        }
        .buttons button:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
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
        radar-chart {
          display: block;
          max-width: 720px;
          margin-inline: auto;
        }
        @container (min-width: 640px) {
          .tiles {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }
        @container (min-width: 820px) {
          .grid {
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          }
          .grid.single {
            grid-template-columns: minmax(0, 1fr);
          }
        }
        @media (forced-colors: active) {
          .fill,
          .pages .fill[data-status] {
            background-color: CanvasText;
          }
          .track {
            border: var(--ddd-border-xs);
            border-color: CanvasText;
          }
        }
      `,
    ];
  }
  _scopeLabel(data) {
    if (data.scope === "site") {
      return this.siteName;
    }
    return data.rootTitle || this.siteName;
  }
  render() {
    const data = this._data;
    const title = data ? this._scopeLabel(data) : this.siteName;
    return html`<section
      class="ddd-block"
      aria-labelledby="hdr"
      @keydown="${this._onKeydown}"
    >
      ${renderDDDBlockHeader({
        id: "hdr",
        icon: "social:school",
        label: this.t.myLearning,
        title,
        titleTag: "h2",
        actions: html`<button
            type="button"
            class="ddd-block-action"
            id="download"
            aria-label="${this.t.downloadMyData}"
            title="${this.t.downloadMyData}"
            ?disabled="${!this._statements.length}"
            @click="${this.downloadData}"
          >
            <simple-icon-lite icon="icons:file-download"></simple-icon-lite>
          </button>
          <button
            type="button"
            class="ddd-block-action has-text"
            id="clear"
            aria-label="${this.t.clearMyData}"
            aria-expanded="${this._confirming ? "true" : "false"}"
            aria-controls="confirm"
            @click="${this._toggleConfirm}"
          >
            ${this.t.clear}
          </button>`,
      })}
      <div class="body ddd-block-body">
        <p class="status" role="status" aria-live="polite">${this._message}</p>
        ${this._confirming ? this.renderConfirm() : nothing}
        ${data ? this.renderBody(data) : nothing}
      </div>
    </section>`;
  }
  renderConfirm() {
    const site = this.siteName;
    const device = this._clearChoice === "device";
    return html`<div
      class="confirm"
      id="confirm"
      role="group"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-text"
    >
      <h3 id="confirm-title">${this.t.confirmTitle}</h3>
      <p id="confirm-text">${this.t.confirmText}</p>
      <fieldset>
        <legend class="sr-only">${this.t.confirmTitle}</legend>
        <label>
          <input
            type="radio"
            name="clear-choice"
            value="site"
            .checked="${!device}"
            @change="${() => (this._clearChoice = "site")}"
          />
          <span
            ><strong>${this.t.clearThisSite}</strong
            ><span class="meta"
              >${fill(this.t.clearThisSiteDetail, { site })}</span
            ></span
          >
        </label>
        <label>
          <input
            type="radio"
            name="clear-choice"
            value="device"
            .checked="${device}"
            @change="${() => (this._clearChoice = "device")}"
          />
          <span
            ><strong>${this.t.clearDevice}</strong
            ><span class="meta">${this.t.clearDeviceDetail}</span></span
          >
        </label>
      </fieldset>
      <div class="buttons">
        <button
          type="button"
          class="danger"
          id="confirm-clear"
          @click="${() => this.clearData(this._clearChoice)}"
        >
          ${device ? this.t.clearDevice : this.t.clearThisSite}
        </button>
        <button
          type="button"
          id="confirm-cancel"
          @click="${this._closeConfirm}"
        >
          ${this.t.cancel}
        </button>
      </div>
    </div>`;
  }
  renderBody(data) {
    if (data.empty) {
      return html`<p class="empty" part="empty">${this.t.nothingYet}</p>
        ${this.preferences ? this.renderPreferences(data) : nothing}`;
    }
    // the chart gets the full width (radar labels stay readable); pages
    // sit beside recent activity and preferences below it
    const side = this.recent || this.preferences;
    const tiles = this.tiles ? this.renderTiles(data) : nothing;
    const chart = this.chart ? this.renderChart(data) : nothing;
    const pages = this.pages ? this.renderPages(data) : nothing;
    const recent = this.recent ? this.renderRecent() : nothing;
    const prefs = this.preferences ? this.renderPreferences(data) : nothing;
    const stack = side
      ? html`<div class="stack">${recent}${prefs}</div>`
      : nothing;
    const cols = this.pages && side ? "grid" : "grid single";
    const lower =
      this.pages || side
        ? html`<div class="${cols}">${pages}${stack}</div>`
        : nothing;
    return html`${tiles}${chart}${lower}`;
  }
  renderTiles(data) {
    const t = data.tiles;
    const first =
      t.firstTry == null ? this.t.noValue : `${Math.round(t.firstTry * 100)}%`;
    const pagesDone = fill(this.t.doneOf, {
      done: t.pagesDone,
      total: t.pagesTotal,
    });
    const last = t.lastVisit
      ? fill(this.t.lastVisit, { when: this._when(t.lastVisit) })
      : this.t.noValue;
    return html`<dl class="tiles" part="tiles">
      <div class="tile panel">
        <dt>${this.t.pagesDone}</dt>
        <dd>
          <span class="big">${pagesDone}</span>
          <span class="small"
            >${fill(this.t.pagesDoneDetail, {
              percent: pct(t.pagesDone, t.pagesTotal),
            })}</span
          >
        </dd>
      </div>
      <div class="tile panel">
        <dt>${this.t.activitiesDone}</dt>
        <dd>
          <span class="big"
            >${fill(this.t.doneOf, {
              done: t.activitiesDone,
              total: t.activitiesTotal,
            })}</span
          >
          <span class="small"
            >${fill(this.t.inProgress, { count: t.inProgress })}</span
          >
        </dd>
      </div>
      <div class="tile panel">
        <dt>${this.t.firstTryAccuracy}</dt>
        <dd>
          <span class="big">${first}</span>
          <span class="small"
            >${fill(this.t.questionsAnswered, { count: t.answered })}</span
          >
        </dd>
      </div>
      <div class="tile panel">
        <dt>${this.t.visits}</dt>
        <dd>
          <span class="big">${t.visits}</span>
          <span class="small">${last}</span>
        </dd>
      </div>
    </dl>`;
  }
  _chartTitle(view) {
    return {
      tags: this.t.chartTags,
      sections: this.t.chartSections,
      activity: this.t.chartActivity,
      element: this.t.chartElement,
    }[view];
  }
  _setView(view) {
    this._view = view;
    this._data = this.compute();
    if (this._wantsRadar(this._data) && !this._radarReady) {
      this._loadRadar();
    }
  }
  renderChart(data) {
    const views = [
      ["tags", this.t.viewTags],
      ["sections", this.t.viewSections],
      ["activity", this.t.viewActivity],
      ["element", this.t.viewElement],
    ];
    const title = this._chartTitle(data.view);
    const radar = this.chartType === "radar";
    // the radar names itself in its own header
    const heading = radar ? nothing : html`<h3 id="chart-title">${title}</h3>`;
    const drawing = radar
      ? this.renderRadar(data, title)
      : this.renderBars(data, title);
    return html`<div class="panel chart" part="chart">
      ${heading}
      <fieldset class="chips" role="radiogroup">
        <legend>${this.t.groupBy}</legend>
        ${views.map(
          ([v, label]) =>
            html`<label class="chip"
              ><input
                type="radio"
                name="group-by"
                value="${v}"
                .checked="${data.view === v}"
                @change="${() => this._setView(v)}"
              /><span>${label}</span></label
            >`,
        )}
      </fieldset>
      ${drawing}
    </div>`;
  }
  renderRadar(data, title) {
    const groups = data.groups;
    return html`<radar-chart
      title="${title}"
      max-score="100"
      .categories="${groups.map((g) => g.label)}"
      .scores="${groups.map((g) =>
        g.accuracy == null ? 0 : Math.round(g.accuracy * 100),
      )}"
      .targetScores="${groups.map((g) => pct(g.done, g.total))}"
      .valueLabels="${groups.map((g) => this._radarValue(g))}"
      score-label="${this.t.accuracy} %"
      target-label="${this.t.done} %"
    ></radar-chart>`;
  }
  // "57% first try · 56% done", or "56% done" when nothing was answered
  _radarValue(g) {
    const done = fill(this.t.radarDone, { done: pct(g.done, g.total) });
    if (g.accuracy == null) {
      return done;
    }
    return fill(this.t.radarFirstTryDone, {
      firstTry: Math.round(g.accuracy * 100),
      done: pct(g.done, g.total),
    });
  }
  renderBars(data, title) {
    const groups = data.groups;
    return html`<ul class="bars" aria-labelledby="chart-title">
        ${groups.map((g) => {
          const text = fill(this.t.doneOf, { done: g.done, total: g.total });
          const correct =
            g.accuracy == null
              ? ""
              : ` · ${fill(this.t.percentCorrect, {
                  percent: Math.round(g.accuracy * 100),
                })}`;
          return html`<li>
            <span class="label">${g.label}</span>
            <span class="num">${text}${correct}</span>
            <span class="track" aria-hidden="true"
              ><span class="fill" style="width: ${pct(g.done, g.total)}%"></span
            ></span>
          </li>`;
        })}
      </ul>
      <details>
        <summary>${this.t.showTable}</summary>
        <table class="ddd-table condensed">
          <caption class="sr-only">
            ${title}
          </caption>
          <thead>
            <tr>
              <th scope="col">${this.t.group}</th>
              <th scope="col" class="num">${this.t.done}</th>
              <th scope="col" class="num">${this.t.total}</th>
              <th scope="col" class="num">${this.t.answered}</th>
              <th scope="col" class="num">${this.t.correct}</th>
            </tr>
          </thead>
          <tbody>
            ${groups.map(
              (g) =>
                html`<tr>
                  <th scope="row">${g.label}</th>
                  <td class="num">${g.done}</td>
                  <td class="num">${g.total}</td>
                  <td class="num">${g.answered}</td>
                  <td class="num">${this._percent(g.accuracy)}</td>
                </tr>`,
            )}
          </tbody>
        </table>
      </details>`;
  }
  _percent(ratio) {
    return ratio == null ? "" : `${Math.round(ratio * 100)}%`;
  }
  _stateText(status) {
    return (
      {
        done: this.t.stateDone,
        "in-progress": this.t.stateInProgress,
        visited: this.t.stateVisited,
      }[status] || this.t.stateNotStarted
    );
  }
  renderPages(data) {
    return html`<div class="panel" part="pages">
      <h3 id="pages-title">${this.t.pagesHeading}</h3>
      <ol class="pages" aria-labelledby="pages-title">
        ${data.pageRows.map((p) => this.renderPageRow(p))}
      </ol>
    </div>`;
  }
  renderPageRow(p) {
    const counts = { done: p.done, total: p.trackable };
    const count = p.trackable
      ? html` · ${fill(this.t.doneOf, counts)}<span class="sr-only"
            >, ${fill(this.t.activitiesOnPage, counts)}</span
          >`
      : nothing;
    const width = `width: ${pct(p.done, p.trackable)}%`;
    const bar = p.trackable
      ? html`<span class="track" aria-hidden="true"
          ><span class="fill" data-status="${p.status}" style="${width}"></span
        ></span>`
      : nothing;
    return html`<li data-page="${p.id}" data-status="${p.status}">
      ${renderProgressMark(p.status)}
      <span class="title">${p.n}. ${p.title}</span>
      <span class="num">${this._stateText(p.status)}${count}</span>
      ${bar}
    </li>`;
  }
  /**
   * One statement in plain words: { glyph, text, meta, answer }
   */
  describeStatement(s) {
    const verbMap = s.verb && s.verb.display ? s.verb.display : {};
    const verb =
      firstText(verbMap) ||
      String((s.verb && s.verb.id) || "")
        .split("/")
        .pop();
    const def = s.object && s.object.definition ? s.object.definition : {};
    const name = firstText(def.name) || this.t.untitled;
    const ctx = s.context || {};
    const ext = ctx.extensions || {};
    const tag = Object.prototype.hasOwnProperty.call(
      ext,
      XAPI_EXTENSIONS.element,
    )
      ? String(ext[XAPI_EXTENSIONS.element])
      : "";
    const ca = ctx.contextActivities || {};
    const parent =
      Array.isArray(ca.parent) && ca.parent[0] ? ca.parent[0] : null;
    const pageName =
      parent && parent.definition ? firstText(parent.definition.name) : "";
    const result = s.result || {};
    const kind = activityKindOf(tag);
    const templates = {
      answered: this.t.verbAnswered,
      completed:
        kind === "videos" || kind === "audio"
          ? this.t.verbWatched
          : this.t.verbCompleted,
      experienced:
        tag === PAGE_ELEMENT ? this.t.verbRead : this.t.verbExperienced,
      progressed: this.t.verbProgressed,
      attempted: this.t.verbAttempted,
      passed: this.t.verbPassed,
      failed: this.t.verbFailed,
    };
    let text = fill(
      Object.prototype.hasOwnProperty.call(templates, verb)
        ? templates[verb]
        : this.t.verbInteracted,
      { name },
    );
    let glyph = "•";
    if (typeof result.success === "boolean") {
      text += ` — ${result.success ? this.t.resultCorrect : this.t.resultIncorrect}`;
      glyph = result.success ? "✓" : "✗";
    } else if (
      result.score &&
      typeof result.score.raw === "number" &&
      typeof result.score.max === "number" &&
      verb !== "completed"
    ) {
      text += ` (${fill(this.t.scoreOf, {
        raw: result.score.raw,
        max: result.score.max,
      })})`;
      glyph = "◐";
    } else if (verb === "completed") {
      glyph = kind === "videos" || kind === "audio" ? "▶" : "✓";
    }
    const meta = [];
    if (pageName && tag !== PAGE_ELEMENT) {
      meta.push(pageName);
    }
    meta.push(tag === PAGE_ELEMENT ? this.t.page : elementTitle(tag || ""));
    const resExt = result.extensions || {};
    const attempts = Object.prototype.hasOwnProperty.call(
      resExt,
      XAPI_EXTENSIONS.attempts,
    )
      ? Number(resExt[XAPI_EXTENSIONS.attempts])
      : 0;
    if (attempts > 0 && verb === "answered") {
      meta.push(fill(this.t.attemptN, { count: attempts }));
    }
    if (s.timestamp) {
      meta.push(this._when(s.timestamp));
    }
    // a response without an interaction type (checklists) is a plain [,]
    // list; show it with commas
    const answer = describeResponse(s).split(XAPI_ITEM_DELIMITER).join(", ");
    return {
      glyph,
      text,
      meta: meta.filter(Boolean).join(" · "),
      answer: answer ? fill(this.t.yourAnswer, { answer }) : "",
    };
  }
  /**
   * Statements for Recent activity, newest first. Back to back reads of the
   * same page (reloads, route changes) show once, at the newest time; the
   * stored statements are untouched.
   */
  recentStatements() {
    const pageRead = (s) => {
      const ext = s.context && s.context.extensions ? s.context.extensions : {};
      const verb = s.verb && s.verb.id ? String(s.verb.id) : "";
      return verb.endsWith("/experienced") &&
        ext[XAPI_EXTENSIONS.element] === PAGE_ELEMENT &&
        s.object
        ? String(s.object.id)
        : "";
    };
    const out = [];
    let lastRead = "";
    [...this._statements]
      .sort((a, b) =>
        String(b.timestamp || "").localeCompare(String(a.timestamp || "")),
      )
      .forEach((s) => {
        const read = pageRead(s);
        if (!read || read !== lastRead) {
          out.push(s);
        }
        lastRead = read;
      });
    return out.slice(0, RECENT_LIMIT);
  }
  renderRecent() {
    const list = this.recentStatements().map((s) => this.describeStatement(s));
    return html`<div class="panel" part="recent">
      <h3 id="recent-title">${this.t.recentActivity}</h3>
      <ul class="recent" aria-labelledby="recent-title">
        ${list.map((r) => this.renderRecentItem(r))}
      </ul>
    </div>`;
  }
  renderRecentItem(r) {
    const answer = r.answer
      ? html`<span class="meta">${r.answer}</span>`
      : nothing;
    return html`<li>
      <span class="glyph" aria-hidden="true">${r.glyph}</span>
      <span class="what">
        <span class="text">${r.text}</span>
        ${answer}
        <span class="meta">${r.meta}</span>
      </span>
    </li>`;
  }
  renderPreferences(data) {
    const p = data.preferences || {};
    const scheme =
      p.darkMode === true
        ? this.t.dark
        : p.darkMode === false
          ? this.t.light
          : this.t.systemDefault;
    const ad =
      p.audioDescription && typeof p.audioDescription === "object"
        ? Object.keys(p.audioDescription).filter((k) => p.audioDescription[k])
            .length
        : 0;
    const sound =
      p.soundStatus === true
        ? this.t.on
        : p.soundStatus === false
          ? this.t.off
          : this.t.systemDefault;
    const last = data.session && data.session.lastVisit;
    return html`<div class="panel" part="preferences">
      <h3 id="prefs-title">${this.t.preferencesHeading}</h3>
      <dl class="prefs" aria-labelledby="prefs-title">
        <dt>${this.t.colorScheme}</dt>
        <dd>${scheme}</dd>
        <dt>${this.t.audioDescription}</dt>
        <dd>${ad ? fill(this.t.onFor, { count: ad }) : this.t.off}</dd>
        <dt>${this.t.soundEffects}</dt>
        <dd>${sound}</dd>
        <dt>${this.t.lastVisitLabel}</dt>
        <dd>${last ? this._when(last) : this.t.noValue}</dd>
      </dl>
      <p class="note">${this.t.savedOnDevice}</p>
    </div>`;
  }
  // a time as "5 minutes ago" / "yesterday", or the date for older ones
  _when(iso) {
    const d = new Date(iso);
    const ms = d.getTime();
    if (!Number.isFinite(ms)) {
      return "";
    }
    const lang =
      this.lang ||
      (globalThis.document && globalThis.document.documentElement.lang) ||
      "en";
    const diff = (ms - Date.now()) / 1000;
    const abs = Math.abs(diff);
    try {
      if (abs < 7 * 86400) {
        const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });
        if (abs < 60) {
          return rtf.format(Math.round(diff), "second");
        }
        if (abs < 3600) {
          return rtf.format(Math.round(diff / 60), "minute");
        }
        if (abs < 86400) {
          return rtf.format(Math.round(diff / 3600), "hour");
        }
        return rtf.format(Math.round(diff / 86400), "day");
      }
      return d.toLocaleDateString(lang, { dateStyle: "medium" });
    } catch {
      return d.toISOString().slice(0, 10);
    }
  }
  static get haxProperties() {
    return {
      canScale: false,
      canEditSource: false,
      contentEditable: false,
      gizmo: {
        title: "My learning",
        description:
          "Dashboard of what the visitor has done on this page, section, branch or site: tiles, a chart, pages and recent activity, from the learner profile on their device",
        icon: "social:school",
        color: "blue",
        tags: [
          "Instructional",
          "progress",
          "learning",
          "dashboard",
          "xapi",
          "learner",
        ],
        handles: [],
        meta: { author: "HAXcms" },
      },
      settings: {
        configure: [
          {
            property: "scope",
            title: "Scope",
            description: "Which pages it covers, relative to this page",
            inputMethod: "select",
            options: {
              page: "This page",
              parent: "Parent page and its children",
              branch: "This branch (parent and everything under it)",
              children: "All children below this page",
              site: "Entire site",
            },
          },
          {
            property: "view",
            title: "Start in view",
            description: "How the chart groups activity first",
            inputMethod: "select",
            options: {
              tags: "Tags",
              sections: "Sections",
              activity: "Activity",
              element: "Element",
            },
          },
          {
            property: "tiles",
            title: "Summary tiles",
            inputMethod: "boolean",
          },
          {
            property: "chart",
            title: "Chart",
            inputMethod: "boolean",
          },
          {
            property: "pages",
            title: "Pages",
            inputMethod: "boolean",
          },
          {
            property: "recent",
            title: "Recent activity",
            inputMethod: "boolean",
          },
          {
            property: "preferences",
            title: "Preferences",
            inputMethod: "boolean",
          },
        ],
        advanced: [],
      },
      demoSchema: [
        {
          tag: this.tag,
          properties: { scope: "branch", view: "tags" },
          content: "",
        },
      ],
    };
  }
}
// the editor loads this lazily for the user menu while the page autoloader
// may already have defined it from another path; one definition is enough
if (!globalThis.customElements.get(MyLearning.tag)) {
  globalThis.customElements.define(MyLearning.tag, MyLearning);
}
