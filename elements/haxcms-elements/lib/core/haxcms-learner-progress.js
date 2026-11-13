/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
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
 * - Where the learner is: `learner-progress-update` window events (media
 *   and slide decks, as the learner goes) are written to the activity's
 *   summary as state (covered ranges, resume point, progress) without a
 *   statement (UserScaffold.updateActivityState); the element reads it
 *   back with `learner-progress-request` to resume and to not send a
 *   milestone twice.
 * - Preferences: mirrors the site's dark mode and sound status into the
 *   profile and imports legacy preference keys once.
 *
 * - Reading: how far the learner scrolled through the page content is
 *   tracked (haxcms-reading-progress.js) and sent as xAPI about the page
 *   activity the visit used: progressed with the HAX progress extension as
 *   the share read crosses 25 / 50 / 75 % (and when the visit ends part
 *   way), completed once the end of the content was seen. Never while
 *   editing, and not again on a page already read.
 * - Elements that cannot be tracked as authored leave themselves out of the
 *   count: an upgraded element whose xapiCountsTowardCompletion() returns
 *   false (video-player showing a plain iframe) is not a trackable item. The
 *   page is counted again once elements still loading upgrade, and when
 *   trackable elements are added to the content (a replace-tag swapping).
 *
 * Page done rule: a page is done when it was read and every trackable
 * activity on it is done; its percent is the average progress of those
 * items, partial progress included (see UserScaffold.pageProgress). Site
 * progress is done pages / pages in the outline, percent the average of the
 * page percents.
 */
import { autorun, toJS } from "mobx";
import { store } from "./haxcms-site-store.js";
import { HAXCMSReadingProgress } from "./haxcms-reading-progress.js";
import { UserScaffoldInstance } from "@haxtheweb/user-scaffold/user-scaffold.js";
import { UABroker } from "@haxtheweb/user-action/lib/UserActionBroker.js";
import {
  buildStatement,
  describeResponse,
  xapiDuration,
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
    this._waiting = new WeakSet();
    // activity id -> the element on the page open now that sent it
    this._engaged = new Map();
    this.reading = new HAXCMSReadingProgress({
      report: (verb, share, page) => this._reportReading(verb, share, page),
      enabled: () => !store.editMode,
    });
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
    this._updateHandler = (e) => this._onUpdate(e);
    globalThis.addEventListener("learner-progress-update", this._updateHandler);
    // the learner leaves the site part way through a page
    this._leaveHandler = () => this.reading.flush();
    globalThis.addEventListener("pagehide", this._leaveHandler);
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
    // trackable elements added to the content later (a replace-tag
    // swapping in what it stood for) change the count
    this._disposers.push(
      autorun(() => {
        const theme = store.themeElement;
        Promise.resolve().then(() => this._watchContent(theme));
      }),
    );
    this._disposers.push(() => this._watchContent(null));
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
    this.reading.end();
    if (this._leaveHandler) {
      globalThis.removeEventListener("pagehide", this._leaveHandler);
      this._leaveHandler = null;
    }
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
    if (this._updateHandler) {
      globalThis.removeEventListener(
        "learner-progress-update",
        this._updateHandler,
      );
      this._updateHandler = null;
    }
    if (this._bodyHandler) {
      globalThis.removeEventListener(
        "json-outline-schema-active-body-changed",
        this._bodyHandler,
      );
      this._bodyHandler = null;
    }
    clearTimeout(this._scanTimer);
    setActorProvider(null);
    this.started = false;
  }
  _watchContent(theme) {
    if (this._contentObserver) {
      this._contentObserver.disconnect();
      this._contentObserver = null;
    }
    if (!theme || typeof globalThis.MutationObserver !== "function") {
      return;
    }
    const selector = XAPI_TRACKABLE_TAGS.join(",");
    this._contentObserver = new globalThis.MutationObserver((records) => {
      const added = records.some((r) =>
        Array.from(r.addedNodes).some(
          (n) =>
            n.nodeType === 1 &&
            (n.matches(selector) || Boolean(n.querySelector(selector))),
        ),
      );
      if (added) {
        this._scheduleScan();
      }
    });
    this._contentObserver.observe(theme, { childList: true, subtree: true });
  }
  /**
   * The element whose box is the content of the page: the theme's content
   * container, else the theme
   */
  contentRegion() {
    const theme = store.themeElement;
    if (!theme) {
      return null;
    }
    const c = theme.contentContainer;
    return c && typeof c.getBoundingClientRect === "function" ? c : theme;
  }
  /**
   * Start tracking how far the page open now is read (default: the active
   * one), unless it is read already
   */
  _beginReading(id, item, url) {
    const key = this.siteKey;
    if (!key || !id || store.editMode) {
      this.reading.end();
      return;
    }
    const pp = this.profile.pageProgress(key, id);
    if (pp.reading.done) {
      this.reading.end();
      return;
    }
    this.reading.begin(
      {
        id,
        url: String(url || "")
          .split("#")[0]
          .split("?")[0],
        title: item && item.title ? item.title : "",
        started: Date.now(),
      },
      () => this.contentRegion(),
    );
  }
  /**
   * A reading statement about the page the tracker was given (the page the
   * learner was on, even when the visit ended by opening another one)
   */
  _reportReading(verb, share, page) {
    if (!page || !page.url || store.editMode) {
      return;
    }
    // reading is reported once per page, ever: a page read part way on one
    // visit only reports again once the learner reads past where they got
    const key = this.siteKey;
    const read = key ? this.profile.readActivity(key, page.url) : null;
    if (
      read &&
      (read.done ||
        (verb === "progressed" && (Number(read.progress) || 0) >= share))
    ) {
      return;
    }
    const done = verb === "completed";
    globalThis.dispatchEvent(
      new CustomEvent("user-engagement", {
        detail: {
          activityDisplay: verb,
          objectName: page.title,
          objectId: page.url,
          resultCompletion: done,
          // the outline item the statement is about (see _onStatement)
          haxcmsPageId: page.id,
          statement: buildStatement({
            verb,
            object: {
              id: page.url,
              name: page.title,
              type: XAPI_ACTIVITY_TYPES.lesson,
            },
            result: {
              completion: done,
              duration: xapiDuration(Date.now() - page.started),
              extensions: { [XAPI_EXTENSIONS.progress]: share },
            },
            context: {
              pageId: page.url,
              pageName: page.title,
              siteName: store.siteTitle,
              extensions: { [XAPI_EXTENSIONS.element]: PAGE_ELEMENT },
            },
          }),
        },
      }),
    );
  }
  _visit(id, item) {
    if (store.editMode) {
      this.reading.end();
      return;
    }
    const key = this.siteKey;
    this._engaged.clear();
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
    this._beginReading(id, item, url);
    this._scheduleScan();
  }
  _onStatement({ statement, element, imported, detail }) {
    const key = this.siteKey;
    const tag =
      elementOf(statement) ||
      (element && element.tagName ? element.tagName.toLowerCase() : "");
    // reading reported as a visit ends belongs to the page it was about,
    // which is no longer the active one
    const page =
      tag === PAGE_ELEMENT && detail && typeof detail.haxcmsPageId === "string"
        ? detail.haxcmsPageId || store.activeId
        : store.activeId;
    if (!key || !page || store.editMode) {
      return;
    }
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
      reading: tag === PAGE_ELEMENT,
      imported,
      // never name a page after the one open now when it is another one
      pageTitle: page === store.activeId ? store.activeTitle : "",
      responseText: describeResponse(statement),
      legacyId,
    });
    if (recorded) {
      this.lastStatement = statement;
      if (element && element.tagName && statement.object) {
        this._engaged.set(statement.object.id, element);
      }
    }
  }
  /**
   * The element on the page open now that sent statements about activity
   * id during this visit, or null (My learning uses it to take the learner
   * to an activity)
   */
  engagedElement(id) {
    const el = this._engaged.get(id);
    return el && el.isConnected ? el : null;
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
  /**
   * Where the learner is in media or slides (detail: activityId, tag, name,
   * state { covered, resume, progress }): written to the activity summary in
   * the profile without a statement. detail.record gets the summary back.
   * Never while editing.
   */
  _onUpdate(e) {
    const d = e && e.detail;
    const key = this.siteKey;
    if (!d || !d.activityId || !key || store.editMode || !store.activeId) {
      return;
    }
    const tag = typeof d.tag === "string" ? d.tag : "";
    d.record = this.profile.updateActivityState(key, d.activityId, d.state, {
      page: store.activeId,
      tag,
      name: typeof d.name === "string" ? d.name : "",
      trackable: this.isTrackable(tag),
    });
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
    const loading = [];
    scope.querySelectorAll(XAPI_TRACKABLE_TAGS.join(",")).forEach((el) => {
      // a player authored inside video-player / audio-player (legacy
      // markup) reports as that wrapper, so it is one activity, not two
      if (el.parentElement && el.parentElement.closest(MEDIA_WRAPPERS)) {
        return;
      }
      const tag = el.tagName.toLowerCase();
      // until it upgrades it counts; count again once it did, since only
      // then can it say it cannot be tracked as authored
      const later = this._upgraded(el, tag);
      if (later) {
        loading.push(later);
      } else if (
        typeof el.xapiCountsTowardCompletion === "function" &&
        el.xapiCountsTowardCompletion() === false
      ) {
        return;
      }
      byTag[tag] = (byTag[tag] || 0) + 1;
      count++;
    });
    if (loading.length) {
      Promise.all(loading).then(() => this._scheduleScan());
    }
    // an activity still waiting to load is a replace-tag that will become it
    scope.querySelectorAll("replace-tag[with]").forEach((el) => {
      const tag = String(el.getAttribute("with")).toLowerCase();
      if (XAPI_TRACKABLE_TAGS.includes(tag)) {
        byTag[tag] = (byTag[tag] || 0) + 1;
        count++;
      }
    });
    this.profile.setPageTrackable(key, page, count, byTag);
    // the content of the page is in place: reading can be measured
    if ((!root || root === store.themeElement) && this._contentIsFor(page)) {
      this.reading.ready();
    }
    return { count, byTag };
  }
  /**
   * Whether the theme holds the content of page id: something is in it and
   * the page-break the site builder puts first names that page (when there
   * is one), so the page before, still on screen while the next one loads,
   * is never measured as the next one
   */
  _contentIsFor(id) {
    const theme = store.themeElement;
    if (!theme || !theme.firstElementChild) {
      return false;
    }
    const pb = theme.querySelector(':scope > page-break[break-type="site"]');
    const shown = pb ? pb.getAttribute("item-id") : null;
    return !shown || shown === id;
  }
  /**
   * null when el has upgraded and rendered, else a promise for when it has
   * (once per element, so a rescan does not wait on it twice)
   */
  _upgraded(el, tag) {
    const registry = globalThis.customElements;
    if (this._waiting.has(el) || !registry) {
      return null;
    }
    let wait = null;
    if (!registry.get(tag)) {
      wait = registry.whenDefined(tag).then(() => this._settled(el));
    } else if (el.updateComplete && el.hasUpdated === false) {
      wait = this._settled(el);
    }
    if (wait) {
      this._waiting.add(el);
    }
    return wait;
  }
  // a Lit element finished updating, including updates its first one asked for
  async _settled(el) {
    for (let i = 0; i < 5 && el.updateComplete; i++) {
      let done = true;
      try {
        done = await el.updateComplete;
      } catch {
        done = true;
      }
      if (done !== false) {
        return;
      }
    }
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
      // reading starts over for the page open now; what was read before the
      // clear is not reported after it
      this.reading.discard();
      let url = "";
      try {
        url = new URL(item.slug || "", globalThis.document.baseURI).href;
      } catch {
        url = "";
      }
      this._beginReading(store.activeId, item, url);
      this.scanPage();
    }
  }
}

globalThis.HAXCMSLearnerProgressInstance =
  globalThis.HAXCMSLearnerProgressInstance || new HAXCMSLearnerProgress();
export const LearnerProgress = globalThis.HAXCMSLearnerProgressInstance;
export { HAXCMSLearnerProgress };
