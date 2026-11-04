/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css, svg, nothing } from "lit";
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
export const MY_LEARNING_VIEWS = [
  "tags",
  "sections",
  "activity",
  "element",
  "map",
];
export const MY_LEARNING_STATES = [
  "done",
  "in-progress",
  "visited",
  "not-started",
];
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
// most pages the Map view draws around their sections at once
// room each page dot needs on its arc, in percent of the drawing
const MAP_DOT_SPACING = 4.5;

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

// a page or section state from the states of the pages it holds
const combinedState = (states) => {
  if (!states.length) {
    return "not-started";
  }
  if (states.every((st) => st === "done")) {
    return "done";
  }
  if (states.some((st) => st === "done" || st === "in-progress")) {
    return "in-progress";
  }
  return states.some((st) => st === "visited") ? "visited" : "not-started";
};

/**
 * What the Map view draws at one level of drilling in.
 *   path []            you at the centre, sections around you, each
 *                      section's pages around it
 *   path [section]     the section at the centre, its pages around it
 *   path [..., page]   the page at the centre, its activities around it
 * Sections are the top level items of the scope (the children of the
 * scope root; the root itself is a section of its own).
 * @param {Object} o
 * @param {Array} o.items manifest items
 * @param {string[]} o.pages page ids in scope, in outline order
 * @param {string|null} o.root scope root
 * @param {Object[]} o.pageRows [{ id, title, status, done, trackable }]
 * @param {Object} o.activitiesByPage { pageId: [{ id, name, tag, done }] }
 * @param {string[]} [o.path] ids drilled into
 * @returns {{ center: Object, nodes: Object[], path: Object[] }} nodes:
 *   { id, kind (section | page | activity), title, state, done, total,
 *   children: [{ id, title, state }] (sections at the top level) }
 */
export function mapModel({
  items,
  pages,
  root,
  pageRows,
  activitiesByPage,
  path = [],
}) {
  const byId = new Map((items || []).map((i) => [i.id, i]));
  const rows = new Map((pageRows || []).map((r) => [r.id, r]));
  const acts = activitiesByPage || {};
  const sectionOf = (id) => {
    if (id === root) {
      return id;
    }
    let cur = byId.get(id);
    let guard = 0;
    while (
      cur &&
      cur.parent &&
      byId.has(cur.parent) &&
      cur.parent !== root &&
      guard++ < 50
    ) {
      cur = byId.get(cur.parent);
    }
    return cur ? cur.id : id;
  };
  const order = [];
  const members = new Map();
  (pages || []).forEach((id) => {
    const k = sectionOf(id);
    if (!members.has(k)) {
      members.set(k, []);
      order.push(k);
    }
    members.get(k).push(id);
  });
  const title = (id) => {
    const r = rows.get(id);
    const i = byId.get(id);
    return (r && r.title) || (i && i.title) || id;
  };
  const pageNode = (id) => {
    const r = rows.get(id) || {};
    return {
      id,
      kind: "page",
      title: title(id),
      state: r.status || "not-started",
      done: r.done || 0,
      total: r.trackable || 0,
    };
  };
  const sectionNode = (id) => {
    const list = members.get(id) || [id];
    const states = list.map((pid) => pageNode(pid).state);
    return {
      id,
      kind: "section",
      title: title(id),
      state: combinedState(states),
      done: states.filter((st) => st === "done").length,
      total: list.length,
      children: list.filter((pid) => pid !== id).map(pageNode),
    };
  };
  const activityNodes = (pid) =>
    (Array.isArray(acts[pid]) ? acts[pid] : []).map((a) => ({
      id: a.id,
      kind: "activity",
      tag: a.tag,
      title: a.name || a.id,
      state: a.done ? "done" : "in-progress",
      done: a.done ? 1 : 0,
      total: 1,
    }));
  // follow the path as far as it is valid
  const trail = [];
  let where = null;
  for (const id of Array.isArray(path) ? path : []) {
    if (!where && members.has(id)) {
      where = sectionNode(id);
    } else if (
      where &&
      where.kind === "section" &&
      where.children.some((c) => c.id === id)
    ) {
      where = pageNode(id);
    } else if (!where && (pages || []).includes(id)) {
      where = pageNode(id);
    } else {
      break;
    }
    trail.push(where);
  }
  if (!where) {
    return {
      center: { id: "", kind: "you", title: "" },
      nodes: order.map(sectionNode),
      path: trail,
    };
  }
  if (where.kind === "section" && where.children.length) {
    return { center: where, nodes: where.children, path: trail };
  }
  const nodes = activityNodes(where.id);
  return {
    center: {
      ...where,
      done: nodes.filter((n) => n.state === "done").length,
      total: Math.max(pageNode(where.id).total, nodes.length),
    },
    nodes,
    path: trail,
  };
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
        // a close button in the titlebar; Escape closes it too (below)
        showClose: true,
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
  // Escape closes the dialog, unless my-learning used it first (it cancels
  // its own clear confirm and stops the key there)
  const onKey = (e) => {
    if (e.key === "Escape" && !e.defaultPrevented && el.isConnected) {
      el.dispatchEvent(
        new CustomEvent("simple-modal-hide", {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: {},
        }),
      );
    }
  };
  const done = () => {
    globalThis.removeEventListener("keydown", onKey);
    globalThis.removeEventListener("simple-modal-closed", done);
  };
  globalThis.addEventListener("keydown", onKey);
  globalThis.addEventListener("simple-modal-closed", done);
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
    this._mapPath = [];
    this._mapFocus = 0;
    this._mapMessage = "";
    this.t = {
      ...this.t,
      myLearning: "My learning",
      downloadMyData: "Download my data (xAPI JSON)",
      clear: "Clear",
      clearMyData: "Clear my learning data",
      nothingYet:
        "Nothing recorded yet. Answer a question or watch a video and it shows up here.",
      pagesRead: "Pages read",
      pagesReadDetail: "{done} done",
      notYet: "—",
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
      viewMap: "Map",
      chartMap: "Your learning map",
      mapYou: "You",
      mapPath: "Map path",
      mapShowing: "Showing {name}",
      mapPagesDone: "{done} of {total} pages done",
      mapActivitiesDone: "{done} of {total} activities done",
      mapNodeLabel: "{name}, {state}, {progress}",
      mapNodeLabelShort: "{name}, {state}",
      mapNoActivities: "Nothing to do on this page yet.",
      mapKeys:
        "Arrow keys move between items, Enter opens one, Escape goes back.",
      mapLegend: "Map key",
      tableName: "Name",
      tableState: "State",
      tableProgress: "Progress",
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
      _mapPath: { type: Array, state: true },
      _mapFocus: { type: Number, state: true },
      _mapMessage: { type: String, state: true },
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
    if (ticket !== this.__refreshes) {
      return;
    }
    // stored statements are the source of truth: put back anything the
    // profile is missing (lost writes) before showing it
    let repaired = 0;
    try {
      repaired = LearnerProgress.repair(list);
    } catch {
      repaired = 0;
    }
    if (repaired) {
      this._data = this.compute();
    }
    this._statements = list;
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
      map: "section",
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
    // pages read and visits: from the page read statements stored for
    // the pages in scope (the source of truth); a page the profile saw
    // opened but whose statements cannot be matched to the outline (a moved
    // slug) still counts, so the numbers never go down
    let visits = 0;
    let last = "";
    const inScope = new Set(sc.pages);
    const reads = this._statements.filter(
      (st) =>
        st.context &&
        st.context.extensions &&
        st.context.extensions[XAPI_EXTENSIONS.element] === PAGE_ELEMENT,
    );
    const readPages = new Set();
    reads.forEach((st) => {
      const id = LearnerProgress.pageOfStatement(st);
      if (inScope.has(id)) {
        visits++;
        readPages.add(id);
        if (st.timestamp && String(st.timestamp) > last) {
          last = String(st.timestamp);
        }
      }
    });
    let profileVisits = 0;
    sc.pages.forEach((id) => {
      const p = recPage(id);
      if (p && p.visits > 0) {
        profileVisits += p.visits;
        readPages.add(id);
        if (p.lastVisit && String(p.lastVisit) > last) {
          last = String(p.lastVisit);
        }
      }
    });
    visits = Math.max(visits, profileVisits);
    const read = readPages.size;
    // trackable activities of each page in scope, for the Map view
    // null prototype: page ids are keys (any id, even "__proto__")
    const activitiesByPage = Object.create(null);
    const recActs = siteRec && siteRec.activities ? siteRec.activities : {};
    Object.keys(recActs)
      .map((id) => ({ id, a: recActs[id] }))
      .filter(({ a }) => a && a.trackable !== false && inScope.has(a.page))
      .sort((x, y) =>
        String(x.a.first || "").localeCompare(String(y.a.first || "")),
      )
      .forEach(({ id, a }) => {
        const list = activitiesByPage[a.page] || [];
        list.push({ id, name: a.name || "", tag: a.tag || "", done: !!a.done });
        activitiesByPage[a.page] = list;
      });
    const engaged = totals ? totals.engaged : 0;
    const tiles = {
      pagesDone: pageRows.filter((r) => r.status === "done").length,
      pagesTotal: pageRows.length,
      pagesRead: read,
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
      // trackable activity in scope (the chart needs some)
      engaged,
      // any page of the site opened on this device
      visited:
        reads.length > 0 ||
        Object.keys(recPages).some((id) => recPages[id].visits > 0),
      hasRecord: Boolean(siteRec),
      tiles,
      groups: summary
        ? this._withData(this._groups(view, summary, sc, byId, recPage))
        : [],
      pageRows,
      items,
      pages: sc.pages,
      activitiesByPage,
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
      data.engaged > 0 &&
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
      e.preventDefault();
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
        .map-path ol {
          display: flex;
          flex-direction: row;
          align-items: center;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-1);
          margin: 0 0 var(--ddd-spacing-2);
          padding: 0;
          list-style: none;
          font-size: var(--ddd-font-size-4xs);
        }
        .map-path li {
          margin: 0;
          padding: 0;
          font-size: inherit;
        }
        .map-path li + li::before {
          content: "›";
          margin-inline-end: var(--ddd-spacing-1);
          color: var(--my-learning-muted);
        }
        .map-path button {
          font: inherit;
          padding: 0;
          border: 0;
          background: transparent;
          color: light-dark(
            var(--ddd-theme-default-link),
            var(--ddd-theme-default-linkLight)
          );
          text-decoration: underline;
          cursor: pointer;
        }
        .map-path span[aria-current] {
          font-weight: var(--ddd-font-weight-bold);
        }
        .map-path button:focus-visible,
        .map-node:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        .map-keys {
          margin: 0 0 var(--ddd-spacing-2);
          font-size: var(--ddd-font-size-4xs);
          color: var(--my-learning-muted);
        }
        .map-legend,
        .map {
          --map-done: var(--my-learning-done);
          --map-partial: var(--my-learning-partial);
          --map-visited: light-dark(
            var(--ddd-theme-default-limestoneGray),
            var(--ddd-theme-default-slateGray)
          );
          --map-empty: var(--my-learning-muted);
          --map-surface: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
        }
        .map {
          position: relative;
          width: 100%;
          max-width: var(--map-size, 560px);
          aspect-ratio: 1;
          margin-inline: auto;
        }
        .map svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        .map line {
          stroke: var(--my-learning-line);
          stroke-width: 0.5;
        }
        .map line.twig {
          stroke-width: 0.25;
        }
        .map-center,
        .map-node {
          position: absolute;
          transform: translate(-50%, -50%);
        }
        .map-center {
          left: 50%;
          top: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: clamp(96px, 24%, 150px);
          height: clamp(96px, 24%, 150px);
          border-radius: var(--ddd-radius-circle);
          background-color: var(--ddd-chart-1);
          color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
          font-weight: var(--ddd-font-weight-bold);
          font-size: var(--ddd-font-size-4xs);
          text-align: center;
          padding: var(--ddd-spacing-1);
          box-sizing: border-box;
          overflow: hidden;
        }
        .map-center-title {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          overflow: hidden;
          max-width: 100%;
        }
        .map-center[data-state="done"] {
          background-color: var(--map-done);
        }
        .map-center[data-state="in-progress"] {
          background-color: var(--map-partial);
        }
        .map-center[data-state="visited"],
        .map-center[data-state="not-started"] {
          background-color: var(--map-surface);
          color: inherit;
          border: var(--ddd-border-sm);
          border-color: var(--map-empty);
        }
        .map-center-sub {
          font-size: 0.85em;
          font-weight: var(--ddd-font-weight-regular);
        }
        .map-node {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--ddd-spacing-1);
          min-width: 24px;
          min-height: 24px;
          margin: 0;
          padding: 0;
          border: 0;
          background: transparent;
          color: inherit;
          font: inherit;
          cursor: pointer;
        }
        .map-node[data-kind="activity"] {
          cursor: default;
        }
        .map-node .dot {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          width: 44px;
          height: 44px;
          border-radius: var(--ddd-radius-circle);
          border: var(--ddd-border-sm);
          border-color: var(--map-empty);
          background-color: var(--map-surface);
          font-weight: var(--ddd-font-weight-bold);
          color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
        }
        .map-node.ring-2 .dot {
          width: 16px;
          height: 16px;
        }
        .map.drilled .map-node .dot {
          width: 36px;
          height: 36px;
        }
        .map-node[data-state="done"] .dot,
        .swatch[data-state="done"] {
          background-color: var(--map-done);
          border-color: var(--map-done);
        }
        .map-node[data-state="in-progress"] .dot,
        .swatch[data-state="in-progress"] {
          background-color: var(--map-partial);
          border-color: var(--map-partial);
        }
        .map-node[data-state="visited"] .dot,
        .swatch[data-state="visited"] {
          background-color: var(--map-visited);
          border-color: var(--map-visited);
        }
        .map-node[data-state="not-started"] .dot {
          color: inherit;
        }
        .map-node .name {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          width: max-content;
          max-width: 8rem;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          overflow: hidden;
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          line-height: var(--ddd-lh-120);
          text-align: center;
          color: var(--my-learning-heading);
          padding: 0 var(--ddd-spacing-1);
          border-radius: var(--ddd-radius-xs);
          background-color: light-dark(
            rgb(255 255 255 / 0.85),
            rgb(0 3 33 / 0.85)
          );
        }
        .map-node .name[data-side="right"],
        .map-node .name[data-side="left"] {
          top: 50%;
          transform: translateY(-50%);
        }
        .map-node .name[data-side="right"] {
          left: calc(100% + 4px);
          text-align: start;
        }
        .map-node .name[data-side="left"] {
          left: auto;
          right: calc(100% + 4px);
          text-align: end;
        }
        .map-node .name[data-side="top"] {
          bottom: calc(100% + 2px);
        }
        .map-node .name[data-side="bottom"] {
          top: calc(100% + 2px);
        }
        .map-legend {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-3);
          margin: var(--ddd-spacing-3) 0 0;
          padding: 0;
          list-style: none;
          font-size: var(--ddd-font-size-4xs);
          color: var(--my-learning-muted);
        }
        .map-legend li {
          margin: 0;
          padding: 0;
          font-size: inherit;
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-1);
        }
        .swatch {
          display: inline-block;
          box-sizing: border-box;
          width: 12px;
          height: 12px;
          border-radius: var(--ddd-radius-circle);
          border: var(--ddd-border-sm);
          border-color: var(--map-empty);
        }
        .map-none {
          text-align: center;
          font-size: var(--ddd-font-size-4xs);
        }
        @media (forced-colors: active) {
          .map-node .dot,
          .map-center,
          .swatch {
            forced-color-adjust: none;
            border-color: CanvasText;
          }
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
  /**
   * Nothing to show: no statements stored and no page opened for this site
   */
  isEmpty(data) {
    return !this._statements.length && !(data && data.visited);
  }
  renderBody(data) {
    if (this.isEmpty(data)) {
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
      t.firstTry == null ? this.t.notYet : `${Math.round(t.firstTry * 100)}%`;
    const pagesRead = fill(this.t.doneOf, {
      done: t.pagesRead,
      total: t.pagesTotal,
    });
    const last = t.lastVisit
      ? fill(this.t.lastVisit, { when: this._when(t.lastVisit) })
      : this.t.noValue;
    return html`<dl class="tiles" part="tiles">
      <div class="tile panel">
        <dt>${this.t.pagesRead}</dt>
        <dd>
          <span class="big">${pagesRead}</span>
          <span class="small"
            >${fill(this.t.pagesReadDetail, {
              done: t.pagesDone,
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
      map: this.t.chartMap,
    }[view];
  }
  _setView(view) {
    this._view = view;
    this._mapPath = [];
    this._mapFocus = 0;
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
      ["map", this.t.viewMap],
    ];
    const title = this._chartTitle(data.view);
    const radar = this.chartType === "radar";
    if (data.view === "map") {
      return html`<div class="panel chart" part="chart">
        <h3 id="chart-title">${title}</h3>
        ${this.renderViewChips(views, data)} ${this.renderMap(data, title)}
      </div>`;
    }
    // the radar names itself in its own header
    const heading = radar ? nothing : html`<h3 id="chart-title">${title}</h3>`;
    const drawing = radar
      ? this.renderRadar(data, title)
      : this.renderBars(data, title);
    return html`<div class="panel chart" part="chart">
      ${heading} ${this.renderViewChips(views, data)} ${drawing}
    </div>`;
  }
  renderViewChips(views, data) {
    return html`<fieldset class="chips" role="radiogroup">
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
    </fieldset>`;
  }
  /**
   * Map view model for the current drill path (see mapModel)
   */
  mapView(data) {
    const d = data || this._data;
    return mapModel({
      items: d.items,
      pages: d.pages,
      root: d.root,
      pageRows: d.pageRows,
      activitiesByPage: d.activitiesByPage,
      path: this._mapPath,
    });
  }
  _mapProgress(n) {
    if (n.kind === "activity") {
      return "";
    }
    const tpl =
      n.kind === "section" && n.children && n.children.length
        ? this.t.mapPagesDone
        : this.t.mapActivitiesDone;
    return fill(tpl, { done: n.done, total: n.total });
  }
  _mapDrill(node) {
    if (node.kind === "activity") {
      return;
    }
    const m = this.mapView();
    const base = m.path.map((n) => n.id);
    // a page at the top level sits under its section
    if (node.kind === "page" && !base.length && node.section) {
      base.push(node.section);
    }
    this._mapPath = [...base, node.id];
    this._mapFocus = 0;
    this._mapMessage = fill(this.t.mapShowing, { name: node.title });
    this._focusMapNode();
  }
  _mapBack(to) {
    const m = this.mapView();
    if (!m.path.length) {
      return false;
    }
    const left = m.path[m.path.length - 1];
    const keep = typeof to === "number" ? to : m.path.length - 1;
    this._mapPath = m.path.slice(0, keep).map((n) => n.id);
    // focus the node we came back from
    const next = this.mapView();
    const flat = this._mapFlat(next);
    const at = flat.findIndex((n) => n.id === left.id);
    this._mapFocus = at > -1 ? at : 0;
    const where = next.path.length
      ? next.path[next.path.length - 1].title
      : this.t.mapYou;
    this._mapMessage = fill(this.t.mapShowing, { name: where });
    this._focusMapNode();
    return true;
  }
  // nodes in keyboard order: each section, then its pages
  /**
   * Where the Map view draws each node, in keyboard order: a ring node,
   * then the page dots around it (top level, only for sections whose pages
   * fit the arc they get; see mapPagesFit). The rings and the drawing grow
   * with the number of nodes so neighbours keep apart. Labels sit outside
   * each node on its own side of the circle.
   * @returns {{ placed: Object[], lines: Array, size: number }}
   */
  _mapLayout(m) {
    const top = !m.path.length;
    const n = m.nodes.length;
    const angle = (i) => (2 * Math.PI * i) / Math.max(n, 1) - Math.PI / 2;
    const pos = (r, a) => [50 + r * Math.cos(a), 50 + r * Math.sin(a)];
    // the arc each ring node owns, and how many page dots fit on it
    const span = Math.min(0.9, ((2 * Math.PI) / Math.max(n, 1)) * 0.7);
    const r2 = 43;
    const fits = Math.max(1, Math.floor((span * r2) / MAP_DOT_SPACING) + 1);
    const showKids = (node) =>
      top &&
      Array.isArray(node.children) &&
      node.children.length > 0 &&
      node.children.length <= fits;
    const anyKids = m.nodes.some(showKids);
    const r1 = anyKids
      ? 25
      : Math.min(36, Math.max(top ? 28 : 30, 22 + n * 1.2));
    const side = (a) => {
      // above / below only right at the top and bottom, so neighbours
      // there lean apart
      const c = Math.cos(a);
      if (c > 0.2) {
        return "right";
      }
      if (c < -0.2) {
        return "left";
      }
      return Math.sin(a) < 0 ? "top" : "bottom";
    };
    const placed = [];
    const lines = [];
    let dots = 0;
    m.nodes.forEach((node, i) => {
      const a = angle(i);
      const [x, y] = pos(r1, a);
      lines.push([50, 50, x, y, "spoke"]);
      placed.push({ node, x, y, ring: 1, side: side(a) });
      if (showKids(node)) {
        const kids = node.children;
        kids.forEach((c, j) => {
          const b =
            kids.length > 1 ? a + span * (j / (kids.length - 1) - 0.5) : a;
          const [px, py] = pos(r2, b);
          lines.push([x, y, px, py, "twig"]);
          placed.push({
            node: { ...c, section: node.id },
            x: px,
            y: py,
            ring: 2,
            side: side(b),
          });
          dots++;
        });
      }
    });
    // more around the circle, a bigger drawing (within the container)
    const size = Math.round(
      Math.min(760, Math.max(440, 360 + n * 28 + dots * 4)),
    );
    return { placed, lines, size };
  }
  // nodes in keyboard order (the drawn ones), or every node (all, the table)
  _mapFlat(m, all = false) {
    if (!all) {
      return this._mapLayout(m).placed.map((p) => p.node);
    }
    const out = [];
    m.nodes.forEach((n) => {
      out.push(n);
      if (!m.path.length && n.children) {
        n.children.forEach((c) => out.push({ ...c, section: n.id }));
      }
    });
    return out;
  }
  _focusMapNode() {
    this.updateComplete.then(() => {
      const nodes = this.shadowRoot.querySelectorAll(".map-node");
      const el = nodes[this._mapFocus] || nodes[0];
      if (el) {
        el.focus();
      }
    });
  }
  _onMapKeydown(e) {
    const nodes = [...this.shadowRoot.querySelectorAll(".map-node")];
    const at = nodes.indexOf(e.target);
    if (e.key === "Escape") {
      if (this._mapBack()) {
        e.preventDefault();
        e.stopPropagation();
      }
      return;
    }
    if (at < 0 || !nodes.length) {
      return;
    }
    const step = {
      ArrowRight: 1,
      ArrowDown: 1,
      ArrowLeft: -1,
      ArrowUp: -1,
    }[e.key];
    let next = -1;
    if (step) {
      next = (at + step + nodes.length) % nodes.length;
    } else if (e.key === "Home") {
      next = 0;
    } else if (e.key === "End") {
      next = nodes.length - 1;
    }
    if (next > -1) {
      e.preventDefault();
      this._mapFocus = next;
      nodes[next].focus();
    }
  }
  renderMap(data, title) {
    const m = this.mapView(data);
    const top = !m.path.length;
    const n = m.nodes.length;
    const { placed, lines, size } = this._mapLayout(m);
    const flat = placed.map((p) => p.node);
    // keyboard order is the order of flat
    const order = new Map(
      flat.map((f, i) => [`${f.section || ""}|${f.id}`, i]),
    );
    const stateWord = (st) => this._stateText(st);
    const center = top
      ? html`<span class="map-center you" aria-hidden="true"
          >${this.t.mapYou}</span
        >`
      : html`<span class="map-center" data-state="${m.center.state}"
          ><span class="map-center-title">${m.center.title}</span
          ><span class="map-center-sub"
            >${this._mapProgress(m.center)}</span
          ></span
        >`;
    const crumbs = [
      { title: this.t.mapYou, at: 0 },
      ...m.path.map((p, i) => ({ title: p.title, at: i + 1 })),
    ];
    return html`<nav class="map-path" aria-label="${this.t.mapPath}">
        <ol>
          ${crumbs.map((c, i) =>
            i === crumbs.length - 1
              ? html`<li><span aria-current="location">${c.title}</span></li>`
              : html`<li>
                  <button type="button" @click="${() => this._mapBack(c.at)}">
                    ${c.title}
                  </button>
                </li>`,
          )}
        </ol>
      </nav>
      <p class="map-keys" id="map-keys">${this.t.mapKeys}</p>
      <div
        class="map ${top ? "top" : "drilled"}"
        style="--map-size: ${size}px"
        part="map"
        role="group"
        aria-labelledby="chart-title"
        aria-describedby="map-keys"
        @keydown="${this._onMapKeydown}"
      >
        <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
          ${lines.map(
            ([x1, y1, x2, y2, k]) =>
              svg`<line class="${k}" x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}"></line>`,
          )}
        </svg>
        ${center}
        ${placed.map(({ node, x, y, ring, side }) => {
          const idx = order.get(`${node.section || ""}|${node.id}`);
          const progress = this._mapProgress(node);
          const label = fill(
            progress ? this.t.mapNodeLabel : this.t.mapNodeLabelShort,
            { name: node.title, state: stateWord(node.state), progress },
          );
          const glyph =
            node.kind === "activity" ? this._glyphFor(node.tag) : "";
          // pages in the outer ring are named by their button label only;
          // long names are cut to two lines (the label has all of it)
          const name =
            ring === 2
              ? nothing
              : html`<span class="name" data-side="${side}" aria-hidden="true"
                  >${node.title}</span
                >`;
          return html`<button
            type="button"
            class="map-node ring-${ring}"
            data-kind="${node.kind}"
            data-state="${node.state}"
            data-id="${node.id}"
            style="left: ${x.toFixed(2)}%; top: ${y.toFixed(2)}%"
            tabindex="${idx === this._mapFocus ? "0" : "-1"}"
            aria-label="${label}"
            title="${node.title}"
            @click="${() => this._mapDrill(node)}"
            @focus="${() => (this._mapFocus = idx)}"
          >
            <span class="dot" aria-hidden="true">${glyph}</span>
            ${name}
          </button>`;
        })}
      </div>
      ${n ? nothing : html`<p class="map-none">${this.t.mapNoActivities}</p>`}
      <ul class="map-legend" aria-label="${this.t.mapLegend}">
        ${MY_LEARNING_STATES.map(
          (st) =>
            html`<li>
              <span class="swatch" data-state="${st}" aria-hidden="true"></span
              >${stateWord(st)}
            </li>`,
        )}
      </ul>
      <p class="sr-only" role="status" aria-live="polite">
        ${this._mapMessage}
      </p>
      <details>
        <summary>${this.t.showTable}</summary>
        <table class="ddd-table condensed">
          <caption class="sr-only">
            ${title}
          </caption>
          <thead>
            <tr>
              <th scope="col">${this.t.tableName}</th>
              <th scope="col">${this.t.tableState}</th>
              <th scope="col">${this.t.tableProgress}</th>
            </tr>
          </thead>
          <tbody>
            ${this._mapFlat(m, true).map(
              (f) =>
                html`<tr>
                  <th scope="row">${f.title}</th>
                  <td>${stateWord(f.state)}</td>
                  <td>${this._mapProgress(f)}</td>
                </tr>`,
            )}
          </tbody>
        </table>
      </details>`;
  }
  _glyphFor(tag) {
    return (
      {
        questions: "?",
        cards: "?",
        checklists: "✓",
        videos: "▶",
        audio: "▶",
        games: "★",
      }[activityKindOf(tag)] || "•"
    );
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
              map: "Map",
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
