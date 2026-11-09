/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * Learner progress for HAXcms sites: a thin bridge, no storage of its own.
 *
 * - Statements: UserActionBroker (@haxtheweb/user-action) normalizes every
 *   learner event that reaches the window into an xAPI statement; this
 *   helper adds what only the site knows (actor, page and site names, the
 *   outline item id of the page) and records it in the learner profile kept
 *   by user-scaffold (UserScaffoldInstance.recordStatement).
 * - Pages: each page opened is recorded as a visit plus an `experienced`
 *   statement for the page, and the trackable elements on it are counted
 *   using the generated xAPI vocabulary (user-action/lib/xapi-vocabulary.js).
 * - Read back: answers `learner-progress-request` window events (questions
 *   and checklists asking for their saved result) from the profile, moving
 *   a record saved under detail.legacyActivityId (the old content
 *   fingerprint id) to detail.activityId once; fires
 *   `learner-progress-ready` once it is listening and `learner-progress-
 *   cleared` after clear() / clearDevice() (detail.scope "site" or
 *   "device").
 * - Preferences: mirrors the site's dark mode and sound status into the
 *   profile and imports legacy preference keys once.
 *
 * Page done rule: a page is done when every trackable activity the learner
 * engaged with on it is done (see UserScaffold.pageProgress). Site progress
 * is done pages / pages in the outline.
 */
import { autorun, toJS } from "mobx";
import { store } from "./haxcms-site-store.js";
import { UserScaffoldInstance } from "@haxtheweb/user-scaffold/user-scaffold.js";
import { UABroker } from "@haxtheweb/user-action/lib/UserActionBroker.js";
import {
  buildStatement,
  describeResponse,
  languageMap,
  legacyActivityId,
  setActorProvider,
  siteUrl,
  XAPI_ACTIVITY_TYPES,
  XAPI_EXTENSIONS,
} from "@haxtheweb/user-action/lib/xapi.js";
import {
  XAPI_VOCABULARY,
  XAPI_TRACKABLE_TAGS,
} from "@haxtheweb/user-action/lib/xapi-vocabulary.js";

// wrappers that report learner data for a player authored inside them
const MEDIA_WRAPPERS = "video-player, audio-player";

export const PAGE_ELEMENT = "haxcms-page";

const elementOf = (statement) => {
  const ext =
    statement && statement.context && statement.context.extensions
      ? statement.context.extensions
      : {};
  return ext[XAPI_EXTENSIONS.element] || "";
};

class HAXCMSLearnerProgress {
  constructor() {
    this.started = false;
    this.lastStatement = null;
    this.profile = UserScaffoldInstance;
    this._disposers = [];
    this._scanTimer = null;
  }
  /**
   * Key of this site in the learner profile: the manifest id, else its url
   */
  get siteKey() {
    const m = store.manifest;
    if (m && m.id) {
      return String(m.id);
    }
    return m ? siteUrl() : "";
  }
  get siteInfo() {
    return { url: siteUrl(), title: store.siteTitle || "" };
  }
  /**
   * Whether an element tag counts toward a page being done
   */
  isTrackable(tag) {
    const v = XAPI_VOCABULARY[tag];
    return Boolean(v && v.countsTowardCompletion);
  }
  /**
   * Begin listening; safe to call more than once
   */
  start() {
    if (this.started) {
      return;
    }
    // the scaffold is created on document.body; when this module loaded
    // before the body existed, ask again instead of failing for the visit
    if (!this.profile) {
      this.profile = globalThis.UserScaffold.requestAvailability();
    }
    if (!this.profile) {
      return;
    }
    this.started = true;
    this.profile.importLegacyPreferences();
    this.profile.recordSession();
    setActorProvider(() =>
      this.siteKey ? this.profile.siteActor(this.siteKey, this.siteInfo) : null,
    );
    UABroker.listen();
    this._unsubscribe = UABroker.subscribe((e) => this._onStatement(e));
    this._requestHandler = (e) => this._onRequest(e);
    globalThis.addEventListener(
      "learner-progress-request",
      this._requestHandler,
    );
    // count the page's activities the moment its content is on the page, so
    // the page progress bar renders in the same frame as the content instead
    // of appearing a moment later and pushing the content down
    this._bodyHandler = () => this.scanPage();
    globalThis.addEventListener(
      "json-outline-schema-active-body-changed",
      this._bodyHandler,
    );
    this._disposers.push(
      autorun(() => {
        const id = store.activeId;
        const item = store.activeItem;
        const key = this.siteKey;
        if (id && item && !item._internalRoute && key) {
          Promise.resolve().then(() => this._visit(id, toJS(item)));
        }
      }),
    );
    this._disposers.push(
      autorun(() => {
        toJS(store.activeItemContent);
        this._scheduleScan();
      }),
    );
    this._disposers.push(
      autorun(() => {
        const dark = store.darkMode;
        const sound = store.soundStatus;
        Promise.resolve().then(() => {
          if (typeof dark === "boolean") {
            this.profile.writePreference("darkMode", dark);
          }
          if (typeof sound === "boolean") {
            this.profile.writePreference("soundStatus", sound);
          }
        });
      }),
    );
    this._disposers.push(
      autorun(() => {
        if (store.isLoggedIn) {
          Promise.resolve().then(() =>
            this.profile.recordSession({ login: true }),
          );
        }
      }),
    );
    globalThis.dispatchEvent(new CustomEvent("learner-progress-ready"));
  }
  /**
   * Stop listening (tests)
   */
  stop() {
    this._disposers.forEach((d) => d());
    this._disposers = [];
    if (this._unsubscribe) {
      this._unsubscribe();
    }
    if (this._requestHandler) {
      globalThis.removeEventListener(
        "learner-progress-request",
        this._requestHandler,
      );
    }
    if (this._bodyHandler) {
      globalThis.removeEventListener(
        "json-outline-schema-active-body-changed",
        this._bodyHandler,
      );
      this._bodyHandler = null;
    }
    setActorProvider(null);
    this.started = false;
  }
  _visit(id, item) {
    if (store.editMode) {
      return;
    }
    const key = this.siteKey;
    let url = "";
    try {
      url = new URL(item.slug || "", globalThis.document.baseURI).href;
    } catch {
      url = "";
    }
    this.profile.recordPageVisit(key, id, {
      title: item.title,
      url,
      site: this.siteInfo,
    });
    // the visit as a statement too, so an LRS sees pages read
    globalThis.dispatchEvent(
      new CustomEvent("user-engagement", {
        detail: {
          activityDisplay: "experienced",
          objectName: item.title,
          objectId: url,
          statement: buildStatement({
            verb: "experienced",
            object: {
              id: url.split("#")[0].split("?")[0],
              name: item.title,
              type: XAPI_ACTIVITY_TYPES.lesson,
            },
            context: {
              pageId: url.split("#")[0].split("?")[0],
              pageName: item.title,
              siteName: store.siteTitle,
              extensions: { [XAPI_EXTENSIONS.element]: PAGE_ELEMENT },
            },
          }),
        },
      }),
    );
    this._scheduleScan();
  }
  _onStatement({ statement, element, imported }) {
    const key = this.siteKey;
    const page = store.activeId;
    if (!key || !page || store.editMode) {
      return;
    }
    const tag =
      elementOf(statement) ||
      (element && element.tagName ? element.tagName.toLowerCase() : "");
    if (!statement.actor) {
      statement.actor = this.profile.siteActor(key, this.siteInfo);
    }
    const ctx = statement.context || {};
    const ca = ctx.contextActivities || {};
    const lang = ctx.language;
    if (ca.parent && ca.parent[0] && store.activeTitle) {
      const def = ca.parent[0].definition || {};
      def.name = def.name || languageMap(store.activeTitle, lang);
      ca.parent[0].definition = def;
    }
    if (ca.grouping && ca.grouping[0] && store.siteTitle) {
      const def = ca.grouping[0].definition || {};
      def.name = def.name || languageMap(store.siteTitle, lang);
      ca.grouping[0].definition = def;
    }
    // an element keyed by its authored resource now may have saved data
    // under its old content fingerprint id; that record moves over once
    let legacyId = "";
    if (element && element.tagName && statement.object) {
      const legacy = legacyActivityId(element);
      legacyId = legacy !== statement.object.id ? legacy : "";
    }
    const recorded = this.profile.recordStatement(key, statement, {
      page,
      tag,
      trackable: this.isTrackable(tag),
      imported,
      pageTitle: store.activeTitle,
      responseText: describeResponse(statement),
      legacyId,
    });
    if (recorded) {
      this.lastStatement = statement;
    }
  }
  _onRequest(e) {
    const d = e && e.detail;
    if (!d || !d.activityId || !this.siteKey) {
      return;
    }
    d.record = this.profile.readActivity(
      this.siteKey,
      d.activityId,
      d.legacyActivityId,
    );
  }
  _scheduleScan() {
    clearTimeout(this._scanTimer);
    this._scanTimer = setTimeout(() => this.scanPage(), 300);
  }
  /**
   * Count the trackable elements of the current page (by tag)
   */
  scanPage(root) {
    const key = this.siteKey;
    const page = store.activeId;
    const scope = root || store.themeElement || globalThis.document;
    if (!key || !page || !scope || !XAPI_TRACKABLE_TAGS.length) {
      return null;
    }
    const byTag = {};
    let count = 0;
    scope.querySelectorAll(XAPI_TRACKABLE_TAGS.join(",")).forEach((el) => {
      // a player authored inside video-player / audio-player (legacy
      // markup) reports as that wrapper, so it is one activity, not two
      if (el.parentElement && el.parentElement.closest(MEDIA_WRAPPERS)) {
        return;
      }
      const tag = el.tagName.toLowerCase();
      byTag[tag] = (byTag[tag] || 0) + 1;
      count++;
    });
    // an activity still waiting to load is a replace-tag that will become it
    scope.querySelectorAll("replace-tag[with]").forEach((el) => {
      const tag = String(el.getAttribute("with")).toLowerCase();
      if (XAPI_TRACKABLE_TAGS.includes(tag)) {
        byTag[tag] = (byTag[tag] || 0) + 1;
        count++;
      }
    });
    this.profile.setPageTrackable(key, page, count, byTag);
    return { count, byTag };
  }
  /**
   * Outline item ids that count as the site's pages
   */
  pageIds() {
    const m = store.manifest;
    const items = m && Array.isArray(m.items) ? m.items : [];
    return items
      .filter(
        (i) =>
          i &&
          i.id &&
          !(
            i.metadata &&
            (i.metadata.hideInMenu || i.metadata.published === false)
          ),
      )
      .map((i) => i.id);
  }
  /**
   * { status, engaged, done, trackable } of a page (default: the active one)
   */
  pageProgress(pageId) {
    return this.profile.pageProgress(this.siteKey, pageId || store.activeId);
  }
  /**
   * { done, total, byPage, engaged } for the outline
   */
  siteProgress() {
    return this.profile.siteProgress(this.siteKey, this.pageIds());
  }
  /**
   * UserScaffold.summarize with this site's outline (tags and ancestors are
   * resolved from the manifest when read)
   */
  summarize(options = {}) {
    const m = toJS(store.manifest);
    const outline = (m && Array.isArray(m.items) ? m.items : []).map((i) => ({
      id: i.id,
      parent: i.parent,
      title: i.title,
      tags: i.metadata && i.metadata.tags ? i.metadata.tags : "",
    }));
    return this.profile.summarize({
      site: this.siteKey,
      outline,
      pageId: store.activeId,
      ...options,
    });
  }
  /**
   * Outline item id a stored statement belongs to, from its page: the
   * statement's parent activity (the page it was sent from) or, for a page
   * read, its object; matched against the URL of every outline item.
   */
  pageOfStatement(statement) {
    const norm = (u) =>
      String(u || "")
        .split("#")[0]
        .split("?")[0]
        .replace(/\/index\.html$/, "")
        .replace(/\/$/, "");
    if (!this.__pageUrls || this.__pageUrlsFor !== store.manifest) {
      this.__pageUrlsFor = store.manifest;
      this.__pageUrls = new Map();
      const m = toJS(store.manifest);
      (m && Array.isArray(m.items) ? m.items : []).forEach((i) => {
        try {
          const url = norm(new URL(i.slug || "", globalThis.document.baseURI));
          if (i.id && url && !this.__pageUrls.has(url)) {
            this.__pageUrls.set(url, i.id);
          }
        } catch {
          // not a usable slug
        }
      });
    }
    const ctx = statement && statement.context ? statement.context : {};
    const ext = ctx.extensions || {};
    const ca = ctx.contextActivities || {};
    const parent =
      Array.isArray(ca.parent) && ca.parent[0] ? ca.parent[0] : null;
    const url =
      ext[XAPI_EXTENSIONS.element] === PAGE_ELEMENT && statement.object
        ? statement.object.id
        : parent
          ? parent.id
          : "";
    return this.__pageUrls.get(norm(url)) || "";
  }
  /**
   * Rebuild what the learner profile lost from this site's stored
   * statements (see UserScaffold.repairSite). Returns how much changed.
   */
  repair(statements) {
    const key = this.siteKey;
    if (!key || !Array.isArray(statements) || !statements.length) {
      return 0;
    }
    return this.profile.repairSite(key, statements, {
      pageOf: (st) => this.pageOfStatement(st),
      trackableOf: (tag) => this.isTrackable(tag),
      pageElement: PAGE_ELEMENT,
    });
  }
  /**
   * Forget this site's progress on this device, including checklist ticks
   * kept under bullet-check-list's own keys
   */
  async clear() {
    const key = this.siteKey;
    if (!key) {
      return;
    }
    await this.profile.clearSite(key);
    let base = "";
    try {
      base = new URL(siteUrl()).pathname;
    } catch {
      base = "";
    }
    if (base) {
      this._removeLocalKeys(`bullet-check-list:v1:${base}`);
    }
    this._afterClear("site");
  }
  /**
   * Forget the learner profile and statements of every site on this device,
   * and every site's bullet-check-list ticks. Preference keys that elements
   * still own (video-player audio description, app-hax dark mode / sound)
   * are left alone; they are the settings those elements use today.
   */
  async clearDevice() {
    await this.profile.clearAll();
    this._removeLocalKeys("bullet-check-list:v1:");
    this._afterClear("device");
  }
  _removeLocalKeys(prefix) {
    try {
      const ls = globalThis.localStorage;
      const doomed = [];
      for (let i = 0; i < ls.length; i++) {
        const k = ls.key(i);
        if (k && k.indexOf(prefix) === 0) {
          doomed.push(k);
        }
      }
      doomed.forEach((k) => ls.removeItem(k));
    } catch {
      // storage blocked
    }
  }
  _afterClear(scope) {
    const key = this.siteKey;
    this.lastStatement = null;
    globalThis.dispatchEvent(
      new CustomEvent("learner-progress-cleared", { detail: { scope } }),
    );
    if (scope === "device") {
      this.profile.recordSession();
    }
    const item = toJS(store.activeItem);
    if (key && item && !item._internalRoute) {
      this.profile.recordPageVisit(key, store.activeId, {
        title: item.title,
        site: this.siteInfo,
      });
      this.scanPage();
    }
  }
}

globalThis.HAXCMSLearnerProgressInstance =
  globalThis.HAXCMSLearnerProgressInstance || new HAXCMSLearnerProgress();
export const LearnerProgress = globalThis.HAXCMSLearnerProgressInstance;
export { HAXCMSLearnerProgress };
